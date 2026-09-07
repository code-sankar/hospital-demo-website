import { config } from '../config.js'
import { formatINR } from '../lib/money.js'

const dateFmt = new Intl.DateTimeFormat('en-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: config.clinic.timezone,
})
const timeFmt = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: config.clinic.timezone,
})

export const formatSlot = (iso) => {
  const d = new Date(iso)
  return { date: dateFmt.format(d), time: timeFmt.format(d) }
}

/* The emails are deliberately plain, table-based HTML: hospital inboxes are
   full of Outlook, and a ticket that renders as a wall of unstyled text is a
   ticket the patient cannot read at the counter. */

const shell = (title, bodyRows, accent = '#0e3b38') => `
<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4efe6;font-family:Helvetica,Arial,sans-serif;color:#10211f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fbf8f3;border:1px solid #ded6c7;">
    <tr><td style="background:${accent};padding:24px 28px;">
      <div style="color:#d8bd90;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Ashvini Institute of Medical Sciences</div>
      <div style="color:#fbf8f3;font-size:22px;margin-top:8px;">${title}</div>
    </td></tr>
    <tr><td style="padding:28px;">${bodyRows}</td></tr>
    <tr><td style="padding:18px 28px;border-top:1px solid #ded6c7;font-size:11px;line-height:1.6;color:#7c7264;">
      27 Palace Cross Road, Vasanth Nagar, Bengaluru 560&nbsp;052 &middot; +91 80 4512 8800<br>
      This is a design demonstration. Ashvini is a fictional institution and no appointment has really been made.
    </td></tr>
  </table>
</body></html>`

const codeBlock = (reference) => `
  <div style="margin:0 0 24px;padding:18px;border:1px dashed #b08a4f;background:#f4efe6;text-align:center;">
    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#90703e;">Your ticket code</div>
    <div style="font-size:30px;letter-spacing:4px;margin-top:8px;font-family:'Courier New',monospace;color:#0e3b38;">${reference}</div>
    <div style="font-size:12px;color:#7c7264;margin-top:10px;">Quote this at the counter when you arrive</div>
  </div>`

const detailRows = (rows) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
    ${rows
      .map(
        ([k, v]) => `<tr>
      <td style="padding:9px 0;color:#7c7264;width:42%;border-bottom:1px solid #ece6da;">${k}</td>
      <td style="padding:9px 0;color:#10211f;font-weight:bold;border-bottom:1px solid #ece6da;">${v}</td>
    </tr>`,
      )
      .join('')}
  </table>`

export function patientTicketEmail(ticket) {
  const { date, time } = formatSlot(ticket.startsAt)
  const html = shell(
    'Your appointment is confirmed',
    `
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;">
      Dear ${ticket.patient.fullName},<br><br>
      Your appointment is confirmed and paid in full. Please bring this ticket code with you.
    </p>
    ${codeBlock(ticket.reference)}
    ${detailRows([
      ['Doctor', ticket.doctor.fullName],
      ['Speciality', ticket.doctor.departmentName],
      ['Date', date],
      ['Time', time],
      ['Amount paid', formatINR(ticket.amountPaise)],
      ['Payment reference', ticket.paymentId ?? '—'],
    ])}
    <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#7c7264;">
      <strong style="color:#963425;">This payment is non-refundable.</strong> The consultation fee is charged in
      full at the time of booking and is not returned if you cancel or do not attend. If you cannot come,
      telephone us on +91&nbsp;80&nbsp;4512&nbsp;8800 as early as you can so the slot can go to someone else.
    </p>
    <p style="margin:16px 0 0;font-size:13px;line-height:1.7;color:#7c7264;">
      Please arrive fifteen minutes early with photo identification and any previous reports or scans.
      View your ticket online at <a href="${config.webOrigin}/ticket/${ticket.reference}" style="color:#0e3b38;">${config.webOrigin}/ticket/${ticket.reference}</a>.
    </p>`,
  )

  const text = [
    `Your appointment at Ashvini is confirmed.`,
    ``,
    `TICKET CODE: ${ticket.reference}`,
    ``,
    `Doctor:  ${ticket.doctor.fullName} (${ticket.doctor.departmentName})`,
    `Date:    ${date}`,
    `Time:    ${time}`,
    `Paid:    ${formatINR(ticket.amountPaise)}`,
    ``,
    `This payment is non-refundable. Quote the ticket code at the counter.`,
    `${config.webOrigin}/ticket/${ticket.reference}`,
  ].join('\n')

  return { subject: `Appointment confirmed — ${ticket.reference}`, html, text }
}

export function counterTicketEmail(ticket) {
  const { date, time } = formatSlot(ticket.startsAt)
  const html = shell(
    `New booking — ${ticket.reference}`,
    `
    ${codeBlock(ticket.reference)}
    ${detailRows([
      ['Patient', ticket.patient.fullName],
      ['Telephone', ticket.patient.phone],
      ['Email', ticket.patient.email],
      ['Doctor', ticket.doctor.fullName],
      ['Speciality', ticket.doctor.departmentName],
      ['Date', date],
      ['Time', time],
      ['Amount paid', formatINR(ticket.amountPaise)],
      ['Reason', ticket.reason],
      ['Notes', ticket.notes || '—'],
    ])}
    <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#7c7264;">
      Paid in full and in advance. Look this code up in the counter console to check the patient in.
    </p>`,
    '#0b2e2c',
  )

  const text = [
    `New paid booking — ${ticket.reference}`,
    ``,
    `Patient: ${ticket.patient.fullName} · ${ticket.patient.phone} · ${ticket.patient.email}`,
    `Doctor:  ${ticket.doctor.fullName} (${ticket.doctor.departmentName})`,
    `When:    ${date}, ${time}`,
    `Paid:    ${formatINR(ticket.amountPaise)}`,
    `Reason:  ${ticket.reason}`,
    `Notes:   ${ticket.notes || '—'}`,
  ].join('\n')

  return { subject: `Counter copy — ${ticket.reference} — ${date}, ${time}`, html, text }
}
