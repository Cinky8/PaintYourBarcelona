import { useEffect, useRef, useState } from 'react'
import { formatLongDate, formatPrice, WORKSHOP_DURATION_MINUTES } from '../eventFormat'

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" className="size-5 shrink-0 mt-0.5 text-text-secondary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)
const icons = {
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6" /></>,
  euro: <><path d="M17 6.5A7 7 0 1 0 17 17.5M4 10h9M4 14h9" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
}

function Details({ event }) {
  const { day, time } = formatLongDate(event.date)
  const rows = [
    ['calendar', <>{day}<br />{time}</>],
    ['clock', `${Math.floor(WORKSHOP_DURATION_MINUTES / 60)}h ${WORKSHOP_DURATION_MINUTES % 60}m`],
    event.address && ['pin', event.address],
    event.collaborator && ['users', <>In collaboration with {event.collaborator}</>],
    ['euro', `${formatPrice(event.price)} per person`],
    ['globe', 'Europe/Madrid (Barcelona time)'],
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="size-8 rounded-full bg-terracotta text-white font-serif text-sm flex items-center justify-center">P</span>
        <span className="font-sans text-sm font-semibold text-text-secondary">Paint Your Barcelona</span>
      </div>
      <h2 className="font-serif text-2xl md:text-3xl text-text-primary font-normal">Postcards Workshop</h2>
      <ul className="flex flex-col gap-3">
        {rows.map(([icon, text], i) => (
          <li key={i} className="flex items-start gap-3 font-sans text-sm text-text-primary leading-relaxed">
            <Icon d={icons[icon]} />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function downloadIcs(ics) {
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: 'paint-your-barcelona.ics' })
  a.click()
  URL.revokeObjectURL(url)
}

const inputClass = 'w-full bg-white border border-text-secondary/20 rounded-lg px-4 py-3 font-sans text-sm text-text-primary placeholder-text-secondary/40 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 transition'
const labelClass = 'font-sans text-sm font-semibold text-text-primary'

export default function BookingModal({ event, onClose, onBooked }) {
  const [form, setForm] = useState({ name: '', email: '', notes: '', people: '1', website: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const dialogRef = useRef(null)
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    dialogRef.current?.querySelector('input')?.focus()
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, people: Number(form.people), eventId: event.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setResult(data)
      setStatus('done')
      onBooked()
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  const total = formatPrice(event.price * (Number(form.people) || 1))

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true" aria-label="Book Postcards Workshop">
      <div className="absolute inset-0 bg-dark/60 backdrop-blur-[2px]" onClick={onClose} />

      <div ref={dialogRef} className="relative w-full sm:max-w-[920px] max-h-[92svh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-[5fr_6fr]">
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 size-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-cream-alt transition-colors z-10">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-cream-alt">
          <Details event={event} />
        </div>

        <div className="p-6 md:p-8">
          {status === 'done' ? (
            <div className="flex flex-col gap-5 h-full justify-center">
              <div className="size-12 rounded-full bg-terracotta/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="size-6 text-terracotta" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-2xl text-text-primary font-normal">You're booked!</h3>
                <p className="font-sans text-sm text-text-secondary leading-relaxed">
                  {result.emailSent
                    ? <>A confirmation with a calendar invite has been sent to <strong className="text-text-primary">{result.booking.email}</strong>.</>
                    : <>Your spot is reserved, but we couldn't send the confirmation email. We'll get in touch with you at <strong className="text-text-primary">{result.booking.email}</strong>.</>}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={result.googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="bg-terracotta text-white font-sans font-bold text-sm px-5 py-3 rounded-lg hover:bg-terracotta/90 transition-colors text-center">
                  Add to Google Calendar
                </a>
                <button onClick={() => downloadIcs(result.ics)} className="font-sans font-semibold text-sm px-5 py-3 rounded-lg border border-text-secondary/20 text-text-primary hover:bg-cream-alt transition-colors">
                  Apple / Outlook (.ics)
                </button>
              </div>
              <button onClick={onClose} className="font-sans text-sm text-text-secondary hover:text-text-primary self-start">Close</button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Your name *</span>
                <input required maxLength={100} autoComplete="name" value={form.name} onChange={set('name')} className={inputClass} />
              </label>
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Email address *</span>
                <input required type="email" maxLength={200} autoComplete="email" value={form.email} onChange={set('email')} className={inputClass} />
              </label>
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Additional notes</span>
                <textarea rows={3} maxLength={1000} placeholder="Anything that will help us prepare for the workshop." value={form.notes} onChange={set('notes')} className={`${inputClass} resize-y`} />
              </label>
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Number of people *</span>
                <select required value={form.people} onChange={set('people')} className={inputClass}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} className="hidden" aria-hidden="true" />

              {error && <p className="font-sans text-sm text-red-700 bg-red-50 rounded-lg px-4 py-3">{error}</p>}

              <div className="flex items-center justify-between gap-4 pt-2">
                <p className="font-sans text-sm text-text-secondary">Total <span className="font-semibold text-text-primary">{total}</span></p>
                <div className="flex gap-2">
                  <button type="button" onClick={onClose} className="font-sans font-semibold text-sm px-5 py-3 rounded-lg text-text-secondary hover:bg-cream-alt transition-colors">Back</button>
                  <button disabled={status === 'sending'} className="bg-terracotta text-white font-sans font-bold text-sm px-6 py-3 rounded-lg hover:bg-terracotta/90 transition-colors shadow-sm disabled:opacity-60">
                    {status === 'sending' ? 'Booking…' : 'Confirm'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
