import { useCallback, useEffect, useState } from 'react'
import {
  CalendarDays,
  CalendarOff,
  Check,
  Loader2,
  Plus,
  Save,
  Trash2,
  TriangleAlert,
  Users,
  Power,
} from 'lucide-react'
import StaffShell from './StaffShell'
import { api } from '../../api/client'
import {
  WEEKDAYS,
  WEEKDAYS_SHORT,
  formatMoney,
  formatLongDate,
  formatTime,
  formatDate,
} from '../../api/format'

const emptyRule = (weekday) => ({ weekday, startsAt: '10:00', endsAt: '13:00', isActive: true })

export default function DoctorConsole() {
  const [profile, setProfile] = useState(null)
  const [rules, setRules] = useState([])
  const [timeOff, setTimeOff] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  // Re-fetching is a dependency change rather than a function call inside the
  // effect, which keeps the effect free of synchronous state updates.
  useEffect(() => {
    let cancelled = false

    Promise.all([api.doctorProfile(), api.doctorAppointments({ days: 30 })])
      .then(([me, appts]) => {
        if (cancelled) return
        setProfile(me.doctor)
        setRules(me.availability)
        setTimeOff(me.timeOff)
        setAppointments(appts.appointments)
        setError(null)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const load = useCallback(() => {
    setLoading(true)
    setReloadToken((t) => t + 1)
  }, [])

  const flash = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 4000)
  }

  const toggleAccepting = async () => {
    const next = !profile.isAccepting
    setProfile((p) => ({ ...p, isAccepting: next }))
    try {
      await api.updateDoctorProfile({ isAccepting: next })
      flash(next ? 'Your diary is open — patients can book again.' : 'Your diary is closed to new bookings.')
    } catch (err) {
      setProfile((p) => ({ ...p, isAccepting: !next }))
      setError(err.message)
    }
  }

  const setSlotMinutes = async (minutes) => {
    setProfile((p) => ({ ...p, slotMinutes: minutes }))
    try {
      await api.updateDoctorProfile({ slotMinutes: minutes })
      flash(`Consultations are now ${minutes} minutes long.`)
    } catch (err) {
      setError(err.message)
      load()
    }
  }

  const saveRota = async () => {
    setSaving(true)
    setError(null)
    try {
      await api.saveAvailability(
        rules.map((r) => ({
          weekday: r.weekday,
          startsAt: r.startsAt,
          endsAt: r.endsAt,
          isActive: r.isActive,
        })),
      )
      flash('Your consulting hours have been updated. The booking page is already showing them.')
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const addTimeOff = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const from = data.get('from')
    const to = data.get('to')
    if (!from || !to) return
    try {
      // The inputs are clinic-local; +05:30 makes that explicit to the server.
      const res = await api.addTimeOff({
        startsAt: `${from}T00:00:00+05:30`,
        endsAt: `${to}T23:59:00+05:30`,
        reason: data.get('reason') || '',
      })
      setTimeOff((t) => [...t, res.timeOff])
      event.currentTarget.reset()
      flash(
        res.affectedAppointments.length
          ? `Absence recorded. ${res.affectedAppointments.length} booked appointment(s) fall inside it — those patients have paid, so please have the desk reschedule them.`
          : 'Absence recorded. Those days are no longer bookable.',
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const removeTimeOff = async (id) => {
    try {
      await api.removeTimeOff(id)
      setTimeOff((t) => t.filter((x) => x.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <StaffShell title="Your diary">
        <div className="flex min-h-48 items-center justify-center" role="status">
          <Loader2 className="size-5 animate-spin text-pine-700" />
        </div>
      </StaffShell>
    )
  }

  if (error && !profile) {
    return (
      <StaffShell title="Your diary">
        <p className="border border-clay-500/30 bg-clay-500/8 p-5 text-[0.9375rem] text-clay-600">{error}</p>
      </StaffShell>
    )
  }

  return (
    <StaffShell
      title={profile.fullName}
      subtitle={`${profile.title} · ${profile.departmentName}`}
      actions={
        <button
          type="button"
          onClick={toggleAccepting}
          className={`inline-flex h-12 items-center gap-3 border px-6 text-[0.875rem] font-medium transition-colors ${
            profile.isAccepting
              ? 'border-pine-700 bg-pine-700 text-ivory hover:bg-pine-600'
              : 'border-clay-500 bg-clay-500 text-ivory hover:bg-clay-600'
          }`}
          aria-pressed={profile.isAccepting}
        >
          <Power className="size-4" />
          {profile.isAccepting ? 'Accepting bookings' : 'Not accepting bookings'}
        </button>
      }
    >
      {message && (
        <div className="mb-8 flex items-start gap-3 border border-pine-700/25 bg-pine-700/6 p-4 text-[0.875rem] text-pine-800">
          <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mb-8 flex items-start gap-3 border border-clay-500/30 bg-clay-500/8 p-4 text-[0.875rem] text-clay-600"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        {/* ---------------- weekly rota ---------------- */}
        <section className="border border-stone-200 bg-ivory p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="flex items-center gap-2.5 font-display text-[1.5rem] text-pine-900">
              <CalendarDays className="size-5 text-brass-500" aria-hidden="true" />
              Consulting hours
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="slot-len" className="text-[0.8125rem] text-pine-900/55">
                Slot length
              </label>
              <select
                id="slot-len"
                value={profile.slotMinutes}
                onChange={(e) => setSlotMinutes(Number(e.target.value))}
                className="border border-stone-200 bg-ivory px-3 py-1.5 text-[0.875rem] text-pine-900"
              >
                {[10, 15, 20, 30, 45, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} min
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-3 text-[0.875rem] leading-relaxed text-pine-900/60">
            These are the hours patients can book into. Change them here and the public booking page follows
            immediately — there is nobody to tell.
          </p>

          <ul className="mt-7 space-y-3">
            {rules.length === 0 && (
              <li className="border border-dashed border-stone-300 p-6 text-center text-[0.875rem] text-pine-900/50">
                You have no consulting hours set, so nothing can be booked.
              </li>
            )}
            {rules.map((rule, i) => (
              <li key={rule.id ?? `new-${i}`} className="flex flex-wrap items-center gap-3 border border-stone-200 p-3">
                <select
                  aria-label="Day"
                  value={rule.weekday}
                  onChange={(e) =>
                    setRules((rs) => rs.map((r, j) => (j === i ? { ...r, weekday: Number(e.target.value) } : r)))
                  }
                  className="border border-stone-200 bg-ivory px-3 py-2 text-[0.875rem] text-pine-900"
                >
                  {WEEKDAYS.map((d, idx) => (
                    <option key={d} value={idx}>
                      {d}
                    </option>
                  ))}
                </select>

                <input
                  type="time"
                  aria-label="From"
                  value={rule.startsAt}
                  onChange={(e) =>
                    setRules((rs) => rs.map((r, j) => (j === i ? { ...r, startsAt: e.target.value } : r)))
                  }
                  className="border border-stone-200 bg-ivory px-3 py-2 text-[0.875rem] text-pine-900"
                />
                <span className="text-pine-900/40">to</span>
                <input
                  type="time"
                  aria-label="To"
                  value={rule.endsAt}
                  onChange={(e) =>
                    setRules((rs) => rs.map((r, j) => (j === i ? { ...r, endsAt: e.target.value } : r)))
                  }
                  className="border border-stone-200 bg-ivory px-3 py-2 text-[0.875rem] text-pine-900"
                />

                <label className="ml-auto flex items-center gap-2 text-[0.8125rem] text-pine-900/65">
                  <input
                    type="checkbox"
                    checked={rule.isActive}
                    onChange={(e) =>
                      setRules((rs) => rs.map((r, j) => (j === i ? { ...r, isActive: e.target.checked } : r)))
                    }
                  />
                  Active
                </label>

                <button
                  type="button"
                  onClick={() => setRules((rs) => rs.filter((_, j) => j !== i))}
                  aria-label={`Remove ${WEEKDAYS[rule.weekday]} clinic`}
                  className="flex size-9 items-center justify-center border border-stone-200 text-pine-700 transition-colors hover:border-clay-500 hover:text-clay-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setRules((rs) => [...rs, emptyRule(rs.length ? (rs.at(-1).weekday + 1) % 7 : 1)])}
              className="inline-flex h-11 items-center gap-2 border border-stone-300 px-5 text-[0.875rem] font-medium text-pine-800 transition-colors hover:border-pine-700"
            >
              <Plus className="size-4" />
              Add a clinic
            </button>
            <button
              type="button"
              onClick={saveRota}
              disabled={saving}
              className="inline-flex h-11 items-center gap-2 bg-pine-700 px-6 text-[0.875rem] font-medium text-ivory transition-colors hover:bg-pine-600 disabled:opacity-60"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save consulting hours
            </button>
          </div>
        </section>

        {/* ---------------- leave ---------------- */}
        <section className="border border-stone-200 bg-ivory p-7">
          <h2 className="flex items-center gap-2.5 font-display text-[1.5rem] text-pine-900">
            <CalendarOff className="size-5 text-brass-500" aria-hidden="true" />
            Leave and absences
          </h2>
          <p className="mt-3 text-[0.875rem] leading-relaxed text-pine-900/60">
            Block out dates that override your weekly hours. Appointments already paid for are never cancelled
            automatically — they are listed so the desk can reschedule them.
          </p>

          <form onSubmit={addTimeOff} className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-[0.75rem] tracking-wide text-pine-900/55 uppercase">
              From
              <input
                type="date"
                name="from"
                required
                className="border border-stone-200 bg-ivory px-3 py-2 text-[0.875rem] text-pine-900 normal-case"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-[0.75rem] tracking-wide text-pine-900/55 uppercase">
              To
              <input
                type="date"
                name="to"
                required
                className="border border-stone-200 bg-ivory px-3 py-2 text-[0.875rem] text-pine-900 normal-case"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-[0.75rem] tracking-wide text-pine-900/55 uppercase sm:col-span-2">
              Reason
              <input
                type="text"
                name="reason"
                placeholder="Conference, leave, theatre list…"
                className="border border-stone-200 bg-ivory px-3 py-2 text-[0.875rem] text-pine-900 normal-case"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 border border-pine-700/25 px-5 text-[0.875rem] font-medium text-pine-800 transition-colors hover:bg-pine-700 hover:text-ivory sm:col-span-2"
            >
              <Plus className="size-4" />
              Block these dates
            </button>
          </form>

          <ul className="mt-6 divide-y divide-stone-200 border-t border-stone-200">
            {timeOff.length === 0 && (
              <li className="py-5 text-[0.875rem] text-pine-900/45">No upcoming absences.</li>
            )}
            {timeOff.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-[0.9375rem] text-pine-900">
                    {formatDate(t.startsAt)} — {formatDate(t.endsAt)}
                  </p>
                  {t.reason && <p className="mt-0.5 text-[0.8125rem] text-pine-900/55">{t.reason}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => removeTimeOff(t.id)}
                  aria-label="Remove this absence"
                  className="flex size-9 items-center justify-center border border-stone-200 text-pine-700 transition-colors hover:border-clay-500 hover:text-clay-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ---------------- upcoming patients ---------------- */}
      <section className="mt-8 border border-stone-200 bg-ivory p-7">
        <h2 className="flex items-center gap-2.5 font-display text-[1.5rem] text-pine-900">
          <Users className="size-5 text-brass-500" aria-hidden="true" />
          Your next thirty days
        </h2>

        {appointments.length === 0 ? (
          <p className="mt-6 border border-dashed border-stone-300 p-6 text-center text-[0.875rem] text-pine-900/50">
            No appointments booked yet.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-300">
                  <th scope="col" className="eyebrow pb-3 text-pine-900/50">When</th>
                  <th scope="col" className="eyebrow pb-3 text-pine-900/50">Patient</th>
                  <th scope="col" className="eyebrow pb-3 text-pine-900/50">Reason</th>
                  <th scope="col" className="eyebrow pb-3 text-pine-900/50">Ticket</th>
                  <th scope="col" className="eyebrow pb-3 text-pine-900/50">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {appointments.map((a) => (
                  <tr key={a.reference}>
                    <td className="py-4 pr-6 text-[0.875rem] text-pine-900">
                      {formatLongDate(a.startsAt)}
                      <span className="block text-pine-900/55">{formatTime(a.startsAt)}</span>
                    </td>
                    <td className="py-4 pr-6 text-[0.875rem]">
                      <span className="block font-medium text-pine-900">{a.patient.fullName}</span>
                      <span className="block text-pine-900/55">{a.patient.phone}</span>
                      {a.notes && <span className="mt-1 block max-w-xs text-pine-900/50">{a.notes}</span>}
                    </td>
                    <td className="py-4 pr-6 text-[0.875rem] text-pine-900/70">{a.reason}</td>
                    <td className="py-4 pr-6 font-mono text-[0.8125rem] text-pine-900/70">{a.reference}</td>
                    <td className="py-4 text-[0.8125rem]">
                      {a.checkedInAt ? (
                        <span className="inline-flex items-center gap-1.5 text-pine-700">
                          <Check className="size-3.5" /> Arrived
                        </span>
                      ) : (
                        <span className="text-pine-900/45">Expected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 border-t border-stone-200 pt-5 text-[0.8125rem] text-pine-900/50">
          Consultation fee {formatMoney(profile.consultationFeePaise)} · {profile.slotMinutes}-minute slots ·
          clinics on {rules.filter((r) => r.isActive).map((r) => WEEKDAYS_SHORT[r.weekday]).join(', ') || 'no days'}
        </p>
      </section>
    </StaffShell>
  )
}
