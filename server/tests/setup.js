import { afterAll, beforeEach } from 'vitest'
import { query, closePool } from '../src/db/pool.js'

beforeEach(async () => {
  await query(`
    TRUNCATE ticket_deliveries, payments, appointments, patients,
             doctor_time_off, doctor_availability, doctors, departments,
             users, audit_log
    RESTART IDENTITY CASCADE
  `)
})

afterAll(async () => {
  await closePool()
})
