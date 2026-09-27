import { useState } from 'react'
import { SERVICES, NICHES_DETAIL, CONTACT_DETAILS, whatsappLink, ENQUIRY_MESSAGES } from '../lib/content'
import PageHero from '../components/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import CtaBand from '../components/CtaBand'
import ServiceIcon from '../components/ServiceIcon'
import { Rule, SectionHead } from '../components/ui/Primitives'
import { EnquiryMockup, ProfileMockup, DeliveryMockup, CareMockup, PhoneMockup } from '../components/Mockups'
import useMeta from '../hooks/useMeta'

const SERVICE_META = {
  web: { label: 'Websites', id: 'websites' },
  whatsapp: { label: 'WhatsApp enquiry setup', id: 'whatsapp' },
  gbp: { label: 'Google Business Profile', id: 'gbp' },
  care: { label: 'Care & Presence', id: 'care' },
}

const SCROLL_OFFSET = 92

export default function Services() {
  useMeta(
    'Services',
    'Websites, click-to-WhatsApp enquiry setup, Google Business Profile work and monthly care for hotels and clinics in Agra. Every service scoped with explicit inclusions and exclusions.',
  )

  return (
    <>
      <PageHero
        eyebrow="Services"
        line1="Four services."
        line2="One connected path."
        sub="A website, an enquiry route, an accurate Google listing and the ongoing work that keeps them true. Each is scoped on its own, and each is worth doing properly before the next one is considered."
        meta={[
          { l: 'Services offered', v: '4' },
          { l: 'Initial response', v: '1 working day' },
          { l: 'Reporting on', v: 'Agra' },
          { l: 'Free first step', v: 'Audit' },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <a
              key={s.id}
              href={`#${SERVICE_META[s.id].id}`}
              className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2.5 text-sm text-ash transition-colors hover:border-rule-strong hover:text-ink"
            >
              <ServiceIcon name={s.icon} className="h-3.5 w-3.5" />
              {SERVICE_META[s.id].label}
            </a>
          ))}
        </div>
      </PageHero>

      {/* ------------------------------------------------------ 1. WEBSITES */}
      <ServiceSection service={SERVICES[0]} anchor="websites" icon="window" mock={<DeliveryMockup />}>
        <PhoneMockup
          title="A stay page, one tap"
          accent="ember"
          lines={[
            'Standard room · 2 adults · from ₹2,400',
            'Deluxe room · balcony, Taj view',
            'Check-in 12:00 · Check-out 11:00',
            '700 m from Agra Cantt station',
          ]}
        />
      </ServiceSection>

      {/* ----------------------------------------------------- 2. WHATSAPP */}
      <ServiceSection
        service={SERVICES[1]}
        anchor="whatsapp"
        icon="chat"
        mock={<EnquiryMockup />}
        flip
      >
        <PhoneMockup
          title="The resulting chat"
          lines={[
            'Hi — is a room available this weekend for 2 guests?',
            'Namaste! Let me confirm with the front desk and reply shortly.',
            'Page context is pre-filled, so you never start from a blank chat.',
          ]}
        />
      </ServiceSection>

      {/* --------------------------------------------------------- 3. GBP */}
      <ServiceSection service={SERVICES[2]} anchor="gbp" icon="pin" mock={<ProfileMockup />}>
        <div className="flex flex-col gap-3.5">
          {[
            { t: 'Audit first, always', d: 'You see what is wrong and what we can actually fix, before any work is quoted.' },
            { t: 'Only authorised access', d: 'You keep ownership of the profile; we work through access you grant, on your terms.' },
            { t: 'Never a fake review', d: 'We draft genuine replies. We do not write, buy or suppress reviews.' },
            { t: 'No ranking promises', d: 'Visibility depends on factors no agency controls, so we do not sell it as a guarantee.' },
          ].map((x) => (
            <div key={x.t} className="rounded-md border border-rule bg-white/[0.02] p-4">
              <p className="text-sm text-ink">{x.t}</p>
              <p className="mt-1.5 text-xs leading-[1.55] text-ash2">{x.d}</p>
            </div>
          ))}
        </div>
      </ServiceSection>

      {/* -------------------------------------------------------- 4. CARE */}
      <ServiceSection service={SERVICES[3]} anchor="care" icon="shield" mock={<CareMockup />} flip>
        <div className="rounded-md border border-rule bg-white/[0.02] p-5">
          <p className="micro mb-3.5 text-ash3">Entry conditions</p>
          <ul className="flex flex-col gap-2.5">
            {[
              'Website technology identified and confirmed',
              'Authorised account access in place',
              'Existing defects reviewed before acceptance',
              'Backup and recovery feasibility understood',
            ].map((c) => (
              <li key={c} className="flex gap-2.5 text-sm leading-[1.5] text-ash2">
                <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
                  <path d="m3 8.4 3 3L13 4.6" stroke="#4fd1a5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-rule pt-4 text-xs leading-[1.6] text-ash3">
            A pre-existing broken website is not automatically repaired under the monthly fee.
            That gets assessed and quoted separately, before you commit to anything.
          </p>
        </div>
      </ServiceSection>

      {/* --------------------------------------------------- NICHE BOUNDARIES */}
      <section className="band relative border-y border-rule bg-black/35">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Sector boundaries"
              sub="Being narrow is a feature. It means we already know what is reasonable to put on a hotel or clinic website — and what would be a promise we cannot keep."
            >
              What we will build,
              <br />
              <span className="fade-line">and what we will not.</span>
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
                    <p className="mt-3.5 text-sm leading-[1.6] text-ash2 text-pretty">
                      {n.body}
                    </p>
                  </div>

                  <div className="grid gap-7 p-7 sm:grid-cols-2">
                    <div>
                      <p className="micro mb-3.5 text-mint">Allowed</p>
                      <ul className="flex flex-col gap-2.5">
                        {n.allowed.map((a) => (
                          <li key={a} className="flex gap-2.5 text-sm leading-[1.5] text-ash">
                            <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
                              <path d="m3 8.4 3 3L13 4.6" stroke="#4fd1a5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
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
                            <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
                              <path d="M4 4l8 8M12 4l-8 8" stroke="#f0705a" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
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

      {/* --------------------------------------------------- NOT READY YET */}
      <section className="band">
        <div className="shell">
          <Reveal>
            <div className="grid gap-10 overflow-hidden rounded-xl border border-rule bg-coal p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:p-12">
              <div>
                <p className="micro mb-4 text-ash3">Not ready to sell</p>
                <h2 className="t-h3 text-ink">
                  Some things we will
                  <br />
                  <span className="fade-line">not sell you yet.</span>
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { t: 'AI voice agents', d: 'Needs a defined use case, consent handling, a telephony provider, a verified information source, human escalation and a tested failure path. We do not sell it as operational before that work exists.' },
                  { t: 'Official WhatsApp automation', d: 'Needs an official integration, account authorisation, template and consent handling, cost limits, monitoring and a manual fallback.' },
                  { t: 'Booking engines & patient systems', d: 'These need a verified integration, their own scope, their own support plan and their own compliance review. We will say so early rather than forcing them into a package.' },
                ].map((x) => (
                  <div key={x.t} className="border-l border-rule pl-5">
                    <p className="text-sm text-ink">{x.t}</p>
                    <p className="mt-1.5 text-sm leading-[1.6] text-ash2">{x.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        line1="Not sure which one you need?"
        line2="Start with the audit."
        sub="The free audit tells you what is actually broken, in priority order. From there the right package usually becomes obvious — and sometimes the answer is that you do not need us yet."
        showHatch
      />
    </>
  )
}

/* --------------------------------------------------------------------------
   One long-form service block: copy on one side, working artefact on the other.
   -------------------------------------------------------------------------- */
function ServiceSection({ service, anchor, icon, mock, flip = false, children }) {
  return (
    <section id={anchor} className="scroll-mt-24 border-b border-rule">
      <div className="shell">
        <div className="band">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
            {/* copy */}
            <Reveal className={`cq-wrap ${flip ? 'lg:order-2' : ''}`}>
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-rule bg-white/[0.03] text-ink">
                  <ServiceIcon name={icon} className="h-5 w-5" />
                </span>
              </div>

              <h2 className="t-h2 mt-7 text-ink">{service.title}</h2>
              <p className="mt-5 max-w-lg text-base leading-[1.65] text-ash text-pretty">
                {service.lede}
              </p>

              <div className="mt-10 flex flex-col">
                {service.points.map((p, i) => (
                  <div key={p.t} className="flex gap-5 border-t border-rule py-6 last:border-b">
                    <span className="micro shrink-0 pt-1 text-ash3">0{i + 1}</span>
                    <div>
                      <h3 className="text-base text-ink">{p.t}</h3>
                      <p className="mt-2 text-sm leading-[1.62] text-ash2 text-pretty">{p.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-md border border-rule bg-white/[0.02] p-5">
                <p className="micro mb-3 text-ash3">Explicitly not included</p>
                <ul className="flex flex-col gap-2">
                  {service.notIncluded.map((x) => (
                    <li key={x} className="flex gap-2.5 text-sm leading-[1.5] text-ash3">
                      <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="#f0705a" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* artefacts */}
            <Reveal delay={130} className={flip ? 'lg:order-1' : ''}>
              <div className="lg:sticky lg:top-28">
                {mock}
                {children && <div className="mt-6">{children}</div>}

                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    href={whatsappLink(ENQUIRY_MESSAGES.general)}
                    variant="secondary"
                    size="md"
                    className="w-full"
                  >
                    Ask about {SERVICE_META[service.id].label}
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
