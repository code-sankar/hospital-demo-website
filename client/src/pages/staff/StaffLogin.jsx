import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, TriangleAlert } from 'lucide-react'
import Container from '../../components/ui/Container'
import ArtPanel from '../../components/art/ArtPanel'
import Logo from '../../components/art/Logo'
import { FieldGroup, Input } from '../../components/ui/Field'
import { useStaffAuth, homeFor } from '../../auth/StaffAuth'
import { site } from '../../data/site'

export default function StaffLogin() {
  const { user, status, signIn } = useStaffAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (status === 'signed-in' && user) {
    return <Navigate to={location.state?.from ?? homeFor(user)} replace />
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const signedIn = await signIn(email.trim(), password)
      navigate(location.state?.from ?? homeFor(signedIn), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center bg-ivory py-16">
        <Container size="tight">
          <Link to="/" aria-label={`${site.name} home`}>
            <Logo />
          </Link>

          <h1 className="mt-14 font-display text-[2.4rem] leading-tight text-pine-900">Staff sign-in</h1>
          <p className="mt-4 max-w-md text-[0.9375rem] text-pine-900/62">
            For consultants managing their own diary and for the reception counter. Patients do not need an
            account — they book with a ticket code.
          </p>

          <form onSubmit={submit} className="mt-10 max-w-md">
            <div className="grid gap-7">
              <FieldGroup label="Email" htmlFor="staff-email" required>
                <Input
                  id="staff-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </FieldGroup>
              <FieldGroup label="Password" htmlFor="staff-password" required>
                <Input
                  id="staff-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </FieldGroup>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 border border-clay-500/30 bg-clay-500/8 p-4 text-[0.875rem] text-clay-600"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="group mt-8 inline-flex h-13 w-full items-center justify-center gap-3 bg-pine-700 px-8 text-[0.9375rem] font-medium tracking-wide text-ivory transition-colors hover:bg-pine-600 disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="size-[18px] animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 max-w-md border border-stone-200 bg-parchment p-5">
            <p className="eyebrow text-brass-600">Demonstration sign-ins</p>
            <ul className="mt-3 space-y-1.5 font-mono text-[0.75rem] text-pine-900/65">
              <li>ananya-iyer@ashvini-health.example · Doctor@12345</li>
              <li>counter@ashvini-health.example · Counter@12345</li>
            </ul>
            <p className="mt-3 text-[0.75rem] leading-relaxed text-pine-900/45">
              Seeded accounts for the demo only. Every consultant has a login of the form
              &lt;slug&gt;@ashvini-health.example.
            </p>
          </div>
        </Container>
      </div>

      <div className="relative hidden lg:block">
        <ArtPanel variant="colonnade" tone="deep" seed={12} arch={false} label="Ashvini staff entrance" />
      </div>
    </div>
  )
}
