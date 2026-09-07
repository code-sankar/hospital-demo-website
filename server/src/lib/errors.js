/** An error carrying an HTTP status, safe to surface to the client verbatim. */
export class HttpError extends Error {
  constructor(status, message, options = {}) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = options.code
    this.details = options.details
    this.expose = true
  }
}

export const badRequest = (message, options) => new HttpError(400, message, options)
export const unauthorized = (message = 'Please sign in to continue.') => new HttpError(401, message)
export const forbidden = (message = 'You do not have access to this.') => new HttpError(403, message)
export const notFound = (message = 'Not found.') => new HttpError(404, message)
export const conflict = (message, options) => new HttpError(409, message, options)
export const gone = (message) => new HttpError(410, message)
export const tooMany = (message = 'Too many requests. Please try again shortly.') => new HttpError(429, message)

/** Wraps an async route handler so rejections reach the error middleware. */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
