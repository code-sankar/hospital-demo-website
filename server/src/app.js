import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import pinoHttp from 'pino-http'
import { config } from './config.js'
import { logger } from './lib/logger.js'
import { errorHandler, notFoundHandler } from './middleware/errors.js'
import { authRouter } from './routes/auth.js'
import { catalogueRouter } from './routes/publicCatalogue.js'
import { appointmentsRouter, ticketsRouter } from './routes/appointments.js'
import { paymentsRouter } from './routes/payments.js'
import { doctorRouter } from './routes/doctor.js'
import { counterRouter } from './routes/counter.js'

export function createApp() {
  const app = express()

  app.set('trust proxy', 1)
  app.disable('x-powered-by')
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

  if (!config.isTest) {
    app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/api/health' } }))
  }

  app.use(
    cors({
      origin: config.webOrigin,
      credentials: true, // the session travels as an httpOnly cookie
    }),
  )

  // The webhook is mounted before the JSON parser on purpose: its signature is
  // computed over the raw bytes, which a parsed body would have destroyed.
  app.use('/api/payments', paymentsRouter)

  app.use(express.json({ limit: '256kb' }))
  app.use(cookieParser())

  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'ashvini-api', env: config.env }))

  app.use('/api/auth', authRouter)
  app.use('/api', catalogueRouter)
  app.use('/api/appointments', appointmentsRouter)
  app.use('/api/tickets', ticketsRouter)
  app.use('/api/doctor', doctorRouter)
  app.use('/api/counter', counterRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
