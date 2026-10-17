import { readEvents } from './_lib/store.js'
import { send } from './_lib/http.js'

function todayInBarcelona() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' })
  try {
    const today = todayInBarcelona()
    const events = (await readEvents())
      .filter(e => e.date.slice(0, 10) >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(({ id, date, collaborator, address = '', price, capacity, booked }) => ({
        id,
        date,
        collaborator,
        address,
        price,
        soldOut: capacity > 0 && booked >= capacity,
      }))
    send(res, 200, { events })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: 'Could not load events' })
  }
}
