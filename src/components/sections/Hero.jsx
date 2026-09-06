import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, CalendarCheck, Phone, ShieldCheck, Clock3, Award } from 'lucide-react'
import Container from '../ui/Container'
import ArtPanel from '../art/ArtPanel'
import { site } from '../../data/site'

const fade = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] },
  }),
}

const proof = [
  { icon: ShieldCheck, label: 'JCI accredited', sub: 'Academic medical centre' },
  { icon: Clock3, label: 'Seen in 5 days', sub: 'Median outpatient wait' },
  { icon: Award, label: '96.4% would recommend', sub: '4,812 verified responses' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory">
      {/* faint architectural wash behind the whole hero */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.055]" aria-hidden="true">
        <ArtPanel variant="lattice" tone="parchment" seed={2} arch={false} grid={false} />
      </div>

      <Container size="wide" className="relative">
        <div className="grid items-center gap-14 py-16 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16 lg:py-24">
          {/* ---- Copy ---- */}
          <div>
            <motion.div initial="hidden" animate="show" custom={0} variants={fade}>
              <span className="inline-flex items-center gap-3 border border-stone-200 bg-ivory/70 px-4 py-2 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-brass-500" aria-hidden="true" />
                <span className="eyebrow text-pine-900/60">
                  Est. {site.established} · {site.address.city}
                  <span className="hidden sm:inline"> · {site.claim}</span>
                </span>
              </span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              custom={1}
              variants={fade}
              className="mt-8 text-[2.75rem] leading-[1.02] text-pine-900 sm:text-[3.6rem] lg:text-[4.4rem]"
            >
              Precision medicine,
              <br />
              <span className="italic text-pine-600">practised with care</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fade}
              className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-pine-900/68"
            >
              Thirteen specialist institutes, a 24-hour emergency department and an academic research faculty —
              gathered on one campus so that your care is coordinated by people who already know your name.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={3}
              variants={fade}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/appointment"
                className="group inline-flex h-14 items-center gap-3 bg-pine-700 px-8 text-[0.9375rem] font-medium tracking-wide text-ivory transition-all duration-300 hover:bg-pine-600 hover:shadow-[0_16px_40px_-16px_rgba(14,59,56,0.7)]"
              >
                <CalendarCheck className="size-[18px]" />
                Book an appointment
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href={`tel:${site.emergencyPhone}`}
                className="inline-flex h-14 items-center gap-3 border border-pine-700/25 px-8 text-[0.9375rem] font-medium tracking-wide text-pine-800 transition-all duration-300 hover:border-clay-500 hover:text-clay-600"
              >
                <Phone className="size-[18px]" />
                Emergency · {site.emergencyPhone}
              </a>
            </motion.div>

            <motion.ul
              initial="hidden"
              animate="show"
              custom={4}
              variants={fade}
              className="mt-12 grid gap-6 border-t border-stone-200 pt-8 sm:grid-cols-3"
            >
              {proof.map((p) => {
                const Icon = p.icon
                return (
                  <li key={p.label} className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-[18px] shrink-0 text-brass-500" aria-hidden="true" />
                    <span>
                      <span className="block text-[0.875rem] font-medium text-pine-900">{p.label}</span>
                      <span className="block text-[0.75rem] text-pine-900/50">{p.sub}</span>
                    </span>
                  </li>
                )
              })}
            </motion.ul>
          </div>

          {/* ---- Artwork ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-lg">
              <div className="arch absolute inset-0 overflow-hidden shadow-lift">
                <ArtPanel variant="atrium" tone="deep" seed={9} arch={false} label="The Vitalis atrium" />
              </div>

              {/* brass hairline frame, offset like a mounted print */}
              <div
                className="arch pointer-events-none absolute -inset-3 border border-brass-500/35"
                aria-hidden="true"
              />

              {/* floating credential card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-6 -left-4 w-60 border border-stone-200 bg-ivory p-5 shadow-card sm:-left-10"
              >
                <p className="eyebrow text-brass-600">Emergency department</p>
                <p className="mt-3 font-display text-[2.5rem] leading-none text-pine-900">21 min</p>
                <p className="mt-2 text-[0.75rem] leading-snug text-pine-900/55">
                  Median time from arrival to first clinical assessment
                </p>
              </motion.div>

              {/* floating consultants pill */}
              <motion.div
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -top-4 -right-2 hidden items-center gap-3 border border-stone-200 bg-ivory px-5 py-3 shadow-card sm:flex"
              >
                <span className="relative flex size-2" aria-hidden="true">
                  <span className="absolute inline-flex size-2 animate-pulse-ring rounded-full bg-pine-400" />
                  <span className="relative inline-flex size-2 rounded-full bg-pine-600" />
                </span>
                <span className="text-[0.8125rem] text-pine-900/75">
                  <span className="font-medium text-pine-900">268 consultants</span> on campus
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
