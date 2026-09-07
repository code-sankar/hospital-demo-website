import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import PageHeader from '../components/sections/PageHeader'
import DepartmentCard from '../components/sections/DepartmentCard'
import CTABand from '../components/sections/CTABand'
import EmergencyBand from '../components/sections/EmergencyBand'
import { departments } from '../data/departments'

export default function Centres() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return departments
    return departments.filter((d) =>
      [d.name, d.tagline, d.summary, ...d.treatments].join(' ').toLowerCase().includes(q),
    )
  }, [query])

  return (
    <>
      <PageHeader
        eyebrow="Centres of Excellence"
        title="Thirteen institutes, one campus, one record"
        lead="Each centre runs its own consultants, theatres and clinics. Because they share a site and a single patient record, a case that touches three specialities still feels like one appointment."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Centres of Excellence' }]}
        variant="colonnade"
        seed={3}
      />

      <section className="bg-ivory py-16 lg:py-20">
        <Container size="wide">
          <h2 className="sr-only">Browse the centres of excellence</h2>
          <div className="flex flex-col gap-6 border-b border-stone-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative w-full max-w-md">
              <label htmlFor="centre-search" className="eyebrow text-pine-900/50">
                Search by speciality or treatment
              </label>
              <div className="mt-3 flex items-center gap-3 border-b border-stone-300 pb-3 transition-colors focus-within:border-pine-700">
                <Search className="size-4 shrink-0 text-pine-700/60" aria-hidden="true" />
                <input
                  id="centre-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. angioplasty, epilepsy, hip replacement"
                  className="w-full bg-transparent text-[0.9375rem] text-pine-900 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-[0.8125rem] text-pine-900/50">
              Showing <span className="font-medium text-pine-900">{results.length}</span> of{' '}
              {departments.length} centres
            </p>
          </div>

          {results.length > 0 ? (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((d, i) => (
                <Reveal as="li" key={d.slug} delay={(i % 3) * 0.06}>
                  <DepartmentCard department={d} index={departments.indexOf(d)} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="mt-16 border border-stone-200 bg-parchment p-14 text-center">
              <p className="font-display text-2xl text-pine-900">No centre matches “{query}”</p>
              <p className="mx-auto mt-3 max-w-md text-[0.9375rem] text-pine-900/60">
                Try a broader term, or call our appointments team on the number below — they will find the right
                speciality for you.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-7 inline-flex h-12 items-center border border-pine-700/25 px-7 text-sm font-medium text-pine-800 transition-colors hover:bg-pine-700 hover:text-ivory"
              >
                Clear search
              </button>
            </div>
          )}
        </Container>
      </section>

      <EmergencyBand />
      <CTABand
        eyebrow="Not sure where to start?"
        title="Tell us the symptom — we will find the speciality"
        lead="Our appointments team triages more than four hundred enquiries a week. Describe what is wrong in plain language and they will route you to the right consultant."
      />
    </>
  )
}
