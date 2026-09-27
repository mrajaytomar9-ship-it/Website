import { CONTACT_DETAILS, whatsappLink, ENQUIRY_MESSAGES } from '../lib/content'
import Button from './ui/Button'
import Reveal from './ui/Reveal'
import { Rule } from './ui/Primitives'

/**
 * CtaBand — the recurring call-to-action panel. `hatch` adds the diagonal
 * stripe band used as a section separator elsewhere on the site.
 */
export default function CtaBand({
  line1 = 'Ready when you are.',
  line2 = 'Start with the free audit.',
  sub = 'Tell us what you do and where your customers find you today. You will get a written list of what is actually wrong — before any price is discussed.',
  primary = { label: 'Request a free audit', to: '/contact' },
  showHatch = false,
}) {
  return (
    <section className="relative">
      {showHatch && (
        <div className="shell">
          <Rule hatch />
        </div>
      )}

      <div className="band">
        <div className="shell">
          <div className="relative overflow-hidden rounded-xl border border-rule bg-coal px-6 py-16 text-center sm:px-12 md:py-24">
            {/* ambient */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(60% 90% at 50% 0%, rgba(232,146,47,0.11) 0%, transparent 70%)',
              }}
            />
            <div aria-hidden="true" className="hairline-grid pointer-events-none absolute inset-0 opacity-45" />

            <Reveal className="cq-wrap relative">
              <h2 className="t-h2 text-balance text-ink">
                {line1}
                <br />
                <span className="fade-line">{line2}</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-[1.62] text-ash text-pretty">
                {sub}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button to={primary.to} variant="primary" size="lg" arrow>
                  {primary.label}
                </Button>
                <Button
                  href={whatsappLink(ENQUIRY_MESSAGES.general)}
                  variant="secondary"
                  size="lg"
                >
                  WhatsApp {CONTACT_DETAILS.phoneDisplay}
                </Button>
              </div>

              <p className="mt-7 text-sm text-ash3">
                {CONTACT_DETAILS.responseNote} · {CONTACT_DETAILS.businessHoursLabel}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
