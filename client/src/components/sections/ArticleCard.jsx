import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import ArtPanel from '../art/ArtPanel'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

export default function ArticleCard({ article, featured = false, index = 0 }) {
  return (
    <Link
      to={`/insights/${article.slug}`}
      className={`group flex h-full overflow-hidden border border-stone-200 bg-ivory transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-pine-700/25 hover:shadow-lift ${
        featured ? 'flex-col lg:flex-row' : 'flex-col'
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-56 lg:h-auto lg:w-1/2' : 'h-44'}`}>
        <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
          <ArtPanel
            variant={article.art}
            tone={index % 2 === 0 ? 'deep' : 'pine'}
            seed={index + 11}
            arch={false}
            label={`${article.title} illustration`}
          />
        </div>
      </div>

      <div className={`flex flex-1 flex-col p-7 ${featured ? 'lg:p-10' : ''}`}>
        <div className="flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
          <span className="text-brass-600">{article.category}</span>
          <span className="h-3 w-px bg-stone-300" aria-hidden="true" />
          <span className="flex items-center gap-1.5 text-pine-900/45">
            <Clock className="size-3" aria-hidden="true" />
            {article.readingTime} min
          </span>
        </div>

        <h3
          className={`mt-4 font-display leading-snug text-pine-900 transition-colors group-hover:text-pine-600 ${
            featured ? 'text-[1.8rem] sm:text-[2.1rem]' : 'text-[1.4rem]'
          }`}
        >
          {article.title}
        </h3>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-pine-900/62">{article.excerpt}</p>

        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5 text-[0.75rem] text-pine-900/50">
          <span>
            {article.author} · {formatDate(article.date)}
          </span>
          <ArrowRight className="size-4 shrink-0 -translate-x-1 text-brass-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  )
}
