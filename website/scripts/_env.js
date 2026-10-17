import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import readline from 'node:readline'

export function askHidden(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
  let muted = false
  rl._writeToOutput = (s) => rl.output.write(muted ? (s.includes('\n') ? '\n' : '*') : s)
  return new Promise(resolve => {
    rl.question(question, answer => { rl.close(); resolve(answer) })
    muted = true
  })
}

// Replaces (or adds) the given KEY=value lines in .env.local, keeping everything else.
export function updateEnvLocal(values) {
  const file = '.env.local'
  const keys = Object.keys(values)
  const lines = (existsSync(file) ? readFileSync(file, 'utf8') : '')
    .split(/\r?\n/)
    .filter(l => l && !keys.some(k => l.startsWith(`${k}=`)))
  for (const [k, v] of Object.entries(values)) lines.push(`${k}=${v}`)
  writeFileSync(file, lines.join('\n') + '\n')
}
