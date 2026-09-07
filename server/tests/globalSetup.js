/**
 * Points the whole suite at a throwaway database before anything imports the
 * app config, then builds the schema once.
 */
export default async function setup() {
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL =
    process.env.TEST_DATABASE_URL ?? 'postgresql://postgres@127.0.0.1:5433/ashvini_test'
  process.env.DATABASE_SSL = 'false'
  process.env.PAYMENT_PROVIDER = 'mock'
  process.env.MAIL_TRANSPORT = 'file'
  process.env.CLINIC_TIMEZONE = 'Asia/Kolkata'
  process.env.BOOKING_LEAD_MINUTES = '60'
  process.env.BOOKING_HOLD_MINUTES = '10'

  const { migrate } = await import('../src/db/migrate.js')
  const { closePool } = await import('../src/db/pool.js')
  await migrate()
  await closePool()
}
