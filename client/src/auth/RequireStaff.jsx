import { Navigate, useLocation } from 'react-router-dom'
import { useStaffAuth, homeFor } from './StaffAuth'
import Container from '../components/ui/Container'

/** Wraps the staff consoles: waits for the session check, then admits or redirects. */
export default function RequireStaff({ roles, children }) {
  const { user, status } = useStaffAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <Container size="wide">
        <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
          <span className="flex items-center gap-3 text-[0.8125rem] tracking-[0.2em] text-pine-900/40 uppercase">
            <span className="size-1.5 animate-pulse rounded-full bg-brass-500" aria-hidden="true" />
            Checking your session
          </span>
        </div>
      </Container>
    )
  }

  if (status === 'signed-out') {
    return <Navigate to="/staff/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeFor(user)} replace />
  }

  return children
}
