import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { query } from '../src/db/pool.js'
import { makeDoctor, makeUser, patientPayload, PASSWORD } from './factories.js'

const app = createApp()

const login = async (email, password = PASSWORD) => {
  const res = await request(app).post('/api/auth/login').send({ email, password })
  return { res, cookie: res.headers['set-cookie'] }
}

async function bookAndPay() {
  const slots = await request(app).get('/api/doctors/test-doctor/slots?days=10')
  const slot = slots.body.days.find((d) => d.slots.length > 0).slots[0]
  const hold = await request(app)
    .post('/api/appointments/hold')
    .send({
      doctorSlug: 'test-doctor',
      startsAt: slot.startsAt,
      reason: 'new',
      notes: 'Breathless climbing stairs.',
      patient: patientPayload(),
      termsAccepted: true,
    })
  const paid = await request(app)
    .post(`/api/appointments/${hold.body.appointmentId}/confirm`)
    .send({
      razorpay_order_id: hold.body.checkout.orderId,
      razorpay_payment_id: hold.body.checkout.mockPaymentId,
      razorpay_signature: hold.body.checkout.mockSignature,
    })
  return paid.body.ticket
}

describe('authentication', () => {
  beforeEach(async () => {
    await makeUser({ email: 'counter@example.test', role: 'counter', fullName: 'Front Desk' })
  })

  it('signs a member of staff in and sets an httpOnly cookie', async () => {
    const { res, cookie } = await login('counter@example.test')
    expect(res.status).toBe(200)
    expect(res.body.user.role).toBe('counter')
    expect(cookie[0]).toMatch(/HttpOnly/i)
    expect(cookie[0]).toMatch(/SameSite=Lax/i)
    // The password hash must never travel to the client.
    expect(JSON.stringify(res.body)).not.toMatch(/password_hash|\$2[aby]\$/)
  })

  it('rejects a wrong password', async () => {
    const { res } = await login('counter@example.test', 'wrong-password')
    expect(res.status).toBe(401)
    expect(res.body.error.message).toMatch(/do not match/i)
  })

  it('gives the same answer for an unknown address as for a wrong password', async () => {
    const unknown = await login('nobody@example.test')
    const wrong = await login('counter@example.test', 'nope')
    expect(unknown.res.status).toBe(401)
    expect(unknown.res.body.error.message).toBe(wrong.res.body.error.message)
  })

  it('refuses a deactivated account', async () => {
    await query(`UPDATE users SET is_active = false WHERE email = 'counter@example.test'`)
    const { res } = await login('counter@example.test')
    expect(res.status).toBe(401)
  })
})

describe('the counter console', () => {
  let ticket
  let cookie

  beforeEach(async () => {
    await makeDoctor()
    await makeUser({ email: 'counter@example.test', role: 'counter', fullName: 'Front Desk' })
    ticket = await bookAndPay()
    cookie = (await login('counter@example.test')).cookie
  })

  it('will not answer without a session', async () => {
    const res = await request(app).get(`/api/counter/tickets/${ticket.reference}`)
    expect(res.status).toBe(401)
  })

  it('will not answer a doctor asking for counter data', async () => {
    const doctorCookie = (await login('test-doctor@example.test')).cookie
    const res = await request(app).get(`/api/counter/tickets/${ticket.reference}`).set('Cookie', doctorCookie)
    expect(res.status).toBe(403)
  })

  it('identifies the patient from the code alone', async () => {
    const res = await request(app).get(`/api/counter/tickets/${ticket.reference}`).set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.ticket.patient).toMatchObject({
      fullName: 'Ramesh Prabhu',
      phone: '+91 98860 55443',
      email: 'ramesh.prabhu@example.com',
    })
    expect(res.body.ticket.notes).toBe('Breathless climbing stairs.')
    expect(res.body.deliveries.map((d) => d.channel).sort()).toEqual(['email_counter', 'email_patient'])
  })

  it('checks the patient in, once', async () => {
    const first = await request(app)
      .post(`/api/counter/tickets/${ticket.reference}/check-in`)
      .set('Cookie', cookie)
    expect(first.body.alreadyCheckedIn).toBe(false)
    expect(first.body.ticket.checkedInAt).toBeTruthy()

    const second = await request(app)
      .post(`/api/counter/tickets/${ticket.reference}/check-in`)
      .set('Cookie', cookie)
    expect(second.body.alreadyCheckedIn).toBe(true)
    expect(second.body.ticket.checkedInAt).toBe(first.body.ticket.checkedInAt)
  })

  it('records who checked the patient in', async () => {
    await request(app).post(`/api/counter/tickets/${ticket.reference}/check-in`).set('Cookie', cookie)
    const { rows } = await query(
      `SELECT u.full_name FROM appointments a JOIN users u ON u.id = a.checked_in_by`,
    )
    expect(rows[0].full_name).toBe('Front Desk')
  })

  it('lists the day’s queue and can be searched', async () => {
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(
      new Date(ticket.startsAt),
    )
    const res = await request(app).get(`/api/counter/queue?date=${day}`).set('Cookie', cookie)
    expect(res.body.appointments.map((a) => a.reference)).toContain(ticket.reference)

    const search = await request(app).get(`/api/counter/queue?date=${day}&q=Ramesh`).set('Cookie', cookie)
    expect(search.body.appointments).toHaveLength(1)
  })

  it('can re-send a ticket the patient never received', async () => {
    const res = await request(app)
      .post(`/api/counter/tickets/${ticket.reference}/resend`)
      .set('Cookie', cookie)
    expect(res.body.delivery).toEqual({ patient: 'sent', counter: 'sent' })
  })
})

