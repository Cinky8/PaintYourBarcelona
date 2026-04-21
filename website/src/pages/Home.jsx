import { useEffect } from 'react'

// ── Calendly inline embed ──────────────────────────────────────────────────
// background matches dark section, text + primary set to off-white so
// Calendly's default blue headings render white instead
const CALENDLY_URL =
  'https://calendly.com/paintyourbarcelona/new-meeting?hide_gdpr_banner=1'

function CalendlyEmbed() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://assets.calendly.com/assets/external/widget.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link)
      if (document.body.contains(script)) document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
      <div
        className="calendly-inline-widget w-full"
        data-url={CALENDLY_URL}
        style={{ minWidth: '320px', height: '900px' }}
      />
    </div>
  )
}

// Image assets from Figma MCP local server
const heroImg = 'http://localhost:3845/assets/0f640192477554facaf3b6a9ef18a0b871cbff5b.png'
const sketchIcon = 'http://localhost:3845/assets/379b40ef23648a1e0f36939495e03126ec4bae56.svg'
const paintIcon = 'http://localhost:3845/assets/e0cf518b0e02b7610c7c36992b3dcb31daf87243.svg'
const souvenirIcon = 'http://localhost:3845/assets/5ad826333f3f0c36a27d7d156d242c6e0616326d.svg'
const checkIcon = 'http://localhost:3845/assets/12840032243c4a2acb087da04b98565ad1c8c683.svg'
const socialImg1 = 'http://localhost:3845/assets/c22de06935aa1c5a795a1b00c420d68a6353ffe0.svg'
const socialImg2 = 'http://localhost:3845/assets/79907cc83c32c267521e62719ea141e501dfad43.svg'

