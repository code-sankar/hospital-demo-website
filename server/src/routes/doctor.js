import { Router } from 'express'
import { z } from 'zod'
import { query, withTransaction } from '../db/pool.js'
import { asyncHandler, badRequest, forbidden, notFound } from '../lib/errors.js'
import { authenticate, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

export const doctorRouter = Router()

doctorRouter.use(authenticate, requireRole('doctor', 'admin'))

/** Resolves which doctor record the request acts on. */
const doctorId = asyncHandler(async (req, _res, next) => {
  if (req.user.doctor_id) {
    req.doctorId = req.user.doctor_id
    return next()
  }
  // An admin may act on a doctor by passing ?doctor=<slug>.
  const slug = req.query.doctor
  if (req.user.role === 'admin' && slug) {
    const { rows } = await query('SELECT id FROM doctors WHERE slug = $1', [slug])
    if (!rows[0]) throw notFound('No such consultant.')
    req.doctorId = rows[0].id
    return next()
  }
  throw forbidden('This login is not linked to a consultant profile.')
})

doctorRouter.use(doctorId)

const timeOfDay = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM, e.g. 09:30.')

const ruleSchema = z
  .object({
    weekday: z.number().int().min(0).max(6),
    startsAt: timeOfDay,
    endsAt: timeOfDay,
    isActive: z.boolean().default(true),
  })
  .refine((r) => r.endsAt > r.startsAt, {
    message: 'The finish time must be after the start time.',
    path: ['endsAt'],
  })

/** Two clinics on the same day must not overlap, or slots would be generated twice. */
const noOverlaps = (rules) => {
  const byDay = new Map()
  for (const rule of rules) {
    if (!rule.isActive) continue
    const list = byDay.get(rule.weekday) ?? []
    if (list.some((other) => rule.startsAt < other.endsAt && other.startsAt < rule.endsAt)) return false
    list.push(rule)
    byDay.set(rule.weekday, list)
  }
  return true
}

doctorRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const { rows } = await query(
      `SELECT d.*, dep.name AS department_name
         FROM doctors d JOIN departments dep ON dep.slug = d.department_slug
        WHERE d.id = $1`,
      [req.doctorId],
    )
    const d = rows[0]

    const { rows: rota } = await query(
      `SELECT id, weekday, to_char(starts_at, 'HH24:MI') AS starts_at,
              to_char(ends_at, 'HH24:MI') AS ends_at, is_active
         FROM doctor_availability WHERE doctor_id = $1 ORDER BY weekday, starts_at`,
      [req.doctorId],
    )

    const { rows: timeOff } = await query(
      `SELECT id, starts_at, ends_at, reason FROM doctor_time_off
        WHERE doctor_id = $1 AND ends_at > now() ORDER BY starts_at`,
      [req.doctorId],
    )

    res.json({
      doctor: {
        slug: d.slug,
        fullName: d.full_name,
        title: d.title,
        departmentSlug: d.department_slug,
        departmentName: d.department_name,
        bio: d.bio,
        focus: d.focus,
        languages: d.languages,
        qualifications: d.qualifications,
        experienceYears: d.experience_years,
        consultationFeePaise: d.consultation_fee_paise,
        slotMinutes: d.slot_minutes,
        isAccepting: d.is_accepting,
        portraitSeed: d.portrait_seed,
        initials: d.initials,
      },
      availability: rota.map((r) => ({
        id: r.id,
        weekday: r.weekday,
        startsAt: r.starts_at,
        endsAt: r.ends_at,
        isActive: r.is_active,
      })),
      timeOff: timeOff.map((t) => ({
        id: t.id,
        startsAt: t.starts_at.toISOString(),
        endsAt: t.ends_at.toISOString(),
        reason: t.reason,
      })),
    })
  }),
)

