import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-dark text-[#f2f1ee]">
      <div className="max-w-[1280px] mx-auto px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="font-serif text-xl text-[#f2f1ee] leading-tight">
              Paint your<br />Barcelona
            </Link>
            <p className="font-sans text-sm text-[#f2f1ee]/60 leading-relaxed max-w-[260px]">
              Curating professional workshops that capture the golden light and creative soul of Barcelona.
            </p>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-[#f2f1ee]/50">Connect</p>
            <div className="flex flex-col gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-[#f2f1ee]/80 hover:text-[#f2f1ee] transition-colors">Instagram</a>
              <a href="#" className="font-sans text-sm text-[#f2f1ee]/80 hover:text-[#f2f1ee] transition-colors">City</a>
              <Link to="/partner" className="font-sans text-sm text-[#f2f1ee]/80 hover:text-[#f2f1ee] transition-colors">FAQ</Link>
              <a href="#" className="font-sans text-sm text-[#f2f1ee]/80 hover:text-[#f2f1ee] transition-colors">Privacy</a>
              <a href="#" className="font-sans text-sm text-[#f2f1ee]/80 hover:text-[#f2f1ee] transition-colors">Terms</a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-[#f2f1ee]/50">Newsletter</p>
            <p className="font-sans text-sm text-[#f2f1ee]/60 leading-relaxed">
              Get notified about upcoming workshops and Barcelona art events.
            </p>
            <div className="flex gap-2 mt-2">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#f2f1ee] placeholder-[#f2f1ee]/30 font-sans outline-none focus:border-orange/50 transition-colors"
              />
              <button className="bg-terracotta hover:bg-terracotta/90 text-white rounded-lg px-4 py-2.5 transition-colors text-lg font-bold leading-none">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-[#f2f1ee]/40">
            © 2024 Paint Your Barcelona. All rights reserved.
          </p>
          <p className="font-sans text-xs text-[#f2f1ee]/40">
            Barcelona, Spain
          </p>
        </div>
      </div>
    </footer>
  )
}
