import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const isPartner = pathname === '/partner'

  const scrollToSection = (id) => {
    setOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  // Close menu on route change
  useEffect(() => setOpen(false), [pathname])

  // Add shadow once user scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-cream transition-shadow duration-300 ${scrolled ? 'shadow-[0_2px_16px_rgba(0,0,0,0.07)]' : 'border-b border-cream-alt'}`}>
      <div className="max-w-[1280px] mx-auto px-8 h-[68px] md:h-[92px] flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-serif text-text-primary text-base md:text-lg font-normal leading-tight hover:opacity-70 transition-opacity">
          Paint Your<br className="hidden md:block" /> Barcelona
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            to="/"
            className={`font-sans text-sm font-medium transition-colors ${!isPartner ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Home
          </Link>
          <Link
            to="/partner"
            className={`font-sans text-sm font-medium transition-colors ${isPartner ? 'text-text-primary border-b border-text-primary pb-0.5' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Become a partner
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => scrollToSection(isPartner ? 'contact' : 'reserve')}
            className="bg-terracotta text-white font-sans font-bold text-sm px-6 py-3 rounded-lg hover:bg-terracotta/90 transition-colors shadow-sm"
          >
            {isPartner ? 'Book Workshop' : 'Reserve Spot'}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2 text-text-primary"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <div className="w-6 flex flex-col gap-[5px]">
            <span className={`block h-0.5 bg-text-primary rounded-full transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-0.5 bg-text-primary rounded-full transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-0.5 bg-text-primary rounded-full transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu — slides down with max-height animation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-56' : 'max-h-0'}`}>
        <div className="bg-cream border-t border-cream-alt px-8 pt-4 pb-6 flex flex-col gap-1">
          <Link
            to="/"
            className="font-sans text-text-primary font-medium text-base py-3 border-b border-cream-alt"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/partner"
            className="font-sans text-text-primary font-medium text-base py-3 border-b border-cream-alt"
            onClick={() => setOpen(false)}
          >
            Become a partner
          </Link>
          <button
            className="mt-3 bg-terracotta text-white font-bold text-sm px-6 py-3 rounded-lg text-center w-full"
            onClick={() => scrollToSection(isPartner ? 'contact' : 'reserve')}
          >
            {isPartner ? 'Book Workshop' : 'Reserve Spot'}
          </button>
        </div>
      </div>
    </nav>
  )
}
