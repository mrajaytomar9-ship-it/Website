import {
  SERVICES,
  GROWTH_FRAMEWORK,
  NICHES_DETAIL,
  CONTACT_DETAILS,
  whatsappLink,
  ENQUIRY_MESSAGES,
} from '../lib/content'
import PageHero from '../components/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import CtaBand from '../components/CtaBand'
import ServiceIcon from '../components/ServiceIcon'
import { SectionHead } from '../components/ui/Primitives'
import {
  EnquiryMockup,
  ProfileMockup,
  DeliveryMockup,
  CareMockup,
  PhoneMockup,
} from '../components/Mockups'
import useMeta from '../hooks/useMeta'

const MOCKS = [
  <DeliveryMockup key="m0" />,
  <PhoneMockup
    key="m1"
    title="An enquiry answered in 5 seconds"
    accent="mint"
    lines={[
      'New enquiry received · 2:14 AM',
      'Automated reply sent in 4 seconds',
      'Follow-up scheduled · day 2',
    ]}
  />,
  <ProfileMockup key="m2" />,
  <CareMockup key="m3" />,
  <PhoneMockup
    key="m4"
    title="A call answered at 11:40 PM"
    accent="ember"
    lines={[
      'Incoming call · answered in 2 rings',
      'Caller: name and number captured',
      'Appointment requested · forwarded to CRM',
    ]}
  />,
]

