import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { DeptIcon } from '../../lib/icons'
import ArtPanel from '../art/ArtPanel'

export default function DepartmentCard({ department, index = 0 }) {
  return (
    <Link
      to={`/centres/${department.slug}`}
      className="group relative flex h-full flex-col overflow-hidden border border-stone-200 bg-ivory transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-pine-700/25 hover:shadow-lift"
    >
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
          <ArtPanel
            variant={department.art}
            tone={index % 3 === 0 ? 'pine' : index % 3 === 1 ? 'deep' : 'sage'}
            seed={index + 3}
            arch={false}
            label={`${department.name} illustration`}
          />
        </div>
        <div className="absolute top-4 left-4 flex size-11 items-center justify-center border border-ivory/25 bg-pine-900/35 backdrop-blur-sm">
          <DeptIcon name={department.icon} className="size-5 text-ivory" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="eyebrow text-brass-600">{String(index + 1).padStart(2, '0')}</p>
        <h3 className="mt-3 font-display text-[1.55rem] leading-snug text-pine-900 transition-colors group-hover:text-pine-600">
          {department.name}
        </h3>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-pine-900/62">{department.summary}</p>

        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5">
          <span className="text-[0.75rem] tracking-wide text-pine-900/50">
            {department.consultants} consultants
            {department.beds > 0 && ` · ${department.beds} beds`}
          </span>
          <span className="flex size-9 items-center justify-center border border-stone-200 text-pine-700 transition-all duration-300 group-hover:border-pine-700 group-hover:bg-pine-700 group-hover:text-ivory">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
