import { promises as fs } from 'node:fs'
import path from 'node:path'
import nodemailer from 'nodemailer'
import { buildIcs, formatWhen, googleCalendarUrl, WORKSHOP_TITLE, ORGANIZER_NAME } from './calendar.js'

export function organizerEmail() {
  return process.env.ORGANIZER_EMAIL || 'paintyourbarcelona@gmail.com'
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const eur = (n) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', minimumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n)

function layout(heading, intro, rows, footer = '') {
  const rowHtml = rows.filter(([, v]) => v).map(([k, v]) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f4f3f1;color:#54433c;font-size:13px;width:130px;vertical-align:top">${esc(k)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f4f3f1;color:#1a1c1a;font-size:14px">${v}</td>
    </tr>`).join('')
  return `<!doctype html><html><body style="margin:0;background:#faf9f6;font-family:Manrope,Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <p style="font-family:Georgia,serif;font-size:18px;color:#1a1c1a;margin:0 0 24px">Paint Your Barcelona</p>
    <div style="background:#fff;border-radius:16px;padding:28px">
      <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:24px;color:#1a1c1a;margin:0 0 8px">${esc(heading)}</h1>
      <p style="color:#54433c;font-size:14px;line-height:1.6;margin:0 0 20px">${intro}</p>
      <table style="width:100%;border-collapse:collapse">${rowHtml}</table>
      ${footer}
    </div>
  </div></body></html>`
}

function detailRows(event, booking) {
  const { day, time } = formatWhen(event)
  return [
    ['What', esc(WORKSHOP_TITLE)],
    ['When', `${esc(day)}<br>${esc(time)} (Barcelona time)`],
    ['Where', event.address && `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}" style="color:#954926">${esc(event.address)}</a>`],
    ['In collaboration with', event.collaborator && esc(event.collaborator)],
    ['People', esc(booking.people)],
    ['Price', `${eur(event.price)} per person · ${eur(event.price * booking.people)} total`],
    ['Notes', booking.notes && esc(booking.notes).replace(/\n/g, '<br>')],
  ]
}

function guestEmail(event, booking) {
  const { day, time } = formatWhen(event)
  const button = `<p style="margin:24px 0 0"><a href="${esc(googleCalendarUrl(event, booking))}" style="display:inline-block;background:#954926;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 22px;border-radius:8px">Add to Google Calendar</a></p>
    <p style="color:#54433c;font-size:12px;margin:12px 0 0">The calendar invite is also attached to this email.</p>`
  return {
    subject: `Booking confirmed: ${WORKSHOP_TITLE} – ${day}, ${time.split(' ')[0]}`,
    html: layout(
      `You're booked, ${booking.name.split(' ')[0]}!`,
      'Thanks for booking. Here are your workshop details — all materials are provided, just bring yourself.',
      detailRows(event, booking),
      button,
    ),
  }
}

function organizerNotice(event, booking, updated) {
  const { day, time } = formatWhen(event)
  const left = Math.max(updated.capacity - updated.booked, 0)
  return {
    subject: `New booking: ${booking.name} (${booking.people}) – ${day}, ${time.split(' ')[0]}`,
    html: layout(
      'New booking',
      `<strong>${esc(booking.name)}</strong> (<a href="mailto:${esc(booking.email)}" style="color:#954926">${esc(booking.email)}</a>) booked ${esc(booking.people)} ${booking.people === 1 ? 'spot' : 'spots'}.`,
      [...detailRows(event, booking), ['Spots left', `${left} of ${updated.capacity}${left === 0 ? ' — now sold out' : ''}`]],
    ),
  }
}

function transport() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user, pass },
  })
}

export async function sendBookingEmails(event, booking, updated) {
  const organizer = organizerEmail()
  const from = `"${ORGANIZER_NAME}" <${process.env.SMTP_USER || organizer}>`
  const guest = guestEmail(event, booking)
  const notice = organizerNotice(event, booking, updated)

  const messages = [
    {
      from, to: `"${booking.name.replace(/"/g, '')}" <${booking.email}>`, replyTo: organizer, ...guest,
      icalEvent: { method: 'REQUEST', filename: 'invite.ics', content: buildIcs(event, booking, organizer, 'REQUEST') },
    },
    {
      from, to: organizer, replyTo: booking.email, ...notice,
      icalEvent: { method: 'PUBLISH', filename: 'booking.ics', content: buildIcs(event, booking, organizer, 'PUBLISH') },
    },
  ]

  const t = transport()
  if (!t) {
    if (process.env.VERCEL) throw new Error('SMTP_USER / SMTP_PASS are not set')
    const dir = path.join(process.cwd(), '.data', 'outbox')
    await fs.mkdir(dir, { recursive: true })
    for (const [i, m] of messages.entries()) {
      const base = path.join(dir, `${booking.id}-${i === 0 ? 'guest' : 'organizer'}`)
      await fs.writeFile(`${base}.html`, `<!-- To: ${esc(m.to)} | Subject: ${esc(m.subject)} -->\n${m.html}`)
      await fs.writeFile(`${base}.ics`, m.icalEvent.content)
    }
    console.log(`[dev] SMTP not configured — booking emails written to .data/outbox/${booking.id}-*`)
    return
  }
  await Promise.all(messages.map(m => t.sendMail(m)))
}
