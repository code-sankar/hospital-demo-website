import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export const hashPassword = (plain) => bcrypt.hash(plain, config.auth.bcryptRounds)
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash)

export const signSession = (user) =>
  jwt.sign(
    { sub: user.id, role: user.role, name: user.full_name },
    config.auth.jwtSecret,
    { expiresIn: `${config.auth.sessionTtlHours}h` },
  )

export const readSession = (token) => {
  try {
    return jwt.verify(token, config.auth.jwtSecret)
  } catch {
    return null
  }
}

/** httpOnly so a script injected into the page cannot read the session. */
export const sessionCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: config.isProd,
  path: '/',
  maxAge: config.auth.sessionTtlHours * 60 * 60 * 1000,
})
