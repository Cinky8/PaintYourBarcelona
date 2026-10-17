// Dates are stored as Barcelona wall-clock time ("YYYY-MM-DDTHH:mm") and shown as-is in every timezone.
function parts(value) {
  const [d, t = '00:00'] = value.split('T')
  const [y, m, day] = d.split('-').map(Number)
  const [h, min] = t.split(':').map(Number)
  return new Date(y, m - 1, day, h, min)
}

export function formatDateParts(value) {
  const d = parts(value)
  return {
    day: d.toLocaleDateString('en-GB', { day: 'numeric' }),
    month: d.toLocaleDateString('en-GB', { month: 'short' }),
    weekday: d.toLocaleDateString('en-GB', { weekday: 'long' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  }
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
  }).format(price)
}

export const WORKSHOP_DURATION_MINUTES = 90

export function formatLongDate(value) {
  const start = parts(value)
  const end = new Date(start.getTime() + WORKSHOP_DURATION_MINUTES * 60000)
  const time = (d) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return {
    day: start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    time: `${time(start)} – ${time(end)}`,
  }
}
