export const WORKSHOP_TITLE = 'Postcards Workshop'
export const DURATION_MINUTES = 90
export const ORGANIZER_NAME = 'Paint Your Barcelona'
const TZ = 'Europe/Madrid'

function tzOffset(ts) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(new Date(ts)).map(x => [x.type, Number(x.value)]),
  )
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - ts
}

// "YYYY-MM-DDTHH:mm" in Barcelona time → Date (UTC instant)
export function barcelonaToDate(value) {
  const [d, t] = value.split('T')
  const [y, m, day] = d.split('-').map(Number)
  const [h, min] = t.split(':').map(Number)
  const wall = Date.UTC(y, m - 1, day, h, min)
  let utc = wall - tzOffset(wall)
  const corrected = wall - tzOffset(utc)
  if (corrected !== utc) utc = corrected
  return new Date(utc)
}

export function eventTimes(event) {
  const start = barcelonaToDate(event.date)
  return { start, end: new Date(start.getTime() + DURATION_MINUTES * 60000) }
}

export function formatWhen(event) {
  const { start, end } = eventTimes(event)
  const day = start.toLocaleDateString('en-GB', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const time = (d) => d.toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })
  return { day, time: `${time(start)} – ${time(end)}` }
}

const icsDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsText = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

function fold(line) {
  const out = []
  let rest = line
  while (Buffer.byteLength(rest) > 74) {
    let i = 74
    while (Buffer.byteLength(rest.slice(0, i)) > 74) i--
    out.push(rest.slice(0, i))
    rest = ' ' + rest.slice(i)
  }
  out.push(rest)
  return out.join('\r\n')
}

function description(event, booking) {
  return [
    event.collaborator && `In collaboration with ${event.collaborator}`,
    `People: ${booking.people}`,
    booking.notes && `Notes: ${booking.notes}`,
  ].filter(Boolean).join('\n')
}

export function buildIcs(event, booking, organizerEmail, method = 'REQUEST') {
  const { start, end } = eventTimes(event)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Paint Your Barcelona//Events//EN',
    'CALSCALE:GREGORIAN',
    `METHOD:${method}`,
    'BEGIN:VEVENT',
    `UID:${booking.id}@paintyourbarcelona`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(`${WORKSHOP_TITLE} – ${ORGANIZER_NAME}`)}`,
    `DESCRIPTION:${icsText(description(event, booking))}`,
    event.address && `LOCATION:${icsText(event.address)}`,
    `ORGANIZER;CN=${icsText(ORGANIZER_NAME)}:mailto:${organizerEmail}`,
    `ATTENDEE;CN=${icsText(booking.name)};ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=FALSE:mailto:${booking.email}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsText(WORKSHOP_TITLE)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)
  return lines.map(fold).join('\r\n') + '\r\n'
}

export function googleCalendarUrl(event, booking) {
  const { start, end } = eventTimes(event)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${WORKSHOP_TITLE} – ${ORGANIZER_NAME}`,
    dates: `${icsDate(start)}/${icsDate(end)}`,
    details: description(event, booking),
    location: event.address || '',
    ctz: TZ,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
