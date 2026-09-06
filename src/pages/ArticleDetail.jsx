import { Link, useParams, Navigate } from 'react-router-dom'
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import ArtPanel from '../components/art/ArtPanel'
import Portrait from '../components/art/Portrait'
import ArticleCard from '../components/sections/ArticleCard'
import CTABand from '../components/sections/CTABand'
import { getArticle, articles } from '../data/articles'
import { getDoctor } from '../data/doctors'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

export default function ArticleDetail() {
  const { slug } = useParams()
  const article = getArticle(slug)

  if (!article) return <Navigate to="/insights" replace />

  const author = getDoctor(article.authorSlug)
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3)

  return (
    <>
      {/* ---------------- Masthead ---------------- */}
      <section className="relative overflow-hidden bg-pine-900">
        <div className="absolute inset-0 opacity-35" aria-hidden="true">
          <ArtPanel variant={article.art} tone="deep" seed={16} arch={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-pine-900 via-pine-900/90 to-pine-900/70" aria-hidden="true" />

        <Container size="narrow" className="relative">
          <div className="py-16 lg:py-20">
            <Breadcrumbs
              inverted
              items={[
                { label: 'Home', to: '/' },
                { label: 'Health Insights', to: '/insights' },
                { label: article.category },
              ]}
            />

            <div className="mt-8 flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
              <span className="text-brass-300">{article.category}</span>
              <span className="h-3 w-px bg-ivory/25" aria-hidden="true" />
              <span className="flex items-center gap-1.5 text-pine-100/55">
                <Clock className="size-3" aria-hidden="true" />
                {article.readingTime} min read
              </span>
            </div>

            <h1 className="mt-6 text-[2.2rem] leading-[1.08] text-ivory sm:text-[3rem]">{article.title}</h1>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-pine-100/70">{article.excerpt}</p>

            <div className="mt-10 flex items-center gap-4 border-t border-ivory/12 pt-8">
              {author && (
                <Link
                  to={`/doctors/${author.slug}`}
                  aria-label={`Read the profile of ${author.name}`}
                  className="size-14 shrink-0 overflow-hidden rounded-full ring-1 ring-brass-400/40"
                >
                  <Portrait seed={author.seed} showMonogram={false} name={author.name} />
                </Link>
              )}
              <div>
                {author ? (
                  <Link to={`/doctors/${author.slug}`} className="font-medium text-ivory hover:text-brass-300">
                    {article.author}
                  </Link>
                ) : (
                  <span className="font-medium text-ivory">{article.author}</span>
                )}
                <p className="text-[0.8125rem] text-pine-100/50">
                  {author?.title ?? 'Consultant'} · {formatDate(article.date)}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- Body ---------------- */}
      <section className="bg-ivory py-16 lg:py-24">
        <Container size="tight">
          {/* One reveal for the whole body: animating each paragraph as the reader
              reaches it makes long-form text feel unsettled. */}
          <Reveal as="article" className="max-w-none">
            {article.body.map((block, i) => {
              if (block.type === 'h') {
                return (
                  <h2 key={i} className="mt-14 mb-5 font-display text-[1.9rem] leading-snug text-pine-900">
                    {block.text}
                  </h2>
                )
              }
              if (block.type === 'quote') {
                return (
                  <blockquote key={i} className="my-12 border-l-2 border-brass-500 py-2 pl-8">
                    <p className="font-display text-[1.6rem] leading-snug text-pine-900 italic sm:text-[1.85rem]">
                      {block.text}
                    </p>
                  </blockquote>
                )
              }
              if (block.type === 'list') {
                return (
                  <ul key={i} className="my-8 space-y-4 border-y border-stone-200 py-8">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-4 text-[1.0625rem] leading-relaxed text-pine-900/78"
                      >
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brass-500" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              }
              return (
                <p key={i} className="mt-6 text-[1.0625rem] leading-[1.8] text-pine-900/78">
                  {block.text}
                </p>
              )
            })}
          </Reveal>

          <div className="mt-16 border-t border-stone-200 pt-8">
            <p className="text-[0.8125rem] leading-relaxed text-pine-900/50">
              This article is general information, not personal medical advice. If something here applies to you,
              discuss it with your own clinician before changing anything about your treatment.
            </p>
          </div>

          {author && (
            <Reveal className="mt-12 flex flex-col gap-6 border border-stone-200 bg-parchment p-8 sm:flex-row sm:items-center">
              <Link
                to={`/doctors/${author.slug}`}
                aria-label={`Read the profile of ${author.name}`}
                className="size-24 shrink-0 overflow-hidden rounded-full"
              >
                <Portrait seed={author.seed} showMonogram={false} name={author.name} />
              </Link>
              <div>
                <p className="eyebrow text-brass-600">About the author</p>
                <Link
                  to={`/doctors/${author.slug}`}
                  className="mt-3 block font-display text-[1.5rem] text-pine-900 hover:text-pine-600"
                >
                  {author.name}
                </Link>
                <p className="mt-1 text-[0.875rem] text-pine-900/60">{author.title}</p>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-pine-900/68">{author.bio}</p>
              </div>
            </Reveal>
          )}

          <div className="mt-12">
            <Link
              to="/insights"
              className="group inline-flex items-center gap-3 text-[0.875rem] font-medium tracking-wide text-pine-800"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              All Health Insights
            </Link>
          </div>
        </Container>
      </section>

      {/* ---------------- Related ---------------- */}
      <section className="border-t border-stone-200 bg-parchment py-20 lg:py-24">
        <Container size="wide">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="font-display text-[2rem] leading-tight text-pine-900 sm:text-[2.4rem]">Keep reading</h2>
            <Link
              to="/insights"
              className="group inline-flex items-center gap-3 border-b border-pine-700/30 pb-2 text-[0.875rem] font-medium text-pine-800 transition-colors hover:border-pine-700"
            >
              All articles
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a, i) => (
              <Reveal as="li" key={a.slug} delay={i * 0.07}>
                <ArticleCard article={a} index={i} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CTABand />
    </>
  )
}
