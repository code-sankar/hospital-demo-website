import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, CircleCheck, ArrowRight, Car, TramFront, Accessibility } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import PageHeader from '../components/sections/PageHeader'
import { FieldGroup, Input, Select, Textarea } from '../components/ui/Field'
import ArtPanel from '../components/art/ArtPanel'
import EmergencyBand from '../components/sections/EmergencyBand'
import { site } from '../data/site'

const desks = [
  {
    title: 'Appointments',
    detail: 'Booking, rescheduling and clinic enquiries.',
    phone: site.phone,
    email: site.appointmentsEmail,
    hours: 'Mon – Fri 07:30 – 20:00 · Sat 08:00 – 14:00',
  },
  {
    title: 'International patients',
    detail: 'Estimates, visas, interpreters and transfers.',
    phone: site.phone,
    email: site.internationalEmail,
    hours: 'Mon – Fri 08:00 – 18:00 CET',
  },
  {
    title: 'General enquiries',
    detail: 'Everything else, including feedback and media.',
    phone: site.phone,
    email: site.email,
    hours: 'Mon – Fri 08:00 – 18:00',
  },
]

const gettingHere = [
  { icon: TramFront, title: 'By tram', detail: 'Lines 12 and 18 stop directly outside the main portico on Rue de la Charité.' },
  { icon: Car, title: 'By car', detail: '420 underground spaces. The first ninety minutes are free for patients and one companion.' },
  { icon: Accessibility, title: 'Step-free access', detail: 'Level entry at both entrances, with wheelchairs and assistance available on request.' },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: 'appointment', message: '' })
  const [error, setError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) || !form.message.trim()) {
      setError('Please add your name, a valid email address and a message.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Someone answers within three rings"
        lead="Our switchboard is staffed by people who know the hospital, not a menu tree. Tell them what you need and they will route you correctly the first time."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        variant="courtyard"
        seed={18}
      />

      {/* ---------------- Desks ---------------- */}
      <section className="bg-ivory py-16 lg:py-20">
        <Container size="wide">
          <ul className="grid gap-px overflow-hidden border border-stone-200 bg-stone-200 lg:grid-cols-3">
            {desks.map((desk, i) => (
              <Reveal as="li" key={desk.title} delay={i * 0.07} className="bg-ivory p-8 lg:p-9">
                <h2 className="font-display text-[1.5rem] leading-snug text-pine-900">{desk.title}</h2>
                <p className="mt-2.5 text-[0.875rem] text-pine-900/60">{desk.detail}</p>
                <ul className="mt-7 space-y-3.5 text-[0.9375rem]">
                  <li className="flex items-center gap-3">
                    <Phone className="size-4 shrink-0 text-brass-500" aria-hidden="true" />
                    <a href={`tel:${desk.phone}`} className="link-underline text-pine-900/80 hover:text-pine-700">
                      {desk.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="size-4 shrink-0 text-brass-500" aria-hidden="true" />
                    <a href={`mailto:${desk.email}`} className="link-underline break-all text-pine-900/80 hover:text-pine-700">
                      {desk.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-brass-500" aria-hidden="true" />
                    <span className="text-[0.8125rem] text-pine-900/60">{desk.hours}</span>
                  </li>
                </ul>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------- Form + map ---------------- */}
      <section className="border-y border-stone-200 bg-parchment py-20 lg:py-24">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* ---- Form ---- */}
            <div>
              <SectionHeading
                eyebrow="Send a message"
                title="Write to us and we will reply within one working day"
              />

              {sent ? (
                <Reveal className="mt-10 border border-pine-700/25 bg-ivory p-10">
                  <span className="flex size-12 items-center justify-center rounded-full bg-pine-700 text-ivory">
                    <CircleCheck className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-display text-[1.7rem] text-pine-900">Thank you, {form.name.split(' ')[0]}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-pine-900/65">
                    Your message is with the right desk. We reply to every enquiry within one working day — sooner
                    if it concerns an appointment already booked.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false)
                      setForm({ name: '', email: '', phone: '', topic: 'appointment', message: '' })
                    }}
                    className="mt-8 inline-flex h-12 items-center gap-2.5 border border-pine-700/25 px-6 text-[0.875rem] font-medium text-pine-800 transition-colors hover:border-pine-700"
                  >
                    Send another message
                  </button>
                  <p className="mt-8 border-t border-stone-200 pt-6 text-[0.75rem] text-pine-900/45">
                    This is a design demonstration — nothing has actually been sent, and no data left your browser.
                  </p>
                </Reveal>
              ) : (
                <form onSubmit={submit} className="mt-10 grid gap-7 sm:grid-cols-2">
                  <FieldGroup label="Your name" htmlFor="c-name" required>
                    <Input id="c-name" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
                  </FieldGroup>
                  <FieldGroup label="Email" htmlFor="c-email" required>
                    <Input id="c-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
                  </FieldGroup>
                  <FieldGroup label="Telephone" htmlFor="c-phone">
                    <Input id="c-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />
                  </FieldGroup>
                  <FieldGroup label="What is this about?" htmlFor="c-topic">
                    <Select id="c-topic" value={form.topic} onChange={(e) => set('topic', e.target.value)}>
                      <option value="appointment">An appointment</option>
                      <option value="results">Results or records</option>
                      <option value="billing">Billing or insurance</option>
                      <option value="international">International patient services</option>
                      <option value="referral">Referring a patient</option>
                      <option value="feedback">Feedback or a complaint</option>
                      <option value="other">Something else</option>
                    </Select>
                  </FieldGroup>
                  <div className="sm:col-span-2">
                    <FieldGroup label="Message" htmlFor="c-message" required hint="Please do not include clinical details you would not want in an email.">
                      <Textarea id="c-message" rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} />
                    </FieldGroup>
                  </div>

                  {error && <p className="text-[0.8125rem] text-clay-600 sm:col-span-2">{error}</p>}

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="group inline-flex h-13 items-center gap-3 bg-pine-700 px-8 text-[0.9375rem] font-medium tracking-wide text-ivory transition-colors hover:bg-pine-600"
                    >
                      Send message
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ---- Location ---- */}
            <Reveal delay={0.1}>
              <div className="border border-stone-200 bg-ivory">
                <div className="relative aspect-4/3 overflow-hidden border-b border-stone-200">
                  <ArtPanel variant="courtyard" tone="sage" seed={20} arch={false} label="Campus map illustration" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="relative flex size-16 items-center justify-center">
                      <span className="absolute inline-flex size-16 animate-pulse-ring rounded-full bg-pine-700/25" />
                      <span className="relative flex size-11 items-center justify-center rounded-full bg-pine-700 text-ivory shadow-lift">
                        <MapPin className="size-5" aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                  <span className="absolute bottom-4 left-4 bg-ivory/92 px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-pine-800 uppercase backdrop-blur-sm">
                    Vitalis campus
                  </span>
                </div>

                <div className="p-8">
                  <h3 className="eyebrow text-brass-600">Find us</h3>
                  <address className="mt-5 text-[1.0625rem] leading-relaxed text-pine-900/80 not-italic">
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                    <br />
                    {site.address.postcode} {site.address.city}
                    <br />
                    {site.address.country}
                  </address>

                  <ul className="mt-8 space-y-5 border-t border-stone-200 pt-8">
                    {gettingHere.map((g) => {
                      const Icon = g.icon
                      return (
                        <li key={g.title} className="flex items-start gap-4">
                          <Icon className="mt-0.5 size-5 shrink-0 text-brass-500" aria-hidden="true" />
                          <span>
                            <span className="block text-[0.9375rem] font-medium text-pine-900">{g.title}</span>
                            <span className="mt-1 block text-[0.8125rem] leading-relaxed text-pine-900/58">
                              {g.detail}
                            </span>
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  <ul className="mt-8 space-y-2.5 border-t border-stone-200 pt-8 text-[0.8125rem]">
                    {site.hours.map((h) => (
                      <li key={h.label} className="flex justify-between gap-4">
                        <span className="text-pine-900/55">{h.label}</span>
                        <span className="text-right font-medium text-pine-900">{h.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <EmergencyBand />
    </>
  )
}
