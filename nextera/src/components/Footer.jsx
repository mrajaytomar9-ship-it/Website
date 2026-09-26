import { Link } from 'react-router-dom'
import { CONTACT_DETAILS, FOOTER_LINKS, whatsappLink, ENQUIRY_MESSAGES } from '../lib/content'
import { Logo } from './Logo'
import { WhatsAppGlyph } from './Navbar'
import Reveal from './ui/Reveal'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-rule">
      {/* Ambient depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-[0.16]"
        style={{
          background:
            'radial-gradient(58% 100% at 50% 100%, rgba(232,146,47,0.5) 0%, transparent 72%)',
        }}
      />

      <div className="shell relative">
        <div className="grid gap-14 py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2.4fr)] lg:gap-20 lg:py-24">
          {/* Identity */}
          <Reveal>
            <Logo />
            <p className="mt-6 max-w-sm text-[14.5px] leading-[1.68] text-ash2 text-pretty">
              Website, WhatsApp enquiry path and Google Business Profile work for hotels and
              clinics in {CONTACT_DETAILS.city}. Scoped packages, tested enquiry paths, and an
              honest answer when something is not worth doing.
            </p>

            <div className="mt-8 flex flex-col gap-2.5">
              <a
                href={whatsappLink(ENQUIRY_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2.5 text-[14.5px] text-ink transition-colors hover:text-ember-soft"
              >
                <WhatsAppGlyph className="h-4 w-4 text-mint" />
                WhatsApp us
              </a>
              <a
                href={`tel:${CONTACT_DETAILS.phoneRaw.replace(/\s/g, '')}`}
                className="text-[14.5px] text-ash transition-colors hover:text-ink"
              >
                {CONTACT_DETAILS.phoneDisplay}
              </a>
              <a
                href={`mailto:${CONTACT_DETAILS.email}`}
                className="text-[14.5px] text-ash transition-colors hover:text-ink"
              >
                {CONTACT_DETAILS.email}
              </a>
              <span className="pt-1 text-[13.5px] text-ash3">
                {CONTACT_DETAILS.city}, {CONTACT_DETAILS.region}
              </span>
            </div>
          </Reveal>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {FOOTER_LINKS.map((col, i) => (
              <Reveal key={col.heading} delay={i * 70}>
                <h3 className="micro mb-5 text-ink">{col.heading}</h3>
                <ul className="flex flex-col gap-3.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="group inline-flex items-center gap-1.5 text-[14px] text-ash2 transition-colors hover:text-ink"
                      >
                        <span className="h-px w-0 bg-ink transition-all duration-300 group-hover:w-3" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-5 border-t border-rule py-7 sm:flex-row sm:items-center">
          <p className="micro text-ash3">
            © {year} Nextera Solution. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-mint" />
            <span className="text-[12.5px] text-ash3">
              {CONTACT_DETAILS.responseNote}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
