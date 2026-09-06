import { Link, useParams, Navigate } from 'react-router-dom'
import { DeptIcon } from '../lib/icons'
import { ArrowRight, CalendarCheck, Check } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Accordion from '../components/ui/Accordion'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import ArtPanel from '../components/art/ArtPanel'
import DoctorCard from '../components/sections/DoctorCard'
import CTABand from '../components/sections/CTABand'
import { getDepartment, departments } from '../data/departments'
import { doctorsByDepartment } from '../data/doctors'

export default function CentreDetail() {
  const { slug } = useParams()
  const dept = getDepartment(slug)

  if (!dept) return <Navigate to="/centres" replace />

  const team = doctorsByDepartment(dept.slug)
  const others = departments.filter((d) => d.slug !== dept.slug).slice(0, 4)

  const facts = [
    { label: 'Established', value: dept.established },
    { label: 'Consultants', value: dept.consultants },
    ...(dept.beds > 0 ? [{ label: 'Inpatient beds', value: dept.beds }] : []),
    { label: 'Annual volume', value: dept.procedures },
  ]

  return (
    <>
      {/* ---------------- Masthead ---------------- */}
      <section className="relative overflow-hidden bg-pine-900">
        <div className="absolute inset-0 opacity-45" aria-hidden="true">
          <ArtPanel variant={dept.art} tone="deep" seed={7} arch={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-pine-900 via-pine-900/94 to-pine-900/55" aria-hidden="true" />

        <Container size="wide" className="relative">
          <div className="grid gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
            <div>
              <Breadcrumbs
                inverted
                items={[
                  { label: 'Home', to: '/' },
                  { label: 'Centres of Excellence', to: '/centres' },
                  { label: dept.name },
                ]}
              />
              <div className="mt-8 flex items-center gap-4">
                <span className="flex size-14 items-center justify-center border border-ivory/25">
                  <DeptIcon name={dept.icon} className="size-6 text-brass-300" aria-hidden="true" />
                </span>
                <p className="eyebrow text-brass-300">Centre of Excellence</p>
              </div>

              <h1 className="mt-7 text-[2.4rem] leading-[1.06] text-ivory sm:text-[3.2rem] lg:text-[3.7rem]">
                {dept.name}
              </h1>
              <p className="mt-4 font-display text-[1.35rem] text-pine-100/70 italic">{dept.tagline}</p>
              <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-pine-100/70">{dept.summary}</p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/appointment"
                  className="group inline-flex h-13 items-center gap-3 bg-ivory px-7 text-[0.9375rem] font-medium tracking-wide text-pine-900 transition-colors hover:bg-brass-300"
                >
                  <CalendarCheck className="size-[18px]" />
                  Book in {dept.name}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href="#team"
                  className="inline-flex h-13 items-center gap-3 border border-ivory/25 px-7 text-[0.9375rem] font-medium tracking-wide text-ivory transition-colors hover:border-brass-300 hover:text-brass-300"
                >
                  Meet the team
                </a>
              </div>
            </div>

            <div className="lg:pl-8">
              <dl className="grid grid-cols-2 gap-px overflow-hidden border border-ivory/12 bg-ivory/12">
                {facts.map((f) => (
                  <div key={f.label} className="bg-pine-900 p-6">
                    <dt className="eyebrow text-pine-100/45">{f.label}</dt>
                    <dd className="mt-3 font-display text-[1.9rem] leading-none text-ivory">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- Overview + highlights ---------------- */}
      <section className="bg-ivory py-20 lg:py-24">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="Overview" title={`Inside the ${dept.name} institute`} />
              <Reveal delay={0.08}>
                <p className="mt-8 text-[1.0625rem] leading-relaxed text-pine-900/72">{dept.overview}</p>
              </Reveal>

              <Reveal delay={0.14} className="mt-10">
                <h3 className="eyebrow text-brass-600">What sets the centre apart</h3>
                <ul className="mt-6 space-y-4">
                  {dept.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3.5 text-[0.9375rem] text-pine-900/75">
                      <Check className="mt-1 size-4 shrink-0 text-pine-600" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={0.12}>
              <div className="relative aspect-4/5 w-full">
                <div className="arch absolute inset-0 overflow-hidden shadow-lift">
                  <ArtPanel variant={dept.art} tone="pine" seed={12} arch={false} label={`${dept.name} artwork`} />
                </div>
                <div className="arch pointer-events-none absolute -inset-3 border border-brass-500/30" aria-hidden="true" />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------- Treatments ---------------- */}
      <section className="border-y border-stone-200 bg-parchment py-20 lg:py-24">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <SectionHeading
              eyebrow="Treatments & services"
              title="What we treat"
              lead="If the condition you are looking for is not listed, call us — the list is representative rather than exhaustive."
            />

            <Reveal delay={0.1}>
              <ul className="grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2">
                {dept.treatments.map((t) => (
                  <li
                    key={t}
                    className="group flex items-center gap-3 bg-parchment px-6 py-5 text-[0.9375rem] text-pine-900/78 transition-colors hover:bg-ivory"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-brass-500" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------- Pathway ---------------- */}
      <section className="bg-ivory py-20 lg:py-24">
        <Container size="wide">
          <SectionHeading
            eyebrow="Your pathway"
            title="From first contact to long-term follow-up"
            align="center"
            className="text-center"
          />

          <ol className="mt-16 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 md:grid-cols-5">
            {dept.pathway.map((step, i) => (
              <Reveal as="li" key={step.step} delay={i * 0.06} className="bg-ivory p-7">
                <span className="font-display text-[2.4rem] leading-none text-stone-200">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-[1.2rem] leading-snug text-pine-900">{step.step}</h3>
                <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-pine-900/60">{step.detail}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------- Technology ---------------- */}
      <section className="relative overflow-hidden bg-pine-800 py-20 lg:py-24">
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <ArtPanel variant="lattice" tone="deep" seed={19} arch={false} grid={false} />
        </div>
        <Container size="wide" className="relative">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading inverted eyebrow="Technology" title="The equipment behind the pathway" />
            <Reveal delay={0.1}>
              <ul className="grid gap-px overflow-hidden border border-ivory/12 bg-ivory/12 sm:grid-cols-3">
                {dept.technology.map((tech) => (
                  <li key={tech.name} className="bg-pine-800 p-7">
                    <h3 className="font-display text-[1.3rem] leading-snug text-ivory">{tech.name}</h3>
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-pine-100/60">{tech.detail}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------- Team ---------------- */}
      {team.length > 0 && (
        <section id="team" className="scroll-mt-32 bg-ivory py-20 lg:py-24">
          <Container size="wide">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <SectionHeading
                eyebrow="The team"
                title={`Consultants in ${dept.name}`}
                lead="You may request a named consultant when you book. If you have no preference, we will match you to the sub-speciality that fits your referral."
              />
              <Reveal delay={0.1}>
                <Link
                  to="/doctors"
                  className="group inline-flex items-center gap-3 border-b border-pine-700/30 pb-2 text-[0.875rem] font-medium tracking-wide text-pine-800 transition-colors hover:border-pine-700"
                >
                  All consultants
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>

            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((doc, i) => (
                <Reveal as="li" key={doc.slug} delay={i * 0.07}>
                  <DoctorCard doctor={doc} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ---------------- FAQs ---------------- */}
      <section className="border-y border-stone-200 bg-parchment py-20 lg:py-24">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading
              eyebrow="Questions"
              title="What patients ask us most"
              lead="Cannot find your question? Our appointments desk will answer it directly — no triage queue."
            />
            <Reveal delay={0.1}>
              <Accordion items={dept.faqs} defaultOpen={0} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------- Related ---------------- */}
      <section className="bg-ivory py-20 lg:py-24">
        <Container size="wide">
          <SectionHeading eyebrow="Related" title="Other centres of excellence" />
          <ul className="mt-12 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((d, i) => (
              <Reveal as="li" key={d.slug} delay={i * 0.06}>
                <Link
                  to={`/centres/${d.slug}`}
                  className="group flex h-full flex-col bg-ivory p-7 transition-colors hover:bg-parchment"
                >
                  <DeptIcon name={d.icon} className="size-6 text-brass-500" aria-hidden="true" />
                  <h3 className="mt-5 font-display text-[1.3rem] leading-snug text-pine-900 transition-colors group-hover:text-pine-600">
                    {d.name}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[0.8125rem] leading-relaxed text-pine-900/58">{d.tagline}</p>
                  <ArrowRight className="mt-5 size-4 text-brass-500 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CTABand
        eyebrow={dept.name}
        title="Book with this centre"
        lead="Appointments are confirmed within one working hour. Tell us your preferred consultant and time, and we will do our best to match both."
      />
    </>
  )
}
