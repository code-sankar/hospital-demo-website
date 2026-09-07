import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import Container from '../components/ui/Container'
import ArtPanel from '../components/art/ArtPanel'
import { site } from '../data/site'

const suggestions = [
  { label: 'Book an appointment', to: '/appointment' },
  { label: 'Find a doctor', to: '/doctors' },
  { label: 'Centres of Excellence', to: '/centres' },
  { label: 'Patients & Visitors', to: '/patients' },
]

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-pine-900">
      <div className="absolute inset-0 opacity-40" aria-hidden="true">
        <ArtPanel variant="colonnade" tone="deep" seed={31} arch={false} />
      </div>

      <Container size="wide" className="relative">
        <div className="flex min-h-[70vh] flex-col justify-center py-24">
          <p className="eyebrow text-brass-300">Error 404</p>
          <p className="mt-8 font-display text-[6rem] leading-none text-ivory/12 sm:text-[9rem]">404</p>
          <h1 className="-mt-8 max-w-2xl text-[2.2rem] leading-tight text-ivory sm:text-[3rem]">
            This page seems to have been discharged
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-pine-100/70">
            The address you followed does not exist, or has moved since it was last linked. Here is where most
            people were heading.
          </p>

          <ul className="mt-10 flex flex-wrap gap-3">
            {suggestions.map((s) => (
              <li key={s.to}>
                <Link
                  to={s.to}
                  className="group inline-flex h-12 items-center gap-2.5 border border-ivory/25 px-6 text-[0.875rem] font-medium tracking-wide text-ivory transition-colors hover:border-brass-300 hover:text-brass-300"
                >
                  {s.label}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-ivory/12 pt-8">
            <Link
              to="/"
              className="inline-flex h-13 items-center gap-3 bg-ivory px-7 text-[0.9375rem] font-medium tracking-wide text-pine-900 transition-colors hover:bg-brass-300"
            >
              Return to the home page
            </Link>
            <a
              href={`tel:${site.phone}`}
              className="inline-flex items-center gap-2.5 text-[0.9375rem] text-pine-100/70 transition-colors hover:text-ivory"
            >
              <Phone className="size-4" />
              {site.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
