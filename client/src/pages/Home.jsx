import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, HeartHandshake, Microscope, Timer } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import ArtPanel from '../components/art/ArtPanel'
import Hero from '../components/sections/Hero'
import QuickActions from '../components/sections/QuickActions'
import Accreditations from '../components/sections/Accreditations'
import StatBand from '../components/sections/StatBand'
import Testimonials from '../components/sections/Testimonials'
import CTABand from '../components/sections/CTABand'
import EmergencyBand from '../components/sections/EmergencyBand'
import DepartmentCard from '../components/sections/DepartmentCard'
import DoctorCard from '../components/sections/DoctorCard'
import ArticleCard from '../components/sections/ArticleCard'
import { departments } from '../data/departments'
import { staticDirectory } from '../data/doctorShape'
import { articles } from '../data/articles'
import { site } from '../data/site'

const differentiators = [
  {
    icon: HeartHandshake,
    title: 'One named clinician',
    detail:
      'A single consultant owns your case from first contact to discharge. You should never have to explain your history twice.',
  },
  {
    icon: Timer,
    title: 'Thirty-minute first visits',
    detail:
      'Nobody should decide about their own body in the four minutes left at the end of an overbooked clinic. We schedule the time properly.',
  },
  {
    icon: Microscope,
    title: 'Diagnostics in one morning',
    detail:
      'Bloods, imaging and physiology completed in a single visit, reported the same day rather than across three appointments.',
  },
  {
    icon: Sparkles,
    title: 'No surprises on the bill',
    detail:
      'A written package estimate before every planned procedure, and a call before anything varies from it. Financial clarity is part of care.',
  },
]

const pathway = [
  { n: '01', title: 'Get in touch', detail: 'Book online, on WhatsApp or by telephone. Confirmed within one working hour.' },
  { n: '02', title: 'One diagnostic visit', detail: 'Imaging, bloods and physiology completed together — not spread across three appointments.' },
  { n: '03', title: 'A plan you understand', detail: 'Your consultant explains the options and the costs in your own language, then writes it down for you.' },
  { n: '04', title: 'Treatment & recovery', detail: 'A named nurse, a scheduled review and a rehabilitation programme that starts on day one.' },
]

