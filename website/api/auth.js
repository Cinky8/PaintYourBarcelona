import { send, readBody, checkPassword, setSession, clearSession, isAuthed } from './_lib/http.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') return send(res, 200, { authed: isAuthed(req) })

    if (req.method === 'POST') {
      const { password } = await readBody(req)
      if (!checkPassword(password)) {
        await new Promise(r => setTimeout(r, 800))
        return send(res, 401, { error: 'Wrong password' })
      }
      setSession(res)
      return send(res, 200, { authed: true })
    }

    if (req.method === 'DELETE') {
      clearSession(res)
      return send(res, 200, { authed: false })
    }

    send(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: 'Server error' })
  }
}
