import { Router } from 'express'
import { z } from 'zod'
import { query } from '../db/pool.js'
import { config } from '../config.js'
import { asyncHandler, notFound } from '../lib/errors.js'
import { validate } from '../middleware/validate.js'
import { listSlots, groupByDate } from '../services/slots.js'

export const catalogueRouter = Router()

const shapeDoctor = (r) => ({
  slug: r.slug,
  fullName: r.full_name,
  title: r.title,
  departmentSlug: r.department_slug,
  departmentName: r.department_name,
  focus: r.focus,
  languages: r.languages,
  qualifications: r.qualifications,
  memberships: r.memberships,
  bio: r.bio,
  experienceYears: r.experience_years,
  consultationFeePaise: r.consultation_fee_paise,
  slotMinutes: r.slot_minutes,
  isAccepting: r.is_accepting,
  portraitSeed: r.portrait_seed,
  initials: r.initials,
  rating: r.rating,
  reviewCount: r.review_count,
})

catalogueRouter.get(
  '/departments',
  asyncHandler(async (_req, res) => {
    const { rows } = await query(
      `SELECT d.slug, d.name, d.tagline, count(doc.id)::int AS doctor_count
         FROM departments d LEFT JOIN doctors doc ON doc.department_slug = d.slug
        GROUP BY d.slug ORDER BY d.sort_order, d.name`,
    )
    res.json({ departments: rows })
  }),
)

catalogueRouter.get(
  '/doctors',
  validate({
    query: z.object({
      department: z.string().trim().optional(),
      language: z.string().trim().optional(),
      q: z.string().trim().max(120).optional(),
      accepting: z.enum(['true', 'false']).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { department, language, q, accepting } = req.validatedQuery
    const { rows } = await query(
      `SELECT d.*, dep.name AS department_name
         FROM doctors d JOIN departments dep ON dep.slug = d.department_slug
        WHERE ($1::text IS NULL OR d.department_slug = $1)
          AND ($2::text IS NULL OR $2 = ANY (d.languages))
          AND ($3::text IS NULL OR (
                d.full_name ILIKE '%' || $3 || '%'
             OR d.title ILIKE '%' || $3 || '%'
             OR dep.name ILIKE '%' || $3 || '%'
             OR EXISTS (SELECT 1 FROM unnest(d.focus) f WHERE f ILIKE '%' || $3 || '%')))
          AND ($4::boolean IS NULL OR d.is_accepting = $4)
        ORDER BY d.full_name`,
      [department ?? null, language ?? null, q ?? null, accepting === undefined ? null : accepting === 'true'],
    )
    res.json({ doctors: rows.map(shapeDoctor) })
  }),
)

catalogueRouter.get(
  '/doctors/:slug',
  asyncHandler(async (req, res) => {
    const { rows } = await query(
      `SELECT d.*, dep.name AS department_name
         FROM doctors d JOIN departments dep ON dep.slug = d.department_slug
        WHERE d.slug = $1`,
      [req.params.slug],
    )
    if (!rows[0]) throw notFound('We could not find that consultant.')

    const { rows: rota } = await query(
      `SELECT weekday, to_char(starts_at, 'HH24:MI') AS starts_at, to_char(ends_at, 'HH24:MI') AS ends_at
         FROM doctor_availability
        WHERE doctor_id = $1 AND is_active
        ORDER BY weekday, starts_at`,
      [rows[0].id],
    )
    res.json({ doctor: { ...shapeDoctor(rows[0]), availability: rota } })
  }),
)

catalogueRouter.get(
  '/doctors/:slug/slots',
  validate({
    query: z.object({
      from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD.').optional(),
      days: z.coerce.number().int().min(1).max(60).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { rows } = await query('SELECT id, is_accepting, slot_minutes FROM doctors WHERE slug = $1', [
      req.params.slug,
    ])
    const doctor = rows[0]
    if (!doctor) throw notFound('We could not find that consultant.')

    if (!doctor.is_accepting) {
      return res.json({ acceptingBookings: false, days: [], slotMinutes: doctor.slot_minutes })
    }

    // Default window starts today in clinic-local terms, not UTC.
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: config.clinic.timezone }).format(new Date())
    const fromDate = req.validatedQuery.from ?? today
    const days = Math.min(req.validatedQuery.days ?? 14, config.clinic.horizonDays)
    const toDate = new Date(`${fromDate}T00:00:00Z`)
    toDate.setUTCDate(toDate.getUTCDate() + days - 1)

    const slots = await listSlots({
      doctorId: doctor.id,
      fromDate,
      toDate: toDate.toISOString().slice(0, 10),
    })

    res.json({
      acceptingBookings: true,
      slotMinutes: doctor.slot_minutes,
      timezone: config.clinic.timezone,
      days: groupByDate(slots),
    })
  }),
)