export default function Home() {
  const featured = articles.find((a) => a.featured) ?? articles[0]
  const secondary = articles.filter((a) => a.slug !== featured.slug).slice(0, 2)

  return (
    <>
      <Hero />
      <QuickActions />
      <Accreditations />

      {/* ---------------- Centres of excellence ---------------- */}
      <section className="bg-ivory py-20 lg:py-28">
        <Container size="wide">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Centres of Excellence"
              title="Thirteen institutes, a single standard of care"
              lead="Each centre runs its own consultants, theatres and clinics — and every one of them sits on the same campus, so a complex case never means a complex journey."
            />
            <Reveal delay={0.1}>
              <Link
                to="/centres"
                className="group inline-flex items-center gap-3 border-b border-pine-700/30 pb-2 text-[0.875rem] font-medium tracking-wide text-pine-800 transition-colors hover:border-pine-700"
              >
                View all specialities
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.slice(0, 6).map((d, i) => (
              <Reveal as="li" key={d.slug} delay={(i % 3) * 0.08}>
                <DepartmentCard department={d} index={i} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------- Why this hospital ---------------- */}
      <section className="border-y border-stone-200 bg-parchment py-20 lg:py-28">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <Reveal className="relative">
              <div className="relative mx-auto aspect-4/5 w-full max-w-md lg:sticky lg:top-32">
                <div className="arch absolute inset-0 overflow-hidden shadow-lift">
                  <ArtPanel variant="courtyard" tone="pine" seed={5} arch={false} label={`The ${site.name} courtyard`} />
                </div>
                <div className="arch pointer-events-none absolute -inset-3 border border-brass-500/30" aria-hidden="true" />
                <div className="absolute right-4 -bottom-8 border border-stone-200 bg-ivory px-6 py-5 shadow-card">
                  <p className="font-display text-[2.4rem] leading-none text-pine-900">{site.established}</p>
                  <p className="mt-1.5 text-[0.75rem] tracking-wide text-pine-900/55">
                    Caring for Bengaluru since
                  </p>
                </div>
              </div>
            </Reveal>

            <div>
              <SectionHeading
                eyebrow={`Why ${site.name}`}
                title="A hospital organised around the patient, not the rota"
                lead="Most of what frustrates people about healthcare is logistical rather than clinical. We rebuilt the logistics."
              />

              <ul className="mt-12 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2">
                {differentiators.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <Reveal as="li" key={item.title} delay={i * 0.07} className="bg-parchment p-7 lg:p-8">
                      <Icon className="size-6 text-brass-500" aria-hidden="true" />
                      <h3 className="mt-5 font-display text-[1.3rem] leading-snug text-pine-900">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-[0.875rem] leading-relaxed text-pine-900/62">{item.detail}</p>
                    </Reveal>
                  )
                })}
              </ul>

              <Reveal delay={0.2} className="mt-10">
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-3 border-b border-pine-700/30 pb-2 text-[0.875rem] font-medium tracking-wide text-pine-800 transition-colors hover:border-pine-700"
                >
                  Our story and our standards
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <StatBand />

      {/* ---------------- Pathway ---------------- */}
      <section className="bg-ivory py-20 lg:py-28">
        <Container size="wide">
          <SectionHeading
            eyebrow="How care works here"
            title="Four steps, and someone with you at each of them"
            lead="The pathway is the same whether you arrive by ambulance at three in the morning or book a routine review online."
            align="center"
            className="text-center"
          />

          <ol className="mt-16 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 lg:grid-cols-4">
            {pathway.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 0.08} className="group relative bg-ivory p-8 lg:p-9">
                <span className="font-display text-[3rem] leading-none text-stone-200 transition-colors duration-500 group-hover:text-brass-300">
                  {step.n}
                </span>
                <h3 className="mt-5 font-display text-[1.4rem] leading-snug text-pine-900">{step.title}</h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-pine-900/62">{step.detail}</p>
                {i < pathway.length - 1 && (
                  <ArrowRight
                    className="absolute top-10 -right-2.5 hidden size-5 bg-ivory text-brass-500 lg:block"
                    aria-hidden="true"
                  />
                )}
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------- Consultants ---------------- */}
      <section className="border-y border-stone-200 bg-parchment py-20 lg:py-28">
        <Container size="wide">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Our consultants"
              title="Doctors you can look up before you meet them"
              lead="Every consultant's training, sub-speciality interests, languages and clinic times are published — so you can choose rather than be allocated."
            />
            <Reveal delay={0.1}>
              <Link
                to="/doctors"
                className="group inline-flex items-center gap-3 border-b border-pine-700/30 pb-2 text-[0.875rem] font-medium tracking-wide text-pine-800 transition-colors hover:border-pine-700"
              >
                Browse all 312 consultants
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {staticDirectory.slice(0, 4).map((doc, i) => (
              <Reveal as="li" key={doc.slug} delay={i * 0.07}>
                <DoctorCard doctor={doc} showAvailability={false} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------- Technology ---------------- */}
      <section className="relative overflow-hidden bg-pine-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-35" aria-hidden="true">
          <ArtPanel variant="imaging" tone="deep" seed={17} arch={false} />
        </div>
        <Container size="wide" className="relative">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <SectionHeading
              inverted
              eyebrow="Technology & facilities"
              title="Equipment matters — but only because of what it lets us avoid"
              lead="Every machine on this list exists to make a diagnosis earlier, an operation smaller, or a hospital stay shorter."
            />

            <Reveal delay={0.1}>
              <ul className="divide-y divide-ivory/12 border-y border-ivory/12">
                {[
                  { name: 'Intra-operative MRI', detail: 'Confirms a tumour is fully removed before the patient leaves theatre.' },
                  { name: 'Surgical robotics', detail: 'Implants positioned within one degree of plan; smaller incisions, faster recovery.' },
                  { name: 'Hybrid cath lab', detail: 'Catheter and open surgery in one room, without moving the patient.' },
                  { name: 'Digital PET-CT', detail: 'Lower tracer dose with higher lesion detectability for staging.' },
                  { name: 'Wide-bore 3T MRI', detail: 'A larger aperture, so claustrophobia stops being a barrier to diagnosis.' },
                  { name: 'In-house genomic sequencing', detail: 'A 523-gene panel reported in ten days, guiding precision therapy.' },
                ].map((tech) => (
                  <li key={tech.name} className="group flex items-start gap-6 py-6">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brass-400" aria-hidden="true" />
                    <div>
                      <h3 className="font-display text-[1.35rem] text-ivory">{tech.name}</h3>
                      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-pine-100/60">{tech.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      <Testimonials />

      {/* ---------------- Insights ---------------- */}
      <section className="bg-ivory py-20 lg:py-28">
        <Container size="wide">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Health Insights"
              title="Written by the clinicians who practise it"
              lead="No sponsored content, no listicles. Just the explanations our consultants find themselves repeating in clinic."
            />
            <Reveal delay={0.1}>
              <Link
                to="/insights"
                className="group inline-flex items-center gap-3 border-b border-pine-700/30 pb-2 text-[0.875rem] font-medium tracking-wide text-pine-800 transition-colors hover:border-pine-700"
              >
                All articles
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal className="lg:row-span-2">
              <ArticleCard article={featured} featured index={0} />
            </Reveal>
            {secondary.map((a, i) => (
              <Reveal key={a.slug} delay={0.08 * (i + 1)}>
                <ArticleCard article={a} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <EmergencyBand />
      <CTABand />
    </>
  )
}
