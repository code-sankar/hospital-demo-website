import { CircleCheck, TriangleAlert } from 'lucide-react'
import { formatMoney, formatLongDate, formatTime } from '../../api/format'

/**
 * The ticket as the patient sees it. The code is set in a monospaced face at a
 * size that survives being read aloud across a busy counter, or held up on a
 * phone screen in a queue.
 */
export default function TicketCard({ ticket, compact = false }) {
  return (
    <div className="border border-stone-200 bg-parchment shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 px-8 py-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-pine-700 text-ivory">
            <CircleCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow text-brass-600">Appointment ticket</p>
            <p className="mt-1 text-[0.8125rem] text-pine-900/55">
              {ticket.checkedInAt ? 'Checked in at the counter' : 'Paid in full · not yet checked in'}
            </p>
          </div>
        </div>
        <span className="border border-pine-700/25 bg-ivory px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-pine-700 uppercase">
          Confirmed
        </span>
      </div>

      <div className="px-8 py-8">
        <div className="border border-dashed border-brass-500 bg-ivory px-6 py-7 text-center">
          <p className="eyebrow text-brass-600">Your ticket code</p>
          <p className="mt-3 font-mono text-[2rem] leading-none tracking-[0.18em] text-pine-900 sm:text-[2.4rem]">
            {ticket.reference}
          </p>
          <p className="mt-4 text-[0.8125rem] text-pine-900/55">Quote this at the counter when you arrive</p>
        </div>

        <dl className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
          {[
            ['Consultant', ticket.doctor.fullName],
            ['Speciality', ticket.doctor.departmentName],
            ['Date', formatLongDate(ticket.startsAt)],
            ['Time', `${formatTime(ticket.startsAt)} IST`],
            ['Patient', ticket.patient.fullName],
            ['Amount paid', formatMoney(ticket.amountPaise)],
            ...(compact ? [] : [['Payment reference', ticket.paymentId ?? '—']]),
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:gap-8">
              <dt className="w-44 shrink-0 text-[0.8125rem] text-pine-900/50">{k}</dt>
              <dd className="text-[0.9375rem] font-medium text-pine-900">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex items-start gap-3 border border-clay-500/25 bg-clay-500/6 p-5">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-clay-500" aria-hidden="true" />
          <p className="text-[0.8125rem] leading-relaxed text-pine-900/75">
            <strong className="font-medium text-clay-600">This payment is not refundable.</strong> The fee was
            charged in full at the time of booking and is not returned if you cancel or do not attend. If you
            cannot come, please telephone us as early as you can so the slot can go to someone else.
          </p>
        </div>

        <p className="mt-6 text-[0.75rem] leading-relaxed text-pine-900/45">
          Please arrive fifteen minutes early with photo identification and any previous reports or scans. A copy
          of this ticket has already reached the hospital counter.
        </p>
      </div>
    </div>
  )
}
