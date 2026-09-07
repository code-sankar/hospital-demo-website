import { config } from '../config.js'
import { readSession } from '../lib/auth.js'
import { query } from '../db/pool.js'
import { unauthorized, forbidden, asyncHandler } from '../lib/errors.js'

/**
 * Reads the session cookie and attaches req.user. The account is re-read from
 * the database on every request so that deactivating a login takes effect
 * immediately rather than when the token happens to expire.
 */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[config.auth.cookieName]
  const claims = token ? readSession(token) : null
  if (!claims) throw unauthorized()

  const { rows } = await query(
    `SELECT u.id, u.email, u.role, u.full_name, u.is_active, u.must_change_password, d.id AS doctor_id, d.slug AS doctor_slug
       FROM users u
       LEFT JOIN doctors d ON d.user_id = u.id
      WHERE u.id = $1`,
    [claims.sub],
  )
  const user = rows[0]
  if (!user || !user.is_active) throw unauthorized('This account is no longer active.')

  req.user = user
  next()
})

/** Route guard: `requireRole('doctor')`, `requireRole('counter', 'admin')`. */
export const requireRole =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user) return next(unauthorized())
    if (!roles.includes(req.user.role)) return next(forbidden())
    next()
  }
