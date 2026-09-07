import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { query } from '../src/db/pool.js'
import { makeDoctor, patientPayload } from './factories.js'

const app = createApp()

/** The first bookable slot the API is prepared to offer for this doctor. */
async function firstSlot(slug = 'test-doctor') {
  const res = await request(app).get(`/api/doctors/${slug}/slots?days=10`)
  const day = res.body.days.find((d) => d.slots.length > 0)
  return day?.slots[0]
}

const holdBody = (startsAt, overrides = {}) => ({
  doctorSlug: 'test-doctor',
  startsAt,
  reason: 'new',
  notes: 'Chest tightness on exertion.',
  patient: patientPayload(),
  termsAccepted: true,
  ...overrides,
})

async function payFor(hold) {
  return request(app)
    .post(`/api/appointments/${hold.appointmentId}/confirm`)
    .send({
      razorpay_order_id: hold.checkout.orderId,
      razorpay_payment_id: hold.checkout.mockPaymentId,
      razorpay_signature: hold.checkout.mockSignature,
    })
}

describe('slot availability', () => {
  beforeEach(async () => {
    await makeDoctor()
  })

  it('offers slots derived from the weekly rota', async () => {
    const res = await request(app).get('/api/doctors/test-doctor/slots?days=3')
    expect(res.status).toBe(200)
    expect(res.body.acceptingBookings).toBe(true)
    expect(res.body.slotMinutes).toBe(15)
    // 10:00–13:00 in 15-minute slots is twelve per day.
    const full = res.body.days.find((d) => d.slots.length === 12)
    expect(full).toBeDefined()
  })

  it('resolves clinic-local times against the clinic timezone', async () => {
    const res = await request(app).get('/api/doctors/test-doctor/slots?days=3')
    const day = res.body.days.find((d) => d.slots.length === 12)
    // 10:00 IST is 04:30 UTC.
    expect(new Date(day.slots[0].startsAt).toISOString()).toMatch(/T04:30:00/)
  })

  it('offers nothing while the doctor is not accepting patients', async () => {
    await query(`UPDATE doctors SET is_accepting = false WHERE slug = 'test-doctor'`)
    const res = await request(app).get('/api/doctors/test-doctor/slots?days=7')
    expect(res.body.acceptingBookings).toBe(false)
    expect(res.body.days).toEqual([])
  })

  it('hides slots covered by time off', async () => {
    const slot = await firstSlot()
    const { rows } = await query(`SELECT id FROM doctors WHERE slug = 'test-doctor'`)
    await query(
      `INSERT INTO doctor_time_off (doctor_id, starts_at, ends_at, reason)
       VALUES ($1, $2::timestamptz - interval '1 hour', $2::timestamptz + interval '1 hour', 'Leave')`,
      [rows[0].id, slot.startsAt],
    )
    const res = await request(app).get('/api/doctors/test-doctor/slots?days=10')
    const all = res.body.days.flatMap((d) => d.slots.map((s) => s.startsAt))
    expect(all).not.toContain(slot.startsAt)
  })

  it('halves the slot count when the doctor doubles the slot length', async () => {
    await query(`UPDATE doctors SET slot_minutes = 30 WHERE slug = 'test-doctor'`)
    const res = await request(app).get('/api/doctors/test-doctor/slots?days=3')
    expect(res.body.days.some((d) => d.slots.length === 6)).toBe(true)
  })
})

describe('holding a slot', () => {
  beforeEach(async () => {
    await makeDoctor()
  })

  it('holds the slot and opens a payment order', async () => {
    const slot = await firstSlot()
    const res = await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))

    expect(res.status).toBe(201)
    expect(res.body.amountPaise).toBe(150000)
    expect(res.body.refundPolicy).toBe('non_refundable')
    expect(res.body.checkout.orderId).toMatch(/^mock_order_/)
    expect(new Date(res.body.holdExpiresAt).getTime()).toBeGreaterThan(Date.now())
  })

  it('removes the held slot from what is on offer', async () => {
    const slot = await firstSlot()
    await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))

    const res = await request(app).get('/api/doctors/test-doctor/slots?days=10')
    const all = res.body.days.flatMap((d) => d.slots.map((s) => s.startsAt))
    expect(all).not.toContain(slot.startsAt)
  })

  it('refuses a second hold on the same slot', async () => {
    const slot = await firstSlot()
    await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))

    const res = await request(app)
      .post('/api/appointments/hold')
      .send(holdBody(slot.startsAt, { patient: patientPayload({ email: 'other@example.com' }) }))

    expect(res.status).toBe(409)
    expect(res.body.error.message).toMatch(/booked that slot/i)
  })

  it('survives two simultaneous holds on the same slot — exactly one wins', async () => {
    const slot = await firstSlot()
    const attempts = [1, 2, 3, 4].map((n) =>
      request(app)
        .post('/api/appointments/hold')
        .send(holdBody(slot.startsAt, { patient: patientPayload({ email: `race${n}@example.com` }) })),
    )
    const results = await Promise.all(attempts)
    expect(results.filter((r) => r.status === 201)).toHaveLength(1)
    expect(results.filter((r) => r.status === 409)).toHaveLength(3)
  })

  it('rejects a time that is not part of the rota', async () => {
    const slot = await firstSlot()
    const offRota = new Date(new Date(slot.startsAt).getTime() + 7 * 60_000).toISOString()
    const res = await request(app).post('/api/appointments/hold').send(holdBody(offRota))
    expect(res.status).toBe(400)
    expect(res.body.error.message).toMatch(/clinic hours/i)
  })

  it('refuses to book a doctor who has stopped accepting patients', async () => {
    const slot = await firstSlot()
    await query(`UPDATE doctors SET is_accepting = false WHERE slug = 'test-doctor'`)
    const res = await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))
    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('doctor_not_accepting')
  })

  it('will not proceed without the non-refundable terms accepted', async () => {
    const slot = await firstSlot()
    const res = await request(app)
      .post('/api/appointments/hold')
      .send({ ...holdBody(slot.startsAt), termsAccepted: false })
    expect(res.status).toBe(400)
    expect(JSON.stringify(res.body.error.fields)).toMatch(/non-refundable/i)
  })

  it('validates the patient details', async () => {
    const slot = await firstSlot()
    const res = await request(app)
      .post('/api/appointments/hold')
      .send(holdBody(slot.startsAt, { patient: patientPayload({ email: 'not-an-email' }) }))
    expect(res.status).toBe(400)
    expect(res.body.error.fields['patient.email']).toMatch(/valid email/i)
  })

  it('releases the slot once the hold expires', async () => {
    const slot = await firstSlot()
    const hold = await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))

    await query(`UPDATE appointments SET hold_expires_at = now() - interval '1 minute' WHERE id = $1`, [
      hold.body.appointmentId,
    ])

    const res = await request(app).get('/api/doctors/test-doctor/slots?days=10')
    const all = res.body.days.flatMap((d) => d.slots.map((s) => s.startsAt))
    expect(all).toContain(slot.startsAt)
  })
})

