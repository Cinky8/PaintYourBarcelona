// Image assets from Figma MCP local server
const heroImg1 = 'http://localhost:3845/assets/a31537eef0c6e75a6ba72a94a66164b3bca4d244.png'
const heroImg2 = 'http://localhost:3845/assets/02a4764b33ac20aaa630f1ebd6a241d083d7c474.png'
const hotelsIcon = 'http://localhost:3845/assets/d22e932b74a0d0989c4972e50ceadd7e58beb89f.svg'
const cafesIcon = 'http://localhost:3845/assets/adf68e7703a4b46564ebcd905d7b9156c8723f85.svg'
const corporateIcon = 'http://localhost:3845/assets/30e83e3daa3ee93430d092fcaf46aad38706a513.svg'
const partnerImg1 = 'http://localhost:3845/assets/f0719c933c1bfd2fecdd81e45b300c519b3a8a40.svg'
const partnerImg2 = 'http://localhost:3845/assets/8c747618536545964ceae7f14382e2f5fc733eea.svg'

export default function Partner() {
  return (
    <main className="pt-[92px]">

      {/* ── HERO ── */}
      <section className="bg-cream px-8 py-20 md:py-28 overflow-hidden">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col gap-6">
            <p className="font-sans font-bold text-xs uppercase tracking-[0.15em] text-terracotta">
              Partnerships &amp; Collaborations
            </p>
            <h1 className="font-serif text-[56px] md:text-[80px] leading-[1] tracking-[-0.01em] text-text-primary">
              Let's{' '}
              <span className="text-terracotta">Create</span>
              <br />Together
            </h1>
            <p className="font-sans text-lg text-text-secondary leading-relaxed max-w-[460px]">
              From hostels to team buildings we curate experiences that linger long after the paint has dried.
            </p>
            <div className="pt-2">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-terracotta text-white font-sans font-bold text-base px-8 py-4 rounded-lg shadow-sm hover:bg-terracotta/90 transition-colors"
              >
                Start a Conversation
              </button>
            </div>
          </div>

          {/* Right — image collage */}
          <div className="hidden lg:flex items-center justify-center relative h-[420px]">
            <div className="absolute top-0 right-0 w-[55%] h-[260px] bg-cream-alt rounded-xl shadow-lg overflow-hidden">
              <div className="w-full h-full bg-[#dbdad7]" />
            </div>
            <div className="absolute bottom-0 left-0 w-[55%] h-[260px] bg-cream-alt rounded-xl shadow-lg overflow-hidden">
              <div className="w-full h-full bg-[#ccc9c4]" />
            </div>
          </div>
        </div>
      </section>

      {/* ── DESIGNED FOR ALL OCCASIONS ── */}
      <section className="bg-cream-alt px-8 py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
          {/* Heading */}
          <div className="flex flex-col gap-4 max-w-[560px]">
            <h2 className="font-serif text-4xl md:text-[48px] leading-[1.1] text-text-primary">
              Designed for all occasions
            </h2>
            <p className="font-sans text-lg text-text-secondary leading-relaxed">
              Whether it's a cosy morning activity in a team retreat, we tailor our workshops to match the rhythm of any environment.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hotels & Guesthouses */}
            <div className="bg-cream rounded-2xl p-8 flex flex-col gap-5">
              <div className="size-14 rounded-xl bg-[#c2e6f0] flex items-center justify-center">
                <img src={hotelsIcon} alt="Hotels" className="size-7 object-contain" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-serif text-[22px] text-text-primary leading-snug">Hotels &amp; Guesthouses</h3>
                <p className="font-sans text-base text-text-secondary leading-relaxed">
                  Add a touch of local charm to your guest experience. Our workshops provide travellers with a creative and local Barcelona journey.
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-auto pt-2">
                <span className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-terracotta">Guest Engagement</span>
                <span className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-terracotta">Social Atmosphere</span>
              </div>
            </div>

            {/* Cafés & Wine Bars */}
            <div className="bg-cream rounded-2xl p-8 flex flex-col gap-5">
              <div className="size-14 rounded-xl bg-orange flex items-center justify-center">
                <img src={cafesIcon} alt="Cafés" className="size-7 object-contain" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-serif text-[22px] text-text-primary leading-snug">Cafés &amp; Wine Bars</h3>
                <p className="font-sans text-base text-text-secondary leading-relaxed">
                  Host creative evenings in your cosy spaces. Increase traffic during off-peak hours with Paint &amp; Sip sessions.
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-auto pt-2">
                <span className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-terracotta">Increase Traffic</span>
                <span className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-terracotta">Joint Marketing</span>
              </div>
            </div>

            {/* Corporate Team Building */}
            <div className="bg-cream rounded-2xl p-8 flex flex-col gap-5">
              <div className="size-14 rounded-xl bg-gold flex items-center justify-center">
                <img src={corporateIcon} alt="Corporate" className="size-7 object-contain" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-serif text-[22px] text-text-primary leading-snug">Corporate Team Building</h3>
                <p className="font-sans text-base text-text-secondary leading-relaxed">
                  Unique team-building activities for companies looking to foster connection through creativity.
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-auto pt-2">
                <span className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-terracotta">Bring Creativity &amp; Learn New Skills</span>
                <span className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-terracotta">Mobile Setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY PARTNER WITH US ── */}
      <section className="bg-cream px-8 py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — images */}
          <div className="hidden lg:grid grid-cols-2 gap-4 h-[480px]">
            <div className="rounded-xl overflow-hidden bg-cream-alt shadow-md">
              <div className="w-full h-full bg-[#ccc9c4]" />
            </div>
            <div className="rounded-xl overflow-hidden bg-cream-alt shadow-md mt-10">
              <div className="w-full h-full bg-[#dbdad7]" />
            </div>
          </div>

          {/* Right — reasons */}
          <div className="flex flex-col gap-10">
            <h2 className="font-serif text-4xl md:text-[48px] leading-[1] text-text-primary">
              Why Partner With Us?
            </h2>
            <div className="flex flex-col gap-10">
              {[
                {
                  num: '01',
                  title: 'Unmatched Reliability',
                  desc: 'We handle everything—from setup to clean-up. Our facilitators are punctual professionals who treat your space with utmost respect.',
                },
                {
                  num: '02',
                  title: 'Professional Grade Materials',
                  desc: 'We provide professional grade art materials and curated reference sessions that ensure beautiful results.',
                },
                {
                  num: '03',
                  title: 'Authentic Barcelona Vibes',
                  desc: 'Our workshops are rooted in the local art scene. We provide the kind of authentic experience that turns a simple visit into a memory.',
                },
              ].map(({ num, title, desc }) => (
                <div key={num} className="flex gap-6">
                  <span className="font-sans font-bold text-2xl text-terracotta/30 shrink-0 pt-1">{num}</span>
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

      {/* ── LET'S START THE DIALOGUE ── */}
      <section id="contact" className="bg-cream-alt px-8 py-24 md:py-32">
        <div className="max-w-[760px] mx-auto flex flex-col gap-12">
          {/* Heading */}
          <div className="flex flex-col gap-4 text-center">
            <h2 className="font-serif text-4xl md:text-[56px] leading-[1] text-text-primary italic">
              Let's start the dialogue.
            </h2>
            <p className="font-sans text-lg text-text-secondary leading-relaxed">
              Tell us a bit about your space and we'll reach out within 24 hours.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs uppercase tracking-[0.1em] text-text-secondary/70">Your Name</label>
                <input
                  type="text"
                  placeholder="Diana Fernandez"
                  className="bg-cream border border-cream-alt rounded-lg px-4 py-4 text-base text-text-primary placeholder-text-secondary/40 font-sans outline-none focus:border-terracotta/40 transition-colors shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs uppercase tracking-[0.1em] text-text-secondary/70">Email Address</label>
                <input
                  type="email"
                  placeholder="hello@yourvenue.com"
                  className="bg-cream border border-cream-alt rounded-lg px-4 py-4 text-base text-text-primary placeholder-text-secondary/40 font-sans outline-none focus:border-terracotta/40 transition-colors shadow-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs uppercase tracking-[0.1em] text-text-secondary/70">Full Location</label>
                <input
                  type="text"
                  placeholder="Barcelona, Spain"
                  className="bg-cream border border-cream-alt rounded-lg px-4 py-4 text-base text-text-primary placeholder-text-secondary/40 font-sans outline-none focus:border-terracotta/40 transition-colors shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs uppercase tracking-[0.1em] text-text-secondary/70">Your Number</label>
                <input
                  type="tel"
                  placeholder="+34 600 000 000"
                  className="bg-cream border border-cream-alt rounded-lg px-4 py-4 text-base text-text-primary placeholder-text-secondary/40 font-sans outline-none focus:border-terracotta/40 transition-colors shadow-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs uppercase tracking-[0.1em] text-text-secondary/70">Description / Website</label>
              <input
                type="url"
                placeholder="https://yourhostel.com"
                className="bg-cream border border-cream-alt rounded-lg px-4 py-4 text-base text-text-primary placeholder-text-secondary/40 font-sans outline-none focus:border-terracotta/40 transition-colors shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs uppercase tracking-[0.1em] text-text-secondary/70">Event / Activity Type</label>
              <select className="bg-cream border border-cream-alt rounded-lg px-4 py-4 text-base text-text-primary font-sans outline-none focus:border-terracotta/40 transition-colors shadow-sm appearance-none">
                <option>Hosting &amp; Guesthouses</option>
                <option>Cafés &amp; Wine Bars</option>
                <option>Corporate Team Building</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs uppercase tracking-[0.1em] text-text-secondary/70">
                Anything else you'd like to add? <span className="normal-case tracking-normal text-text-secondary/40">(optional)</span>
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your space, expected group size, preferred dates, or any other details..."
                className="bg-cream border border-cream-alt rounded-lg px-4 py-4 text-base text-text-primary placeholder-text-secondary/40 font-sans outline-none focus:border-terracotta/40 transition-colors shadow-sm resize-none"
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-terracotta hover:bg-terracotta/90 text-white font-sans font-bold text-base py-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                Send Inquiry <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </section>

    </main>
  )
}
