import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Check,
  Loader2,
  Mail,
  Phone,
  Search,
  TriangleAlert,
  UserRoundCheck,
  X,
} from 'lucide-react'
import StaffShell from './StaffShell'
import { api } from '../../api/client'
import { formatMoney, formatLongDate, formatTime } from '../../api/format'

const todayInClinic = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())

/**
 * The desk's screen. A patient says a code; this turns it into a name, a
 * consultant and a time, and checks them in.
 */
export default function CounterConsole() {
  const [code, setCode] = useState('')
  const [lookup, setLookup] = useState(null)
  const [lookupError, setLookupError] = useState(null)
  const [searching, setSearching] = useState(false)
  const [working, setWorking] = useState(false)
  const [flash, setFlash] = useState(null)

  const [date, setDate] = useState(todayInClinic)
  const [filter, setFilter] = useState('')
  const [queueState, setQueueState] = useState({ appointments: [], loadedFor: null })
  const [reloadToken, setReloadToken] = useState(0)

  const inputRef = useRef(null)
  const queueKey = `${date}|${filter}|${reloadToken}`

  useEffect(() => {
    let cancelled = false

    api
      .counterQueue({ date, q: filter || undefined })
      .then((res) => !cancelled && setQueueState({ appointments: res.appointments, loadedFor: queueKey }))
      .catch(() => !cancelled && setQueueState({ appointments: [], loadedFor: queueKey }))

    return () => {
      cancelled = true
    }
    // queueKey folds date, filter and the manual reload counter into one dep.
  }, [queueKey, date, filter])

  const queue = queueState.loadedFor === queueKey ? queueState.appointments : []
  const loadingQueue = queueState.loadedFor !== queueKey
  const loadQueue = useCallback(() => setReloadToken((t) => t + 1), [])

  // The desk works keyboard-first: focus lands in the code box on arrival.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const find = async (reference) => {
    const value = (reference ?? code).trim()
    if (!value) return
    setSearching(true)
    setLookupError(null)
    setFlash(null)
    try {
      const res = await api.counterTicket(value)
      setLookup(res)
      setCode(res.ticket.reference)
    } catch (err) {
      setLookup(null)
      setLookupError(err.message)
    } finally {
      setSearching(false)
    }
  }

  const checkIn = async () => {
    setWorking(true)
    try {
      const res = await api.checkIn(lookup.ticket.reference)
      setLookup((l) => ({ ...l, ticket: res.ticket }))
      setFlash(res.alreadyCheckedIn ? 'This patient was already checked in.' : 'Patient checked in.')
      loadQueue()
    } catch (err) {
      setLookupError(err.message)
    } finally {
      setWorking(false)
    }
  }

  const resend = async () => {
    setWorking(true)
    try {
      const res = await api.resendTicket(lookup.ticket.reference)
      setFlash(
        res.delivery.patient === 'sent'
          ? 'Ticket re-sent to the patient’s email.'
          : 'The email could not be sent — read the code out to the patient instead.',
      )
    } catch (err) {
      setLookupError(err.message)
    } finally {
      setWorking(false)
    }
  }

  const clear = () => {
    setCode('')
    setLookup(null)
    setLookupError(null)
    setFlash(null)
    inputRef.current?.focus()
  }

  return (
    <StaffShell
      title="Reception counter"
      subtitle="Ask the patient for their ticket code, or find them in the day’s list."
    >
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        {/* ---------------- code lookup ---------------- */}
        <section className="border border-stone-200 bg-ivory p-7">
          <h2 className="font-display text-[1.5rem] text-pine-900">Look up a ticket</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              find()
            }}
            className="mt-6"
          >
            <label htmlFor="counter-code" className="eyebrow text-pine-900/55">
              Ticket code
            </label>
            <div className="mt-3 flex gap-2">
              <input
                id="counter-code"
                ref={inputRef}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ASH-7K3M-9QX2"
                autoComplete="off"
                spellCheck={false}
                className="w-full border border-stone-300 bg-ivory px-4 py-3 font-mono text-[1.05rem] tracking-[0.14em] text-pine-900 uppercase placeholder:text-stone-400 focus:border-pine-700 focus:outline-none"
              />
              <button
                type="submit"
                disabled={searching || !code.trim()}
                className="inline-flex h-auto shrink-0 items-center gap-2 bg-pine-700 px-6 text-[0.875rem] font-medium text-ivory transition-colors hover:bg-pine-600 disabled:opacity-50"
              >
                {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                Find
              </button>
              {(lookup || lookupError) && (
                <button
                  type="button"
                  onClick={clear}
                  aria-label="Clear"
                  className="flex shrink-0 items-center justify-center border border-stone-200 px-3 text-pine-700 transition-colors hover:border-pine-700"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </form>

          {lookupError && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 border border-clay-500/30 bg-clay-500/8 p-4 text-[0.875rem] text-clay-600"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{lookupError}</span>
            </div>
          )}

          {flash && (
            <div className="mt-6 flex items-start gap-3 border border-pine-700/25 bg-pine-700/6 p-4 text-[0.875rem] text-pine-800">
              <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{flash}</span>
            </div>
          )}

          {lookup && (
            <div className="mt-7 border border-pine-700/25 bg-parchment">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-6 py-4">
                <p className="font-mono text-[1.1rem] tracking-[0.14em] text-pine-900">
                  {lookup.ticket.reference}
                </p>
                <span
                  className={`px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase ${
                    lookup.ticket.checkedInAt
                      ? 'bg-pine-700 text-ivory'
                      : 'border border-pine-700/25 text-pine-700'
                  }`}
                >
                  {lookup.ticket.checkedInAt ? 'Checked in' : 'Expected'}
                </span>
              </div>

              <dl className="divide-y divide-stone-200 px-6">
                {[
                  ['Patient', lookup.ticket.patient.fullName],
                  ['Telephone', lookup.ticket.patient.phone],
                  ['Email', lookup.ticket.patient.email],
                  ['Consultant', lookup.ticket.doctor.fullName],
                  ['Speciality', lookup.ticket.doctor.departmentName],
                  ['Appointment', `${formatLongDate(lookup.ticket.startsAt)} · ${formatTime(lookup.ticket.startsAt)}`],
                  ['Reason', lookup.ticket.reason],
                  ['Paid', `${formatMoney(lookup.ticket.amountPaise)} · ${lookup.ticket.paymentStatus}`],
                  ...(lookup.ticket.notes ? [['Notes', lookup.ticket.notes]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:gap-6">
                    <dt className="w-32 shrink-0 text-[0.8125rem] text-pine-900/50">{k}</dt>
                    <dd className="text-[0.9375rem] text-pine-900">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap gap-3 border-t border-stone-200 px-6 py-5">
                <button
                  type="button"
                  onClick={checkIn}
                  disabled={working || Boolean(lookup.ticket.checkedInAt)}
                  className="inline-flex h-11 items-center gap-2 bg-pine-700 px-6 text-[0.875rem] font-medium text-ivory transition-colors hover:bg-pine-600 disabled:opacity-45"
                >
                  {working ? <Loader2 className="size-4 animate-spin" /> : <UserRoundCheck className="size-4" />}
                  {lookup.ticket.checkedInAt ? 'Already checked in' : 'Check in'}
                </button>
                <button
                  type="button"
                  onClick={resend}
                  disabled={working}
                  className="inline-flex h-11 items-center gap-2 border border-stone-300 px-5 text-[0.875rem] font-medium text-pine-800 transition-colors hover:border-pine-700 disabled:opacity-45"
                >
                  <Mail className="size-4" />
                  Re-send ticket
                </button>
                <a
                  href={`tel:${lookup.ticket.patient.phone.replace(/\s/g, '')}`}
                  className="inline-flex h-11 items-center gap-2 border border-stone-300 px-5 text-[0.875rem] font-medium text-pine-800 transition-colors hover:border-pine-700"
                >
                  <Phone className="size-4" />
                  Call
                </a>
              </div>

              <div className="border-t border-stone-200 px-6 py-4">
                <p className="eyebrow text-pine-900/45">Ticket delivery</p>
                <ul className="mt-2 space-y-1 text-[0.8125rem] text-pine-900/60">
                  {lookup.deliveries.map((d, i) => (
                    <li key={`${d.channel}-${i}`}>
                      {d.channel === 'email_patient' ? 'Patient copy' : 'Counter copy'} → {d.recipient} ·{' '}
                      <span className={d.status === 'sent' ? 'text-pine-700' : 'text-clay-600'}>{d.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* ---------------- day list ---------------- */}
        <section className="border border-stone-200 bg-ivory p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-[1.5rem] text-pine-900">Today at the desk</h2>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="Date"
                className="border border-stone-200 bg-ivory px-3 py-2 text-[0.875rem] text-pine-900"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 border-b border-stone-200 pb-3">
            <Search className="size-4 shrink-0 text-pine-700/60" aria-hidden="true" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by name, phone or code"
              aria-label="Filter the day’s list"
              className="w-full bg-transparent text-[0.9375rem] text-pine-900 placeholder:text-stone-400 focus:outline-none"
            />
          </div>

          {loadingQueue ? (
            <div className="flex min-h-32 items-center justify-center" role="status">
              <Loader2 className="size-5 animate-spin text-pine-700" />
            </div>
          ) : queue.length === 0 ? (
            <p className="mt-6 border border-dashed border-stone-300 p-6 text-center text-[0.875rem] text-pine-900/50">
              Nothing booked for this date.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-200">
              {queue.map((a) => (
                <li key={a.reference}>
                  <button
                    type="button"
                    onClick={() => find(a.reference)}
                    className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-parchment"
                  >
                    <span className="w-16 shrink-0 font-display text-[1.05rem] text-pine-900">
                      {formatTime(a.startsAt)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.9375rem] font-medium text-pine-900">
                        {a.patient.fullName}
                      </span>
                      <span className="block truncate text-[0.8125rem] text-pine-900/55">
                        {a.doctor.fullName} · {a.patient.phone}
                      </span>
                    </span>
                    <span className="hidden shrink-0 font-mono text-[0.75rem] text-pine-900/45 sm:block">
                      {a.reference}
                    </span>
                    <span
                      className={`shrink-0 px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.1em] uppercase ${
                        a.checkedInAt ? 'bg-pine-700 text-ivory' : 'border border-stone-300 text-pine-900/50'
                      }`}
                    >
                      {a.checkedInAt ? 'In' : 'Due'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </StaffShell>
  )
}
