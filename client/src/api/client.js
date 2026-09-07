/**
 * Thin fetch wrapper for the Ashvini API.
 *
 * Everything goes through `/api`, which Vite proxies in development and the
 * host serves from the same origin in production — so the session cookie is
 * first-party in both, and no token is ever handled by JavaScript.
 */

const BASE = import.meta.env.VITE_API_BASE ?? '/api'

export class ApiError extends Error {
  constructor(message, { status, code, fields, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
    this.details = details
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let response
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError('We could not reach the hospital’s systems. Check your connection and try again.', {
      status: 0,
    })
  }

  if (response.status === 204) return null

  let payload
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const error = payload?.error ?? {}
    throw new ApiError(error.message ?? `Request failed (${response.status}).`, {
      status: response.status,
      code: error.code,
      fields: error.fields,
      details: error.details,
    })
  }

  return payload
}

export const api = {
  health: () => request('/health'),

  // --- public catalogue ---
  departments: () => request('/departments'),
  doctors: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== 'all'),
    ).toString()
    return request(`/doctors${qs ? `?${qs}` : ''}`)
  },
  doctor: (slug) => request(`/doctors/${encodeURIComponent(slug)}`),
  slots: (slug, { from, days = 14 } = {}) => {
    const qs = new URLSearchParams({ days: String(days), ...(from ? { from } : {}) })
    return request(`/doctors/${encodeURIComponent(slug)}/slots?${qs}`)
  },

  // --- booking ---
  hold: (body) => request('/appointments/hold', { method: 'POST', body }),
  release: (id) => request(`/appointments/${id}/release`, { method: 'POST' }),
  confirm: (id, body) => request(`/appointments/${id}/confirm`, { method: 'POST', body }),
  ticket: (reference) => request(`/tickets/${encodeURIComponent(reference)}`),

  // --- staff sessions ---
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),

  // --- doctor console ---
  doctorProfile: () => request('/doctor/me'),
  updateDoctorProfile: (body) => request('/doctor/me', { method: 'PATCH', body }),
  saveAvailability: (rules) => request('/doctor/availability', { method: 'PUT', body: { rules } }),
  addTimeOff: (body) => request('/doctor/time-off', { method: 'POST', body }),
  removeTimeOff: (id) => request(`/doctor/time-off/${id}`, { method: 'DELETE' }),
  doctorAppointments: ({ from, days = 14 } = {}) => {
    const qs = new URLSearchParams({ days: String(days), ...(from ? { from } : {}) })
    return request(`/doctor/appointments?${qs}`)
  },

  // --- counter console ---
  counterTicket: (reference) => request(`/counter/tickets/${encodeURIComponent(reference)}`),
  checkIn: (reference) => request(`/counter/tickets/${encodeURIComponent(reference)}/check-in`, { method: 'POST' }),
  resendTicket: (reference) => request(`/counter/tickets/${encodeURIComponent(reference)}/resend`, { method: 'POST' }),
  counterQueue: ({ date, q } = {}) => {
    const qs = new URLSearchParams({ ...(date ? { date } : {}), ...(q ? { q } : {}) })
    return request(`/counter/queue${qs.toString() ? `?${qs}` : ''}`)
  },
}
