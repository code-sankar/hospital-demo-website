import { ZodError } from 'zod'
import { HttpError } from '../lib/errors.js'
import { logger } from '../lib/logger.js'
import { config } from '../config.js'

export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: { message: `No route for ${req.method} ${req.path}` } })
}

// The fourth parameter is what marks this as Express error middleware — it is
// required even though it is unused.
export const errorHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Some of the details you entered are not valid.',
        code: 'validation_failed',
        fields: Object.fromEntries(
          err.issues.map((i) => [i.path.join('.') || '_', i.message]),
        ),
      },
    })
  }

  if (err instanceof HttpError) {
    if (err.status >= 500) logger.error({ err }, 'request failed')
    return res.status(err.status).json({
      error: { message: err.message, code: err.code, details: err.details },
    })
  }

  logger.error({ err, path: req.path }, 'unhandled error')
  res.status(500).json({
    error: {
      message: 'Something went wrong at our end. Please try again.',
      // Never leak internals in production; invaluable in development.
      ...(config.isProd ? {} : { debug: err.message, stack: err.stack }),
    },
  })
}
