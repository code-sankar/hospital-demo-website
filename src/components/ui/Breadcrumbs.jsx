import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items, inverted = false }) {
  const base = inverted ? 'text-ivory/60' : 'text-pine-900/55'
  const hover = inverted ? 'hover:text-ivory' : 'hover:text-pine-700'
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1.5 text-[0.75rem] tracking-wide ${base}`}>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3 opacity-50" aria-hidden="true" />}
            {item.to && i < items.length - 1 ? (
              <Link to={item.to} className={`transition-colors ${hover}`}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={inverted ? 'text-ivory/90' : 'text-pine-900/85'}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
