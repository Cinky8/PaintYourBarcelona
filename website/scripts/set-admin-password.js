// Usage: npm run set-password
// Asks for a new admin password, stores only its scrypt hash in .env.local, and prints the value for Vercel.
import crypto from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { askHidden as ask } from './_env.js'

const password = await ask('New admin password: ')
const confirm = await ask('Repeat password:    ')

if (password !== confirm) {
  console.error('\nPasswords do not match. Nothing changed.')
  process.exit(1)
}
if (password.length < 8) {
  console.error('\nUse at least 8 characters. Nothing changed.')
  process.exit(1)
}

const salt = crypto.randomBytes(16)
const hash = crypto.scryptSync(password, salt, 64)
const value = `scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`

const file = '.env.local'
const lines = (existsSync(file) ? readFileSync(file, 'utf8') : '')
  .split(/\r?\n/)
  .filter(l => l && !l.startsWith('ADMIN_PASSWORD=') && !l.startsWith('ADMIN_PASSWORD_HASH='))
lines.push(`ADMIN_PASSWORD_HASH=${value}`)
if (!lines.some(l => l.startsWith('SESSION_SECRET='))) {
  lines.push(`SESSION_SECRET=${crypto.randomBytes(32).toString('hex')}`)
}
writeFileSync(file, lines.join('\n') + '\n')

console.log('\nSaved to .env.local (only the hash is stored, never the password).')
console.log('For Vercel, add this Environment Variable:\n')
console.log(`  ADMIN_PASSWORD_HASH = ${value}\n`)
