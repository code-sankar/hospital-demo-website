/** Presentation helpers shared by the booking flow and both staff consoles. */

const TZ = 'Asia/Kolkata'

export const formatMoney = (paise) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100)

export const formatTime = (iso) =>
  new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ }).format(
    new Date(iso),
  )

export const formatDate = (iso) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ }).format(
    new Date(iso),
  )

export const formatLongDate = (iso) =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TZ,
  }).format(new Date(iso))

/** For a YYYY-MM-DD calendar key rather than an instant. */
export const formatDayKey = (key, opts = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  new Intl.DateTimeFormat('en-IN', { ...opts, timeZone: 'UTC' }).format(new Date(`${key}T00:00:00Z`))

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Minutes until `iso`, floored at zero — drives the hold countdown. */
export const minutesUntil = (iso) => Math.max(0, Math.floor((new Date(iso) - Date.now()) / 60000))
