import { query } from '../db/pool.js'
import { config } from '../config.js'

/**
 * Releases slots whose payment window has closed. Called before anything that
 * reads or writes availability, so an abandoned checkout never holds a slot
 * hostage beyond its window.
 */
export async function sweepExpiredHolds() {
  const { rowCount } = await query(
    `UPDATE appointments
        SET status = 'expired'
      WHERE status = 'pending_payment'
        AND hold_expires_at IS NOT NULL
        AND hold_expires_at < now()`,
  )
  return rowCount
}

/**
 * Available slots for a doctor across a date range.
 *
 * The arithmetic runs in Postgres on purpose. Availability is stored as local
 * wall-clock time ("Tuesday, 10:00"), and only the database has the timezone
 * rules needed to turn that into a correct absolute instant — including any
 * DST transition, which matters the moment this is reused outside India.
 */
export async function listSlots({ doctorId, fromDate, toDate, includeUnavailable = false }) {
  await sweepExpiredHolds()

  const { rows } = await query(
    `
    WITH p AS (
      SELECT $1::uuid AS doctor_id,
             $2::date AS from_date,
             $3::date AS to_date,
             $4::text AS tz,
             now() + make_interval(mins => $5::int) AS earliest
    ),
    days AS (
      SELECT d::date AS day
        FROM p, generate_series(p.from_date, p.to_date, interval '1 day') AS d
    ),
    candidate AS (
      SELECT
        dy.day,
        ((dy.day + a.starts_at) AT TIME ZONE p.tz) + make_interval(mins => g.n * doc.slot_minutes) AS starts_at,
        ((dy.day + a.starts_at) AT TIME ZONE p.tz) + make_interval(mins => (g.n + 1) * doc.slot_minutes) AS ends_at
      FROM p
      CROSS JOIN days dy
      JOIN doctors doc ON doc.id = p.doctor_id
      JOIN doctor_availability a
        ON a.doctor_id = p.doctor_id
       AND a.is_active
       AND a.weekday = EXTRACT(dow FROM dy.day)::smallint
      CROSS JOIN LATERAL generate_series(
        0,
        floor(EXTRACT(EPOCH FROM (a.ends_at - a.starts_at)) / 60 / doc.slot_minutes)::int - 1
      ) AS g(n)
    )
    SELECT
      c.day,
      c.starts_at,
      c.ends_at,
      EXISTS (
        SELECT 1 FROM doctor_time_off t
         WHERE t.doctor_id = (SELECT doctor_id FROM p)
           AND t.starts_at < c.ends_at AND t.ends_at > c.starts_at
      ) AS on_leave,
      EXISTS (
        SELECT 1 FROM appointments ap
         WHERE ap.doctor_id = (SELECT doctor_id FROM p)
           AND ap.status IN ('pending_payment', 'confirmed')
           AND ap.starts_at < c.ends_at AND ap.ends_at > c.starts_at
      ) AS taken,
      c.starts_at < (SELECT earliest FROM p) AS too_soon
    FROM candidate c
    ORDER BY c.starts_at
    `,
    [doctorId, fromDate, toDate, config.clinic.timezone, config.clinic.leadTimeMinutes],
  )

  return rows
    .map((r) => ({
      date: typeof r.day === 'string' ? r.day : r.day.toISOString().slice(0, 10),
      startsAt: r.starts_at.toISOString(),
      endsAt: r.ends_at.toISOString(),
      available: !r.on_leave && !r.taken && !r.too_soon,
      reason: r.on_leave ? 'doctor_unavailable' : r.taken ? 'booked' : r.too_soon ? 'too_soon' : null,
    }))
    .filter((s) => includeUnavailable || s.available)
}

/**
 * Confirms one exact slot is bookable, and returns its end instant.
 * The booking endpoint never trusts a start time supplied by the browser.
 */
export async function resolveSlot({ doctorId, startsAt }) {
  const day = new Date(startsAt)
  if (Number.isNaN(day.getTime())) return null

  // Look one day either side so a slot near local midnight is still found
  // whichever way the UTC date falls.
  const from = new Date(day.getTime() - 86_400_000).toISOString().slice(0, 10)
  const to = new Date(day.getTime() + 86_400_000).toISOString().slice(0, 10)

  const slots = await listSlots({ doctorId, fromDate: from, toDate: to, includeUnavailable: true })
  const wanted = new Date(startsAt).toISOString()
  return slots.find((s) => s.startsAt === wanted) ?? null
}

/** Groups slots by clinic-local date, for rendering a calendar. */
export function groupByDate(slots) {
  const map = new Map()
  for (const slot of slots) {
    if (!map.has(slot.date)) map.set(slot.date, [])
    map.get(slot.date).push(slot)
  }
  return [...map.entries()].map(([date, items]) => ({ date, slots: items }))
}