export default function Services() {
  useMeta(
    'Services',
    'Premium website development, customer experience automation, online presence and WhatsApp CRM for businesses across India. Every service scoped with explicit inclusions.'
  )

  return (
    <>
      <PageHero
        eyebrow="Service catalogue"
        line1="Four core services."
        line2="One growth system."
        sub="Each service can be bought on its own, or combined into a bundle for a lower total price. Every engagement starts with understanding your business — not with a template."
        meta={[
          { l: 'Core services', v: '5' },
          { l: 'Websites from', v: '₹23,600' },
          { l: 'AI voice from', v: '₹14,999' },
          { l: 'Free first step', v: '30-min consultation' },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2.5 text-sm text-ash transition-colors hover:border-rule-strong hover:text-ink"
            >
              <ServiceIcon name={s.icon} className="h-3.5 w-3.5" />
              {s.title.split(' & ')[0]}
            </a>
          ))}
        </div>
      </PageHero>

      {SERVICES.map((service, i) => (
        <ServiceSection
          key={service.id}
          service={service}
          index={i}
          mock={MOCKS[i]}
          flip={i % 2 === 1}
        />
      ))}

      {/* ------------------------------------------------ 5-STEP FRAMEWORK */}
      <section id="framework" className="band relative border-y border-rule bg-black/35">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Our 5-step growth framework"
              sub="Every engagement follows the same five steps, whether it is a single website or the complete system."
            >
              How the work
              <br />
              <span className="fade-line">actually runs.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {GROWTH_FRAMEWORK.map((g, i) => (
              <Reveal key={g.n} delay={i * 90}>
                <div className="h-full rounded-xl border border-rule bg-void p-6">
                  <p className="micro text-ember">{g.n}</p>
                  <h3 className="mt-4 font-display text-xl tracking-[-0.03em] text-ink">{g.t}</h3>
                  <p className="mt-3 text-sm leading-[1.6] text-ash2 text-pretty">{g.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ NICHE BOUNDARIES */}
      <section className="band">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Sector experience"
              sub="We already know what is reasonable to put on a hotel or clinic website — and what would be a promise we cannot keep."
            >
              What we build well,
              <br />
              <span className="fade-line">and what we will not oversell.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {NICHES_DETAIL.map((n, i) => (
              <Reveal key={n.id} delay={i * 110}>
                <article
                  id={n.id}
                  className="h-full scroll-mt-28 overflow-hidden rounded-xl border border-rule bg-void"
                >
                  <div className="border-b border-rule px-7 py-6">
                    <p className="micro text-ash3">{n.label}</p>
                    <h3 className="mt-3.5 font-display text-xl tracking-[-0.03em] text-ink">
                      {n.headline}
                    </h3>
                    <p className="mt-3.5 text-sm leading-[1.6] text-ash2 text-pretty">{n.body}</p>
                  </div>

                  <div className="grid gap-7 p-7 sm:grid-cols-2">
                    <div>
                      <p className="micro mb-3.5 text-mint">Allowed</p>
                      <ul className="flex flex-col gap-2.5">
                        {n.allowed.map((a) => (
                          <li key={a} className="flex gap-2.5 text-sm leading-[1.5] text-ash">
                            <Tick />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="micro mb-3.5 text-ember-soft">Not offered</p>
                      <ul className="flex flex-col gap-2.5">
                        {n.notAllowed.map((a) => (
                          <li key={a} className="flex gap-2.5 text-sm leading-[1.5] text-ash3">
                            <Cross />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        line1="Not sure which one you need?"
        line2="Start with the consultation."
        sub="A free 30-minute consultation tells you what is actually missing, in priority order. From there the right bundle usually becomes obvious — and sometimes the answer is that you do not need us yet."
        showHatch
      />
    </>
  )
}

/* --------------------------------------------------------------------------
   One long-form service block: copy on one side, working artefact on the other.
   -------------------------------------------------------------------------- */
function ServiceSection({ service, index, mock, flip = false }) {
  const message = ENQUIRY_MESSAGES[service.id] || ENQUIRY_MESSAGES.general

  return (
    <section id={service.id} className="scroll-mt-24 border-b border-rule">
      <div className="shell">
        <div className="band">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
            {/* copy */}
            <Reveal className={`cq-wrap ${flip ? 'lg:order-2' : ''}`}>
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-rule bg-white/[0.03] text-ink">
                  <ServiceIcon name={service.icon} className="h-5 w-5" />
                </span>
                <span className="micro text-ash3">Service 2.{index + 1}</span>
              </div>

              <h2 className="t-h2 mt-7 text-ink">{service.title}</h2>
              <p className="mt-4 text-base leading-[1.6] text-ember-soft text-pretty">
                {service.lede}
              </p>
              <p className="mt-5 max-w-lg text-base leading-[1.65] text-ash text-pretty">
                {service.body}
              </p>

              <div className="mt-8">
                <p className="micro mb-3 text-ash3">Who it is for</p>
                <div className="flex flex-wrap gap-2">
                  {service.audience.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-rule px-3 py-1.5 text-xs text-ash2"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-9">
                <p className="micro mb-4 text-mint">What is included</p>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {service.includes.map((x) => (
                    <li key={x} className="flex gap-2.5 text-sm leading-[1.5] text-ash">
                      <Tick />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-9">
                <p className="micro mb-4 text-ash3">Our process</p>
                <ol className="flex flex-col">
                  {service.process.map((step, i) => (
                    <li
                      key={step}
                      className="flex gap-4 border-t border-rule py-4 last:border-b"
                    >
                      <span className="micro shrink-0 pt-0.5 text-ash3">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm leading-[1.6] text-ash2">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {service.notIncluded.length > 0 && (
                <div className="mt-8 rounded-md border border-rule bg-white/[0.02] p-5">
                  <p className="micro mb-3 text-ash3">Priced separately</p>
                  <ul className="flex flex-col gap-2">
                    {service.notIncluded.map((x) => (
                      <li key={x} className="flex gap-2.5 text-sm leading-[1.5] text-ash3">
                        <Cross />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-9">
                <p className="micro mb-4 text-ash3">Common questions</p>
                <div className="flex flex-col gap-5">
                  {service.faqs.map((f) => (
                    <div key={f.q} className="border-l border-rule pl-5">
                      <p className="text-sm text-ink">{f.q}</p>
                      <p className="mt-2 text-sm leading-[1.6] text-ash2 text-pretty">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* artefacts */}
            <Reveal delay={130} className={flip ? 'lg:order-1' : ''}>
              <div className="lg:sticky lg:top-28">
                {mock}

                <div className="mt-6 rounded-md border border-rule bg-white/[0.02] p-5">
                  <p className="micro text-ash3">Starting point</p>
                  <p className="mt-2 font-display text-xl tracking-[-0.03em] text-ink">
                    {service.startingPoint}
                  </p>
                  <p className="mt-2 text-xs leading-[1.6] text-ash3">
                    Including 18% GST where applicable. Also available inside a package — see the
                    pricing page for the full rate card.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Button href={whatsappLink(message)} variant="secondary" size="md" className="w-full">
                    Ask about {service.title.split(' & ')[0]}
                  </Button>
                  <a
                    href={`tel:${CONTACT_DETAILS.phoneRaw.replace(/\s/g, '')}`}
                    className="text-center text-sm text-ash3 transition-colors hover:text-ink"
                  >
                    or call {CONTACT_DETAILS.phoneDisplay}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
      <path
        d="m3 8.4 3 3L13 4.6"
        stroke="#4fd1a5"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Cross() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
      <path d="M4 4l8 8M12 4l-8 8" stroke="#f0705a" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
