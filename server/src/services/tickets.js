import { query } from '../db/pool.js'
import { config } from '../config.js'
import { logger } from '../lib/logger.js'
import { sendMail } from './mailer.js'
import { patientTicketEmail, counterTicketEmail } from './ticketEmails.js'

const TICKET_SELECT = `
  SELECT a.id, a.reference, a.starts_at, a.ends_at, a.status, a.reason, a.notes,
         a.amount_paise, a.confirmed_at, a.checked_in_at, a.created_at,
         p.full_name AS patient_name, p.email AS patient_email, p.phone AS patient_phone,
         d.full_name AS doctor_name, d.title AS doctor_title, d.slug AS doctor_slug,
         dep.name AS department_name, dep.slug AS department_slug,
         pay.provider_payment_id, pay.status AS payment_status, pay.refund_policy
    FROM appointments a
    JOIN patients p    ON p.id = a.patient_id
    JOIN doctors d     ON d.id = a.doctor_id
    JOIN departments dep ON dep.slug = d.department_slug
    LEFT JOIN LATERAL (
      SELECT provider_payment_id, status, refund_policy
        FROM payments
       WHERE appointment_id = a.id
       ORDER BY (status = 'paid') DESC, created_at DESC
       LIMIT 1
    ) pay ON true
`

const shape = (r) =>
  r && {
    id: r.id,
    reference: r.reference,
    startsAt: r.starts_at.toISOString(),
    endsAt: r.ends_at.toISOString(),
    status: r.status,
    reason: r.reason,
    notes: r.notes,
    amountPaise: r.amount_paise,
    confirmedAt: r.confirmed_at?.toISOString() ?? null,
    checkedInAt: r.checked_in_at?.toISOString() ?? null,
    createdAt: r.created_at.toISOString(),
    paymentId: r.provider_payment_id,
    paymentStatus: r.payment_status,
    refundPolicy: r.refund_policy ?? 'non_refundable',
    patient: { fullName: r.patient_name, email: r.patient_email, phone: r.patient_phone },
    doctor: {
      fullName: r.doctor_name,
      title: r.doctor_title,
      slug: r.doctor_slug,
      departmentName: r.department_name,
      departmentSlug: r.department_slug,
    },
  }

export async function getTicketById(id) {
  const { rows } = await query(`${TICKET_SELECT} WHERE a.id = $1`, [id])
  return shape(rows[0])
}

export async function getTicketByReference(reference) {
  const { rows } = await query(`${TICKET_SELECT} WHERE upper(a.reference) = upper($1)`, [reference])
  return shape(rows[0])
}

async function recordDelivery(appointmentId, channel, recipient, status, error) {
  await query(
    `INSERT INTO ticket_deliveries (appointment_id, channel, recipient, status, error)
     VALUES ($1, $2, $3, $4, $5)`,
    [appointmentId, channel, recipient, status, error ?? null],
  )
}

/**
 * Sends the ticket twice: once to the patient, once to the hospital counter's
 * inbox. Delivery failures are recorded and swallowed — a mail server having a
 * bad afternoon must not undo a payment that has already cleared. The ticket
 * remains retrievable from the counter console and by its code regardless.
 */
export async function deliverTicket(ticket) {
  const outcome = { patient: 'skipped', counter: 'skipped' }

  const targets = [
    { channel: 'email_patient', to: ticket.patient.email, build: patientTicketEmail, key: 'patient' },
    { channel: 'email_counter', to: config.mail.counterInbox, build: counterTicketEmail, key: 'counter' },
  ]

  for (const target of targets) {
    try {
      const { subject, html, text } = target.build(ticket)
      await sendMail({
        to: target.to,
        subject,
        html,
        text,
        headers: { 'X-Ashvini-Ticket': ticket.reference },
      })
      await recordDelivery(ticket.id, target.channel, target.to, 'sent')
      outcome[target.key] = 'sent'
    } catch (err) {
      logger.error({ err, reference: ticket.reference, channel: target.channel }, 'ticket delivery failed')
      await recordDelivery(ticket.id, target.channel, target.to, 'failed', err.message).catch(() => {})
      outcome[target.key] = 'failed'
    }
  }

  return outcome
}

/** Delivery history for a ticket — shown in the counter console. */
export async function listDeliveries(appointmentId) {
  const { rows } = await query(
    `SELECT channel, recipient, status, error, sent_at
       FROM ticket_deliveries WHERE appointment_id = $1 ORDER BY sent_at`,
    [appointmentId],
  )
  return rows.map((r) => ({
    channel: r.channel,
    recipient: r.recipient,
    status: r.status,
    error: r.error,
    sentAt: r.sent_at.toISOString(),
  }))
}
