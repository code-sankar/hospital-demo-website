import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

// Look for .env beside the server first, then at the repository root, so a
// single root .env works for the whole workspace.
const here = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: [join(here, '..', '.env'), join(here, '..', '..', '.env')] })

const bool = (v, fallback = false) =>
  v === undefined ? fallback : ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase())

const int = (v, fallback) => {
  const n = Number.parseInt(v ?? '', 10)
  return Number.isFinite(n) ? n : fallback
}

const required = (name, value) => {
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`,
    )
  }
  return value
}

const env = process.env.NODE_ENV ?? 'development'
const isProd = env === 'production'
const isTest = env === 'test'

export const config = {
  env,
  isProd,
  isTest,
  port: int(process.env.PORT, 4000),
  logLevel: process.env.LOG_LEVEL ?? (isTest ? 'silent' : 'info'),

  /** Where the browser app is served from — used for CORS and for links in emails. */
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',

  db: {
    // Supabase gives you this string under Project settings → Database → Connection string.
    // Use the pooled (pgBouncer, port 6543) string for serverless, the direct one otherwise.
    url: required('DATABASE_URL', process.env.DATABASE_URL),
    // Supabase requires TLS. Local Postgres usually does not.
    ssl: bool(process.env.DATABASE_SSL, /supabase|amazonaws|neon|render/i.test(process.env.DATABASE_URL ?? '')),
    poolMax: int(process.env.DATABASE_POOL_MAX, 10),
  },

  auth: {
    // 64+ random chars. `openssl rand -hex 48` produces a good one.
    jwtSecret: isTest ? 'test-secret-not-for-production' : required('JWT_SECRET', process.env.JWT_SECRET),
    sessionTtlHours: int(process.env.SESSION_TTL_HOURS, 12),
    cookieName: process.env.SESSION_COOKIE_NAME ?? 'ashvini_session',
    bcryptRounds: int(process.env.BCRYPT_ROUNDS, isTest ? 4 : 12),
  },

  clinic: {
    /** Availability rules are stored as local wall-clock times in this zone. */
    timezone: process.env.CLINIC_TIMEZONE ?? 'Asia/Kolkata',
    /** How long a slot is held while the patient pays. */
    holdMinutes: int(process.env.BOOKING_HOLD_MINUTES, 10),
    /** Nothing may be booked closer to now than this. */
    leadTimeMinutes: int(process.env.BOOKING_LEAD_MINUTES, 60),
    /** How far ahead the public calendar runs. */
    horizonDays: int(process.env.BOOKING_HORIZON_DAYS, 30),
    currency: process.env.CURRENCY ?? 'INR',
  },

  payments: {
    // 'razorpay' for the real gateway, 'mock' for local development and demos.
    provider: process.env.PAYMENT_PROVIDER ?? 'mock',
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID ?? '',
      keySecret: process.env.RAZORPAY_KEY_SECRET ?? '',
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ?? '',
    },
  },

  mail: {
    // 'smtp' sends for real; 'file' writes .eml files to server/.mailbox and logs a line.
    transport: process.env.MAIL_TRANSPORT ?? 'file',
    from: process.env.MAIL_FROM ?? 'Ashvini Institute of Medical Sciences <no-reply@ashvini-health.example>',
    /** Every confirmed ticket is copied here — this is the hospital counter's inbox. */
    counterInbox: process.env.COUNTER_INBOX ?? 'counter@ashvini-health.example',
    smtp: {
      host: process.env.SMTP_HOST ?? '',
      port: int(process.env.SMTP_PORT, 587),
      secure: bool(process.env.SMTP_SECURE, false),
      user: process.env.SMTP_USER ?? '',
      pass: process.env.SMTP_PASS ?? '',
    },
  },
}

if (config.payments.provider === 'razorpay') {
  required('RAZORPAY_KEY_ID', config.payments.razorpay.keyId)
  required('RAZORPAY_KEY_SECRET', config.payments.razorpay.keySecret)
}
