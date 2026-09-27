import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV, CONTACT_DETAILS, whatsappLink, ENQUIRY_MESSAGES } from '../lib/content'
import { Logo } from './Logo'
import { useScrolled, useMedia } from './ui/Primitives'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(20)
  const isDesktop = useMedia('(min-width: 1024px)')
  const { pathname, hash } = useLocation()

  // Close the mobile sheet on navigation
  useEffect(() => {
    setOpen(false)
  }, [pathname, hash])

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Esc closes
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-rule bg-black/72 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="shell">
          <div className="flex h-[68px] items-center justify-between gap-6 md:h-[76px]">
            <Link
              to="/"
              className="shrink-0 transition-opacity hover:opacity-75"
              aria-label="Nextera Solution — home"
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              <Logo />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV.filter((n) => n.to !== '/').map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-white/[0.08] text-ink'
                        : 'bg-transparent text-ash hover:bg-white/[0.04] hover:text-ink'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {/* 2px, not 1px: a hairline underline was too faint to
                          read as "you are here" on a dark canvas. */}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3.5 -bottom-[3px] h-[2px] origin-left rounded-full bg-ink transition-transform duration-300 ${
                          isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <a
                href={`tel:${CONTACT_DETAILS.phoneRaw.replace(/\s/g, '')}`}
                className="hidden rounded-full border border-rule px-4 py-2 text-sm text-ash transition-colors hover:border-rule-strong hover:text-ink lg:inline-flex"
              >
                {CONTACT_DETAILS.phoneDisplay}
              </a>

              <a
                href={whatsappLink(ENQUIRY_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="group hidden items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4.5 py-2.5 text-xs font-medium tracking-[0.02em] text-ink transition-all duration-300 hover:border-white/30 hover:bg-white/[0.09] sm:inline-flex"
              >
                <WhatsAppGlyph className="h-[15px] w-[15px]" />
                Get started
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* Mobile trigger */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="relative z-[62] flex h-10 w-10 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-rule-strong lg:hidden"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
              >
                <span className="relative block h-[10px] w-[16px]">
                  <span
                    className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                      open ? 'top-[5px] rotate-45' : 'top-0'
                    }`}
                  />
                  <span
                    className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                      open ? 'top-[5px] -rotate-45' : 'top-[9px]'
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <MobileSheet open={open} isDesktop={isDesktop} onClose={() => setOpen(false)} />
    </>
  )
}

function MobileSheet({ open, isDesktop, onClose }) {
  const { pathname } = useLocation()
  if (isDesktop) return null

  return (
    <div
      className={`fixed inset-0 z-[61] lg:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-400 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`sheet-scroll absolute inset-x-0 top-0 origin-top border-b border-rule bg-coal px-5 pb-8 pt-[84px] transition-all duration-500 ${
          open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {NAV.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between border-b border-rule-faint py-4 font-display text-xl tracking-[-0.03em] transition-colors ${
                  isActive ? 'text-ink' : 'text-ash2 hover:text-ink'
                }`
              }
              style={{ transitionDelay: `${open ? i * 45 + 80 : 0}ms` }}
            >
              <span className="flex items-center gap-3">
                {/* NavLink already sets aria-current="page"; the dot is the
                    sighted-user equivalent inside the sheet. */}
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                    pathname === item.to ? 'bg-ink' : 'bg-transparent'
                  }`}
                />
                {item.label}
              </span>
              <span className="text-xs tracking-[0.2em] text-ash3">0{i + 1}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={whatsappLink(ENQUIRY_MESSAGES.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-void"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            Get started on WhatsApp
          </a>
          <a
            href={`tel:${CONTACT_DETAILS.phoneRaw.replace(/\s/g, '')}`}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-rule-strong text-sm text-ink"
          >
            {CONTACT_DETAILS.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  )
}

export function WhatsAppGlyph({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.12h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.35c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.2-8.24 8.2Z" />
    </svg>
  )
}
