import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDateParts, formatPrice } from '../eventFormat'

const EMPTY = { date: '', collaborator: '', address: '', price: '', capacity: '', booked: '0' }

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(data.error || 'Something went wrong'), { status: res.status })
  return data
}

const inputClass = 'w-full bg-white border border-text-secondary/20 rounded-lg px-4 py-2.5 font-sans text-sm text-text-primary outline-none focus:border-terracotta transition-colors'
const labelClass = 'font-sans text-xs font-bold uppercase tracking-[0.1em] text-text-secondary'

function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api('/api/auth', { method: 'POST', body: { password } })
      onLogin()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream-alt">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="font-serif text-2xl text-text-primary">Paint Your Barcelona</p>
          <p className="font-sans text-sm text-text-secondary">Admin login</p>
        </div>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Password</span>
          <input type="password" autoFocus required value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
        </label>
        {error && <p className="font-sans text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="bg-terracotta text-white font-sans font-bold text-sm px-6 py-3 rounded-lg hover:bg-terracotta/90 transition-colors disabled:opacity-60">
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  )
}

function EventForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl p-6 md:p-8 border border-terracotta/30 flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Date &amp; time</span>
          <input type="datetime-local" required value={form.date} onChange={set('date')} className={inputClass} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>In collaboration with</span>
          <input type="text" maxLength={120} placeholder="e.g. Casa Gracia Hostel" value={form.collaborator} onChange={set('collaborator')} className={inputClass} />
        </label>
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className={labelClass}>Address</span>
          <input type="text" maxLength={200} placeholder="e.g. Passeig de Gràcia 116, 08008 Barcelona" value={form.address} onChange={set('address')} className={inputClass} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Price (€)</span>
          <input type="number" required min="0" step="0.01" value={form.price} onChange={set('price')} className={inputClass} />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Capacity</span>
            <input type="number" required min="1" step="1" value={form.capacity} onChange={set('capacity')} className={inputClass} />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Spots booked</span>
            <input type="number" required min="0" step="1" value={form.booked} onChange={set('booked')} className={inputClass} />
          </label>
        </div>
      </div>
      <p className="font-sans text-xs text-text-secondary">
        Capacity is never shown on the website. When spots booked reaches capacity, the event shows a Sold Out tag.
      </p>
      {error && <p className="font-sans text-sm text-red-700">{error}</p>}
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="font-sans font-semibold text-sm px-5 py-2.5 rounded-lg text-text-secondary hover:bg-cream-alt transition-colors">
          Cancel
        </button>
        <button disabled={busy} className="bg-terracotta text-white font-sans font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-terracotta/90 transition-colors disabled:opacity-60">
          {busy ? 'Saving…' : 'Save event'}
        </button>
      </div>
    </form>
  )
}

