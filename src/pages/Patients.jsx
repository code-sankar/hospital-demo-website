import { Link } from 'react-router-dom'
import { Check, ArrowRight, Plane, CreditCard, Clock, FileText } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Accordion from '../components/ui/Accordion'
import PageHeader from '../components/sections/PageHeader'
import ArtPanel from '../components/art/ArtPanel'
import CTABand from '../components/sections/CTABand'
import EmergencyBand from '../components/sections/EmergencyBand'
import {
  visitPlanning,
  visitingHours,
  insurers,
  packages,
  internationalServices,
  faqs,
} from '../data/patients'
import { site } from '../data/site'

const jump = [
  { label: 'Planning your visit', href: '#planning' },
  { label: 'Visiting hours', href: '#visiting' },
  { label: 'Admissions & billing', href: '#admissions' },
  { label: 'Health packages', href: '#packages' },
  { label: 'International patients', href: '#international' },
  { label: 'Questions', href: '#faq' },
]

export default function Patients() {
  return (
    <>
      <PageHeader
        eyebrow="Patients & Visitors"
        title="Everything you need before you walk through the door"
        lead="Directions, admission paperwork, insurance, visiting hours and the answers to the questions our reception desk is asked most often."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Patients & Visitors' }]}
        variant="atrium"
        seed={13}
      />

      {/* ---- Jump links ---- */}
      <nav aria-label="On this page" className="sticky top-18 z-30 lg:top-28 border-b border-stone-200 bg-ivory/92 backdrop-blur-lg">
        <Container size="wide">
          <ul className="scrollbar-none flex gap-1 overflow-x-auto py-3">
            {jump.map((j) => (
              <li key={j.href}>
                <a
                  href={j.href}
                  className="inline-block whitespace-nowrap px-4 py-2 text-[0.8125rem] font-medium tracking-wide text-pine-900/65 transition-colors hover:bg-parchment hover:text-pine-700"
                >
                  {j.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {/* ---------------- Planning ---------------- */}
      <section id="planning" className="scroll-mt-36 bg-ivory py-20 lg:py-24">
        <Container size="wide">
          <SectionHeading
            eyebrow="Planning your visit"
            title="Arrive prepared, and the appointment starts on time"
            lead="Registration takes about five minutes when you have what we need — and considerably longer when you do not."
          />

          <div className="mt-14 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 lg:grid-cols-3">
            {visitPlanning.map((block, i) => (
              <Reveal key={block.title} delay={i * 0.08} className="bg-ivory p-8 lg:p-9">
                <h3 className="font-display text-[1.5rem] leading-snug text-pine-900">{block.title}</h3>
                <ul className="mt-6 space-y-3.5">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.875rem] leading-relaxed text-pine-900/70">
                      <Check className="mt-1 size-3.5 shrink-0 text-pine-600" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- Visiting hours ---------------- */}
      <section id="visiting" className="scroll-mt-36 border-y border-stone-200 bg-parchment py-20 lg:py-24">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <SectionHeading
              eyebrow="Visiting"
              title="Who can visit, and when"
              lead="Parents of children and partners of maternity patients are never treated as visitors. Everyone else, we ask to respect the rest periods."
            />

            <Reveal delay={0.1}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-stone-300">
                      <th scope="col" className="eyebrow pb-4 text-pine-900/50">Ward</th>
                      <th scope="col" className="eyebrow pb-4 text-pine-900/50">Hours</th>
                      <th scope="col" className="eyebrow pb-4 text-pine-900/50">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {visitingHours.map((row) => (
                      <tr key={row.ward}>
                        <th scope="row" className="py-5 pr-6 font-display text-[1.15rem] font-normal text-pine-900">
                          {row.ward}
                        </th>
                        <td className="py-5 pr-6 text-[0.9375rem] text-pine-900/75">{row.hours}</td>
                        <td className="py-5 text-[0.8125rem] text-pine-900/55">{row.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------- Admissions & billing ---------------- */}
      <section id="admissions" className="scroll-mt-36 bg-ivory py-20 lg:py-24">
        <Container size="wide">
          <SectionHeading
            eyebrow="Admissions & billing"
            title="No invoice should ever be a surprise"
            lead="For any planned procedure we issue a fixed-price estimate covering surgeon, anaesthetist, theatre, implant and expected length of stay — valid for ninety days."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: FileText,
                title: 'Written estimates',
                detail:
                  'A single itemised figure before you commit, not a range. We notify you in advance of any variation, and explain why.',
              },
              {
                icon: CreditCard,
                title: 'Direct billing',
                detail:
                  'We settle directly with all major Swiss insurers and most international policies, so you are not left reclaiming.',
              },
              {
                icon: Clock,
                title: 'Admission in 20 minutes',
                detail:
                  'Pre-registration online the day before means the paperwork is done when you arrive on the ward.',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={i * 0.08} className="border border-stone-200 bg-ivory p-8">
                  <Icon className="size-6 text-brass-500" aria-hidden="true" />
                  <h3 className="mt-5 font-display text-[1.4rem] leading-snug text-pine-900">{item.title}</h3>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-pine-900/62">{item.detail}</p>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={0.2} className="mt-14 border border-stone-200 bg-parchment p-8 lg:p-10">
            <h3 className="eyebrow text-brass-600">Insurers we bill directly</h3>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {insurers.map((ins) => (
                <li key={ins} className="border border-stone-200 bg-ivory px-4 py-2 text-[0.875rem] text-pine-900/75">
                  {ins}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.8125rem] text-pine-900/55">
              Not listed? We still provide itemised invoices formatted for reimbursement in most countries. Ask our
              billing office on {site.phone}.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ---------------- Health packages ---------------- */}
      <section id="packages" className="scroll-mt-36 border-y border-stone-200 bg-parchment py-20 lg:py-24">
        <Container size="wide">
          <SectionHeading
            eyebrow="Preventive health"
            title="Screening packages, reported the same day"
            lead="Every package finishes with a physician consultation — a set of numbers without an interpretation is not a health check."
            align="center"
            className="text-center"
          />

          <ul className="mt-16 grid gap-6 lg:grid-cols-3">
            {packages.map((pkg, i) => {
              const feature = pkg.tone === 'feature'
              return (
                <Reveal
                  as="li"
                  key={pkg.name}
                  delay={i * 0.08}
                  className={`flex flex-col border p-8 lg:p-9 ${
                    feature ? 'border-pine-700 bg-pine-900 text-ivory shadow-lift' : 'border-stone-200 bg-ivory'
                  }`}
                >
                  {feature && (
                    <span className="eyebrow mb-5 inline-block w-fit border border-brass-400/40 px-3 py-1 text-brass-300">
                      Most requested
                    </span>
                  )}
                  <h3 className={`font-display text-[1.6rem] leading-snug ${feature ? 'text-ivory' : 'text-pine-900'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`mt-3 text-[0.875rem] leading-relaxed ${feature ? 'text-pine-100/65' : 'text-pine-900/60'}`}>
                    {pkg.description}
                  </p>

                  <div className={`mt-7 flex items-end gap-3 border-t pt-7 ${feature ? 'border-ivory/15' : 'border-stone-200'}`}>
                    <span className={`font-display text-[2.6rem] leading-none ${feature ? 'text-ivory' : 'text-pine-900'}`}>
                      {pkg.price}
                    </span>
                    <span className={`pb-1 text-[0.8125rem] ${feature ? 'text-pine-100/50' : 'text-pine-900/50'}`}>
                      · {pkg.duration}
                    </span>
                  </div>

                  <ul className="mt-7 flex-1 space-y-3">
                    {pkg.includes.map((inc) => (
                      <li
                        key={inc}
                        className={`flex items-start gap-3 text-[0.875rem] leading-relaxed ${
                          feature ? 'text-pine-100/78' : 'text-pine-900/70'
                        }`}
                      >
                        <Check className={`mt-1 size-3.5 shrink-0 ${feature ? 'text-brass-400' : 'text-pine-600'}`} aria-hidden="true" />
                        {inc}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/appointment"
                    className={`mt-9 flex h-13 items-center justify-center gap-2.5 text-[0.9375rem] font-medium tracking-wide transition-colors ${
                      feature
                        ? 'bg-ivory text-pine-900 hover:bg-brass-300'
                        : 'border border-pine-700/25 text-pine-800 hover:bg-pine-700 hover:text-ivory'
                    }`}
                  >
                    Book this package
                    <ArrowRight className="size-4" />
                  </Link>
                </Reveal>
              )
            })}
          </ul>
        </Container>
      </section>

      {/* ---------------- International ---------------- */}
      <section id="international" className="relative scroll-mt-36 overflow-hidden bg-pine-900 py-20 lg:py-24">
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <ArtPanel variant="lattice" tone="deep" seed={23} arch={false} grid={false} />
        </div>
        <Container size="wide" className="relative">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <SectionHeading
                inverted
                eyebrow="International patients"
                title="Travelling for treatment should be the easy part"
                lead={`A dedicated international desk handles visas, estimates, interpreters, transfers and accommodation — one contact, in ${site.languages.length} languages.`}
              />
              <Reveal delay={0.15} className="mt-10">
                <a
                  href={`mailto:${site.internationalEmail}`}
                  className="group inline-flex h-13 items-center gap-3 bg-ivory px-7 text-[0.9375rem] font-medium tracking-wide text-pine-900 transition-colors hover:bg-brass-300"
                >
                  <Plane className="size-[18px]" />
                  {site.internationalEmail}
                </a>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <ul className="grid gap-px overflow-hidden border border-ivory/12 bg-ivory/12 sm:grid-cols-2">
                {internationalServices.map((s) => (
                  <li key={s.title} className="bg-pine-900 p-7">
                    <h3 className="font-display text-[1.25rem] leading-snug text-ivory">{s.title}</h3>
                    <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-pine-100/60">{s.detail}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------- FAQs ---------------- */}
      <section id="faq" className="scroll-mt-36 bg-ivory py-20 lg:py-24">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading
              eyebrow="Frequently asked"
              title="The questions our reception desk hears most"
              lead="If yours is not here, the appointments team will answer it directly — there is no triage queue for a simple question."
            />
            <Reveal delay={0.1}>
              <Accordion items={faqs} defaultOpen={0} />
            </Reveal>
          </div>
        </Container>
      </section>

      <EmergencyBand />
      <CTABand />
    </>
  )
}
