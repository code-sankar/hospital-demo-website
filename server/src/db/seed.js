import { query, withTransaction, closePool } from './pool.js'
import { config } from '../config.js'
import { logger } from '../lib/logger.js'
import { hashPassword } from '../lib/auth.js'
import { ticketCode } from '../lib/codes.js'
import { migrate } from './migrate.js'

// The marketing site's content files stay the single source of truth for who
// works here, so the database and the printed brochure can never disagree.
import { departments } from '../../../client/src/data/departments.js'
import { doctors } from '../../../client/src/data/doctors.js'

/* -------------------------------------------------------------------------- */
/*  Rota parsing                                                              */
/* -------------------------------------------------------------------------- */

const DAYS = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 }

const to24h = (hour, minute, meridiem) => {
  let h = Number(hour)
  if (meridiem === 'pm' && h !== 12) h += 12
  if (meridiem === 'am' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${minute}`
}

/**
 * Turns the human clinic times already written in the content file
 * ("Mon 10:00 am – 1:00 pm", "Mon – Sat 8:00 am – 5:00 pm (reporting)") into
 * weekly rota rows. Anything it cannot read confidently is skipped rather than
 * guessed at — a wrong rota books patients into empty rooms.
 */
export function parseAvailability(lines) {
  const rules = []
  const time = String.raw`(\d{1,2}):(\d{2})\s*(am|pm)`
  const dayNames = Object.keys(DAYS).join('|')
  const single = new RegExp(`^(${dayNames})\\w*\\s+${time}\\s*[–-]\\s*${time}`, 'i')
  const range = new RegExp(`^(${dayNames})\\w*\\s*[–-]\\s*(${dayNames})\\w*\\s+${time}\\s*[–-]\\s*${time}`, 'i')

  for (const line of lines) {
    const text = line.trim()

    const r = range.exec(text)
    if (r) {
      const [, fromDay, toDay, h1, m1, ap1, h2, m2, ap2] = r
      const from = DAYS[fromDay.toLowerCase()]
      const to = DAYS[toDay.toLowerCase()]
      for (let d = from; ; d = (d + 1) % 7) {
        rules.push({ weekday: d, startsAt: to24h(h1, m1, ap1.toLowerCase()), endsAt: to24h(h2, m2, ap2.toLowerCase()) })
        if (d === to) break
      }
      continue
    }

    const s = single.exec(text)
    if (s) {
      const [, day, h1, m1, ap1, h2, m2, ap2] = s
      rules.push({
        weekday: DAYS[day.toLowerCase()],
        startsAt: to24h(h1, m1, ap1.toLowerCase()),
        endsAt: to24h(h2, m2, ap2.toLowerCase()),
      })
    }
  }
  return rules
}

/* -------------------------------------------------------------------------- */
/*  Fees                                                                      */
/* -------------------------------------------------------------------------- */

/** Consultation fee in paise, scaled the way an Indian private hospital would. */
function feeFor(doctor) {
  if (/professor|director/i.test(doctor.title)) return 250000 // ₹2,500
  if (/senior consultant/i.test(doctor.title)) return 150000 // ₹1,500
  if (doctor.experience >= 20) return 150000
  return 110000 // ₹1,100
}

/* -------------------------------------------------------------------------- */
/*  Seeding                                                                   */
/* -------------------------------------------------------------------------- */

// Demo credentials. Every seeded account is flagged must_change_password, and
// seeding refuses to run against production without an explicit override.
const DEMO = {
  doctorPassword: 'Doctor@12345',
  counterPassword: 'Counter@12345',
  adminPassword: 'Admin@12345',
}

async function upsertUser({ email, fullName, role, password }) {
  const { rows } = await query(
    `INSERT INTO users (email, password_hash, role, full_name, must_change_password)
     VALUES ($1, $2, $3, $4, true)
     ON CONFLICT (lower(email)) DO UPDATE
        SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = true
     RETURNING id`,
    [email, await hashPassword(password), role, fullName],
  )
  return rows[0].id
}

async function seedDemoBookings() {
  const { rows: existing } = await query(
    `SELECT count(*)::int AS n FROM appointments WHERE status = 'confirmed'`,
  )
  if (existing[0].n > 0) return 0

  // Place a few paid bookings on the next slots each doctor actually offers, so
  // the counter console and the doctor dashboard have something in them.
  const { rows: candidates } = await query(
    `
    WITH days AS (
      SELECT (now() AT TIME ZONE $1)::date + i AS day FROM generate_series(0, 13) i
    ),
    slot AS (
      SELECT d.id AS doctor_id, d.consultation_fee_paise, d.slot_minutes,
             ((dy.day + a.starts_at) AT TIME ZONE $1) AS starts_at,
             row_number() OVER (PARTITION BY d.id ORDER BY dy.day, a.starts_at) AS rn
        FROM days dy
        JOIN doctor_availability a ON a.is_active AND a.weekday = EXTRACT(dow FROM dy.day)::smallint
        JOIN doctors d ON d.id = a.doctor_id AND d.is_accepting
       WHERE ((dy.day + a.starts_at) AT TIME ZONE $1) > now() + interval '2 hours'
    )
    SELECT * FROM slot WHERE rn = 1 ORDER BY starts_at LIMIT 4
    `,
    [config.clinic.timezone],
  )

  const people = [
    { fullName: 'Sunita Rangappa', email: 'sunita.rangappa@example.com', phone: '+91 98450 11223' },
    { fullName: 'Imtiaz Ahmed', email: 'imtiaz.ahmed@example.com', phone: '+91 99012 44556' },
    { fullName: 'Mahesh Pai', email: 'mahesh.pai@example.com', phone: '+91 80503 77889' },
    { fullName: 'Deepa Chandran', email: 'deepa.chandran@example.com', phone: '+91 97414 33221' },
  ]

  let made = 0
  for (const [i, slot] of candidates.entries()) {
    const person = people[i % people.length]
    await withTransaction(async (client) => {
      const { rows: p } = await client.query(
        `INSERT INTO patients (full_name, email, phone) VALUES ($1, $2, $3)
         ON CONFLICT (lower(email), phone) DO UPDATE SET full_name = EXCLUDED.full_name
         RETURNING id`,
        [person.fullName, person.email, person.phone],
      )
      const { rows: appt } = await client.query(
        `INSERT INTO appointments
           (reference, doctor_id, patient_id, starts_at, ends_at, status, reason,
            amount_paise, confirmed_at, terms_accepted_at)
         VALUES ($1, $2, $3, $4::timestamptz, $4::timestamptz + make_interval(mins => $5::int), 'confirmed', 'new', $6, now(), now())
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [ticketCode(), slot.doctor_id, p[0].id, slot.starts_at, slot.slot_minutes, slot.consultation_fee_paise],
      )
      if (appt[0]) {
        await client.query(
          `INSERT INTO payments (appointment_id, provider, provider_order_id, amount_paise, status, paid_at)
           VALUES ($1, 'mock', $2, $3, 'paid', now())`,
          [appt[0].id, `mock_order_seed_${appt[0].id.slice(0, 8)}`, slot.consultation_fee_paise],
        )
        made += 1
      }
    })
  }
  return made
}

