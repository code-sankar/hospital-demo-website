import { useState, useMemo } from 'react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import PageHeader from '../components/sections/PageHeader'
import ArticleCard from '../components/sections/ArticleCard'
import CTABand from '../components/sections/CTABand'
import { articles } from '../data/articles'

const categories = ['All', ...new Set(articles.map((a) => a.category))]

export default function Insights() {
  const [category, setCategory] = useState('All')

  const list = useMemo(
    () => (category === 'All' ? articles : articles.filter((a) => a.category === category)),
    [category],
  )

  const [lead, ...rest] = list

  return (
    <>
      <PageHeader
        eyebrow="Health Insights"
        title="Explanations our consultants find themselves repeating"
        lead="No sponsored content and no listicles — just the things worth understanding, written by the clinicians who treat them."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Health Insights' }]}
        variant="neuro"
        seed={15}
      />

      <section className="bg-ivory py-16 lg:py-20">
        <Container size="wide">
          <h2 className="sr-only">Articles</h2>
          <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-6">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`border px-5 py-2.5 text-[0.8125rem] font-medium tracking-wide transition-all duration-300 ${
                  category === c
                    ? 'border-pine-700 bg-pine-700 text-ivory'
                    : 'border-stone-200 text-pine-900/70 hover:border-pine-700/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {lead && (
            <Reveal className="mt-12">
              <ArticleCard article={lead} featured index={0} />
            </Reveal>
          )}

          {rest.length > 0 && (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a, i) => (
                <Reveal as="li" key={a.slug} delay={(i % 3) * 0.07}>
                  <ArticleCard article={a} index={i + 1} />
                </Reveal>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <CTABand
        eyebrow="Health Insights"
        title="Have a question we have not written about?"
        lead="Send it to our editorial desk. If our consultants find themselves answering it in clinic more than once a week, it usually becomes an article."
        primary={{ label: 'Get in touch', to: '/contact' }}
        variant="neuro"
      />
    </>
  )
}
