import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ArrowUpRight, ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import { Mark } from '../art/Logo'
import SocialIcon from '../ui/SocialIcons'
import { site } from '../../data/site'
import { departments } from '../../data/departments'

const columns = [
  {
    title: 'Centres of Excellence',
    links: departments.slice(0, 7).map((d) => ({ label: d.name, to: `/centres/${d.slug}` })),
  },
  {
    title: 'For patients',
    links: [
      { label: 'Book an appointment', to: '/appointment' },
      { label: 'Find a doctor', to: '/doctors' },
      { label: 'Planning your visit', to: '/patients#planning' },
      { label: 'Admissions & billing', to: '/patients#admissions' },
      { label: 'International patients', to: '/patients#international' },
      { label: 'Health packages', to: '/patients#packages' },
      { label: 'Frequently asked questions', to: '/patients#faq' },
    ],
  },
  {
    title: 'The centre',
    links: [
      { label: 'About Vitalis', to: '/about' },
      { label: 'Our leadership', to: '/about#leadership' },
      { label: 'Quality & outcomes', to: '/about#outcomes' },
      { label: 'Health insights', to: '/insights' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-pine-900 text-pine-100/70">
      <div className="pointer-events-none absolute inset-0 bg-hairline opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 -right-24 size-[30rem] rounded-full bg-brass-500/8 blur-3xl"
        aria-hidden="true"
      />

      <Container size="wide" className="relative">
        {/* Newsletter / referral strip */}
        <div className="grid gap-10 border-b border-ivory/10 py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-brass-300">Health Insights</p>
            <h2 className="mt-5 max-w-lg font-display text-3xl leading-tight text-ivory sm:text-[2.4rem]">
              Evidence you can use, written by the clinicians who practise it
            </h2>
          </div>
          <form
            className="flex flex-col justify-end"
            onSubmit={(e) => {
              e.preventDefault()
              e.currentTarget.reset()
            }}
          >
            <label htmlFor="footer-email" className="eyebrow text-pine-100/50">
              Monthly, never more
            </label>
            <div className="mt-4 flex items-center gap-3 border-b border-ivory/25 pb-3 transition-colors focus-within:border-brass-400">
              <Mail className="size-4 shrink-0 text-brass-300" aria-hidden="true" />
              <input
                id="footer-email"
                type="email"
                required
                placeholder="your.name@example.com"
                className="w-full bg-transparent text-[0.9375rem] text-ivory placeholder:text-pine-100/35 focus:outline-none"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center gap-2 text-[0.8125rem] font-medium tracking-wide text-brass-300 transition-colors hover:text-ivory"
              >
                Subscribe
                <ArrowRight className="size-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-pine-100/40">
              We never share your address. Unsubscribe in one click.
            </p>
          </form>
        </div>

        {/* Main columns */}
        <div className="grid gap-12 py-16 lg:grid-cols-[1.3fr_repeat(3,1fr)] lg:gap-10">
          <div>
            <Mark className="h-11 w-11" tone="#fbf8f3" accent="#c6a068" />
            <p className="mt-6 font-display text-2xl tracking-[0.16em] text-ivory uppercase">{site.name}</p>
            <p className="mt-1 text-[0.625rem] font-medium tracking-[0.28em] text-pine-100/45 uppercase">
              Medical Centre · Est. {site.established}
            </p>
            <p className="mt-6 max-w-xs text-[0.875rem] leading-relaxed text-pine-100/55">
              {site.description}
            </p>

            <ul className="mt-8 space-y-3 text-[0.875rem]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brass-400" aria-hidden="true" />
                <span>
                  {site.address.line1}
                  <br />
                  {site.address.postcode} {site.address.city}, {site.address.country}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-brass-400" aria-hidden="true" />
                <a href={`tel:${site.phone}`} className="link-underline hover:text-ivory">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-brass-400" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="link-underline hover:text-ivory">
                  {site.email}
                </a>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-3">
              {site.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex size-10 items-center justify-center border border-ivory/15 text-pine-100/60 transition-colors hover:border-brass-400 hover:text-brass-300"
                >
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="eyebrow text-brass-300">{col.title}</h3>
              <ul className="mt-6 space-y-3 text-[0.875rem]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="link-underline transition-colors hover:text-ivory">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Emergency band */}
        <div className="flex flex-col gap-6 border-t border-ivory/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="relative flex size-2.5" aria-hidden="true">
              <span className="absolute inline-flex size-2.5 animate-pulse-ring rounded-full bg-clay-400" />
              <span className="relative inline-flex size-2.5 rounded-full bg-clay-500" />
            </span>
            <p className="text-[0.875rem] text-pine-100/70">
              Emergency department open 24 hours ·{' '}
              <a href={`tel:${site.emergencyPhone}`} className="font-medium text-ivory">
                {site.emergencyPhone}
              </a>{' '}
              · Ambulance{' '}
              <a href={`tel:${site.ambulancePhone}`} className="font-medium text-ivory">
                {site.ambulancePhone}
              </a>
            </p>
          </div>
          <a
            href="#patient-portal"
            className="inline-flex items-center gap-2 border border-ivory/20 px-5 py-2.5 text-[0.8125rem] tracking-wide transition-colors hover:border-brass-400 hover:text-brass-300"
          >
            Patient portal
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4 border-t border-ivory/10 py-7 text-[0.75rem] text-pine-100/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {['Privacy notice', 'Cookie policy', 'Patients’ charter', 'Accessibility', 'Modern slavery statement'].map(
              (l) => (
                <li key={l}>
                  <a href="#legal" className="link-underline hover:text-pine-100/80">
                    {l}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        <p className="border-t border-ivory/10 py-6 text-[0.6875rem] leading-relaxed text-pine-100/30">
          This website is a design demonstration. Vitalis Medical Centre is a fictional institution, and all
          clinicians, outcomes and contact details shown here are illustrative. Nothing on this site is medical
          advice — if you are unwell, contact your own doctor or local emergency services.
        </p>
      </Container>
    </footer>
  )
}
