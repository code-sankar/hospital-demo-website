import { Link, useParams, Navigate } from 'react-router-dom'
import {
  Star,
  Languages,
  GraduationCap,
  Award,
  Clock,
  CalendarCheck,
  ArrowRight,
  BriefcaseMedical,
} from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import SectionHeading from '../components/ui/SectionHeading'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import Portrait from '../components/art/Portrait'
import ArtPanel from '../components/art/ArtPanel'
import DoctorCard from '../components/sections/DoctorCard'
import CTABand from '../components/sections/CTABand'
import { useDoctor } from '../data/useDoctors'
import { staticDirectory } from '../data/doctorShape'
import { getDepartment } from '../data/departments'
import { formatMoney, WEEKDAYS_SHORT } from '../api/format'

export default function DoctorDetail() {
  const { slug } = useParams()
  const { doctor, live } = useDoctor(slug)

  if (!doctor) return <Navigate to="/doctors" replace />

  const dept = getDepartment(doctor.departmentSlug)
  const colleagues = staticDirectory.filter(
    (d) => d.departmentSlug === doctor.departmentSlug && d.slug !== doctor.slug,
  )

  return (
    <>
      {/* ---------------- Profile masthead ---------------- */}
      <section className="relative overflow-hidden bg-pine-900">
        <div className="absolute inset-0 opacity-35" aria-hidden="true">
          <ArtPanel variant={dept?.art ?? 'colonnade'} tone="deep" seed={doctor.portraitSeed} arch={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-pine-900 via-pine-900/95 to-pine-900/60" aria-hidden="true" />

        <Container size="wide" className="relative">
          <div className="grid gap-12 py-14 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16 lg:py-20">
            <div className="order-2 lg:order-1">
              <div className="relative mx-auto aspect-4/5 w-full max-w-xs">
                <div className="arch absolute inset-0 overflow-hidden shadow-lift">
                  <Portrait seed={doctor.portraitSeed} initials={doctor.initials} name={doctor.fullName} />
                </div>
                <div className="arch pointer-events-none absolute -inset-2.5 border border-brass-400/35" aria-hidden="true" />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Breadcrumbs
                inverted
                items={[
                  { label: 'Home', to: '/' },
                  { label: 'Find a Doctor', to: '/doctors' },
                  { label: doctor.fullName },
                ]}
              />

              <Link
                to={`/centres/${doctor.departmentSlug}`}
                className="eyebrow mt-8 inline-block text-brass-300 transition-colors hover:text-ivory"
              >
                {doctor.departmentName}
              </Link>

              <h1 className="mt-5 text-[2.3rem] leading-[1.06] text-ivory sm:text-[3rem]">{doctor.fullName}</h1>
              <p className="mt-3 text-[1.0625rem] text-pine-100/72">{doctor.title}</p>

              <ul className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.875rem] text-pine-100/70">
                <li className="flex items-center gap-2">
                  <Star className="size-4 fill-brass-400 text-brass-400" aria-hidden="true" />
                  <span className="font-medium text-ivory">{doctor.rating?.toFixed(1)}</span>
                  <span className="text-pine-100/45">({doctor.reviewCount} reviews)</span>
                </li>
                <li className="flex items-center gap-2">
                  <BriefcaseMedical className="size-4 text-brass-400" aria-hidden="true" />
                  {doctor.experienceYears} years in practice
                </li>
                <li className="flex items-center gap-2">
                  <Languages className="size-4 text-brass-400" aria-hidden="true" />
                  {doctor.languages.join(' · ')}
                </li>
              </ul>

              <ul className="mt-8 flex flex-wrap gap-2">
                {doctor.focus.map((f) => (
                  <li key={f} className="border border-ivory/20 px-3.5 py-1.5 text-[0.75rem] tracking-wide text-pine-100/80">
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/appointment"
                  className="group inline-flex h-13 items-center gap-3 bg-ivory px-7 text-[0.9375rem] font-medium tracking-wide text-pine-900 transition-colors hover:bg-brass-300"
                >
                  <CalendarCheck className="size-[18px]" />
                  Request an appointment
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                {!live ? (
                  <span className="inline-flex h-13 items-center gap-2.5 border border-ivory/20 px-6 text-[0.875rem] text-pine-100/60">
                    Availability loading…
                  </span>
                ) : doctor.isAccepting ? (
                  <span className="inline-flex h-13 items-center gap-2.5 border border-pine-300/30 px-6 text-[0.875rem] text-pine-100/80">
                    <span className="size-1.5 rounded-full bg-pine-300" aria-hidden="true" />
                    Accepting new patients
                  </span>
                ) : (
                  <span className="inline-flex h-13 items-center gap-2.5 border border-ivory/20 px-6 text-[0.875rem] text-pine-100/60">
                    Emergency rota — not bookable
                  </span>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- Biography + credentials ---------------- */}
      <section className="bg-ivory py-20 lg:py-24">
        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow="Biography" title="About the consultant" />
              <Reveal delay={0.08}>
                <p className="mt-8 text-[1.0625rem] leading-relaxed text-pine-900/72">{doctor.bio}</p>
              </Reveal>

              <Reveal delay={0.14} className="mt-12">
                <h3 className="eyebrow flex items-center gap-2.5 text-brass-600">
                  <GraduationCap className="size-4" aria-hidden="true" />
                  Qualifications & training
                </h3>
                <ul className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
                  {doctor.qualifications.map((e) => (
                    <li key={e} className="py-4 text-[0.9375rem] text-pine-900/75">
                      {e}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.2} className="mt-12">
                <h3 className="eyebrow flex items-center gap-2.5 text-brass-600">
                  <Award className="size-4" aria-hidden="true" />
                  Professional memberships
                </h3>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {doctor.memberships.map((m) => (
                    <li key={m} className="border border-stone-200 bg-parchment px-4 py-2 text-[0.8125rem] text-pine-900/70">
                      {m}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* ---- Sidebar ---- */}
            <Reveal delay={0.12}>
              <aside className="border border-stone-200 bg-parchment p-8 lg:sticky lg:top-32">
                <h2 className="eyebrow flex items-center gap-2.5 text-brass-600">
                  <Clock className="size-4" aria-hidden="true" />
                  Clinic times
                </h2>
                <ul className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
                  {(doctor.availability ?? []).length === 0 && (
                    <li className="py-3.5 text-[0.9375rem] text-pine-900/55">
                      {live ? 'No clinics published at the moment.' : 'Loading clinic times…'}
                    </li>
                  )}
                  {(doctor.availability ?? []).map((slot, i) => (
                    <li
                      key={`${slot.weekday}-${slot.starts_at}-${i}`}
                      className="flex items-center justify-between gap-4 py-3.5 text-[0.9375rem] text-pine-900/78"
                    >
                      <span>{WEEKDAYS_SHORT[slot.weekday]}</span>
                      <span>
                        {slot.starts_at} – {slot.ends_at}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-8 space-y-4 text-[0.875rem]">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-pine-900/55">Speciality</dt>
                    <dd className="text-right font-medium text-pine-900">{doctor.departmentName}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-pine-900/55">Consultation</dt>
                    <dd className="text-right font-medium text-pine-900">{doctor.slotMinutes} minutes</dd>
                  </div>
                  {doctor.consultationFeePaise != null && (
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-pine-900/55">Fee, payable in advance</dt>
                      <dd className="text-right font-medium text-pine-900">
                        {formatMoney(doctor.consultationFeePaise)}
                      </dd>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-pine-900/55">Video review</dt>
                    <dd className="text-right font-medium text-pine-900">Available for follow-up</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-pine-900/55">Insurance</dt>
                    <dd className="text-right font-medium text-pine-900">Cashless</dd>
                  </div>
                </dl>

                <Link
                  to="/appointment"
                  className="mt-8 flex h-13 w-full items-center justify-center gap-2.5 bg-pine-700 text-[0.9375rem] font-medium tracking-wide text-ivory transition-colors hover:bg-pine-600"
                >
                  <CalendarCheck className="size-[18px]" />
                  Book with {doctor.fullName.split(' ').slice(-1)[0]}
                </Link>

                <Link
                  to={`/centres/${doctor.departmentSlug}`}
                  className="mt-3 flex h-13 w-full items-center justify-center border border-pine-700/25 text-[0.9375rem] font-medium tracking-wide text-pine-800 transition-colors hover:border-pine-700"
                >
                  Visit {doctor.departmentName}
                </Link>
              </aside>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------- Colleagues ---------------- */}
      {colleagues.length > 0 && (
        <section className="border-t border-stone-200 bg-parchment py-20 lg:py-24">
          <Container size="wide">
            <SectionHeading eyebrow="Also in this centre" title={`Colleagues in ${doctor.departmentName}`} />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {colleagues.slice(0, 4).map((doc, i) => (
                <Reveal as="li" key={doc.slug} delay={i * 0.07}>
                  <DoctorCard doctor={doc} compact showAvailability={false} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CTABand
        eyebrow="Appointments"
        title={`Request a consultation with ${doctor.fullName}`}
        lead="Tell us your preferred day and whether you are self-paying or insured. We confirm within one working hour and send preparation instructions in advance."
      />
    </>
  )
}
