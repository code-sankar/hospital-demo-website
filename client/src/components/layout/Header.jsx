import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, CalendarCheck, Search } from 'lucide-react'
import Container from '../ui/Container'
import Logo from '../art/Logo'
import TopBar from './TopBar'
import MegaMenu from './MegaMenu'
import MobileMenu from './MobileMenu'
import { navigation, site } from '../../data/site'

export default function Header() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 12)
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close any open menu when the route changes — adjusting state during render
  // rather than in an effect avoids a second paint with the menu still open.
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setOpenMenu(null)
    setMobileOpen(false)
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpenMenu(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const hoverOpen = (label) => {
    clearTimeout(closeTimer.current)
    setOpenMenu(label)
  }
  const hoverClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140)
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:bg-pine-700 focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50">
        <TopBar />
        <div
          className={`relative border-b transition-all duration-500 ${
            scrolled
              ? 'border-stone-200 bg-ivory/92 backdrop-blur-xl shadow-[0_1px_24px_-8px_rgba(16,33,31,0.18)]'
              : 'border-transparent bg-ivory'
          }`}
          onMouseLeave={hoverClose}
          onBlur={(e) => {
            // Close once focus leaves the header entirely, so keyboard users
            // are not left with a panel open behind them.
            if (!e.currentTarget.contains(e.relatedTarget)) setOpenMenu(null)
          }}
        >
          <Container size="wide">
            <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-18' : 'h-22'}`}>
              <Link to="/" aria-label={`${site.name} home`} className="shrink-0">
                <Logo compact={scrolled} />
              </Link>

              <nav aria-label="Primary" className="hidden xl:block">
                <ul className="flex items-center gap-1">
                  {navigation.map((item) => (
                    <li
                      key={item.label}
                      onMouseEnter={() => (item.children ? hoverOpen(item.label) : setOpenMenu(null))}
                      onFocus={() => (item.children ? hoverOpen(item.label) : setOpenMenu(null))}
                    >
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `flex items-center gap-1.5 px-4 py-2.5 text-[0.8125rem] font-medium tracking-wide transition-colors ${
                            isActive || openMenu === item.label
                              ? 'text-pine-600'
                              : 'text-pine-900/78 hover:text-pine-600'
                          }`
                        }
                        aria-haspopup={item.children ? 'true' : undefined}
                        aria-expanded={item.children ? openMenu === item.label : undefined}
                      >
                        {item.label}
                        {item.children && (
                          <ChevronDown
                            className={`size-3.5 transition-transform duration-300 ${
                              openMenu === item.label ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </NavLink>

                      {item.children && openMenu === item.label && (
                        <MegaMenu item={item} onNavigate={() => setOpenMenu(null)} />
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/doctors"
                  aria-label="Find a doctor"
                  className="hidden size-11 items-center justify-center border border-stone-200 text-pine-700 transition-colors hover:border-pine-700 hover:bg-pine-700 hover:text-ivory sm:flex"
                >
                  <Search className="size-4" />
                </Link>
                <Link
                  to="/appointment"
                  className="hidden h-11 items-center gap-2.5 bg-pine-700 px-6 text-[0.8125rem] font-medium tracking-wide text-ivory transition-colors hover:bg-pine-600 sm:inline-flex"
                >
                  <CalendarCheck className="size-4" />
                  Book an appointment
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                  className="flex size-11 items-center justify-center border border-stone-200 text-pine-800 transition-colors hover:border-pine-700 xl:hidden"
                >
                  <Menu className="size-5" />
                </button>
              </div>
            </div>
          </Container>

        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
