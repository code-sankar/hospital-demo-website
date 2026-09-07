import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { query } from '../db/pool.js'
import { config } from '../config.js'
import { hashPassword, verifyPassword, signSession, sessionCookieOptions } from '../lib/auth.js'
import { asyncHandler, unauthorized, badRequest } from '../lib/errors.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

export const authRouter = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: config.isTest ? 1000 : 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { message: 'Too many sign-in attempts. Please wait fifteen minutes.' } },
})

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  role: u.role,
  fullName: u.full_name,
  mustChangePassword: u.must_change_password,
  doctorSlug: u.doctor_slug ?? null,
})

authRouter.post(
  '/login',
  loginLimiter,
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const { rows } = await query(
      `SELECT u.*, d.slug AS doctor_slug
         FROM users u LEFT JOIN doctors d ON d.user_id = u.id
        WHERE lower(u.email) = lower($1)`,
      [email],
    )
    const user = rows[0]

    // Compare against a dummy hash when the account is missing so that a wrong
    // address and a wrong password take the same amount of time to answer.
    const hash = user?.password_hash ?? '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv'
    const ok = await verifyPassword(password, hash)

    if (!user || !ok || !user.is_active) throw unauthorized('That email and password do not match.')

    await query('UPDATE users SET last_login_at = now() WHERE id = $1', [user.id])
    res.cookie(config.auth.cookieName, signSession(user), sessionCookieOptions())
    res.json({ user: publicUser(user) })
  }),
)

authRouter.post('/logout', (req, res) => {
  res.clearCookie(config.auth.cookieName, { ...sessionCookieOptions(), maxAge: undefined })
  res.json({ ok: true })
})

authRouter.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({ user: publicUser(req.user) })
  }),
)

authRouter.post(
  '/change-password',
  authenticate,
  validate({
    body: z.object({
      currentPassword: z.string().min(1),
      newPassword: z
        .string()
        .min(10, 'Use at least ten characters.')
        .max(200)
        .refine((v) => /[a-z]/i.test(v) && /\d/.test(v), 'Include at least one letter and one number.'),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { rows } = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id])
    const ok = await verifyPassword(req.body.currentPassword, rows[0].password_hash)
    if (!ok) throw badRequest('Your current password is not correct.')

    await query(
      'UPDATE users SET password_hash = $2, must_change_password = false WHERE id = $1',
      [req.user.id, await hashPassword(req.body.newPassword)],
    )
    res.json({ ok: true })
  }),
)
