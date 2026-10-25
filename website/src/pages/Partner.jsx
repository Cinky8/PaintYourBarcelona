import { useState } from 'react'
import emailjs from '@emailjs/browser'
import images from '../images'

// ── EmailJS config ─────────────────────────────────────────────────────────
// Sign up at emailjs.com, connect your Gmail, create two templates, then
// paste the IDs below. See the setup guide at the bottom of this file.
const EMAILJS_SERVICE_ID       = 'service_5az77mg'
const EMAILJS_NOTIFY_TEMPLATE  = 'template_mf8wmjc'
const EMAILJS_REPLY_TEMPLATE   = 'template_0nx07uq'
const EMAILJS_PUBLIC_KEY       = 'ub6jtaQkyGrvKaqQG'
// ──────────────────────────────────────────────────────────────────────────

const WORKSHOPS = ['Postcards', 'Holiday Cards', 'T-Shirts', 'Mugs', 'Not sure yet']

const EMPTY_FORM = {
  name: '', email: '', company: '', teamSize: '', location: '', phone: '',
  date: '', workshop: WORKSHOPS[0], message: '',
}

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" className="size-7 text-text-primary" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

const CRAFTS = [
  {
    title: 'Postcards',
    bg: 'bg-[#c2e6f0]',
    icon: <Icon><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M14 9h4M14 12h4M14 15h3M11 5v14" /><path d="M5 15l2-3 2 2 1-1" /></Icon>,
    desc: "Sketch Barcelona's most iconic landmarks and paint them in acrylics on your own postcard. Our signature workshop and the easiest way to start.",
    tags: ['Barcelona-inspired'],
  },
  {
    title: 'Holiday Cards',
    bg: 'bg-orange',
    icon: <Icon><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M12 7l1.4 2.9 3.1.4-2.3 2.2.6 3.1L12 14.1l-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z" /></Icon>,
    desc: 'Christmas, Easter or any seasonal moment. Paint personal cards your team can actually send to clients, family or each other.',
    tags: ['Seasonal', 'Ready to send'],
  },
  {
    title: 'T-Shirts',
    bg: 'bg-gold',
    icon: <Icon><path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z" /></Icon>,
    desc: 'Design and paint your own T-shirt with fabric paints. A wearable souvenir that lasts long after the event.',
    tags: ['Wearable'],
  },
  {
    title: 'Mugs',
    bg: 'bg-[#e9c9b8]',
    icon: <Icon><path d="M4 7h12v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7z" /><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" /><path d="M8 3v2M12 3v2" /></Icon>,
    desc: 'Paint a ceramic mug that will sit on desks and kitchen counters for years: a daily reminder of a good day together.',
    tags: ['Everyday use'],
  },
]

const STEPS = [
  { title: 'Tell us about your team', desc: 'Group size, date, and the occasion.' },
  { title: 'We tailor the session', desc: 'We pick the craft and theme together, and you get a clear proposal.' },
  { title: 'We bring everything', desc: 'We set up at your office or a venue of your choice, guide the session, and clean up afterwards.' },
  { title: 'Everyone takes something home', desc: 'A finished piece, made by them.' },
]

const REASONS = [
  { title: 'Effortless for you', desc: 'We handle everything, from materials and setup to guidance and clean-up. You just bring the team.' },
  { title: 'Made for every skill level', desc: "Step-by-step guidance means everyone finishes with something beautiful, whether they paint every weekend or haven't held a brush since school." },
  { title: 'Quality materials', desc: 'Professional paints, papers, textiles and ceramics, chosen for great results and pieces that last.' },
  { title: 'Connection through creativity', desc: "Making something side by side sparks conversation and laughter, and it's a shared memory that a meeting room can't create." },
]

const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

