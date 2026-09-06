import { useState, useMemo } from 'react'
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
} from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import PageHeader from '../components/sections/PageHeader'
import { FieldGroup, Input, Select, Textarea } from '../components/ui/Field'
import { departments } from '../data/departments'
import { doctors } from '../data/doctors'
import { insurers } from '../data/patients'
import { site } from '../data/site'

const STEPS = ['Reason', 'Consultant & time', 'Your details', 'Confirm']

const reasons = [
  { id: 'new', label: 'New consultation', detail: 'A first appointment about a new problem.' },
  { id: 'follow-up', label: 'Follow-up review', detail: 'You have been seen here before.' },
  { id: 'second', label: 'Second opinion', detail: 'A review of a diagnosis or plan made elsewhere.' },
  { id: 'package', label: 'Health screening', detail: 'A preventive package rather than a symptom.' },
]

const times = ['08:00', '09:15', '10:30', '11:45', '14:00', '15:15', '16:30', '17:45']

/** The next ten weekdays, used to populate the date picker. */
function nextWeekdays(count = 10) {
  const out = []
  const cursor = new Date()
  cursor.setDate(cursor.getDate() + 1)
  while (out.length < count) {
    if (cursor.getDay() !== 0) out.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return out
}

const fmtDay = (d) => d.toLocaleDateString('en-GB', { weekday: 'short' })
const fmtDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const fmtFull = (d) =>
  d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export default function Appointment() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [reference, setReference] = useState('')
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    reason: 'new',
    department: '',
    doctor: 'any',
    date: null,
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    payer: 'insured',
    insurer: '',
    notes: '',
    consent: false,
  })

  const days = useMemo(() => nextWeekdays(10), [])
  const availableDoctors = useMemo(
    () => (form.department ? doctors.filter((d) => d.department === form.department && d.accepting) : []),
    [form.department],
  )

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = (which) => {
    const e = {}
    if (which === 0 && !form.department) e.department = 'Please choose a speciality.'
    if (which === 1) {
      if (!form.date) e.date = 'Please choose a date.'
      if (!form.time) e.time = 'Please choose a time.'
    }
    if (which === 2) {
      if (!form.firstName.trim()) e.firstName = 'Required.'
      if (!form.lastName.trim()) e.lastName = 'Required.'
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Enter a valid email address.'
      if (form.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a contact number.'
      if (form.payer === 'insured' && !form.insurer) e.insurer = 'Please choose your insurer.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate(step)) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({ top: 240, behavior: 'smooth' })
  }
  const back = () => {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.consent) {
      setErrors({ consent: 'Please confirm before submitting.' })
      return
    }
    setReference(
      `VIT-${String(new Date().getFullYear()).slice(2)}${String(Math.floor(Math.random() * 9000) + 1000)}`,
    )
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const chosenDoctor = doctors.find((d) => d.slug === form.doctor)
  const chosenDept = departments.find((d) => d.slug === form.department)

  /* ---------------- Confirmation ---------------- */
  if (submitted) {
    return (
      <>
        <PageHeader
          eyebrow="Request received"
          title="Thank you — your request is with our appointments team"
          lead="You will receive a confirmation by email within one working hour, together with preparation instructions and directions to the right entrance."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Appointment' }]}
          variant="courtyard"
          seed={5}
        />

        <section className="bg-ivory py-20 lg:py-24">
          <Container size="narrow">
            <Reveal className="border border-stone-200 bg-parchment p-8 sm:p-12">
              <span className="flex size-14 items-center justify-center rounded-full bg-pine-700 text-ivory">
                <CircleCheck className="size-7" aria-hidden="true" />
              </span>
              <p className="eyebrow mt-8 text-brass-600">Your reference</p>
              <p className="mt-3 font-display text-[2.6rem] leading-none text-pine-900">{reference}</p>

              <dl className="mt-10 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2">
                {[
                  { k: 'Name', v: `${form.firstName} ${form.lastName}` },
                  { k: 'Speciality', v: chosenDept?.name ?? '—' },
                  { k: 'Consultant', v: chosenDoctor ? chosenDoctor.name : 'First available' },
                  { k: 'Requested date', v: form.date ? fmtFull(form.date) : '—' },
                  { k: 'Requested time', v: form.time || '—' },
                  { k: 'Payment', v: form.payer === 'insured' ? form.insurer : 'Self-funded' },
                ].map((row) => (
                  <div key={row.k} className="bg-parchment px-6 py-5">
                    <dt className="eyebrow text-pine-900/45">{row.k}</dt>
                    <dd className="mt-2 text-[0.9375rem] font-medium text-pine-900">{row.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-wrap gap-4">
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
              </div>

              <p className="mt-8 border-t border-stone-200 pt-6 text-[0.8125rem] leading-relaxed text-pine-900/55">
                This is a design demonstration — no request has actually been sent, and no personal data has left
                your browser. If you need care urgently, attend the Emergency Department or call{' '}
                {site.emergencyPhone}.
              </p>
            </Reveal>
          </Container>
        </section>
      </>
    )
  }

  /* ---------------- Booking wizard ---------------- */
  return (
    <>
      <PageHeader
        eyebrow="Appointments"
        title="Book a consultation in four short steps"
        lead="Requests are reviewed by a person, not an algorithm, and confirmed within one working hour during clinic times."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Appointment' }]}
        variant="courtyard"
        seed={5}
      />

      <section className="bg-ivory py-16 lg:py-20">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_0.75fr] lg:gap-16">
            <div>
              {/* ---- Stepper ---- */}
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

              <form onSubmit={submit} className="mt-10">
                {/* ---- Step 0: reason ---- */}
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

                    <div className="mt-10">
                      <FieldGroup label="Speciality" htmlFor="ap-dept" required>
                        <Select
                          id="ap-dept"
                          value={form.department}
                          onChange={(e) => {
                            set('department', e.target.value)
                            set('doctor', 'any')
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
                  </div>
                )}

                {/* ---- Step 1: consultant & time ---- */}
                {step === 1 && (
                  <div className="animate-rise">
                    <h2 className="font-display text-[1.8rem] text-pine-900">Choose a consultant and a time</h2>

                    <div className="mt-7">
                      <FieldGroup label="Consultant" htmlFor="ap-doc" hint="Leave as first available if you have no preference.">
                        <Select id="ap-doc" value={form.doctor} onChange={(e) => set('doctor', e.target.value)}>
                          <option value="any">First available consultant</option>
                          {availableDoctors.map((d) => (
                            <option key={d.slug} value={d.slug}>
                              {d.name} — {d.focus[0]}
                            </option>
                          ))}
                        </Select>
                      </FieldGroup>
                    </div>

                    <fieldset className="mt-10">
                      <legend className="eyebrow text-pine-900/55">
                        Preferred date <span className="text-clay-500">*</span>
                      </legend>
                      <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {days.map((d) => {
                          const active = form.date && d.toDateString() === form.date.toDateString()
                          return (
                            <li key={d.toISOString()}>
                              <button
                                type="button"
                                onClick={() => set('date', d)}
                                aria-pressed={!!active}
                                className={`flex w-full flex-col items-center gap-0.5 border py-3 transition-all duration-300 ${
                                  active
                                    ? 'border-pine-700 bg-pine-700 text-ivory'
                                    : 'border-stone-200 text-pine-900 hover:border-pine-700/40'
                                }`}
                              >
                                <span className="text-[0.6875rem] tracking-[0.12em] uppercase opacity-70">
                                  {fmtDay(d)}
                                </span>
                                <span className="font-display text-[1.1rem]">{fmtDate(d)}</span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                      {errors.date && <p className="mt-3 text-[0.8125rem] text-clay-600">{errors.date}</p>}
                    </fieldset>

                    <fieldset className="mt-10">
                      <legend className="eyebrow text-pine-900/55">
                        Preferred time <span className="text-clay-500">*</span>
                      </legend>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {times.map((t, i) => {
                          const unavailable = i === 3
                          return (
                            <li key={t}>
                              <button
                                type="button"
                                disabled={unavailable}
                                onClick={() => set('time', t)}
                                aria-pressed={form.time === t}
                                className={`border px-5 py-2.5 text-[0.875rem] transition-all duration-300 ${
                                  unavailable
                                    ? 'cursor-not-allowed border-stone-200 text-pine-900/25 line-through'
                                    : form.time === t
                                      ? 'border-pine-700 bg-pine-700 text-ivory'
                                      : 'border-stone-200 text-pine-900 hover:border-pine-700/40'
                                }`}
                              >
                                {t}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                      {errors.time && <p className="mt-3 text-[0.8125rem] text-clay-600">{errors.time}</p>}
                    </fieldset>
                  </div>
                )}

                {/* ---- Step 2: details ---- */}
                {step === 2 && (
                  <div className="animate-rise">
                    <h2 className="font-display text-[1.8rem] text-pine-900">Your details</h2>

                    <div className="mt-8 grid gap-7 sm:grid-cols-2">
                      <div>
                        <FieldGroup label="First name" htmlFor="ap-first" required>
                          <Input id="ap-first" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} autoComplete="given-name" />
                        </FieldGroup>
                        {errors.firstName && <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.firstName}</p>}
                      </div>
                      <div>
                        <FieldGroup label="Family name" htmlFor="ap-last" required>
                          <Input id="ap-last" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} autoComplete="family-name" />
                        </FieldGroup>
                        {errors.lastName && <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.lastName}</p>}
                      </div>
                      <div>
                        <FieldGroup label="Email" htmlFor="ap-email" required>
                          <Input id="ap-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
                        </FieldGroup>
                        {errors.email && <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.email}</p>}
                      </div>
                      <div>
                        <FieldGroup label="Telephone" htmlFor="ap-phone" required>
                          <Input id="ap-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />
                        </FieldGroup>
                        {errors.phone && <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.phone}</p>}
                      </div>
                      <FieldGroup label="Date of birth" htmlFor="ap-dob">
                        <Input id="ap-dob" type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
                      </FieldGroup>
                      <FieldGroup label="How will you pay?" htmlFor="ap-payer">
                        <Select id="ap-payer" value={form.payer} onChange={(e) => set('payer', e.target.value)}>
                          <option value="insured">Private insurance</option>
                          <option value="self">Self-funded</option>
                          <option value="corporate">Corporate / employer scheme</option>
                        </Select>
                      </FieldGroup>

                      {form.payer === 'insured' && (
                        <div className="sm:col-span-2">
                          <FieldGroup label="Insurer" htmlFor="ap-insurer" required>
                            <Select id="ap-insurer" value={form.insurer} onChange={(e) => set('insurer', e.target.value)}>
                              <option value="">Choose your insurer</option>
                              {insurers.map((ins) => (
                                <option key={ins} value={ins}>
                                  {ins}
                                </option>
                              ))}
                              <option value="Other">Other / not listed</option>
                            </Select>
                          </FieldGroup>
                          {errors.insurer && <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.insurer}</p>}
                        </div>
                      )}

                      <div className="sm:col-span-2">
                        <FieldGroup
                          label="Anything we should know?"
                          htmlFor="ap-notes"
                          hint="Symptoms, referral details, interpreter or access requirements."
                        >
                          <Textarea id="ap-notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
                        </FieldGroup>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---- Step 3: confirm ---- */}
                {step === 3 && (
                  <div className="animate-rise">
                    <h2 className="font-display text-[1.8rem] text-pine-900">Check and confirm</h2>

                    <dl className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
                      {[
                        { k: 'Reason', v: reasons.find((r) => r.id === form.reason)?.label },
                        { k: 'Speciality', v: chosenDept?.name },
                        { k: 'Consultant', v: chosenDoctor ? chosenDoctor.name : 'First available' },
                        { k: 'Date', v: form.date ? fmtFull(form.date) : '—' },
                        { k: 'Time', v: form.time },
                        { k: 'Name', v: `${form.firstName} ${form.lastName}` },
                        { k: 'Email', v: form.email },
                        { k: 'Telephone', v: form.phone },
                        { k: 'Payment', v: form.payer === 'insured' ? form.insurer : form.payer === 'self' ? 'Self-funded' : 'Corporate scheme' },
                        ...(form.notes ? [{ k: 'Notes', v: form.notes }] : []),
                      ].map((row) => (
                        <div key={row.k} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
                          <dt className="w-40 shrink-0 text-[0.8125rem] text-pine-900/50">{row.k}</dt>
                          <dd className="text-[0.9375rem] text-pine-900">{row.v || '—'}</dd>
                        </div>
                      ))}
                    </dl>

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
                            <path d="m2 6 3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="text-[0.875rem] leading-relaxed text-pine-900/70">
                        I agree that Vitalis may contact me about this request, and I understand that submitting
                        it does not confirm an appointment until the team replies.
                      </span>
                    </label>
                    {errors.consent && <p className="mt-2 text-[0.8125rem] text-clay-600">{errors.consent}</p>}
                  </div>
                )}

                {/* ---- Navigation ---- */}
                <div className="mt-12 flex items-center justify-between gap-4 border-t border-stone-200 pt-8">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={back}
                      className="inline-flex h-13 items-center gap-2.5 border border-stone-300 px-6 text-[0.875rem] font-medium text-pine-800 transition-colors hover:border-pine-700"
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
                      type="submit"
                      className="group inline-flex h-13 items-center gap-3 bg-pine-700 px-8 text-[0.9375rem] font-medium tracking-wide text-ivory transition-colors hover:bg-pine-600"
                    >
                      <CalendarCheck className="size-[18px]" />
                      Submit request
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* ---- Aside ---- */}
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
                  { icon: Clock, title: 'Confirmed in one hour', detail: 'Every request is answered by a person during clinic hours.' },
                  { icon: ShieldCheck, title: 'Direct billing', detail: 'We settle directly with all major Swiss and international insurers.' },
                  { icon: CalendarCheck, title: 'Free to reschedule', detail: 'Change or cancel up to 24 hours before with no charge.' },
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
                  or attend the Emergency Department directly.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}
