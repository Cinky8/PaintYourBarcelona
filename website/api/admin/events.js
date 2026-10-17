import crypto from 'node:crypto'
import { readEvents, writeEvents, readBookings } from '../_lib/store.js'
import { send, readBody, query, isAuthed } from '../_lib/http.js'

function validate(input) {
  const date = String(input.date || '')
  const collaborator = String(input.collaborator || '').trim()
  const address = String(input.address || '').trim()
  const price = Number(input.price)
  const capacity = Number(input.capacity)
  const booked = Number(input.booked ?? 0)

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(date)) return { error: 'Date and time are required' }
  if (collaborator.length > 120) return { error: 'Collaborator name is too long' }
  if (address.length > 200) return { error: 'Address is too long' }
  if (!Number.isFinite(price) || price < 0) return { error: 'Price must be 0 or more' }
  if (!Number.isInteger(capacity) || capacity < 1) return { error: 'Capacity must be a whole number of at least 1' }
  if (!Number.isInteger(booked) || booked < 0) return { error: 'Spots booked must be a whole number, 0 or more' }

  return { value: { date, collaborator, address, price: Math.round(price * 100) / 100, capacity, booked } }
}

export default async function handler(req, res) {
  try {
    if (!isAuthed(req)) return send(res, 401, { error: 'Not logged in' })

    const events = await readEvents()

    if (req.method === 'GET') {
      const bookings = await readBookings()
      return send(res, 200, {
        events: [...events]
          .sort((a, b) => a.date.localeCompare(b.date))
          .map(e => ({ ...e, bookings: bookings.filter(b => b.eventId === e.id) })),
      })
    }

    if (req.method === 'POST') {
      const { value, error } = validate(await readBody(req))
      if (error) return send(res, 400, { error })
      const event = { id: crypto.randomUUID(), ...value }
      await writeEvents([...events, event])
      return send(res, 201, { event })
    }

    const id = query(req).get('id')
    const index = events.findIndex(e => e.id === id)
    if (index === -1) return send(res, 404, { error: 'Event not found' })

    if (req.method === 'PUT') {
      const { value, error } = validate(await readBody(req))
      if (error) return send(res, 400, { error })
      events[index] = { id, ...value }
      await writeEvents(events)
      return send(res, 200, { event: events[index] })
    }

    if (req.method === 'DELETE') {
      await writeEvents(events.filter(e => e.id !== id))
      return send(res, 200, { ok: true })
    }

    send(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: 'Server error' })
  }
}
