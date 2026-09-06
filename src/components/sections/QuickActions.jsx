import { Link } from 'react-router-dom'
import { CalendarCheck, Stethoscope, Ambulance, ClipboardList, ArrowUpRight } from 'lucide-react'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'

const actions = [
  {
    icon: CalendarCheck,
    title: 'Book an appointment',
    detail: 'Choose a consultant, a date and a time — confirmed within one working hour.',
    to: '/appointment',
  },
  {
    icon: Stethoscope,
    title: 'Find a doctor',
    detail: 'Search 268 consultants by speciality, language or the condition you need treated.',
    to: '/doctors',
  },
  {
    icon: ClipboardList,
    title: 'Health packages',
    detail: 'Preventive screening from CHF 190, reported the same day by a physician.',
    to: '/patients#packages',
  },
  {
    icon: Ambulance,
    title: 'Emergency care',
    detail: 'Open 24 hours. A consultant is physically present in the department at all times.',
    to: '/centres/emergency-critical-care',
    urgent: true,
  },
]

export default function QuickActions() {
  return (
    <section className="relative border-y border-stone-200 bg-parchment">
      <Container size="wide">
        <h2 className="sr-only">Quick actions</h2>
        <ul className="grid divide-stone-200 sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {actions.map((action, i) => {
            const Icon = action.icon
            return (
              <li key={action.title} className="border-b border-stone-200 last:border-b-0 sm:border-b-0">
                <Reveal delay={i * 0.06}>
                  <Link
                    to={action.to}
                    className="group flex h-full flex-col p-8 transition-colors duration-400 hover:bg-ivory lg:p-9"
                  >
                    <span
                      className={`flex size-12 items-center justify-center border transition-colors duration-400 ${
                        action.urgent
                          ? 'border-clay-500/30 text-clay-500 group-hover:bg-clay-500 group-hover:text-ivory'
                          : 'border-pine-700/20 text-pine-700 group-hover:bg-pine-700 group-hover:text-ivory'
                      }`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 font-display text-[1.35rem] leading-snug text-pine-900">
                      {action.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-[0.875rem] leading-relaxed text-pine-900/58">
                      {action.detail}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.14em] text-brass-600 uppercase">
                      Continue
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
