import { query, withTransaction } from '../db/pool.js'
import { config } from '../config.js'
import { ticketCode } from '../lib/codes.js'
import { badRequest, conflict, notFound, gone } from '../lib/errors.js'
import { logger } from '../lib/logger.js'
import { resolveSlot, sweepExpiredHolds } from './slots.js'
import { paymentProvider } from './payments.js'
import { getTicketById, deliverTicket } from './tickets.js'

/** Postgres raises this when the appointments_no_overlap constraint is hit. */
const EXCLUSION_VIOLATION = '23P01'

/**
 * Step one of booking: reserve the slot and open a payment order.
 *
 * The appointment exists immediately as `pending_payment` so the database — not
 * a queue or a cache — owns the reservation. It holds for config.clinic.holdMinutes
 * and is then swept back into circulation.
 */
export async function holdSlot({ doctorSlug, startsAt, patient, reason, notes }) {
  await sweepExpiredHolds()

  const { rows: doctorRows } = await query(
    `SELECT d.id, d.slug, d.full_name, d.is_accepting, d.consultation_fee_paise, d.slot_minutes,
            dep.name AS department_name
       FROM doctors d
       JOIN departments dep ON dep.slug = d.department_slug
      WHERE d.slug = $1`,
    [doctorSlug],
  )
  const doctor = doctorRows[0]
  if (!doctor) throw notFound('We could not find that consultant.')
  if (!doctor.is_accepting) {
    throw conflict(`${doctor.full_name} is not accepting new appointments at the moment.`, {
      code: 'doctor_not_accepting',
    })
  }

  // Never trust a start time from the browser: re-derive it from the rota.
  const slot = await resolveSlot({ doctorId: doctor.id, startsAt })
  if (!slot) throw badRequest('That time is not part of this consultant’s clinic hours.')
  if (!slot.available) {
    const message =
      slot.reason === 'booked'
        ? 'Someone booked that slot a moment before you. Please choose another time.'
        : slot.reason === 'doctor_unavailable'
          ? 'The consultant is not available at that time.'
          : 'That slot is too close to now to book online. Please choose a later time or call us.'
    throw conflict(message, { code: slot.reason })
  }

  const reference = ticketCode()
  const holdExpiresAt = new Date(Date.now() + config.clinic.holdMinutes * 60_000)

  const appointment = await withTransaction(async (client) => {
    const { rows: patientRows } = await client.query(
      `INSERT INTO patients (full_name, email, phone, date_of_birth)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (lower(email), phone)
       DO UPDATE SET full_name = EXCLUDED.full_name,
                     date_of_birth = COALESCE(EXCLUDED.date_of_birth, patients.date_of_birth)
       RETURNING id`,
      [patient.fullName, patient.email, patient.phone, patient.dateOfBirth ?? null],
    )

    try {
      const { rows } = await client.query(
        `INSERT INTO appointments
           (reference, doctor_id, patient_id, starts_at, ends_at, status, reason, notes,
            amount_paise, hold_expires_at, terms_accepted_at)
         VALUES ($1, $2, $3, $4, $5, 'pending_payment', $6, $7, $8, $9, now())
         RETURNING id, reference, starts_at, ends_at, amount_paise, hold_expires_at`,
        [
          reference,
          doctor.id,
          patientRows[0].id,
          slot.startsAt,
          slot.endsAt,
          reason,
          notes ?? '',
          doctor.consultation_fee_paise,
          holdExpiresAt,
        ],
      )
      return rows[0]
    } catch (err) {
      if (err.code === EXCLUSION_VIOLATION) {
        throw conflict('Someone booked that slot a moment before you. Please choose another time.', {
          code: 'booked',
        })
      }
      throw err
    }
  })

  // The order is created after the slot is safely held, so a gateway hiccup
  // cannot leave an order without a reservation behind it.
  const provider = paymentProvider()
  const order = await provider.createOrder({
    amountPaise: appointment.amount_paise,
    receipt: appointment.reference,
    notes: { appointmentId: appointment.id, doctor: doctor.full_name },
  })

  await query(
    `INSERT INTO payments (appointment_id, provider, provider_order_id, amount_paise, currency, status)
     VALUES ($1, $2, $3, $4, $5, 'created')`,
    [appointment.id, provider.name, order.orderId, appointment.amount_paise, config.clinic.currency],
  )

  logger.info({ appointmentId: appointment.id, doctor: doctor.slug }, 'slot held, awaiting payment')

  return {
    appointmentId: appointment.id,
    startsAt: appointment.starts_at.toISOString(),
    endsAt: appointment.ends_at.toISOString(),
    amountPaise: appointment.amount_paise,
    holdExpiresAt: appointment.hold_expires_at.toISOString(),
    doctor: { slug: doctor.slug, fullName: doctor.full_name, departmentName: doctor.department_name },
    checkout: order.checkout,
  }
}

