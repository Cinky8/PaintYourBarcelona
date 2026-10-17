import crypto from 'node:crypto'

const COOKIE = 'pyb_admin'
const SESSION_SECONDS = 60 * 60 * 12

export function send(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(data))
}

export async function readBody(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

export function query(req) {
  return new URL(req.url, 'http://localhost').searchParams
}

function secret() {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) throw new Error('SESSION_SECRET must be set (32+ characters)')
  return s
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url')
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(a).digest()
  const hb = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

// ADMIN_PASSWORD_HASH format: scrypt$<salt base64url>$<hash base64url>, created by `npm run set-password`
export function checkPassword(password) {
  const stored = process.env.ADMIN_PASSWORD_HASH
  if (!stored) throw new Error('ADMIN_PASSWORD_HASH is not set (run `npm run set-password`)')
  const [algo, salt, hash] = stored.split('$')
  if (algo !== 'scrypt' || !salt || !hash) throw new Error('ADMIN_PASSWORD_HASH is malformed')
  if (typeof password !== 'string' || password.length > 200) return false
  const expected = Buffer.from(hash, 'base64url')
  const actual = crypto.scryptSync(password, Buffer.from(salt, 'base64url'), expected.length)
  return crypto.timingSafeEqual(actual, expected)
}

function cookieAttrs(maxAge) {
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${process.env.VERCEL ? '; Secure' : ''}`
}

export function setSession(res) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_SECONDS * 1000 })).toString('base64url')
  res.setHeader('Set-Cookie', `${COOKIE}=${payload}.${sign(payload)}; ${cookieAttrs(SESSION_SECONDS)}`)
}

export function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; ${cookieAttrs(0)}`)
}

export function isAuthed(req) {
  const match = (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))
  if (!match) return false
  const [payload, sig] = match[1].split('.')
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).exp > Date.now()
  } catch {
    return false
  }
}
