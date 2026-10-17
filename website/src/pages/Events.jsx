import { useCallback, useEffect, useState } from 'react'
import images from '../images'
import BookingModal from '../components/BookingModal'
import { formatDateParts, formatPrice } from '../eventFormat'

function EventCard({ event, onBook }) {
  const { day, month, weekday, time } = formatDateParts(event.date)

  return (
    <article className={`bg-white border border-cream-alt rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] ${event.soldOut ? 'opacity-75' : ''}`}>
      <div className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-0 sm:w-20 shrink-0 sm:border-r sm:border-cream-alt sm:pr-6">
        <span className="font-serif text-4xl md:text-5xl text-terracotta leading-none">{day}</span>
        <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-text-secondary sm:mt-2">{month}</span>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-sans text-sm font-semibold text-text-primary">{weekday} · {time}</p>
          {event.soldOut && (
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] bg-text-primary text-white px-2.5 py-1 rounded-full">
              Sold out
            </span>
          )}
        </div>
        {event.collaborator && (
          <p className="font-sans text-text-secondary">
            In collaboration with <span className="font-semibold text-text-primary">{event.collaborator}</span>
          </p>
        )}
        {event.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-text-secondary hover:text-terracotta transition-colors flex items-start gap-1.5 w-fit"
          >
            <svg viewBox="0 0 24 24" className="size-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            <span className="underline decoration-text-secondary/30 underline-offset-2">{event.address}</span>
          </a>
        )}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
        <span className="font-serif text-2xl text-text-primary">{formatPrice(event.price)}</span>
        <button
          type="button"
          disabled={event.soldOut}
          onClick={onBook}
          className="bg-terracotta text-white font-sans font-bold text-sm px-6 py-3 rounded-lg hover:bg-terracotta/90 transition-colors shadow-sm disabled:bg-text-secondary/30 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {event.soldOut ? 'Sold out' : 'Book'}
        </button>
      </div>
    </article>
  )
}

export default function Events() {
  const [events, setEvents] = useState(null)
  const [error, setError] = useState(false)
  const [booking, setBooking] = useState(null)

  const load = useCallback(() =>
    fetch('/api/events')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(data => setEvents(data.events))
      .catch(() => setError(true)), [])

  useEffect(() => { load() }, [load])
  const closeBooking = useCallback(() => setBooking(null), [])

  return (
    <main className="pt-[68px] md:pt-[92px]">
      <section className="relative h-[320px] md:h-[440px] overflow-hidden">
        <img src={images.EventsHero} alt="Hand-painted Barcelona postcards" className="absolute inset-0 w-full h-full object-cover object-[50%_40%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/35 to-dark/10" />
        <div className="relative h-full max-w-[1280px] mx-auto px-8 flex flex-col justify-end pb-12 md:pb-16 gap-3">
          <span className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-white/80">Workshops calendar</span>
          <h1 className="font-serif text-white text-5xl md:text-7xl font-normal leading-tight">Next Events</h1>
        </div>
      </section>

      <section className="px-8 py-16 md:py-24">
        <div className="max-w-[960px] mx-auto flex flex-col gap-4">
          {error && (
            <p className="font-sans text-text-secondary text-center py-12">Events couldn't be loaded right now. Please try again later.</p>
          )}
          {!error && events === null && (
            <p className="font-sans text-text-secondary text-center py-12">Loading events…</p>
          )}
          {events?.length === 0 && (
            <p className="font-sans text-text-secondary text-center py-12">No upcoming events</p>
          )}
          {events?.map(event => <EventCard key={event.id} event={event} onBook={() => setBooking(event)} />)}
        </div>
      </section>

      {booking && <BookingModal event={booking} onClose={closeBooking} onBooked={load} />}
    </main>
  )
}
