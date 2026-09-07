import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ChevronDown, Phone, CalendarCheck } from 'lucide-react'
import Logo from '../art/Logo'
import { navigation, site } from '../../data/site'

export default function MobileMenu({ open, onClose }) {
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 z-100 xl:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-pine-950/50 backdrop-blur-sm transition-opacity duration-400 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <Logo compact />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-10 items-center justify-center border border-stone-200 text-pine-800 transition-colors hover:border-pine-700"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-4">
          <ul className="divide-y divide-stone-200">
            {navigation.map((item) => (
              <li key={item.label} className="py-1">
                <div className="flex items-center justify-between">
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="flex-1 py-4 font-display text-2xl text-pine-900"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      aria-label={`Show ${item.label} links`}
                      aria-expanded={expanded === item.label}
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                      className="flex size-9 items-center justify-center text-pine-700"
                    >
                      <ChevronDown
                        className={`size-5 transition-transform duration-300 ${
                          expanded === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>
                {item.children && (
                  <div
                    className="grid transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ gridTemplateRows: expanded === item.label ? '1fr' : '0fr' }}
                  >
                    <ul className="overflow-hidden">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            to={child.href}
                            onClick={onClose}
                            className="block border-l border-stone-200 py-2.5 pl-4 text-[0.9375rem] text-pine-900/70 transition-colors hover:border-brass-500 hover:text-pine-700"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                      <li className="h-3" />
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-stone-200 bg-parchment px-6 py-6">
          <Link
            to="/appointment"
            onClick={onClose}
            className="flex h-13 w-full items-center justify-center gap-2.5 bg-pine-700 text-sm font-medium tracking-wide text-ivory"
          >
            <CalendarCheck className="size-4" />
            Book an appointment
          </Link>
          <a
            href={`tel:${site.emergencyPhone}`}
            className="mt-3 flex h-13 w-full items-center justify-center gap-2.5 border border-clay-500/40 text-sm font-medium tracking-wide text-clay-600"
          >
            <Phone className="size-4" />
            Emergency · {site.emergencyPhone}
          </a>
        </div>
      </div>
    </div>
  )
}
