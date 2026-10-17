import crypto from 'node:crypto'
import { readEvents, reserveSpots } from './_lib/store.js'
import { send, readBody } from './_lib/http.js'
import { sendBookingEmails, organizerEmail } from './_lib/mail.js'
import { buildIcs, googleCalendarUrl, barcelonaToDate } from './_lib/calendar.js'

const MAX_PEOPLE = 10
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/

function validate(input) {
  const name = String(input.name || '').trim().replace(/[\r\n]+/g, ' ')
  const email = String(input.email || '').trim()
  const notes = String(input.notes || '').trim()
  const people = Number(input.people)

  if (!name || name.length > 100) return { error: 'Please enter your name' }
  if (!EMAIL_RE.test(email) || email.length > 200) return { error: 'Please enter a valid email address' }
  if (notes.length > 1000) return { error: 'Notes are too long (max 1000 characters)' }
  if (!Number.isInteger(people) || people < 1 || people > MAX_PEOPLE) return { error: `Number of people must be between 1 and ${MAX_PEOPLE}` }
  return { value: { name, email, notes, people } }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' })
  try {
    const body = await readBody(req)
    if (body.website) return send(res, 400, { error: 'Invalid request' })

    const { value, error } = validate(body)
    if (error) return send(res, 400, { error })

    const event = (await readEvents()).find(e => e.id === body.eventId)
    if (!event || barcelonaToDate(event.date) < new Date()) return send(res, 404, { error: 'This event is no longer available' })

    const booking = { id: crypto.randomUUID(), eventId: event.id, ...value, createdAt: new Date().toISOString() }
    const result = await reserveSpots(event.id, value.people, booking)
    if (result.error === 'NOT_FOUND') return send(res, 404, { error: 'This event is no longer available' })
    if (result.error === 'FULL') {
      return send(res, 409, {
        error: value.people > 1
          ? 'There are not enough spots left for this many people. Try a smaller number.'
          : 'Sorry, this event just sold out.',
      })
    }

    let emailSent = true
    try {
      await sendBookingEmails(event, booking, result.event)
    } catch (err) {
      console.error('Booking saved but email failed:', err)
      emailSent = false
    }

    send(res, 201, {
      booking: { id: booking.id, people: booking.people, name: booking.name, email: booking.email },
      emailSent,
      googleCalendarUrl: googleCalendarUrl(event, booking),
      ics: buildIcs(event, booking, organizerEmail(), 'PUBLISH'),
    })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: 'Something went wrong. Please try again.' })
  }
}
