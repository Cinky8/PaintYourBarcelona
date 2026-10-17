import { promises as fs } from 'node:fs'
import path from 'node:path'

const KEY = 'pyb:events'
const LOCAL_FILE = path.join(process.cwd(), '.data', 'events.json')

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url, token } : null
}

async function redis(command) {
  const { url, token } = redisConfig()
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  })
  if (!res.ok) throw new Error(`Redis error ${res.status}`)
  return (await res.json()).result
}

export async function readEvents() {
  if (redisConfig()) {
    const raw = await redis(['GET', KEY])
    return raw ? JSON.parse(raw) : []
  }
  if (process.env.VERCEL) throw new Error('No database configured: connect Upstash Redis to this Vercel project')
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

export async function writeEvents(events) {
  if (redisConfig()) {
    await redis(['SET', KEY, JSON.stringify(events)])
    return
  }
  if (process.env.VERCEL) throw new Error('No database configured: connect Upstash Redis to this Vercel project')
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true })
  await fs.writeFile(LOCAL_FILE, JSON.stringify(events, null, 2))
}

const BOOKINGS_KEY = 'pyb:bookings'
const LOCAL_BOOKINGS = path.join(process.cwd(), '.data', 'bookings.json')

// Checks capacity, adds the people and saves the booking in one atomic step (Lua runs atomically in Redis).
const RESERVE_LUA = `
local raw = redis.call('GET', KEYS[1])
if not raw then return 'NOT_FOUND' end
local events = cjson.decode(raw)
for _, e in ipairs(events) do
  if e.id == ARGV[1] then
    local people = tonumber(ARGV[2])
    if e.booked + people > e.capacity then return 'FULL' end
    e.booked = e.booked + people
    redis.call('SET', KEYS[1], cjson.encode(events))
    redis.call('RPUSH', KEYS[2], ARGV[3])
    return cjson.encode(e)
  end
end
return 'NOT_FOUND'`

// Returns { event } with the updated counts, or { error: 'NOT_FOUND' | 'FULL' }
export async function reserveSpots(eventId, people, booking) {
  if (redisConfig()) {
    const result = await redis(['EVAL', RESERVE_LUA, '2', KEY, BOOKINGS_KEY, eventId, String(people), JSON.stringify(booking)])
    return result === 'NOT_FOUND' || result === 'FULL' ? { error: result } : { event: JSON.parse(result) }
  }
  const events = await readEvents()
  const event = events.find(e => e.id === eventId)
  if (!event) return { error: 'NOT_FOUND' }
  if (event.booked + people > event.capacity) return { error: 'FULL' }
  event.booked += people
  await writeEvents(events)
  await fs.writeFile(LOCAL_BOOKINGS, JSON.stringify([...(await readBookings()), booking], null, 2))
  return { event }
}

export async function readBookings() {
  if (redisConfig()) return ((await redis(['LRANGE', BOOKINGS_KEY, '0', '-1'])) || []).map(s => JSON.parse(s))
  try {
    return JSON.parse(await fs.readFile(LOCAL_BOOKINGS, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}
