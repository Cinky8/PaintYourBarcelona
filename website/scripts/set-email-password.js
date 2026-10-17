// Usage: npm run set-email-password
// Asks for the Gmail App Password (hidden), checks it with Gmail, and saves it to .env.local.
import nodemailer from 'nodemailer'
import { askHidden, updateEnvLocal } from './_env.js'

const user = process.env.SMTP_USER || 'paintyourbarcelona@gmail.com'
const pass = (await askHidden(`Gmail App Password for ${user}: `)).replace(/\s+/g, '')

if (!/^[a-z]{16}$/i.test(pass)) {
  console.error('\nThat does not look like an App Password (16 letters). Nothing changed.')
  process.exit(1)
}

process.stdout.write('Checking with Gmail… ')
try {
  await nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } }).verify()
} catch (err) {
  console.error(`failed.\n${err.message}\nNothing changed. Is 2-Step Verification on, and was the code copied correctly?`)
  process.exit(1)
}

updateEnvLocal({ SMTP_USER: user, SMTP_PASS: pass })
console.log('works!\nSaved to .env.local (gitignored, never committed).')
console.log('For Vercel: add SMTP_USER and SMTP_PASS in Settings → Environment Variables and tick "Sensitive".')
