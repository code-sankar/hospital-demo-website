import { ArrowUpRight, HeartHandshake, GraduationCap, Scale, Baby } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import PageHeader from '../components/sections/PageHeader'
import CTABand from '../components/sections/CTABand'
import ArtPanel from '../components/art/ArtPanel'
import { careers } from '../data/about'
import { site } from '../data/site'

const benefits = [
  { icon: GraduationCap, title: 'Protected teaching time', detail: 'Four hours a week, timetabled and defended — not the first thing cancelled when the ward is busy.' },
  { icon: Scale, title: 'Rotas published 12 weeks ahead', detail: 'You should be able to plan a life around this job, including the on-call weekends.' },
  { icon: Baby, title: 'Genuine flexible working', detail: 'Part-time consultant posts, phased returns after maternity leave, and an on-site crèche from six months.' },
  { icon: HeartHandshake, title: 'Staff wellbeing that is real', detail: 'Confidential psychological support, a rest facility on every floor, and post-incident debriefs as standard.' },
]

export default function Careers() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Work somewhere the rota is published twelve weeks ahead"
        lead="Ninety-one per cent of our clinical staff are still here a year later. In a sector where nursing attrition routinely runs past a third, that figure is the thing we are proudest of — and it is not an accident."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Careers' }]}
        variant="colonnade"
        seed={22}
      />

      <section className="bg-ivory py-20 lg:py-24">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Why work here"
                title="We fixed the things that make people leave"
                lead="Most clinicians do not resign over pay. They resign over rotas, over cancelled teaching, and over never being able to plan a weekend."
              />

              <ul className="mt-12 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2">
                {benefits.map((b, i) => {
                  const Icon = b.icon
                  return (
                    <Reveal as="li" key={b.title} delay={i * 0.07} className="bg-ivory p-7 lg:p-8">
                      <Icon className="size-6 text-brass-500" aria-hidden="true" />
                      <h3 className="mt-5 font-display text-[1.3rem] leading-snug text-pine-900">{b.title}</h3>
                      <p className="mt-2.5 text-[0.875rem] leading-relaxed text-pine-900/62">{b.detail}</p>
                    </Reveal>
                  )
                })}
              </ul>
            </div>

            <Reveal delay={0.12}>
              <div className="relative aspect-4/5 w-full lg:sticky lg:top-32">
                <div className="arch absolute inset-0 overflow-hidden shadow-lift">
                  <ArtPanel variant="atrium" tone="pine" seed={26} arch={false} label={`${site.name} staff areas`} />
                </div>
                <div className="arch pointer-events-none absolute -inset-3 border border-brass-500/30" aria-hidden="true" />
                <div className="absolute -bottom-8 left-4 border border-stone-200 bg-ivory px-6 py-5 shadow-card">
                  <p className="font-display text-[2.4rem] leading-none text-pine-900">91%</p>
                  <p className="mt-1.5 text-[0.75rem] tracking-wide text-pine-900/55">
                    Clinical staff retention, rolling year
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-stone-200 bg-parchment py-20 lg:py-24">
        <Container size="wide">
          <SectionHeading
            eyebrow="Open positions"
            title="Current vacancies"
            lead="We recruit continuously for nursing and allied health. Speculative applications from consultants are always read."
          />

          <ul className="mt-14 divide-y divide-stone-200 border-y border-stone-200">
            {careers.map((job, i) => (
              <Reveal as="li" key={job.role} delay={i * 0.05}>
                <a
                  href="#apply"
                  className="group grid gap-3 py-7 transition-colors hover:bg-ivory/60 lg:grid-cols-[1.6fr_1fr_1fr_auto] lg:items-center lg:gap-8 lg:px-4"
                >
                  <h3 className="font-display text-[1.45rem] leading-snug text-pine-900 transition-colors group-hover:text-pine-600">
                    {job.role}
                  </h3>
                  <p className="text-[0.875rem] text-pine-900/60">{job.dept}</p>
                  <p className="text-[0.875rem] text-pine-900/60">
                    {job.type} · {job.location}
                  </p>
                  <span className="flex size-10 items-center justify-center border border-stone-300 text-pine-700 transition-all duration-300 group-hover:border-pine-700 group-hover:bg-pine-700 group-hover:text-ivory">
                    <ArrowUpRight className="size-4" />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>

          <p className="mt-10 text-[0.8125rem] leading-relaxed text-pine-900/50">
            {site.name} is an equal-opportunity employer. We welcome applications regardless of caste, religion,
            gender or background, and we guarantee an interview to any applicant with a disability who meets the
            essential criteria.
          </p>
        </Container>
      </section>

      <CTABand
        eyebrow="Applications"
        title="Send us your CV, even if nothing above fits"
        lead="Speculative applications are read by the relevant clinical director, not filtered by an algorithm. If there is a role coming, we will tell you."
        primary={{ label: 'Contact recruitment', to: '/contact' }}
      />
    </>
  )
}
