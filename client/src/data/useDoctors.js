import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { staticDirectory, staticDoctor } from './doctorShape'

/**
 * Consultants from the API, which knows who is currently accepting bookings.
 *
 * If the API cannot be reached the bundled content file stands in, so the
 * public site still renders during a demo on a bad connection — `live` tells
 * the caller which it got, and availability is hidden when it is stale.
 *
 * `loading` is derived from which request the state belongs to rather than set
 * at the top of the effect, so a dependency change never costs an extra render.
 */
export function useDoctors(params) {
  const key = JSON.stringify(params ?? {})
  const [state, setState] = useState({ doctors: staticDirectory, live: false, key: null })

  useEffect(() => {
    const controller = new AbortController()

    api
      .doctors(JSON.parse(key))
      .then((res) => {
        if (!controller.signal.aborted) setState({ doctors: res.doctors, live: true, key })
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ doctors: staticDirectory, live: false, key })
      })

    return () => controller.abort()
  }, [key])

  return { doctors: state.doctors, live: state.live, loading: state.key !== key }
}

export function useDoctor(slug) {
  const [state, setState] = useState({ doctor: staticDoctor(slug), live: false, slug: null })

  useEffect(() => {
    const controller = new AbortController()

    api
      .doctor(slug)
      .then((res) => {
        if (!controller.signal.aborted) setState({ doctor: res.doctor, live: true, slug })
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ doctor: staticDoctor(slug), live: false, slug })
      })

    return () => controller.abort()
  }, [slug])

  // Fall back to the bundled record while the live one is still in flight, so
  // the page paints immediately instead of flashing a spinner.
  return {
    doctor: state.slug === slug ? state.doctor : staticDoctor(slug),
    live: state.slug === slug && state.live,
    loading: state.slug !== slug,
  }
}
