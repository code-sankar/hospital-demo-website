import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarX2, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../../api/client'
import { formatDayKey, formatTime } from '../../api/format'

const PAGE_DAYS = 7

/**
 * Real availability, straight from the doctor's rota. Days the doctor consults
 * on but which are fully booked stay visible and greyed, so a patient can see
 * that the clinic exists on Tuesdays and is simply full.
 */
export default function SlotPicker({ doctorSlug, value, onChange, onError }) {
  // `loadedFor` records which consultant the data belongs to, so "loading" is
  // derived rather than set at the top of the effect.
  const [state, setState] = useState({ data: null, loadedFor: null })
  const [offset, setOffset] = useState(0)
  const [activeDay, setActiveDay] = useState(null)

  const report = useCallback((err) => onError?.(err), [onError])

  useEffect(() => {
    if (!doctorSlug) return undefined
    const controller = new AbortController()

    api
      .slots(doctorSlug, { days: 28 })
      .then((res) => {
        if (controller.signal.aborted) return
        setState({ data: res, loadedFor: doctorSlug })
        setActiveDay(res.days.find((d) => d.slots.length > 0)?.date ?? null)
        setOffset(0)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setState({ data: null, loadedFor: doctorSlug })
        report(err)
      })

    return () => controller.abort()
  }, [doctorSlug, report])

  const data = state.loadedFor === doctorSlug ? state.data : null
  const loading = state.loadedFor !== doctorSlug

  const days = useMemo(() => data?.days ?? [], [data])
  const page = days.slice(offset, offset + PAGE_DAYS)
  const active = days.find((d) => d.date === activeDay)

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center border border-stone-200 bg-parchment" role="status">
        <span className="flex items-center gap-3 text-[0.75rem] tracking-[0.2em] text-pine-900/40 uppercase">
          <span className="size-1.5 animate-pulse rounded-full bg-brass-500" aria-hidden="true" />
          Loading clinic times
        </span>
      </div>
    )
  }

  if (data && !data.acceptingBookings) {
    return (
      <div className="flex flex-col items-center gap-3 border border-stone-200 bg-parchment p-10 text-center">
        <CalendarX2 className="size-6 text-clay-500" aria-hidden="true" />
        <p className="font-display text-xl text-pine-900">This consultant is not taking bookings just now</p>
        <p className="max-w-sm text-[0.875rem] text-pine-900/60">
          They have paused their online diary. Choose another consultant, or call the appointments desk on
          +91&nbsp;80&nbsp;4512&nbsp;8800 and we will find you a slot.
        </p>
      </div>
    )
  }

  if (days.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 border border-stone-200 bg-parchment p-10 text-center">
        <CalendarX2 className="size-6 text-pine-700/50" aria-hidden="true" />
        <p className="font-display text-xl text-pine-900">No clinic times in the next four weeks</p>
        <p className="max-w-sm text-[0.875rem] text-pine-900/60">
          Please choose another consultant, or call us and we will arrange something.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="eyebrow text-pine-900/55">
          Choose a day <span className="text-clay-500">*</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(0, o - PAGE_DAYS))}
            disabled={offset === 0}
            aria-label="Earlier days"
            className="flex size-8 items-center justify-center border border-stone-200 text-pine-700 transition-colors hover:border-pine-700 disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setOffset((o) => Math.min(Math.max(0, days.length - PAGE_DAYS), o + PAGE_DAYS))}
            disabled={offset + PAGE_DAYS >= days.length}
            aria-label="Later days"
            className="flex size-8 items-center justify-center border border-stone-200 text-pine-700 transition-colors hover:border-pine-700 disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-7">
        {page.map((day) => {
          const isActive = day.date === activeDay
          const isFull = day.slots.length === 0
          return (
            <li key={day.date}>
              <button
                type="button"
                disabled={isFull}
                onClick={() => setActiveDay(day.date)}
                aria-pressed={isActive}
                className={`flex w-full flex-col items-center gap-0.5 border py-3 transition-all duration-300 ${
                  isActive
                    ? 'border-pine-700 bg-pine-700 text-ivory'
                    : isFull
                      ? 'cursor-not-allowed border-stone-200 text-pine-900/25'
                      : 'border-stone-200 text-pine-900 hover:border-pine-700/40'
                }`}
              >
                <span className="text-[0.6875rem] tracking-[0.12em] uppercase opacity-70">
                  {formatDayKey(day.date, { weekday: 'short' })}
                </span>
                <span className="font-display text-[1.1rem]">
                  {formatDayKey(day.date, { day: 'numeric', month: 'short' })}
                </span>
                <span className="text-[0.625rem] opacity-60">{isFull ? 'full' : `${day.slots.length} free`}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {active && (
        <div className="mt-8">
          <p className="eyebrow text-pine-900/55">
            Choose a time <span className="text-clay-500">*</span>
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {active.slots.map((slot) => (
              <li key={slot.startsAt}>
                <button
                  type="button"
                  onClick={() => onChange(slot)}
                  aria-pressed={value?.startsAt === slot.startsAt}
                  className={`border px-5 py-2.5 text-[0.875rem] transition-all duration-300 ${
                    value?.startsAt === slot.startsAt
                      ? 'border-pine-700 bg-pine-700 text-ivory'
                      : 'border-stone-200 text-pine-900 hover:border-pine-700/40'
                  }`}
                >
                  {formatTime(slot.startsAt)}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.75rem] text-pine-900/45">
            Times are Indian Standard Time. Each consultation is {data.slotMinutes} minutes.
          </p>
        </div>
      )}
    </div>
  )
}
