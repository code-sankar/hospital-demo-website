import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api, ApiError } from '../api/client'

const StaffAuthContext = createContext(null)

/**
 * Staff session state. The session itself lives in an httpOnly cookie the
 * browser never exposes to script — this only mirrors who is signed in, and
 * asks the server on mount because the cookie cannot be read here.
 */
export function StaffAuthProvider({ children }) {
  const { pathname } = useLocation()
  const onStaffRoute = pathname.startsWith('/staff')

  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // loading | signed-in | signed-out

  // The session is only checked on the staff routes. Probing on every public
  // page would put an expected 401 in the console of every patient's browser
  // and cost a request nobody needed.
  useEffect(() => {
    if (!onStaffRoute) return undefined

    let cancelled = false
    api
      .me()
      .then((res) => {
        if (cancelled) return
        setUser(res.user)
        setStatus('signed-in')
      })
      .catch(() => {
        if (cancelled) return
        setUser(null)
        setStatus('signed-out')
      })
    return () => {
      cancelled = true
    }
  }, [onStaffRoute])

  const signIn = useCallback(async (email, password) => {
    const res = await api.login(email, password)
    setUser(res.user)
    setStatus('signed-in')
    return res.user
  }, [])

  const signOut = useCallback(async () => {
    try {
      await api.logout()
    } catch (err) {
      if (!(err instanceof ApiError)) throw err
    }
    setUser(null)
    setStatus('signed-out')
  }, [])

  const value = useMemo(
    // Outside the staff area there is nothing to wait for, so never report
    // "loading" there — a guard rendered off-route would hang on it.
    () => ({ user, status: onStaffRoute ? status : 'signed-out', signIn, signOut, setUser }),
    [user, status, onStaffRoute, signIn, signOut],
  )

  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext)
  if (!ctx) throw new Error('useStaffAuth must be used inside <StaffAuthProvider>')
  return ctx
}

/** Home screen for each role, used after signing in and by the route guard. */
export const homeFor = (user) => (user?.role === 'doctor' ? '/staff/doctor' : '/staff/counter')