describe('payment and ticketing', () => {
  beforeEach(async () => {
    await makeDoctor()
  })

  it('confirms the booking and issues a ticket to patient and counter', async () => {
    const slot = await firstSlot()
    const hold = await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))
    const res = await payFor(hold.body)

    expect(res.status).toBe(200)
    expect(res.body.ticket.status).toBe('confirmed')
    expect(res.body.ticket.reference).toMatch(/^ASH-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    expect(res.body.ticket.paymentStatus).toBe('paid')
    expect(res.body.ticket.refundPolicy).toBe('non_refundable')
    expect(res.body.delivery).toEqual({ patient: 'sent', counter: 'sent' })

    const { rows } = await query(
      `SELECT channel, status FROM ticket_deliveries ORDER BY channel`,
    )
    expect(rows).toEqual([
      { channel: 'email_counter', status: 'sent' },
      { channel: 'email_patient', status: 'sent' },
    ])
  })

  it('is idempotent — paying twice issues one ticket, not two', async () => {
    const slot = await firstSlot()
    const hold = await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))
    const first = await payFor(hold.body)
    const second = await payFor(hold.body)

    expect(second.status).toBe(200)
    expect(second.body.alreadyConfirmed).toBe(true)
    expect(second.body.ticket.reference).toBe(first.body.ticket.reference)

    const { rows } = await query(`SELECT count(*)::int AS n FROM ticket_deliveries`)
    expect(rows[0].n).toBe(2) // one patient copy, one counter copy — not four
  })

  it('rejects a forged payment signature', async () => {
    const slot = await firstSlot()
    const hold = await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))

    const res = await request(app)
      .post(`/api/appointments/${hold.body.appointmentId}/confirm`)
      .send({
        razorpay_order_id: hold.body.checkout.orderId,
        razorpay_payment_id: hold.body.checkout.mockPaymentId,
        razorpay_signature: 'f'.repeat(64),
      })

    expect(res.status).toBe(400)
    const { rows } = await query(`SELECT status FROM appointments`)
    expect(rows[0].status).toBe('pending_payment')
  })

  it('will not confirm a booking whose hold has expired', async () => {
    const slot = await firstSlot()
    const hold = await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))
    await query(`UPDATE appointments SET status = 'expired' WHERE id = $1`, [hold.body.appointmentId])

    const res = await payFor(hold.body)
    expect(res.status).toBe(410)
    expect(res.body.error.message).toMatch(/timed out/i)
  })

  it('records the amount actually charged against the appointment', async () => {
    const slot = await firstSlot()
    const hold = await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))
    await payFor(hold.body)

    const { rows } = await query(
      `SELECT a.amount_paise, p.amount_paise AS paid, p.status, p.refund_policy
         FROM appointments a JOIN payments p ON p.appointment_id = a.id`,
    )
    expect(rows[0]).toMatchObject({
      amount_paise: 150000,
      paid: 150000,
      status: 'paid',
      refund_policy: 'non_refundable',
    })
  })
})

describe('public ticket lookup', () => {
  beforeEach(async () => {
    await makeDoctor()
  })

  it('returns a confirmed ticket by its code', async () => {
    const slot = await firstSlot()
    const hold = await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))
    const paid = await payFor(hold.body)

    const res = await request(app).get(`/api/tickets/${paid.body.ticket.reference}`)
    expect(res.status).toBe(200)
    expect(res.body.ticket.patient.fullName).toBe('Ramesh Prabhu')
    // Contact details are not part of the public view.
    expect(res.body.ticket.patient.phone).toBeUndefined()
  })

  it('does not disclose a booking that has not been paid for', async () => {
    const slot = await firstSlot()
    await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))
    const { rows } = await query(`SELECT reference FROM appointments`)

    const res = await request(app).get(`/api/tickets/${rows[0].reference}`)
    expect(res.status).toBe(404)
  })

  it('is case-insensitive, because codes get read aloud', async () => {
    const slot = await firstSlot()
    const hold = await request(app).post('/api/appointments/hold').send(holdBody(slot.startsAt))
    const paid = await payFor(hold.body)

    const res = await request(app).get(`/api/tickets/${paid.body.ticket.reference.toLowerCase()}`)
    expect(res.status).toBe(200)
  })

  it('404s on an unknown code', async () => {
    const res = await request(app).get('/api/tickets/ASH-ZZZZ-ZZZZ')
    expect(res.status).toBe(404)
  })
})
