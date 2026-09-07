import { Router } from 'express'
import { z } from 'zod'
import { query } from '../db/pool.js'
import { config } from '../config.js'
import { asyncHandler, badRequest, conflict } from '../lib/errors.js'
import { authenticate, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { requireTicket } from './appointments.js'
import { listDeliveries, getTicketByReference, deliverTicket } from '../services/tickets.js'

export const counterRouter = Router()

counterRouter.use(authenticate, requireRole('counter', 'admin'))

/**
 * The counter's whole job: a patient walks up and says a code. This returns
 * everything the desk needs to identify them and check them in.
 */
counterRouter.get(
  '/tickets/:reference',
  requireTicket,
  asyncHandler(async (req, res) => {
    res.json({
      ticket: req.ticket,
      deliveries: await listDeliveries(req.ticket.id),
    })
  }),
)

counterRouter.post(
  '/tickets/:reference/check-in',
  requireTicket,
  asyncHandler(async (req, res) => {
    const ticket = req.ticket
    if (ticket.status !== 'confirmed') {
      throw conflict(`That ticket is ${ticket.status.replace('_', ' ')} and cannot be checked in.`)
    }
    if (ticket.checkedInAt) {
      return res.json({ ticket, alreadyCheckedIn: true })
    }

    await query(
      `UPDATE appointments SET checked_in_at = now(), checked_in_by = $2 WHERE id = $1`,
      [ticket.id, req.user.id],
    )
    await query(
      `INSERT INTO audit_log (actor_user_id, action, entity, entity_id)
       VALUES ($1, 'appointment.checked_in', 'appointment', $2)`,
      [req.user.id, ticket.id],
    )

    res.json({ ticket: await getTicketByReference(ticket.reference), alreadyCheckedIn: false })
  }),
)

/** Re-sends the ticket, for when a patient says the email never arrived. */
counterRouter.post(
  '/tickets/:reference/resend',
  requireTicket,
  asyncHandler(async (req, res) => {
    if (req.ticket.status !== 'confirmed') throw badRequest('Only a confirmed ticket can be re-sent.')
    const delivery = await deliverTicket(req.ticket)
    res.json({ delivery })
  }),
)

/** The day's list, so the desk can work without a code when someone forgets theirs. */
counterRouter.get(
  '/queue',
  validate({
    query: z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      q: z.string().trim().max(80).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const date =
      req.validatedQuery.date ??
      new Intl.DateTimeFormat('en-CA', { timeZone: config.clinic.timezone }).format(new Date())
    const q = req.validatedQuery.q ?? null

    const { rows } = await query(
      `SELECT a.reference, a.starts_at, a.status, a.checked_in_at, a.amount_paise,
              p.full_name, p.phone,
              d.full_name AS doctor_name, dep.name AS department_name
         FROM appointments a
         JOIN patients p ON p.id = a.patient_id
         JOIN doctors d ON d.id = a.doctor_id
         JOIN departments dep ON dep.slug = d.department_slug
        WHERE a.status IN ('confirmed','completed','no_show')
          AND (a.starts_at AT TIME ZONE $1)::date = $2::date
          AND ($3::text IS NULL OR p.full_name ILIKE '%' || $3 || '%'
               OR p.phone ILIKE '%' || $3 || '%' OR a.reference ILIKE '%' || $3 || '%')
        ORDER BY a.starts_at`,
      [config.clinic.timezone, date, q],
    )

    res.json({
      date,
      appointments: rows.map((r) => ({
        reference: r.reference,
        startsAt: r.starts_at.toISOString(),
        status: r.status,
        checkedInAt: r.checked_in_at?.toISOString() ?? null,
        amountPaise: r.amount_paise,
        patient: { fullName: r.full_name, phone: r.phone },
        doctor: { fullName: r.doctor_name, departmentName: r.department_name },
      })),
    })
  }),
)
