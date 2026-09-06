import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import ArtPanel from '../art/ArtPanel'
import { site } from '../../data/site'

export default function CTABand({
  eyebrow = 'Next step',
  title = 'Speak to someone who can actually help',
  lead = 'Our appointments team answers within three rings, and confirms every booking within one working hour. If you are unsure which speciality you need, they will find out for you.',
  primary = { label: 'Book an appointment', to: '/appointment' },
  variant = 'courtyard',
}) {
  return (
    <section className="relative overflow-hidden bg-pine-900">
      <div className="absolute inset-0 opacity-40" aria-hidden="true">
        <ArtPanel variant={variant} tone="deep" seed={14} arch={false} />
      </div>
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-brass-500/8 blur-3xl"
        aria-hidden="true"
      />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-10 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <Reveal>
            <p className="eyebrow text-brass-300">{eyebrow}</p>
            <span aria-hidden="true" className="mt-5 block h-px w-12 bg-brass-300/60" />
            <h2 className="mt-6 max-w-2xl font-display text-[2.1rem] leading-tight text-ivory sm:text-[2.9rem]">
              {title}
            </h2>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-pine-100/70">{lead}</p>
          </Reveal>

          <Reveal delay={0.12} className="flex flex-col gap-4 lg:items-end">
            <Link
              to={primary.to}
              className="group inline-flex h-14 w-full items-center justify-center gap-3 bg-ivory px-8 text-[0.9375rem] font-medium tracking-wide text-pine-900 transition-colors hover:bg-brass-300 lg:w-auto"
            >
              {primary.label}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${site.phone}`}
              className="inline-flex h-14 w-full items-center justify-center gap-3 border border-ivory/25 px-8 text-[0.9375rem] font-medium tracking-wide text-ivory transition-colors hover:border-brass-300 hover:text-brass-300 lg:w-auto"
            >
              <Phone className="size-[18px]" />
              {site.phone}
            </a>
            <p className="text-[0.75rem] text-pine-100/45 lg:text-right">
              Mon – Sat 8:00 am – 8:00 pm · Sun 9:00 am – 1:00 pm
              <br />
              Emergency department open 24×7
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
