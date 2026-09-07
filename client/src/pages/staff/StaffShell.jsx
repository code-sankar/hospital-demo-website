import { Link, NavLink } from 'react-router-dom'
import { LogOut, Stethoscope, ConciergeBell } from 'lucide-react'
import Container from '../../components/ui/Container'
import { Mark } from '../../components/art/Logo'
import { useStaffAuth } from '../../auth/StaffAuth'
import { site } from '../../data/site'

/**
 * Chrome for the two internal consoles. Deliberately flatter and denser than
 * the public site: this is a tool people use all day, not a page they read.
 */
export default function StaffShell({ title, subtitle, children, actions }) {
  const { user, signOut } = useStaffAuth()

  const tabs =
    user?.role === 'admin'
      ? [
          { to: '/staff/doctor', label: 'Consultant diary', icon: Stethoscope },
          { to: '/staff/counter', label: 'Counter', icon: ConciergeBell },
        ]
      : []

  return (
    <div className="min-h-screen bg-parchment">
      <header className="border-b border-stone-200 bg-pine-900">
        <Container size="wide">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link to="/" className="flex items-center gap-3">
              <Mark className="h-8 w-8" tone="#fbf8f3" accent="#c6a068" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-[0.95rem] tracking-[0.18em] text-ivory uppercase">
                  {site.name}
                </span>
                <span className="mt-1 text-[0.5625rem] font-medium tracking-[0.24em] text-pine-100/50 uppercase">
                  Staff console
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-5">
              {user && (
                <span className="hidden text-right sm:block">
                  <span className="block text-[0.8125rem] text-ivory">{user.fullName}</span>
                  <span className="block text-[0.6875rem] tracking-[0.14em] text-pine-100/45 uppercase">
                    {user.role}
                  </span>
                </span>
              )}
              <button
                type="button"
                onClick={signOut}
                className="inline-flex h-9 items-center gap-2 border border-ivory/25 px-4 text-[0.8125rem] text-ivory transition-colors hover:border-brass-300 hover:text-brass-300"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </div>
          </div>
        </Container>
      </header>

      {tabs.length > 0 && (
        <nav aria-label="Consoles" className="border-b border-stone-200 bg-ivory">
          <Container size="wide">
            <ul className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <li key={tab.to}>
                    <NavLink
                      to={tab.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 border-b-2 px-4 py-3 text-[0.8125rem] font-medium transition-colors ${
                          isActive
                            ? 'border-pine-700 text-pine-800'
                            : 'border-transparent text-pine-900/55 hover:text-pine-700'
                        }`
                      }
                    >
                      <Icon className="size-4" />
                      {tab.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </Container>
        </nav>
      )}

      <main className="py-10">
        <Container size="wide">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-[2rem] leading-tight text-pine-900 sm:text-[2.4rem]">{title}</h1>
              {subtitle && <p className="mt-2 max-w-2xl text-[0.9375rem] text-pine-900/60">{subtitle}</p>}
            </div>
            {actions}
          </div>
          <div className="mt-10">{children}</div>
        </Container>
      </main>
    </div>
  )
}
