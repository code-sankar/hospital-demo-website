import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check,
  ArrowRight,
  ArrowLeft,
  CalendarCheck,
  Phone,
  Clock,
  ShieldCheck,
  CircleCheck,
  TriangleAlert,
  Timer,
  Loader2,
} from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import PageHeader from '../components/sections/PageHeader'
import { FieldGroup, Input, Select, Textarea } from '../components/ui/Field'
import { api } from '../api/client'
import { formatMoney, formatLongDate, formatTime, minutesUntil } from '../api/format'
import SlotPicker from './booking/SlotPicker'
import { usePayment } from './booking/usePayment'
import TicketCard from '../components/booking/TicketCard'
import { departments } from '../data/departments'
import { site } from '../data/site'

const STEPS = ['Consultant', 'Time', 'Your details', 'Pay & confirm']

const reasons = [
  { id: 'new', label: 'New consultation', detail: 'A first appointment about a new problem.' },
  { id: 'follow-up', label: 'Follow-up review', detail: 'You have been seen here before.' },
  { id: 'second-opinion', label: 'Second opinion', detail: 'A review of a diagnosis made elsewhere.' },
  { id: 'package', label: 'Health check', detail: 'A preventive package rather than a symptom.' },
]

export default function Appointment() {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [banner, setBanner] = useState(null)

  const [doctorState, setDoctorState] = useState({ doctors: [], loadedFor: '' })

  const [hold, setHold] = useState(null)
  const [holding, setHolding] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [minutesLeft, setMinutesLeft] = useState(null)

  const [form, setForm] = useState({
    reason: 'new',
    department: '',
    doctorSlug: '',
    slot: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    notes: '',
    consent: false,
  })

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  /* ---- consultants for the chosen speciality ---- */
  useEffect(() => {
    if (!form.department) return undefined
    const controller = new AbortController()

    api
      .doctors({ department: form.department, accepting: 'true' })
      .then((res) => {
        if (controller.signal.aborted) return
        setDoctorState({ doctors: res.doctors, loadedFor: form.department })
        setBanner(null)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setDoctorState({ doctors: [], loadedFor: form.department })
        setBanner(err.message)
      })

    return () => controller.abort()
  }, [form.department])

  // Only trust the list once it belongs to the speciality currently selected,
  // so switching speciality never briefly shows the previous one's consultants.
  const doctors = useMemo(
    () => (doctorState.loadedFor === form.department ? doctorState.doctors : []),
    [doctorState, form.department],
  )
  const loadingDoctors = Boolean(form.department) && doctorState.loadedFor !== form.department
  const doctor = useMemo(
    () => doctors.find((d) => d.slug === form.doctorSlug),
    [doctors, form.doctorSlug],
  )

  /* ---- countdown while the slot is held for payment ---- */
  useEffect(() => {
    if (!hold?.holdExpiresAt || ticket) return undefined
    const tick = () => setMinutesLeft(minutesUntil(hold.holdExpiresAt))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [hold, ticket])

  const onConfirmed = useCallback((res) => {
    setTicket(res.ticket)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const { pay, paying, error: payError, setError: setPayError } = usePayment({ onConfirmed })

  /* ---- validation ---- */
  const validate = (which) => {
    const e = {}
    if (which === 0) {
      if (!form.department) e.department = 'Please choose a speciality.'
      if (!form.doctorSlug) e.doctorSlug = 'Please choose a consultant.'
    }
    if (which === 1 && !form.slot) e.slot = 'Please choose a date and time.'
    if (which === 2) {
      if (!form.firstName.trim()) e.firstName = 'Required.'
      if (!form.lastName.trim()) e.lastName = 'Required.'
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Enter a valid email address.'
      if (form.phone.replace(/\D/g, '').length < 8) e.phone = 'Enter a contact number.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate(step)) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({ top: 240, behavior: 'smooth' })
  }

  const back = async () => {
    setErrors({})
    setBanner(null)
    // Going back from the payment step abandons the reservation immediately
    // rather than leaving the slot locked until the hold times out.
    if (step === 3 && hold) {
      await api.release(hold.appointmentId).catch(() => {})
      setHold(null)
      setPayError(null)
    }
    setStep((s) => Math.max(s - 1, 0))
  }

  /* ---- reserve the slot, then pay ---- */
  const reserveAndPay = async () => {
    if (!form.consent) {
      setErrors({ consent: 'Please accept the non-refundable payment terms to continue.' })
      return
    }
    setBanner(null)
    const patient = {
      fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email.trim(),
      phone: form.phone.trim(),
      dateOfBirth: form.dob || null,
    }

    try {
      let current = hold
      if (!current) {
        setHolding(true)
        current = await api.hold({
          doctorSlug: form.doctorSlug,
          startsAt: form.slot.startsAt,
          reason: form.reason,
          notes: form.notes,
          patient,
          termsAccepted: true,
        })
        setHold(current)
      }
      await pay(current, patient)
    } catch (err) {
      if (err.code === 'booked') {
        setBanner('Someone booked that time a moment before you. Please choose another slot.')
        setForm((f) => ({ ...f, slot: null }))
        setHold(null)
        setStep(1)
      } else if (err.fields) {
        setErrors(err.fields)
        setBanner(err.message)
      } else if (!payError) {
        setBanner(err.message)
      }
    } finally {
      setHolding(false)
    }
  }

  /* ---------------- confirmation ---------------- */
  if (ticket) {
    return (
      <>
        <PageHeader
          eyebrow="Appointment confirmed"
          title="Thank you — your appointment is booked and paid"
          lead="Your ticket has been emailed to you and a copy has gone to the hospital counter. Bring the code with you."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Appointment' }]}
          variant="courtyard"
          seed={5}
        />
        <section className="bg-ivory py-16 lg:py-24">
          <Container size="narrow">
            <Reveal>
              <TicketCard ticket={ticket} />
            </Reveal>

            <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/patients"
                className="inline-flex h-13 items-center gap-3 bg-pine-700 px-7 text-[0.9375rem] font-medium text-ivory transition-colors hover:bg-pine-600"
              >
                Planning your visit
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={`tel:${site.phone}`}
                className="inline-flex h-13 items-center gap-3 border border-pine-700/25 px-7 text-[0.9375rem] font-medium text-pine-800 transition-colors hover:border-pine-700"
              >
                <Phone className="size-[18px]" />
                {site.phone}
              </a>
            </Reveal>
          </Container>
        </section>
      </>
    )
  }

  /* ---------------- booking wizard ---------------- */
  return (
    <>
      <PageHeader
        eyebrow="Appointments"
        title="Book a consultation in four short steps"
        lead="Choose your consultant and a time from their live diary. The consultation fee is payable in full at the time of booking."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Appointment' }]}
        variant="courtyard"
        seed={5}
      />

      <section className="bg-ivory py-16 lg:py-20">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_0.75fr] lg:gap-16">
            <div>
              {/* ---- stepper ---- */}
              <ol className="grid grid-cols-4 gap-2 border-b border-stone-200 pb-6">
                {STEPS.map((label, i) => {
                  const state = i < step ? 'done' : i === step ? 'active' : 'todo'
                  return (
                    <li key={label} className="flex flex-col gap-3">
                      <span
                        className={`h-0.5 w-full transition-colors duration-500 ${
                          state === 'todo' ? 'bg-stone-200' : 'bg-pine-700'
                        }`}
                      />
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-semibold transition-colors ${
                            state === 'done'
                              ? 'bg-pine-700 text-ivory'
                              : state === 'active'
                                ? 'border border-pine-700 text-pine-700'
                                : 'border border-stone-300 text-pine-900/35'
                          }`}
                        >
                          {state === 'done' ? <Check className="size-3.5" /> : i + 1}
                        </span>
                        <span
                          className={`hidden text-[0.8125rem] font-medium sm:block ${
                            state === 'todo' ? 'text-pine-900/35' : 'text-pine-900'
                          }`}
                        >
                          {label}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ol>

              {banner && (
                <div
                  role="alert"
                  className="mt-8 flex items-start gap-3 border border-clay-500/30 bg-clay-500/8 p-4 text-[0.875rem] text-clay-600"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{banner}</span>
                </div>
              )}

              <div className="mt-10">
                {/* ---- step 0: reason, speciality, consultant ---- */}
                {step === 0 && (
                  <div className="animate-rise">
                    <h2 className="font-display text-[1.8rem] text-pine-900">What is the appointment for?</h2>
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                      {reasons.map((r) => (
                        <li key={r.id}>
                          <button
                            type="button"
                            onClick={() => set('reason', r.id)}
                            aria-pressed={form.reason === r.id}
                            className={`flex w-full flex-col items-start border p-5 text-left transition-all duration-300 ${
                              form.reason === r.id
                                ? 'border-pine-700 bg-pine-700/5'
                                : 'border-stone-200 hover:border-pine-700/40'
                            }`}
                          >
                            <span className="font-display text-[1.2rem] text-pine-900">{r.label}</span>
                            <span className="mt-1.5 text-[0.8125rem] text-pine-900/58">{r.detail}</span>
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-10 grid gap-7 sm:grid-cols-2">
                      <div>
                        <FieldGroup label="Speciality" htmlFor="ap-dept" required>
                          <Select
                            id="ap-dept"
                            value={form.department}
                            onChange={(e) => {
                              set('department', e.target.value)
                              set('doctorSlug', '')
                              set('slot', null)
                            }}
                          >
                            <option value="">Choose a centre of excellence</option>
                            {departments.map((d) => (
                              <option key={d.slug} value={d.slug}>
                                {d.name}
                              </option>
                            ))}
                          </Select>
                        </FieldGroup>
                        {errors.department && (
                          <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.department}</p>
                        )}
                      </div>

                      <div>
                        <FieldGroup
                          label="Consultant"
                          htmlFor="ap-doc"
                          required
                          hint={
                            form.department && !loadingDoctors && doctors.length === 0
                              ? 'No consultant in this speciality is taking online bookings today.'
                              : undefined
                          }
                        >
                          <Select
                            id="ap-doc"
                            value={form.doctorSlug}
                            disabled={!form.department || loadingDoctors}
                            onChange={(e) => {
                              set('doctorSlug', e.target.value)
                              set('slot', null)
                            }}
                          >
                            <option value="">
                              {loadingDoctors ? 'Loading consultants…' : 'Choose a consultant'}
                            </option>
                            {doctors.map((d) => (
                              <option key={d.slug} value={d.slug}>
                                {d.fullName} — {formatMoney(d.consultationFeePaise)}
                              </option>
                            ))}
                          </Select>
                        </FieldGroup>
                        {errors.doctorSlug && (
                          <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.doctorSlug}</p>
                        )}
                      </div>
                    </div>

                    {doctor && (
                      <div className="mt-8 border border-stone-200 bg-parchment p-6">
                        <p className="eyebrow text-brass-600">{doctor.departmentName}</p>
                        <p className="mt-3 font-display text-[1.4rem] text-pine-900">{doctor.fullName}</p>
                        <p className="mt-1 text-[0.875rem] text-pine-900/60">{doctor.title}</p>
                        <p className="mt-4 border-t border-stone-200 pt-4 text-[0.9375rem] text-pine-900/75">
                          Consultation fee{' '}
                          <span className="font-medium text-pine-900">
                            {formatMoney(doctor.consultationFeePaise)}
                          </span>{' '}
                          · {doctor.slotMinutes} minutes · payable in advance
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ---- step 1: live availability ---- */}
                {step === 1 && (
                  <div className="animate-rise">
                    <h2 className="font-display text-[1.8rem] text-pine-900">
                      When would you like to see {doctor?.fullName ?? 'your consultant'}?
                    </h2>
                    <p className="mt-3 text-[0.9375rem] text-pine-900/62">
                      These are the times the consultant currently has open. They come straight from their own
                      diary, so what you see here is what is genuinely free.
                    </p>

                    <div className="mt-8">
                      <SlotPicker
                        doctorSlug={form.doctorSlug}
                        value={form.slot}
                        onChange={(slot) => set('slot', slot)}
                        onError={(err) => setBanner(err.message)}
                      />
                    </div>
                    {errors.slot && <p className="mt-4 text-[0.8125rem] text-clay-600">{errors.slot}</p>}
                  </div>
                )}

                {/* ---- step 2: patient details ---- */}
                {step === 2 && (
                  <div className="animate-rise">
                    <h2 className="font-display text-[1.8rem] text-pine-900">Your details</h2>
                    <div className="mt-8 grid gap-7 sm:grid-cols-2">
                      <div>
                        <FieldGroup label="First name" htmlFor="ap-first" required>
                          <Input
                            id="ap-first"
                            value={form.firstName}
                            onChange={(e) => set('firstName', e.target.value)}
                            autoComplete="given-name"
                          />
                        </FieldGroup>
                        {errors.firstName && (
                          <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <FieldGroup label="Last name" htmlFor="ap-last" required>
                          <Input
                            id="ap-last"
                            value={form.lastName}
                            onChange={(e) => set('lastName', e.target.value)}
                            autoComplete="family-name"
                          />
                        </FieldGroup>
                        {errors.lastName && (
                          <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.lastName}</p>
                        )}
                      </div>
                      <div>
                        <FieldGroup
                          label="Email"
                          htmlFor="ap-email"
                          required
                          hint="Your ticket is sent here."
                        >
                          <Input
                            id="ap-email"
                            type="email"
                            value={form.email}
                            onChange={(e) => set('email', e.target.value)}
                            autoComplete="email"
                          />
                        </FieldGroup>
                        {errors.email && <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.email}</p>}
                        {errors['patient.email'] && (
                          <p className="mt-2 text-[0.8125rem] text-clay-600">{errors['patient.email']}</p>
                        )}
                      </div>
                      <div>
                        <FieldGroup label="Mobile number" htmlFor="ap-phone" required>
                          <Input
                            id="ap-phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => set('phone', e.target.value)}
                            autoComplete="tel"
                            placeholder="+91 98450 00000"
                          />
                        </FieldGroup>
                        {errors.phone && <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.phone}</p>}
                      </div>
                      <FieldGroup label="Date of birth" htmlFor="ap-dob">
                        <Input id="ap-dob" type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
                      </FieldGroup>
                      <div className="sm:col-span-2">
                        <FieldGroup
                          label="Anything the consultant should know?"
                          htmlFor="ap-notes"
                          hint="Symptoms, referral details, interpreter or access requirements."
                        >
                          <Textarea id="ap-notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
                        </FieldGroup>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---- step 3: review and pay ---- */}
                {step === 3 && (
                  <div className="animate-rise">
                    <h2 className="font-display text-[1.8rem] text-pine-900">Check and pay</h2>

                    <dl className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
                      {[
                        ['Reason', reasons.find((r) => r.id === form.reason)?.label],
                        ['Consultant', doctor?.fullName],
                        ['Speciality', doctor?.departmentName],
                        ['Date', form.slot && formatLongDate(form.slot.startsAt)],
                        ['Time', form.slot && `${formatTime(form.slot.startsAt)} IST`],
                        ['Name', `${form.firstName} ${form.lastName}`],
                        ['Email', form.email],
                        ['Mobile', form.phone],
                        ...(form.notes ? [['Notes', form.notes]] : []),
                      ].map(([k, v]) => (
                        <div key={k} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
                          <dt className="w-40 shrink-0 text-[0.8125rem] text-pine-900/50">{k}</dt>
                          <dd className="text-[0.9375rem] text-pine-900">{v || '—'}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-8 flex items-center justify-between border border-pine-700/25 bg-pine-700/5 p-6">
                      <div>
                        <p className="eyebrow text-brass-600">Payable now, in full</p>
                        <p className="mt-2 text-[0.8125rem] text-pine-900/60">
                          The consultation fee is charged when you book.
                        </p>
                      </div>
                      <p className="font-display text-[2.2rem] leading-none text-pine-900">
                        {doctor ? formatMoney(doctor.consultationFeePaise) : '—'}
                      </p>
                    </div>

                    <label className="mt-8 flex cursor-pointer items-start gap-3.5">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => set('consent', e.target.checked)}
                        className="peer sr-only"
                      />
                      <span
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-brass-500 ${
                          form.consent ? 'border-pine-700 bg-pine-700' : 'border-stone-300'
                        }`}
                      >
                        {form.consent && (
                          <svg viewBox="0 0 12 12" className="size-3 text-ivory" aria-hidden="true">
                            <path
                              d="m2 6 3 3 5-6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="text-[0.875rem] leading-relaxed text-pine-900/70">
                        I understand that the consultation fee is payable in full at the time of booking and is{' '}
                        <strong className="font-medium text-clay-600">not refundable</strong> if I cancel or do
                        not attend, and I agree to be contacted about this appointment.
                      </span>
                    </label>
                    {errors.consent && <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.consent}</p>}

                    {hold && !ticket && (
                      <p className="mt-6 flex items-center gap-2.5 text-[0.8125rem] text-pine-900/60">
                        <Timer className="size-4 text-brass-500" aria-hidden="true" />
                        Your slot is held for another {minutesLeft ?? hold.holdMinutes} minute
                        {(minutesLeft ?? hold.holdMinutes) === 1 ? '' : 's'} while you pay.
                      </p>
                    )}

                    {payError && (
                      <div
                        role="alert"
                        className="mt-6 flex items-start gap-3 border border-clay-500/30 bg-clay-500/8 p-4 text-[0.875rem] text-clay-600"
                      >
                        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <span>{payError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ---- navigation ---- */}
              <div className="mt-12 flex items-center justify-between gap-4 border-t border-stone-200 pt-8">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={back}
                    disabled={paying || holding}
                    className="inline-flex h-13 items-center gap-2.5 border border-stone-300 px-6 text-[0.875rem] font-medium text-pine-800 transition-colors hover:border-pine-700 disabled:opacity-40"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="group inline-flex h-13 items-center gap-3 bg-pine-700 px-8 text-[0.9375rem] font-medium tracking-wide text-ivory transition-colors hover:bg-pine-600"
                  >
                    Continue
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={reserveAndPay}
                    disabled={paying || holding}
                    className="inline-flex h-13 items-center gap-3 bg-pine-700 px-8 text-[0.9375rem] font-medium tracking-wide text-ivory transition-colors hover:bg-pine-600 disabled:opacity-60"
                  >
                    {paying || holding ? (
                      <>
                        <Loader2 className="size-[18px] animate-spin" />
                        {holding ? 'Holding your slot…' : 'Confirming payment…'}
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="size-[18px]" />
                        Pay {doctor ? formatMoney(doctor.consultationFeePaise) : ''} &amp; confirm
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* ---- aside ---- */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="border border-stone-200 bg-parchment p-7">
                <h2 className="eyebrow text-brass-600">Prefer to speak to someone?</h2>
                <a
                  href={`tel:${site.phone}`}
                  className="mt-5 block font-display text-[1.9rem] leading-none text-pine-900 transition-colors hover:text-pine-600"
                >
                  {site.phone}
                </a>
                <ul className="mt-6 space-y-3 text-[0.8125rem] text-pine-900/62">
                  {site.hours.map((h) => (
                    <li key={h.label} className="flex justify-between gap-4">
                      <span>{h.label}</span>
                      <span className="text-right text-pine-900/85">{h.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="mt-6 space-y-5">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Paid in advance',
                    detail:
                      'The full consultation fee is taken at the time of booking. This secures the slot and is not refundable.',
                  },
                  {
                    icon: CircleCheck,
                    title: 'A coded ticket',
                    detail:
                      'You receive a ticket code by email. The counter receives the same ticket, so quoting the code is all you need on arrival.',
                  },
                  {
                    icon: Clock,
                    title: 'Live diaries',
                    detail:
                      'Every time shown is one the consultant has open right now — no waiting to hear whether it was really free.',
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.title} className="flex items-start gap-4 border border-stone-200 p-5">
                      <Icon className="mt-0.5 size-5 shrink-0 text-brass-500" aria-hidden="true" />
                      <span>
                        <span className="block text-[0.9375rem] font-medium text-pine-900">{item.title}</span>
                        <span className="mt-1 block text-[0.8125rem] leading-relaxed text-pine-900/58">
                          {item.detail}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-6 border border-clay-500/25 bg-clay-500/6 p-6">
                <p className="text-[0.875rem] leading-relaxed text-pine-900/75">
                  <strong className="font-medium text-clay-600">This is not for emergencies.</strong> If you are
                  seriously unwell, call{' '}
                  <a href={`tel:${site.emergencyPhone}`} className="font-medium text-clay-600 underline">
                    {site.emergencyPhone}
                  </a>{' '}
                  or come straight to the Emergency Department.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}