describe('the doctor console', () => {
  let cookie

  beforeEach(async () => {
    await makeDoctor()
    cookie = (await login('test-doctor@example.test')).cookie
  })

  it('will not answer without a session', async () => {
    expect((await request(app).get('/api/doctor/me')).status).toBe(401)
  })

  it('will not answer a counter clerk asking for doctor data', async () => {
    await makeUser({ email: 'clerk@example.test', role: 'counter' })
    const clerk = (await login('clerk@example.test')).cookie
    expect((await request(app).get('/api/doctor/me').set('Cookie', clerk)).status).toBe(403)
  })

  it('returns the doctor’s own profile and rota', async () => {
    const res = await request(app).get('/api/doctor/me').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.doctor.slug).toBe('test-doctor')
    expect(res.body.availability).toHaveLength(7)
  })

  it('turns new bookings off and on', async () => {
    await request(app).patch('/api/doctor/me').set('Cookie', cookie).send({ isAccepting: false })
    const off = await request(app).get('/api/doctors/test-doctor/slots?days=7')
    expect(off.body.acceptingBookings).toBe(false)

    await request(app).patch('/api/doctor/me').set('Cookie', cookie).send({ isAccepting: true })
    const on = await request(app).get('/api/doctors/test-doctor/slots?days=7')
    expect(on.body.acceptingBookings).toBe(true)
  })

  it('replaces the weekly rota and the public calendar follows', async () => {
    const res = await request(app)
      .put('/api/doctor/availability')
      .set('Cookie', cookie)
      .send({ rules: [{ weekday: 2, startsAt: '16:00', endsAt: '18:00', isActive: true }] })
    expect(res.status).toBe(200)

    const slots = await request(app).get('/api/doctors/test-doctor/slots?days=14')
    const days = slots.body.days.filter((d) => d.slots.length > 0)
    expect(days.every((d) => new Date(`${d.date}T00:00:00Z`).getUTCDay() === 2)).toBe(true)
    // 16:00–18:00 in 15-minute slots is eight.
    expect(days[0].slots).toHaveLength(8)
  })

  it('rejects a rota where two clinics on one day overlap', async () => {
    const res = await request(app)
      .put('/api/doctor/availability')
      .set('Cookie', cookie)
      .send({
        rules: [
          { weekday: 1, startsAt: '10:00', endsAt: '13:00', isActive: true },
          { weekday: 1, startsAt: '12:00', endsAt: '14:00', isActive: true },
        ],
      })
    expect(res.status).toBe(400)
    expect(res.body.error.message).toMatch(/overlap/i)
  })

  it('rejects a clinic that finishes before it starts', async () => {
    const res = await request(app)
      .put('/api/doctor/availability')
      .set('Cookie', cookie)
      .send({ rules: [{ weekday: 1, startsAt: '14:00', endsAt: '10:00', isActive: true }] })
    expect(res.status).toBe(400)
  })

  it('reports paid bookings that a new absence would clash with, and leaves them alone', async () => {
    const ticket = await bookAndPay()

    const res = await request(app)
      .post('/api/doctor/time-off')
      .set('Cookie', cookie)
      .send({
        startsAt: new Date(new Date(ticket.startsAt).getTime() - 3_600_000).toISOString(),
        endsAt: new Date(new Date(ticket.startsAt).getTime() + 3_600_000).toISOString(),
        reason: 'Conference',
      })

    expect(res.status).toBe(201)
    expect(res.body.affectedAppointments.map((a) => a.reference)).toContain(ticket.reference)

    // The patient has paid: their appointment must survive the doctor's leave.
    const { rows } = await query(`SELECT status FROM appointments WHERE reference = $1`, [ticket.reference])
    expect(rows[0].status).toBe('confirmed')
  })

  it('lists only that doctor’s own appointments', async () => {
    const ticket = await bookAndPay()
    await makeDoctor({ slug: 'other-doctor', fullName: 'Dr Other' })
    const other = (await login('other-doctor@example.test')).cookie

    const mine = await request(app).get('/api/doctor/appointments?days=30').set('Cookie', cookie)
    expect(mine.body.appointments.map((a) => a.reference)).toContain(ticket.reference)

    const theirs = await request(app).get('/api/doctor/appointments?days=30').set('Cookie', other)
    expect(theirs.body.appointments).toHaveLength(0)
  })

  it('lets a doctor change their own password', async () => {
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Cookie', cookie)
      .send({ currentPassword: PASSWORD, newPassword: 'brand-new-passw0rd' })
    expect(res.status).toBe(200)

    expect((await login('test-doctor@example.test', PASSWORD)).res.status).toBe(401)
    expect((await login('test-doctor@example.test', 'brand-new-passw0rd')).res.status).toBe(200)
  })

  it('refuses a password change without the current password', async () => {
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Cookie', cookie)
      .send({ currentPassword: 'not-it', newPassword: 'brand-new-passw0rd' })
    expect(res.status).toBe(400)
  })
})
