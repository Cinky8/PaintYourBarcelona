import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Re-read on every server restart; Vite's loadEnv would keep stale values already in process.env.
function loadLocalEnv() {
  for (const file of ['.env', '.env.local']) {
    if (existsSync(file)) Object.assign(process.env, parseEnv(readFileSync(file, 'utf8')))
  }
}

// Serves the Vercel functions in /api during `npm run dev`.
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      loadLocalEnv()
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url.split('?')[0]
        if (!pathname.startsWith('/api/') || pathname.includes('/_') || pathname.includes('..')) return next()
        try {
          const mod = await server.ssrLoadModule(`${pathname}.js`)
          await mod.default(req, res)
        } catch (err) {
          if (err.code === 'ERR_LOAD_URL' || /Failed to load url/.test(err.message)) return next()
          console.error(err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Server error' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localApi()],
  base: '/',
})