export default function Home() {
  return (
    <main className="pt-[92px]">

      {/* ── HERO ── */}
      <section className="bg-cream flex items-center px-8 pt-12 pb-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col gap-6">
            <p className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-terracotta">
              Artistic Immersion in Barcelona
            </p>
            <h1 className="font-serif text-[64px] lg:text-[96px] leading-[1] tracking-[-0.02em] text-text-primary">
              Paint your<br />
              Barcelona{' '}
              <span className="relative inline-block">
                <span className="relative z-10">memory.</span>
                <span className="absolute bottom-1 left-[-4%] right-[-4%] h-5 bg-orange/30 rounded-full -rotate-1 z-0" />
              </span>
            </h1>
            <p className="font-sans text-lg text-text-secondary leading-relaxed max-w-[440px]">
              Thousands of photos on your phone. But did you ever create your own souvenir?
              Join us for a unique postcard painting workshop in the heart of Barcelona.
            </p>
            <div className="pt-2">
              <a
                href="#reserve"
                className="inline-block bg-terracotta text-white font-sans font-bold text-base px-10 py-4 rounded-lg shadow-sm hover:bg-terracotta/90 transition-colors"
              >
                Join a Workshop
              </a>
            </div>
          </div>

          {/* Right — Hero image */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-[-4%_-8%_-7%_0%] bg-[rgba(197,232,243,0.3)] rounded-2xl -rotate-3" />
            <div className="relative rounded-xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
              <img src={heroImg} alt="Barcelona painting workshop" className="w-full h-full object-cover" />
            </div>
            {/* Floating quote card */}
            <div className="absolute -bottom-10 -left-10 bg-white rounded-xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] p-6 max-w-[200px]">
              <p className="font-serif text-orange text-lg leading-[1.55]">
                "Make your own personal and creative souvenir"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WORKSHOP EXPERIENCE ── */}
      <section className="bg-cream-alt px-8 py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-20">
          {/* Heading */}
          <div className="flex flex-col items-center gap-4">
            <h2 className="font-serif text-4xl md:text-[48px] leading-[1] text-text-primary text-center">
              The Workshop Experience
            </h2>
            <div className="w-24 h-1 bg-gold rounded-full" />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="mb-4 flex items-center justify-center rounded-full size-20 bg-[#c2e6f0]">
                <img src={sketchIcon} alt="Sketching" className="w-7 h-6 object-contain" />
              </div>
              <h3 className="font-serif text-2xl text-text-primary">Sketching</h3>
              <p className="font-sans text-base text-text-secondary leading-relaxed">
                We begin with basic pencil drawings of iconic monuments of the city, like Sagrada Familia and Arc de Triomf.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="mb-4 flex items-center justify-center rounded-full size-20 bg-orange">
                <img src={paintIcon} alt="Painting" className="w-7 h-7 object-contain" />
              </div>
              <h3 className="font-serif text-2xl text-text-primary">Painting</h3>
              <p className="font-sans text-base text-text-secondary leading-relaxed">
                Layer vibrant acrylic colors to recreate the terracotta rooftops and fun colours of Gaudí's buildings.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="mb-4 flex items-center justify-center rounded-full size-20 bg-gold">
                <img src={souvenirIcon} alt="Souvenir" className="w-8 h-8 object-contain" />
              </div>
              <h3 className="font-serif text-2xl text-text-primary">Souvenir</h3>
              <p className="font-sans text-base text-text-secondary leading-relaxed">
                Walk away with your personal hand-painted postcard, ready to be sent to loved ones or framed for your gallery wall.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRAVELLERS EXPERIENCES ── */}
      <section className="bg-cream px-8 py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
          {/* Heading */}
          <div className="flex flex-col items-center gap-3">
            <p className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-terracotta">
              Workshop Stories
            </p>
            <h2 className="font-serif text-4xl md:text-[48px] leading-[1] text-text-primary text-center">
              Travellers experiences
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Testimonial 1 */}
            <div className="bg-cream-alt rounded-2xl p-8 flex flex-col gap-6">
              <div className="bg-[#dbdad7] rounded-xl h-48 w-full" />
              <div className="flex flex-col gap-4">
                <p className="font-serif text-lg text-text-primary leading-[1.625]">
                  "Great experience, I went with some friends and we had a lot of fun. The teacher was very kind and helped us at all times. I recommend anyone that passes by Barcelona to go!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-[rgba(149,73,38,0.2)] flex items-center justify-center">
                    <span className="font-sans font-bold text-terracotta text-base">M</span>
                  </div>
                  <div>
                    <p className="font-sans font-bold text-text-primary text-sm">Marco</p>
                    <p className="font-sans text-text-secondary text-xs">from Italy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-cream-alt rounded-2xl p-8 flex flex-col gap-6">
              <div className="bg-[#dbdad7] rounded-xl h-48 w-full" />
              <div className="flex flex-col gap-4">
                <p className="font-serif text-lg text-text-primary leading-[1.625]">
                  "I partecipated to a workshop with some friends and it was a really cool experience, I was able to fully express my creativity! Diana was very professional and patient."
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-[rgba(66,99,108,0.2)] flex items-center justify-center">
                    <span className="font-sans font-bold text-[#42636c] text-base">N</span>
                  </div>
                  <div>
                    <p className="font-sans font-bold text-text-primary text-sm">Nicole</p>
                    <p className="font-sans text-text-secondary text-xs">from Uruguay</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-cream-alt rounded-2xl p-8 flex flex-col gap-6">
              <div className="bg-[#dbdad7] rounded-xl h-48 w-full" />
              <div className="flex flex-col gap-4">
                <p className="font-serif text-lg text-text-primary leading-[1.625]">
                  "We joined the workshop on a rainy day during our trip and what a wonderful experience it was! Thanks to Diana's help I think all of us did pretty good job."
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-[rgba(124,88,0,0.2)] flex items-center justify-center">
                    <span className="font-sans font-bold text-[#7c5800] text-base">A</span>
                  </div>
                  <div>
                    <p className="font-sans font-bold text-text-primary text-sm">Adam</p>
                    <p className="font-sans text-text-secondary text-xs">from Slovakia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIALIZE SECTION ── */}
      <section className="bg-cream px-8 py-24 md:py-32 overflow-hidden">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
          <h2 className="font-serif text-[48px] md:text-[60px] leading-[1] text-text-primary max-w-[560px]">
            Socialize, sip, and rediscover your creativity
          </h2>
          {/* Gallery grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-[320px] md:h-[500px]">
            <div className="col-span-1 row-span-1 bg-cream-alt rounded-xl overflow-hidden md:col-start-1">
              <div className="w-full h-full bg-[#dbdad7]" />
            </div>
            <div className="col-span-1 row-span-1 bg-cream-alt rounded-xl overflow-hidden md:mt-12">
              <div className="w-full h-full bg-[#ccc9c4]" />
            </div>
            <div className="col-span-1 row-span-1 bg-cream-alt rounded-xl overflow-hidden">
              <div className="w-full h-full bg-[#e0ddd8]" />
            </div>
            <div className="col-span-1 row-span-1 bg-cream-alt rounded-xl overflow-hidden md:mt-12">
              <div className="w-full h-full bg-[#d0cdc7]" />
            </div>
          </div>
        </div>
      </section>

      {/* ── RESERVE YOUR SPOT ── */}
      <section id="reserve" className="bg-dark px-8 py-24 md:py-32">
        <div className="max-w-[900px] mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <h2 className="font-serif text-4xl md:text-[48px] leading-[1] text-[#f2f1ee]">
              Reserve your spot
            </h2>
            <p className="font-sans text-base text-[#f2f1ee]/60">
              Pick a date and time — you'll get an instant confirmation email.
            </p>
          </div>
          <CalendlyEmbed />
        </div>
      </section>

      {/* ── FOR HOSTELS & VENUES ── */}
      <section className="bg-cream-alt px-8 py-20 md:py-24">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left image placeholder */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-[480px] aspect-[4/3] bg-cream rounded-2xl flex items-center justify-center">
              <div className="size-32 rounded-full border-2 border-dashed border-gold/40" />
            </div>
          </div>

          {/* Right content */}
          <div className="flex flex-col gap-8">
            <h2 className="font-serif text-4xl md:text-[48px] leading-[1.1] text-text-primary">
              For Hostels &amp; Venues
            </h2>
            <p className="font-sans text-lg text-text-secondary leading-relaxed">
              Elevate your guest experience with curated creative workshops. We collaborate with hostels and cafes to bring the art of Barcelona directly to your guests in a fun, social setting.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img src={checkIcon} alt="check" className="size-5 shrink-0" />
                <span className="font-sans text-base text-text-primary">Fully mobile setup &amp; mess-free cleaning</span>
              </div>
              <div className="flex items-center gap-4">
                <img src={checkIcon} alt="check" className="size-5 shrink-0" />
                <span className="font-sans text-base text-text-primary">Authentic Barcelona vibes for your guests</span>
              </div>
            </div>
            <div>
              <a
                href="/partner"
                className="inline-block font-sans font-bold text-sm text-terracotta border-b border-terracotta pb-0.5 hover:opacity-70 transition-opacity"
              >
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEET DIANA ── */}
      <section className="bg-cream px-8 py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-12 text-center">
          <p className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-terracotta">
            Your Guide
          </p>
          {/* Circular avatar */}
          <div className="size-32 md:size-40 rounded-full bg-cream-alt border-2 border-gold/30 flex items-center justify-center overflow-hidden">
            <div className="size-full bg-[#dbdad7] rounded-full" />
          </div>
          <div className="flex flex-col gap-5 max-w-[580px]">
            <h2 className="font-serif text-4xl md:text-[48px] leading-[1] text-text-primary">
              Meet Diana
            </h2>
            <p className="font-sans text-lg text-text-secondary leading-relaxed">
              Diana is a Barcelona-based artist and workshop facilitator who has been bringing the joy of painting to travellers for over five years. Her patient, step-by-step approach means everyone leaves with a painting they're proud of — no experience needed.
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}