export default function Partner() {
  const [form, setForm]     = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    // The EmailJS templates only know the original fields, so the new details travel inside `message`.
    const details = [
      `Company: ${form.company}`,
      `Team size: ${form.teamSize}`,
      `Preferred date: ${form.date || '—'}`,
    ].join('\n')

    const templateVars = {
      from_name:     form.name,
      from_email:    form.email,
      location:      form.location,
      phone:         form.phone,
      website:       form.company,
      activity_type: form.workshop,
      message:       `${details}\n\n${form.message || '—'}`,
    }

    try {
      // 1. Notification email → paintyourbarcelona@gmail.com
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_NOTIFY_TEMPLATE,
        { ...templateVars, to_email: 'paintyourbarcelona@gmail.com' },
        EMAILJS_PUBLIC_KEY,
      )

      // 2. Auto-reply → user's email
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_REPLY_TEMPLATE,
        { to_name: form.name, to_email: form.email },
        EMAILJS_PUBLIC_KEY,
      )

      setStatus('success')
      setForm(EMPTY_FORM)
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
    }
  }

  const inputCls = 'bg-cream-alt border border-cream-alt rounded-lg px-4 py-4 text-base text-text-primary placeholder-text-secondary/40 font-sans outline-none focus:border-terracotta/40 transition-colors shadow-sm'
  const labelCls = 'font-sans text-xs uppercase tracking-[0.1em] text-text-secondary/70'
  const optional = <span className="normal-case tracking-normal text-text-secondary/40">(optional)</span>

  return (
    <main className="pt-[92px]">

      {/* ── HERO ── */}
      <section className="bg-cream px-8 py-20 md:py-28 overflow-hidden">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <p className="font-sans font-bold text-xs uppercase tracking-[0.15em] text-terracotta">
              Corporate Creative Workshops
            </p>
            <h1 className="font-serif text-[56px] md:text-[80px] leading-[1] tracking-[-0.01em] text-text-primary">
              <span className="text-terracotta">Create</span>
              <br />Together
            </h1>
            <p className="font-sans text-lg text-text-secondary leading-relaxed max-w-[480px]">
              Hands-on craft workshops that bring your team together, away from screens and spreadsheets. Everyone paints something with their own hands and leaves with a piece they're proud of.
            </p>
            <div className="pt-2">
              <button
                onClick={scrollToContact}
                className="bg-terracotta text-white font-sans font-bold text-base px-8 py-4 rounded-lg shadow-sm hover:bg-terracotta/90 transition-colors"
              >
                Plan Your Workshop
              </button>
            </div>
          </div>

          {/* Right — image collage */}
          <div className="hidden lg:flex items-center justify-center relative h-[420px]">
            <div className="absolute top-0 right-0 w-[55%] h-[260px] bg-cream-alt rounded-xl shadow-lg overflow-hidden">
              <img src={images.PartnerLanding1} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 w-[55%] h-[260px] bg-cream-alt rounded-xl shadow-lg overflow-hidden">
              <img src={images.HolidayCards1} alt="Four hand-painted Christmas cards: snowman, tree, bauble and Santa" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CHOOSE YOUR CRAFT ── */}
      <section className="bg-cream-alt px-8 py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
          <div className="flex flex-col gap-4 max-w-[600px]">
            <h2 className="font-serif text-4xl md:text-[48px] leading-[1.1] text-text-primary">
              Choose your craft
            </h2>
            <p className="font-sans text-lg text-text-secondary leading-relaxed">
              Four workshops, all guided step by step and suited to every skill level. No artistic experience needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CRAFTS.map(({ title, bg, icon, desc, tags }) => (
              <div key={title} className="bg-cream rounded-2xl p-8 flex flex-col gap-5">
                <div className={`size-14 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-[22px] text-text-primary leading-snug">{title}</h3>
                  <p className="font-sans text-base text-text-secondary leading-relaxed">{desc}</p>
                </div>
                <div className="flex flex-col gap-2 mt-auto pt-2">
                  {[...tags, '1.5 – 2 hours'].map(tag => (
                    <span key={tag} className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-terracotta">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAKE IT YOURS ── */}
      <section className="bg-dark px-8 py-20 md:py-24">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-16 items-center">
          <h2 className="font-serif text-3xl md:text-[44px] leading-[1.1] text-[#f2f1ee]">
            Your company, your theme.
          </h2>
          <p className="font-sans text-lg text-[#f2f1ee]/70 leading-relaxed">
            We can build the workshop around your brand, a product launch, a company milestone or a seasonal campaign. That covers colours, motifs, logos or a shared theme. Or keep it simple and let everyone paint what inspires them. Both work beautifully.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-cream px-8 py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-center">
          <div className="rounded-xl overflow-hidden shadow-md max-w-[460px] w-full mx-auto lg:-rotate-2">
            <img src={images.Landing} alt="Hand-painted Barcelona postcards of the Sagrada Família and Arc de Triomf" className="w-full aspect-[3/4] object-cover" loading="lazy" decoding="async" />
          </div>

          <div className="flex flex-col gap-12">
            <h2 className="font-serif text-4xl md:text-[48px] leading-[1.1] text-text-primary">
              How it works
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {STEPS.map(({ title, desc }, i) => (
                <li key={title} className="flex flex-col gap-4 border-t border-text-primary/15 pt-6">
                  <span className="font-serif text-4xl text-terracotta leading-none">{i + 1}</span>
                  <h3 className="font-serif text-xl text-text-primary">{title}</h3>
                  <p className="font-sans text-base text-text-secondary leading-relaxed">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── WHY PARTNER WITH US ── */}
      <section className="bg-cream-alt px-8 py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="hidden lg:grid grid-cols-2 gap-4 h-[520px]">
            <div className="rounded-xl overflow-hidden bg-cream shadow-md">
              <img src={images.Why1} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
            <div className="rounded-xl overflow-hidden bg-cream shadow-md mt-10">
              <img src={images.HolidayCards2} alt="Hand-painted Christmas tree and snowman cards" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <h2 className="font-serif text-4xl md:text-[48px] leading-[1] text-text-primary">
              Why Partner With Us?
            </h2>
            <div className="flex flex-col gap-10">
              {REASONS.map(({ title, desc }, i) => (
                <div key={title} className="flex gap-6">
                  <span className="font-sans font-bold text-2xl text-terracotta/30 shrink-0 pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif text-xl text-text-primary">{title}</h3>
                    <p className="font-sans text-base text-text-secondary leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="bg-cream px-8 py-24 md:py-32">
        <div className="max-w-[760px] lg:max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-start">
          <div className="flex flex-col gap-4 text-center lg:text-left lg:sticky lg:top-[120px]">
            <h2 className="font-serif text-4xl md:text-[56px] leading-[1] text-text-primary italic">
              Let's plan your workshop.
            </h2>
            <p className="font-sans text-lg text-text-secondary leading-relaxed">
              Tell us a bit about your team and we'll reply within 24 hours with ideas and a proposal.
            </p>
            <div className="hidden lg:block mt-8 rounded-xl overflow-hidden shadow-md rotate-2 max-w-[380px]">
              <img src={images.Why2} alt="Hand-painted Gaudí-style lizard on a Barcelona postcard" className="w-full aspect-[3/4] object-cover" loading="lazy" decoding="async" />
            </div>
          </div>

          {/* ── Success state ── */}
          {status === 'success' ? (
            <div className="bg-cream-alt rounded-2xl p-12 flex flex-col items-center gap-4 text-center shadow-sm">
              <div className="size-16 rounded-full bg-terracotta/10 flex items-center justify-center text-3xl">✓</div>
              <h3 className="font-serif text-2xl text-text-primary">Message received!</h3>
              <p className="font-sans text-base text-text-secondary leading-relaxed max-w-[400px]">
                Thanks for reaching out. We've sent a confirmation to your inbox and will reply within 24 hours.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 font-sans font-bold text-sm text-terracotta border-b border-terracotta pb-0.5 hover:opacity-70 transition-opacity"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Your Name</label>
                  <input required type="text" placeholder="Diana Fernandez" value={form.name} onChange={set('name')} className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Email Address</label>
                  <input required type="email" placeholder="diana@company.com" value={form.email} onChange={set('email')} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Company Name</label>
                  <input required type="text" placeholder="Your company" value={form.company} onChange={set('company')} className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Team Size</label>
                  <input required type="text" inputMode="numeric" placeholder="e.g. 15" value={form.teamSize} onChange={set('teamSize')} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Location</label>
                  <input required type="text" placeholder="Barcelona, Spain" value={form.location} onChange={set('location')} className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Your Number {optional}</label>
                  <input type="tel" placeholder="+34 600 000 000" value={form.phone} onChange={set('phone')} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Workshop</label>
                  <select value={form.workshop} onChange={set('workshop')} className={`${inputCls} appearance-none`}>
                    {WORKSHOPS.map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Preferred Date {optional}</label>
                  <input type="date" value={form.date} onChange={set('date')} className={inputCls} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelCls}>Anything else you'd like to add? {optional}</label>
                <textarea
                  rows={4}
                  placeholder="Occasion, company theme ideas, anything else…"
                  value={form.message}
                  onChange={set('message')}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {status === 'error' && (
                <p className="font-sans text-sm text-red-500 text-center">
                  Something went wrong — please try again or email us directly at paintyourbarcelona@gmail.com
                </p>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-terracotta hover:bg-terracotta/90 disabled:opacity-60 text-white font-sans font-bold text-base py-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? 'Sending…' : <> Send Inquiry <span>→</span> </>}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

    </main>
  )
}
