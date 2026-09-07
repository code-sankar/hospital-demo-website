import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TriangleAlert } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import PageHeader from '../components/sections/PageHeader'
import TicketCard from '../components/booking/TicketCard'
import { api } from '../api/client'
import { site } from '../data/site'

/**
 * The link in the confirmation email. The code itself is the credential, so
 * this shows the patient's name but none of their contact details — enough to
 * recognise your own ticket, not enough to be worth guessing at.
 */
export default function Ticket() {
  const { reference } = useParams()
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    api
      .ticket(reference)
      .then((res) => !cancelled && setTicket(res.ticket))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [reference])

  return (
    <>
      <PageHeader
        eyebrow="Appointment ticket"
        title={ticket ? 'Your appointment is confirmed' : 'Appointment ticket'}
        lead={
          ticket
            ? 'Bring this code with you. The hospital counter already holds a copy.'
            : 'Enter the code from your confirmation email to see your appointment.'
        }
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Ticket' }]}
        variant="courtyard"
        seed={9}
      />

      <section className="bg-ivory py-16 lg:py-24">
        <Container size="narrow">
          {loading && (
            <div className="flex min-h-48 items-center justify-center" role="status" aria-live="polite">
              <span className="flex items-center gap-3 text-[0.8125rem] tracking-[0.2em] text-pine-900/40 uppercase">
                <span className="size-1.5 animate-pulse rounded-full bg-brass-500" aria-hidden="true" />
                Looking up your ticket
              </span>
            </div>
          )}

          {!loading && error && (
            <Reveal className="border border-stone-200 bg-parchment p-10 text-center">
              <TriangleAlert className="mx-auto size-7 text-clay-500" aria-hidden="true" />
              <h2 className="mt-5 font-display text-[1.8rem] text-pine-900">We could not find that ticket</h2>
              <p className="mx-auto mt-3 max-w-md text-[0.9375rem] text-pine-900/62">
                {error} Check the code against your confirmation email — codes look like{' '}
                <span className="font-mono">ASH-7K3M-9QX2</span> — or call us on {site.phone} and we will find
                your booking.
              </p>
              <Link
                to="/appointment"
                className="mt-8 inline-flex h-12 items-center gap-2.5 border border-pine-700/25 px-7 text-sm font-medium text-pine-800 transition-colors hover:bg-pine-700 hover:text-ivory"
              >
                Book an appointment
              </Link>
            </Reveal>
          )}

          {!loading && ticket && (
            <>
              <Reveal>
                <TicketCard ticket={ticket} compact />
              </Reveal>
              <Reveal delay={0.1} className="mt-10">
                <Link
                  to="/"
                  className="group inline-flex items-center gap-3 text-[0.875rem] font-medium tracking-wide text-pine-800"
                >
                  <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  Back to the hospital
                </Link>
              </Reveal>
            </>
          )}
        </Container>
      </section>
    </>
  )
}
