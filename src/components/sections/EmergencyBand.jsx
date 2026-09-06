import { Phone, TriangleAlert } from 'lucide-react'
import Container from '../ui/Container'
import { site } from '../../data/site'
import { emergencySigns } from '../../data/patients'

export default function EmergencyBand() {
  return (
    <section className="border-y border-clay-500/20 bg-clay-500/6">
      <Container size="wide">
        <div className="grid gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow flex items-center gap-2 text-clay-600">
              <TriangleAlert className="size-4" aria-hidden="true" />
              When not to wait
            </p>
            <h2 className="mt-5 font-display text-[1.8rem] leading-tight text-pine-900 sm:text-[2.2rem]">
              Some symptoms need an ambulance, not an appointment
            </h2>
            <a
              href={`tel:${site.emergencyPhone}`}
              className="mt-7 inline-flex h-13 items-center gap-3 bg-clay-500 px-7 text-[0.9375rem] font-medium tracking-wide text-ivory transition-colors hover:bg-clay-600"
            >
              <Phone className="size-[18px]" />
              Call {site.emergencyPhone} immediately
            </a>
          </div>

          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {emergencySigns.map((sign) => (
              <li key={sign} className="flex items-start gap-3 text-[0.9375rem] text-pine-900/75">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-clay-500" aria-hidden="true" />
                {sign}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
