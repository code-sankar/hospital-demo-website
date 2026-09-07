import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import ArtPanel from '../art/ArtPanel'

export default function MegaMenu({ item, onNavigate }) {
  return (
    <div className="absolute inset-x-0 top-full z-40 border-t border-stone-200 bg-ivory shadow-lift">
      <Container size="wide">
        <div className="grid gap-10 py-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="eyebrow text-brass-600">{item.label}</p>
            <ul className="mt-6 grid gap-x-10 gap-y-1 sm:grid-cols-2">
              {item.children.map((child) => (
                <li key={child.label}>
                  <Link
                    to={child.href}
                    onClick={onNavigate}
                    className="group flex items-start justify-between gap-4 border-b border-stone-200/70 py-4 transition-colors hover:border-pine-700"
                  >
                    <span>
                      <span className="block font-display text-lg text-pine-900 transition-colors group-hover:text-pine-600">
                        {child.label}
                      </span>
                      {child.description && (
                        <span className="mt-0.5 block text-[0.8125rem] text-pine-900/55">
                          {child.description}
                        </span>
                      )}
                    </span>
                    <ArrowRight className="mt-1.5 size-4 shrink-0 -translate-x-1 text-brass-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative hidden overflow-hidden lg:block">
            <div className="absolute inset-0 arch overflow-hidden">
              <ArtPanel variant="atrium" tone="pine" seed={4} arch={false} />
            </div>
            <div className="relative flex h-full min-h-56 flex-col justify-end p-7">
              <p className="eyebrow text-brass-300">Around the clock</p>
              <p className="mt-3 font-display text-2xl text-ivory">
                Emergency care, every hour of every day
              </p>
              <Link
                to="/centres/emergency-critical-care"
                onClick={onNavigate}
                className="mt-4 inline-flex items-center gap-2 text-sm text-ivory/85 transition-colors hover:text-brass-300"
              >
                Emergency &amp; Critical Care
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
