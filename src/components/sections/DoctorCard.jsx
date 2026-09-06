import { Link } from 'react-router-dom'
import { Star, Languages, ArrowUpRight } from 'lucide-react'
import Portrait from '../art/Portrait'

export default function DoctorCard({ doctor, compact = false }) {
  return (
    <Link
      to={`/doctors/${doctor.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-stone-200 bg-ivory transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-pine-700/25 hover:shadow-lift"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-parchment">
        <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
          <Portrait seed={doctor.seed} initials={doctor.initials} name={doctor.name} />
        </div>
        {doctor.accepting && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-ivory/92 px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.12em] text-pine-700 uppercase backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-pine-500" aria-hidden="true" />
            Accepting patients
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow text-brass-600">{doctor.departmentName}</p>
        <h3 className="mt-3 font-display text-[1.4rem] leading-snug text-pine-900 transition-colors group-hover:text-pine-600">
          {doctor.name}
        </h3>
        <p className="mt-1.5 text-[0.8125rem] leading-snug text-pine-900/58">{doctor.title}</p>

        {!compact && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {doctor.focus.slice(0, 2).map((f) => (
              <li
                key={f}
                className="border border-stone-200 px-2.5 py-1 text-[0.6875rem] tracking-wide text-pine-900/60"
              >
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-200 pt-5 text-[0.75rem] text-pine-900/55">
          <span className="flex items-center gap-1.5">
            <Star className="size-3.5 fill-brass-500 text-brass-500" aria-hidden="true" />
            {doctor.rating.toFixed(1)}
            <span className="text-pine-900/35">({doctor.reviews})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Languages className="size-3.5" aria-hidden="true" />
            {doctor.languages.length} languages
          </span>
          <ArrowUpRight className="size-4 shrink-0 -translate-x-1 text-brass-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  )
}
