import { Link } from 'react-router-dom'
import { CONTACT_DETAILS, whatsappLink, ENQUIRY_MESSAGES, NAV } from '../lib/content'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import { Dot } from '../components/ui/Primitives'
import useMeta from '../hooks/useMeta'

export default function NotFound() {
  useMeta('Page not found', 'The page you were looking for does not exist.')

  return (
    <section className="relative flex min-h-[86vh] items-center overflow-hidden pt-[124px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(48% 44% at 50% 24%, rgba(255,255,255,0.06) 0%, transparent 68%)',
        }}
      />

      <div className="shell relative">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-rule bg-white/[0.025] px-4 py-2">
              <Dot tone="ember" className="anim-pulse" />
              <span className="micro text-ash2">Error 404</span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-9 text-[clamp(3rem,10vw,7rem)] font-medium leading-[0.95] tracking-[-0.045em] text-ink">
              Page not
              <br />
              <span className="fade-line">on the map.</span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mx-auto mt-8 max-w-lg text-[16.5px] leading-[1.65] text-ash text-pretty">
              This link has moved, expired, or never existed. The pages that do exist are
              listed below — including the free audit.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <Button to="/" variant="primary" size="lg">
                Back to home
              </Button>
              <Button
                href={whatsappLink(ENQUIRY_MESSAGES.general)}
                variant="secondary"
                size="lg"
              >
                Ask us directly
              </Button>
            </div>
          </Reveal>

          <Reveal delay={420} className="mt-16 w-full">
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="rounded-full border border-rule px-4 py-2.5 text-[13px] text-ash transition-colors hover:border-rule-strong hover:text-ink"
                >
                  {n.label}
                </Link>
              ))}
            </div>
            <p className="mt-8 text-[13px] text-ash3">
              Or call {CONTACT_DETAILS.phoneDisplay} · {CONTACT_DETAILS.responseNote}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
