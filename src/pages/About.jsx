import { Link } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import PageHeader from '../components/sections/PageHeader'
import ArtPanel from '../components/art/ArtPanel'
import Portrait from '../components/art/Portrait'
import Accreditations from '../components/sections/Accreditations'
import StatBand from '../components/sections/StatBand'
import CTABand from '../components/sections/CTABand'
import { milestones, values, leadership, outcomes } from '../data/about'
import { site } from '../data/site'

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Vitalis"
        title="A hundred years of the same argument: that care should be personal"
        lead={`Founded in ${site.established} as an eleven-bed clinic on Rue de la Charité, Vitalis is now a thirteen-institute academic medical centre — still on the same street, still built around the idea that a patient should be known by name.`}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        variant="colonnade"
        seed={11}
      />

      {/* ---------------- Founding statement ---------------- */}
      <section className="bg-ivory py-20 lg:py-28">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="Our purpose" title="Medicine is technical. Care is not." />
              <Reveal delay={0.08} className="mt-8 space-y-6 text-[1.0625rem] leading-relaxed text-pine-900/72">
                <p>
                  Almost everything that frustrates people about hospitals is organisational rather than clinical.
                  Appointments that do not talk to each other. Results that arrive by post a fortnight after the
                  anxiety began. A different face at every visit, and a history retold from scratch each time.
                </p>
                <p>
                  Vitalis was rebuilt around those failures rather than around departments. One named clinician
                  owns each case. Diagnostics happen in a single morning. Results reach you and your consultant at
                  the same moment. None of this is technically difficult — it is simply a choice about how a
                  hospital is arranged.
                </p>
                <p>
                  We publish our clinical outcomes every year, including the ones we are not proud of, because a
                  hospital that only reports its successes is asking to be trusted rather than earning it.
                </p>
              </Reveal>

              <Reveal delay={0.16} className="mt-12">
                <figure className="border-l-2 border-brass-500 pl-8">
                  <Quote className="size-7 text-brass-500/40" aria-hidden="true" />
                  <blockquote className="mt-4 font-display text-[1.6rem] leading-snug text-pine-900 italic sm:text-[1.9rem]">
                    “A hospital is not a building full of equipment. It is a promise that somebody will be paying
                    attention.”
                  </blockquote>
                  <figcaption className="mt-5 text-[0.875rem] text-pine-900/55">
                    Dr Marguerite Vitalis, founder — from her opening address, 1924
                  </figcaption>
                </figure>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="relative aspect-4/5 w-full lg:sticky lg:top-32">
                <div className="arch absolute inset-0 overflow-hidden shadow-lift">
                  <ArtPanel variant="atrium" tone="pine" seed={21} arch={false} label="The Vitalis building" />
                </div>
                <div className="arch pointer-events-none absolute -inset-3 border border-brass-500/30" aria-hidden="true" />
                <div className="absolute -bottom-8 left-4 border border-stone-200 bg-ivory px-6 py-5 shadow-card">
                  <p className="eyebrow text-brass-600">Rue de la Charité</p>
                  <p className="mt-2.5 font-display text-[1.9rem] leading-none text-pine-900">Since 1924</p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------- Values ---------------- */}
      <section className="border-y border-stone-200 bg-parchment py-20 lg:py-28">
        <Container size="wide">
          <SectionHeading
            eyebrow="What we hold to"
            title="Four commitments we are willing to be measured against"
            align="center"
            className="text-center"
          />

          <ul className="mt-16 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.07} className="bg-parchment p-8 lg:p-9">
                <span className="font-display text-[2.6rem] leading-none text-brass-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-display text-[1.4rem] leading-snug text-pine-900">{v.title}</h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-pine-900/62">{v.detail}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------- Timeline ---------------- */}
      <section className="relative overflow-hidden bg-pine-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-25" aria-hidden="true">
          <ArtPanel variant="colonnade" tone="deep" seed={4} arch={false} />
        </div>
        <Container size="wide" className="relative">
          <SectionHeading inverted eyebrow="Our history" title="A century, in seven moments" />

          <ol className="mt-16 space-y-0">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.year} delay={i * 0.05}>
                <div className="group grid gap-4 border-t border-ivory/12 py-8 transition-colors hover:bg-ivory/4 lg:grid-cols-[10rem_1fr_1.3fr] lg:gap-10 lg:py-10">
                  <span className="font-display text-[2.4rem] leading-none text-brass-400 lg:text-[3rem]">
                    {m.year}
                  </span>
                  <h3 className="font-display text-[1.5rem] leading-snug text-ivory lg:pt-2">{m.title}</h3>
                  <p className="text-[0.9375rem] leading-relaxed text-pine-100/62 lg:pt-3">{m.detail}</p>
                </div>
              </Reveal>
            ))}
            <li className="border-t border-ivory/12" />
          </ol>
        </Container>
      </section>

      <StatBand />

      {/* ---------------- Leadership ---------------- */}
      <section id="leadership" className="scroll-mt-32 bg-ivory py-20 lg:py-28">
        <Container size="wide">
          <SectionHeading
            eyebrow="Leadership"
            title="The people accountable for all of it"
            lead="Our executive team is clinically led — every member still holds a practising role, because a hospital run entirely from an office drifts."
          />

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((person, i) => (
              <Reveal as="li" key={person.name} delay={i * 0.07}>
                <div className="group border border-stone-200 bg-ivory transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                  <div className="aspect-4/5 overflow-hidden bg-parchment">
                    <Portrait seed={person.seed} initials={person.initials} name={person.name} />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-[1.35rem] leading-snug text-pine-900">{person.name}</h3>
                    <p className="mt-1.5 text-[0.8125rem] font-medium tracking-wide text-brass-600">
                      {person.role}
                    </p>
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-pine-900/58">{person.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------- Outcomes ---------------- */}
      <section id="outcomes" className="scroll-mt-32 border-y border-stone-200 bg-parchment py-20 lg:py-28">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <SectionHeading
              eyebrow="Quality & outcomes"
              title="Published every year, flattering or not"
              lead="These figures come from our annual quality report, audited externally and available in full on request."
            >
              <Reveal delay={0.15}>
                <Link
                  to="/contact"
                  className="group mt-8 inline-flex items-center gap-3 border-b border-pine-700/30 pb-2 text-[0.875rem] font-medium tracking-wide text-pine-800 transition-colors hover:border-pine-700"
                >
                  Request the full quality report
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </SectionHeading>

            <Reveal delay={0.1}>
              <dl className="grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2">
                {outcomes.map((o) => (
                  <div key={o.label} className="bg-parchment p-7">
                    <dd className="font-display text-[2.6rem] leading-none text-pine-900">{o.value}</dd>
                    <dt className="mt-4 text-[0.9375rem] font-medium text-pine-900/85">{o.label}</dt>
                    <p className="mt-1.5 text-[0.75rem] text-pine-900/45">{o.note}</p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Container>
      </section>

      <Accreditations />

      <CTABand
        eyebrow="Visit us"
        title="Come and see the place before you need it"
        lead="We run guided tours of the campus for prospective patients and referring practices every Thursday afternoon. No obligation, and no sales pitch."
        primary={{ label: 'Arrange a visit', to: '/contact' }}
      />
    </>
  )
}