export async function seed({ force = false } = {}) {
  if (config.isProd && !force) {
    throw new Error('Refusing to seed demo accounts in production. Pass --force if you really mean it.')
  }

  await migrate()

  for (const [i, dept] of departments.entries()) {
    await query(
      `INSERT INTO departments (slug, name, tagline, sort_order) VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, sort_order = EXCLUDED.sort_order`,
      [dept.slug, dept.name, dept.tagline, i],
    )
  }
  logger.info({ count: departments.length }, 'departments seeded')

  let rotaRows = 0
  for (const doc of doctors) {
    const email = `${doc.slug}@ashvini-health.example`
    const userId = await upsertUser({
      email,
      fullName: doc.name,
      role: 'doctor',
      password: DEMO.doctorPassword,
    })

    const { rows } = await query(
      `INSERT INTO doctors
         (user_id, slug, full_name, title, department_slug, focus, languages, qualifications,
          memberships, bio, experience_years, consultation_fee_paise, slot_minutes, is_accepting,
          portrait_seed, initials, rating, review_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       ON CONFLICT (slug) DO UPDATE SET
         user_id = EXCLUDED.user_id, full_name = EXCLUDED.full_name, title = EXCLUDED.title,
         department_slug = EXCLUDED.department_slug, focus = EXCLUDED.focus,
         languages = EXCLUDED.languages, qualifications = EXCLUDED.qualifications,
         memberships = EXCLUDED.memberships, bio = EXCLUDED.bio,
         experience_years = EXCLUDED.experience_years, portrait_seed = EXCLUDED.portrait_seed,
         initials = EXCLUDED.initials, rating = EXCLUDED.rating, review_count = EXCLUDED.review_count
       RETURNING id`,
      [
        userId,
        doc.slug,
        doc.name,
        doc.title,
        doc.department,
        doc.focus,
        doc.languages,
        doc.education,
        doc.memberships,
        doc.bio,
        doc.experience,
        feeFor(doc),
        15,
        doc.accepting,
        doc.seed,
        doc.initials,
        doc.rating,
        doc.reviews,
      ],
    )
    const doctorId = rows[0].id

    const rules = parseAvailability(doc.availability)
    const { rows: hasRota } = await query(
      'SELECT count(*)::int AS n FROM doctor_availability WHERE doctor_id = $1',
      [doctorId],
    )
    // Never overwrite a rota a doctor has since edited for themselves.
    if (hasRota[0].n === 0 && rules.length > 0) {
      for (const r of rules) {
        await query(
          `INSERT INTO doctor_availability (doctor_id, weekday, starts_at, ends_at)
           VALUES ($1, $2, $3, $4)`,
          [doctorId, r.weekday, r.startsAt, r.endsAt],
        )
        rotaRows += 1
      }
    }
  }
  logger.info({ doctors: doctors.length, rotaRows }, 'doctors and rotas seeded')

  await upsertUser({
    email: 'counter@ashvini-health.example',
    fullName: 'Front Desk — Main Reception',
    role: 'counter',
    password: DEMO.counterPassword,
  })
  await upsertUser({
    email: 'admin@ashvini-health.example',
    fullName: 'Hospital Administrator',
    role: 'admin',
    password: DEMO.adminPassword,
  })

  const bookings = await seedDemoBookings()
  logger.info({ bookings }, 'demo bookings seeded')

  return { departments: departments.length, doctors: doctors.length, rotaRows, bookings }
}

if (process.argv[1]?.endsWith('seed.js')) {
  seed({ force: process.argv.includes('--force') })
    .then((summary) => {
      console.log('\n  Seed complete:', summary)
      console.log('\n  Demo sign-ins (all flagged “must change password”):')
      console.log(`    Doctor   ananya-iyer@ashvini-health.example      ${DEMO.doctorPassword}`)
      console.log(`    Doctor   any <doctor-slug>@ashvini-health.example ${DEMO.doctorPassword}`)
      console.log(`    Counter  counter@ashvini-health.example          ${DEMO.counterPassword}`)
      console.log(`    Admin    admin@ashvini-health.example            ${DEMO.adminPassword}\n`)
      return closePool()
    })
    .catch((err) => {
      logger.error({ err }, 'seed failed')
      process.exitCode = 1
      return closePool()
    })
}
