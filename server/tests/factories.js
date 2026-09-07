import { query } from '../src/db/pool.js'
import { hashPassword } from '../src/lib/auth.js'

export const PASSWORD = 'Passw0rd!2345'

export async function makeDepartment(slug = 'cardiac-sciences', name = 'Cardiac Sciences') {
  await query(
    `INSERT INTO departments (slug, name, tagline) VALUES ($1, $2, 'Hearts')
     ON CONFLICT (slug) DO NOTHING`,
    [slug, name],
  )
  return slug
}

export async function makeUser({ email, role, fullName = 'Test User', password = PASSWORD }) {
  const { rows } = await query(
    `INSERT INTO users (email, password_hash, role, full_name) VALUES ($1, $2, $3, $4) RETURNING *`,
    [email, await hashPassword(password), role, fullName],
  )
  return rows[0]
}

/**
 * A doctor consulting on every weekday from 10:00 to 13:00 clinic-local, which
 * guarantees the tests always have a future slot to aim at whatever day they run.
 */
export async function makeDoctor({
  slug = 'test-doctor',
  fullName = 'Dr Test Doctor',
  feePaise = 150000,
  slotMinutes = 15,
  isAccepting = true,
  withUser = true,
  rota = [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, startsAt: '10:00', endsAt: '13:00' })),
} = {}) {
  const department = await makeDepartment()
  const user = withUser
    ? await makeUser({ email: `${slug}@example.test`, role: 'doctor', fullName })
    : null

  const { rows } = await query(
    `INSERT INTO doctors (user_id, slug, full_name, title, department_slug,
                          consultation_fee_paise, slot_minutes, is_accepting, initials)
     VALUES ($1, $2, $3, 'Consultant', $4, $5, $6, $7, 'TD') RETURNING *`,
    [user?.id ?? null, slug, fullName, department, feePaise, slotMinutes, isAccepting],
  )
  const doctor = rows[0]

  for (const r of rota) {
    await query(
      `INSERT INTO doctor_availability (doctor_id, weekday, starts_at, ends_at) VALUES ($1,$2,$3,$4)`,
      [doctor.id, r.weekday, r.startsAt, r.endsAt],
    )
  }
  return { doctor, user }
}

export const patientPayload = (overrides = {}) => ({
  fullName: 'Ramesh Prabhu',
  email: 'ramesh.prabhu@example.com',
  phone: '+91 98860 55443',
  ...overrides,
})