function EventRow({ event, onEdit, onDelete }) {
  const { day, month, weekday, time } = formatDateParts(event.date)
  const soldOut = event.booked >= event.capacity
  const past = event.date.slice(0, 10) < new Date().toISOString().slice(0, 10)
  const [showGuests, setShowGuests] = useState(false)
  const guests = event.bookings || []

  return (
    <div className={`bg-white rounded-2xl border border-cream-alt ${past ? 'opacity-50' : ''}`}>
    <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-sans font-semibold text-text-primary">{weekday} {day} {month} · {time}</p>
          {soldOut && <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] bg-text-primary text-white px-2 py-0.5 rounded-full">Sold out</span>}
          {past && <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] bg-cream-alt text-text-secondary px-2 py-0.5 rounded-full">Past · hidden</span>}
        </div>
        <p className="font-sans text-sm text-text-secondary truncate">{event.collaborator || 'No collaborator'}</p>
        {event.address && <p className="font-sans text-xs text-text-secondary/80 truncate">{event.address}</p>}
      </div>
      <div className="flex items-center gap-6 font-sans text-sm">
        <span className="text-text-primary font-semibold">{formatPrice(event.price)}</span>
        <button
          onClick={() => setShowGuests(v => !v)}
          disabled={guests.length === 0}
          className="text-text-secondary enabled:hover:text-text-primary enabled:underline decoration-text-secondary/30 underline-offset-2"
        >
          {event.booked} / {event.capacity} booked{guests.length > 0 && ` · ${guests.length} ${guests.length === 1 ? 'booking' : 'bookings'} ${showGuests ? '▴' : '▾'}`}
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="font-sans font-semibold text-sm px-4 py-2 rounded-lg border border-text-secondary/20 text-text-primary hover:bg-cream-alt transition-colors">Edit</button>
        <button onClick={onDelete} className="font-sans font-semibold text-sm px-4 py-2 rounded-lg text-red-700 hover:bg-red-50 transition-colors">Delete</button>
      </div>
    </div>
    {showGuests && (
      <ul className="border-t border-cream-alt px-5 md:px-6 py-3 flex flex-col">
        {guests.map(g => (
          <li key={g.id} className="py-2.5 border-b border-cream-alt last:border-0 font-sans text-sm flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-0.5">
            <span className="font-semibold text-text-primary">{g.name}</span>
            <a href={`mailto:${g.email}`} className="text-terracotta hover:underline">{g.email}</a>
            <span className="text-text-secondary">{g.people} {g.people === 1 ? 'person' : 'people'}</span>
            {g.notes && <span className="text-text-secondary italic sm:basis-full">“{g.notes}”</span>}
          </li>
        ))}
      </ul>
    )}
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [events, setEvents] = useState(null)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const load = () =>
    api('/api/admin/events')
      .then(d => setEvents(d.events))
      .catch(err => (err.status === 401 ? onLogout() : setError(err.message)))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [])

  const save = async (form) => {
    const body = { ...form, price: Number(form.price), capacity: Number(form.capacity), booked: Number(form.booked) }
    if (editing === 'new') await api('/api/admin/events', { method: 'POST', body })
    else await api(`/api/admin/events?id=${encodeURIComponent(editing)}`, { method: 'PUT', body })
    setEditing(null)
    await load()
  }

  const remove = async (event) => {
    const { weekday, day, month } = formatDateParts(event.date)
    if (!confirm(`Delete the event on ${weekday} ${day} ${month}?`)) return
    try {
      await api(`/api/admin/events?id=${encodeURIComponent(event.id)}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const logout = async () => {
    await api('/api/auth', { method: 'DELETE' }).catch(() => {})
    onLogout()
  }

  const toForm = (e) => ({ date: e.date, collaborator: e.collaborator, address: e.address || '', price: String(e.price), capacity: String(e.capacity), booked: String(e.booked) })

  return (
    <div className="min-h-screen bg-cream-alt">
      <header className="bg-cream border-b border-cream-alt">
        <div className="max-w-[960px] mx-auto px-4 sm:px-8 h-[68px] flex items-center justify-between">
          <p className="font-serif text-lg text-text-primary">Events admin</p>
          <div className="flex items-center gap-4">
            <Link to="/events" target="_blank" className="font-sans text-sm font-medium text-text-secondary hover:text-text-primary">View page ↗</Link>
            <button onClick={logout} className="font-sans text-sm font-medium text-text-secondary hover:text-text-primary">Log out</button>
          </div>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-4 sm:px-8 py-10 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-serif text-3xl text-text-primary font-normal">Next events</h1>
          {editing === null && (
            <button onClick={() => setEditing('new')} className="bg-terracotta text-white font-sans font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-terracotta/90 transition-colors">
              + Add event
            </button>
          )}
        </div>

        {error && <p className="font-sans text-sm text-red-700">{error}</p>}
        {editing === 'new' && <EventForm initial={EMPTY} onSave={save} onCancel={() => setEditing(null)} />}
        {events === null && !error && <p className="font-sans text-sm text-text-secondary">Loading…</p>}
        {events?.length === 0 && editing !== 'new' && (
          <p className="font-sans text-sm text-text-secondary py-8 text-center">No events yet. Click “Add event” to create the first one.</p>
        )}
        {events?.map(event =>
          editing === event.id
            ? <EventForm key={event.id} initial={toForm(event)} onSave={save} onCancel={() => setEditing(null)} />
            : <EventRow key={event.id} event={event} onEdit={() => setEditing(event.id)} onDelete={() => remove(event)} />
        )}
      </main>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(null)

  useEffect(() => {
    api('/api/auth').then(d => setAuthed(d.authed)).catch(() => setAuthed(false))
  }, [])

  if (authed === null) return null
  return authed ? <Dashboard onLogout={() => setAuthed(false)} /> : <Login onLogin={() => setAuthed(true)} />
}