/**
 * Step two: verify the gateway's response, confirm the appointment and issue
 * the ticket. Idempotent — a repeated call on an already-confirmed appointment
 * returns the same ticket rather than charging or emailing twice.
 */
export async function confirmPayment({ appointmentId, payload, trusted = false }) {
  const { rows } = await query(
    `SELECT a.id, a.status, a.hold_expires_at, a.amount_paise,
            pay.id AS payment_id, pay.provider, pay.provider_order_id, pay.status AS payment_status
       FROM appointments a
       LEFT JOIN LATERAL (
         SELECT id, provider, provider_order_id, status
           FROM payments WHERE appointment_id = a.id
          ORDER BY created_at DESC LIMIT 1
       ) pay ON true
      WHERE a.id = $1`,
    [appointmentId],
  )
  const row = rows[0]
  if (!row) throw notFound('We could not find that booking.')

  if (row.status === 'confirmed') {
    return { ticket: await getTicketById(appointmentId), alreadyConfirmed: true }
  }
  if (row.status === 'expired') {
    throw gone('That booking timed out before payment was completed. Nothing was charged — please book again.')
  }
  if (row.status !== 'pending_payment') {
    throw conflict(`This booking is ${row.status.replace('_', ' ')} and cannot be paid for.`)
  }
  if (!row.payment_id) throw badRequest('No payment order exists for this booking.')

  const provider = paymentProvider()
  if (provider.name !== row.provider) {
    throw badRequest(`This booking was created with the "${row.provider}" gateway.`)
  }

  // `trusted` means the signature was already checked over the raw webhook
  // body, which is a stronger guarantee than the browser handshake. Verifying
  // the handshake again there would fail: the webhook carries no such field.
  const verified = trusted
    ? { paymentId: payload.razorpay_payment_id, signature: 'webhook', raw: payload }
    : provider.verifyPayment({ orderId: row.provider_order_id, payload })

  const confirmed = await withTransaction(async (client) => {
    await client.query(
      `UPDATE payments
          SET status = 'paid', provider_payment_id = $2, provider_signature = $3,
              paid_at = now(), raw = $4
        WHERE id = $1`,
      [row.payment_id, verified.paymentId, verified.signature, JSON.stringify(verified.raw ?? {})],
    )

    // The hold is only lifted here, under the same transaction as the payment,
    // so a slot can never be confirmed and released at the same moment.
    const { rows: updated } = await client.query(
      `UPDATE appointments
          SET status = 'confirmed', confirmed_at = now(), hold_expires_at = NULL
        WHERE id = $1 AND status = 'pending_payment'
        RETURNING id`,
      [appointmentId],
    )
    if (updated.length === 0) {
      throw conflict('That booking changed while the payment was being confirmed. Please contact us.')
    }

    await client.query(
      `INSERT INTO audit_log (action, entity, entity_id, meta)
       VALUES ('appointment.confirmed', 'appointment', $1, $2)`,
      [appointmentId, JSON.stringify({ paymentId: verified.paymentId, provider: provider.name })],
    )
    return true
  })

  if (!confirmed) throw conflict('Could not confirm that booking.')

  const ticket = await getTicketById(appointmentId)
  const delivery = await deliverTicket(ticket)

  logger.info({ reference: ticket.reference, delivery }, 'appointment confirmed and ticket issued')
  return { ticket, delivery, alreadyConfirmed: false }
}

/** Abandons a hold before it expires, e.g. the patient closed the checkout. */
export async function releaseHold(appointmentId) {
  const { rowCount } = await query(
    `UPDATE appointments SET status = 'expired'
      WHERE id = $1 AND status = 'pending_payment'`,
    [appointmentId],
  )
  return rowCount > 0
}
