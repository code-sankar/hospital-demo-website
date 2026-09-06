import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import PageHeader from '../components/sections/PageHeader'
import DoctorCard from '../components/sections/DoctorCard'
import CTABand from '../components/sections/CTABand'
import { doctors } from '../data/doctors'
import { departments } from '../data/departments'

const allLanguages = [...new Set(doctors.flatMap((d) => d.languages))].sort()

export default function Doctors() {
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('all')
  const [language, setLanguage] = useState('all')
  const [acceptingOnly, setAcceptingOnly] = useState(false)
  const [sort, setSort] = useState('name')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = doctors.filter((d) => {
      if (dept !== 'all' && d.department !== dept) return false
      if (language !== 'all' && !d.languages.includes(language)) return false
      if (acceptingOnly && !d.accepting) return false
      if (!q) return true
      return [d.name, d.title, d.departmentName, ...d.focus].join(' ').toLowerCase().includes(q)
    })

    return [...list].sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'experience') return b.experience - a.experience
      return a.name.localeCompare(b.name)
    })
  }, [query, dept, language, acceptingOnly, sort])

  const activeFilters = (dept !== 'all' ? 1 : 0) + (language !== 'all' ? 1 : 0) + (acceptingOnly ? 1 : 0)

  const reset = () => {
    setQuery('')
    setDept('all')
    setLanguage('all')
    setAcceptingOnly(false)
    setSort('name')
  }

  return (
    <>
      <PageHeader
        eyebrow="Find a doctor"
        title="Choose your consultant, rather than be allocated one"
        lead="Search by name, speciality, condition or the language you would rather be treated in. Every profile lists qualifications, sub-speciality interests and clinic times."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Find a Doctor' }]}
        variant="lattice"
        seed={8}
      />

      <section className="bg-ivory py-14 lg:py-20">
        <Container size="wide">
          {/* ---- Filter bar ---- */}
          <h2 className="sr-only">Search and filter consultants</h2>
          <div className="border border-stone-200 bg-parchment p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
              <div>
                <label htmlFor="doc-search" className="eyebrow text-pine-900/50">
                  Search
                </label>
                <div className="mt-3 flex items-center gap-3 border-b border-stone-300 pb-2.5 transition-colors focus-within:border-pine-700">
                  <Search className="size-4 shrink-0 text-pine-700/60" aria-hidden="true" />
                  <input
                    id="doc-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Name, speciality or condition"
                    className="w-full bg-transparent text-[0.9375rem] text-pine-900 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="doc-dept" className="eyebrow text-pine-900/50">
                  Speciality
                </label>
                <select
                  id="doc-dept"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="mt-3 w-full appearance-none border-b border-stone-300 bg-transparent pb-2.5 text-[0.9375rem] text-pine-900 focus:border-pine-700 focus:outline-none"
                >
                  <option value="all">All specialities</option>
                  {departments.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="doc-lang" className="eyebrow text-pine-900/50">
                  Language
                </label>
                <select
                  id="doc-lang"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-3 w-full appearance-none border-b border-stone-300 bg-transparent pb-2.5 text-[0.9375rem] text-pine-900 focus:border-pine-700 focus:outline-none"
                >
                  <option value="all">Any language</option>
                  {allLanguages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="doc-sort" className="eyebrow text-pine-900/50">
                  Sort by
                </label>
                <select
                  id="doc-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="mt-3 w-full appearance-none border-b border-stone-300 bg-transparent pb-2.5 text-[0.9375rem] text-pine-900 focus:border-pine-700 focus:outline-none lg:w-40"
                >
                  <option value="name">Name (A–Z)</option>
                  <option value="rating">Patient rating</option>
                  <option value="experience">Years in practice</option>
                </select>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-6">
              <label className="flex cursor-pointer items-center gap-3 text-[0.875rem] text-pine-900/75">
                <input
                  type="checkbox"
                  checked={acceptingOnly}
                  onChange={(e) => setAcceptingOnly(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  className={`flex size-5 items-center justify-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-brass-500 ${
                    acceptingOnly ? 'border-pine-700 bg-pine-700' : 'border-stone-300 bg-ivory'
                  }`}
                >
                  {acceptingOnly && (
                    <svg viewBox="0 0 12 12" className="size-3 text-ivory" aria-hidden="true">
                      <path d="m2 6 3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                Only consultants accepting new patients
              </label>

              <div className="flex items-center gap-5">
                {activeFilters > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 text-[0.8125rem] text-pine-900/60 transition-colors hover:text-clay-600"
                  >
                    <X className="size-3.5" />
                    Clear {activeFilters} filter{activeFilters > 1 ? 's' : ''}
                  </button>
                )}
                <p className="flex items-center gap-2 text-[0.8125rem] text-pine-900/55">
                  <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                  <span className="font-medium text-pine-900">{results.length}</span> consultant
                  {results.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </div>

          {/* ---- Results ---- */}
          {results.length > 0 ? (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((doc, i) => (
                <Reveal as="li" key={doc.slug} delay={(i % 4) * 0.05}>
                  <DoctorCard doctor={doc} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="mt-16 border border-stone-200 bg-parchment p-14 text-center">
              <p className="font-display text-2xl text-pine-900">No consultant matches those filters</p>
              <p className="mx-auto mt-3 max-w-md text-[0.9375rem] text-pine-900/60">
                Widen your search, or call the appointments desk — many consultants hold slots that are not
                published online.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-7 inline-flex h-12 items-center border border-pine-700/25 px-7 text-sm font-medium text-pine-800 transition-colors hover:bg-pine-700 hover:text-ivory"
              >
                Reset all filters
              </button>
            </div>
          )}

          <p className="mt-14 border-t border-stone-200 pt-8 text-[0.8125rem] leading-relaxed text-pine-900/50">
            This directory shows a representative selection of our 312 consultants. Registrars, DNB trainees and
            allied health professionals are listed inside each centre of excellence.
          </p>
        </Container>
      </section>

      <CTABand
        eyebrow="Cannot decide?"
        title="Describe the problem — we will suggest the consultant"
        lead="Our appointments team knows which consultant runs which sub-speciality clinic, and which of them has a cancellation this week."
      />
    </>
  )
}