doctorRouter.patch(
  '/me',
  validate({
    body: z.object({
      isAccepting: z.boolean().optional(),
      bio: z.string().trim().max(2000).optional(),
      focus: z.array(z.string().trim().min(1).max(80)).max(8).optional(),
      languages: z.array(z.string().trim().min(1).max(40)).max(12).optional(),
      slotMinutes: z.number().int().min(5).max(120).optional(),
      consultationFeeRupees: z.number().int().min(1).max(500000).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const b = req.body
    const { rows } = await query(
      `UPDATE doctors SET
         is_accepting          = COALESCE($2, is_accepting),
         bio                   = COALESCE($3, bio),
         focus                 = COALESCE($4, focus),
         languages             = COALESCE($5, languages),
         slot_minutes          = COALESCE($6, slot_minutes),
         consultation_fee_paise = COALESCE($7, consultation_fee_paise)
       WHERE id = $1
       RETURNING is_accepting, slot_minutes, consultation_fee_paise`,
      [
        req.doctorId,
        b.isAccepting ?? null,
        b.bio ?? null,
        b.focus ?? null,
        b.languages ?? null,
        b.slotMinutes ?? null,
        b.consultationFeeRupees ? b.consultationFeeRupees * 100 : null,
      ],
    )

    await query(
      `INSERT INTO audit_log (actor_user_id, action, entity, entity_id, meta)
       VALUES ($1, 'doctor.profile_updated', 'doctor', $2, $3)`,
      [req.user.id, req.doctorId, JSON.stringify(b)],
    )

    res.json({
      doctor: {
        isAccepting: rows[0].is_accepting,
        slotMinutes: rows[0].slot_minutes,
        consultationFeePaise: rows[0].consultation_fee_paise,
      },
    })
  }),
)

/**
 * Replaces the whole weekly rota in one transaction. Sending the complete set
 * rather than patching single rows keeps the doctor's screen and the database
 * in step — there is no partially-applied state to reason about.
 */
doctorRouter.put(
  '/availability',
  validate({ body: z.object({ rules: z.array(ruleSchema).max(40) }) }),
  asyncHandler(async (req, res) => {
    const { rules } = req.body
    if (!noOverlaps(rules)) {
      throw badRequest('Two clinics on the same day overlap. Please adjust the times.')
    }

    await withTransaction(async (client) => {
      await client.query('DELETE FROM doctor_availability WHERE doctor_id = $1', [req.doctorId])
      for (const r of rules) {
        await client.query(
          `INSERT INTO doctor_availability (doctor_id, weekday, starts_at, ends_at, is_active)
           VALUES ($1, $2, $3, $4, $5)`,
          [req.doctorId, r.weekday, r.startsAt, r.endsAt, r.isActive],
        )
      }
      await client.query(
        `INSERT INTO audit_log (actor_user_id, action, entity, entity_id, meta)
         VALUES ($1, 'doctor.availability_replaced', 'doctor', $2, $3)`,
        [req.user.id, req.doctorId, JSON.stringify({ count: rules.length })],
      )
    })

    res.json({ ok: true, count: rules.length })
  }),
)

doctorRouter.post(
  '/time-off',
  validate({
    body: z
      .object({
        startsAt: z.string().datetime({ offset: true }),
        endsAt: z.string().datetime({ offset: true }),
        reason: z.string().trim().max(200).default(''),
      })
      .refine((v) => new Date(v.endsAt) > new Date(v.startsAt), {
        message: 'The end must be after the start.',
        path: ['endsAt'],
      }),
  }),
  asyncHandler(async (req, res) => {
    const { startsAt, endsAt, reason } = req.body

    const { rows: clash } = await query(
      `SELECT reference, starts_at FROM appointments
        WHERE doctor_id = $1 AND status IN ('pending_payment','confirmed')
          AND starts_at < $3 AND ends_at > $2
        ORDER BY starts_at`,
      [req.doctorId, startsAt, endsAt],
    )

    const { rows } = await query(
      `INSERT INTO doctor_time_off (doctor_id, starts_at, ends_at, reason)
       VALUES ($1, $2, $3, $4) RETURNING id, starts_at, ends_at, reason`,
      [req.doctorId, startsAt, endsAt, reason],
    )

    // Existing bookings are never silently cancelled — patients have paid for
    // them. They are reported back so the doctor can have them rescheduled.
    res.status(201).json({
      timeOff: {
        id: rows[0].id,
        startsAt: rows[0].starts_at.toISOString(),
        endsAt: rows[0].ends_at.toISOString(),
        reason: rows[0].reason,
      },
      affectedAppointments: clash.map((c) => ({
        reference: c.reference,
        startsAt: c.starts_at.toISOString(),
      })),
    })
  }),
)

doctorRouter.delete(
  '/time-off/:id',
  validate({ params: z.object({ id: z.string().uuid() }) }),
  asyncHandler(async (req, res) => {
    const { rowCount } = await query('DELETE FROM doctor_time_off WHERE id = $1 AND doctor_id = $2', [
      req.params.id,
      req.doctorId,
    ])
    if (!rowCount) throw notFound('No such entry.')
    res.json({ ok: true })
  }),
)

doctorRouter.get(
  '/appointments',
  validate({
    query: z.object({
      from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      days: z.coerce.number().int().min(1).max(90).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const from = req.validatedQuery.from ?? new Date().toISOString().slice(0, 10)
    const days = req.validatedQuery.days ?? 14

    const { rows } = await query(
      `SELECT a.reference, a.starts_at, a.ends_at, a.status, a.reason, a.notes,
              a.amount_paise, a.checked_in_at,
              p.full_name, p.phone, p.email
         FROM appointments a JOIN patients p ON p.id = a.patient_id
        WHERE a.doctor_id = $1
          AND a.status IN ('confirmed','completed','no_show')
          AND a.starts_at >= $2::date
          AND a.starts_at < ($2::date + make_interval(days => $3::int))
        ORDER BY a.starts_at`,
      [req.doctorId, from, days],
    )

    res.json({
      appointments: rows.map((r) => ({
        reference: r.reference,
        startsAt: r.starts_at.toISOString(),
        endsAt: r.ends_at.toISOString(),
        status: r.status,
        reason: r.reason,
        notes: r.notes,
        amountPaise: r.amount_paise,
        checkedInAt: r.checked_in_at?.toISOString() ?? null,
        patient: { fullName: r.full_name, phone: r.phone, email: r.email },
      })),
    })
  }),
)
