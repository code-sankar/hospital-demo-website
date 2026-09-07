import { Link } from 'react-router-dom'
import { Phone, CalendarCheck, Stethoscope } from 'lucide-react'
import { site } from '../../data/site'

/** Thumb-reachable actions on small screens — the three things patients want. */
export default function MobileActionBar() {
  const items = [
    { label: 'Call', icon: Phone, href: `tel:${site.phone}` },
    { label: 'Book', icon: CalendarCheck, to: '/appointment', primary: true },
    { label: 'Doctors', icon: Stethoscope, to: '/doctors' },
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-ivory/95 backdrop-blur-lg sm:hidden">
      <ul className="grid grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          const content = (
            <>
              <Icon className="size-5" />
              <span className="text-[0.6875rem] font-medium tracking-wide">{item.label}</span>
            </>
          )
          const cls = `flex h-16 flex-col items-center justify-center gap-1 ${
            item.primary ? 'bg-pine-700 text-ivory' : 'text-pine-800'
          }`
          return (
            <li key={item.label}>
              {item.to ? (
                <Link to={item.to} className={cls}>
                  {content}
                </Link>
              ) : (
                <a href={item.href} className={cls}>
                  {content}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
