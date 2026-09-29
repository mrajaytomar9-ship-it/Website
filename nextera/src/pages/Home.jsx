import { useState } from 'react'
import {
  HERO,
  NICHES,
  PROBLEMS,
  SERVICES,
  PACKAGES,
  FAQS,
  WORK_EXAMPLES,
  CONTACT_DETAILS,
  TOOLS,
  REPORT,
  whatsappLink,
  ENQUIRY_MESSAGES,
} from '../lib/content'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import Marquee from '../components/ui/Marquee'
import CtaBand from '../components/CtaBand'
import { Rule, SectionHead, Dot } from '../components/ui/Primitives'
import {
  AuditMockup,
  EnquiryMockup,
  ProfileMockup,
  DeliveryMockup,
  CareMockup,
} from '../components/Mockups'
import { WhatsAppGlyph } from '../components/Navbar'
import ServiceIcon from '../components/ServiceIcon'
import { Meter } from '../components/tools/fields'
import useMeta from '../hooks/useMeta'

/* =============================================================== HERO ===== */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-[124px] md:pt-[150px]">
      {/* focal glow behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{
          background:
            'radial-gradient(52% 46% at 50% 22%, rgba(255,255,255,0.075) 0%, transparent 66%)',
        }}
      />

      <div className="shell relative">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow */}
          <Reveal delay={60}>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-rule bg-white/[0.025] px-4 py-2">
              <ServiceIcon name="pin" className="h-3.5 w-3.5 shrink-0 text-ash2" />
              <span className="micro text-ash2">India · Hotels · Clinics · Restaurants · Institutes</span>
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={150}>
            <h1 className="t-hero mt-9 text-balance font-medium text-ink">
              {HERO.line1}
              <br />
              <span className="fade-line">{HERO.line2}</span>
            </h1>
          </Reveal>

          <Reveal delay={260}>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-[1.65] text-ash text-pretty md:text-lg">
              {HERO.sub}
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={360}>
            <div className="mt-11 flex flex-col items-center gap-3 sm:flex-row">
              <Button to={HERO.primary.to} variant="primary" size="lg">
                {HERO.primary.label}
              </Button>
              <Button to={HERO.secondary.to} variant="secondary" size="lg">
                {HERO.secondary.label}
              </Button>
            </div>
          </Reveal>

          {/* Stats */}
          <Reveal delay={470} className="mt-20 w-full">
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-3">
              {HERO.stats.map((s) => (
                <div key={s.label} className="bg-void px-6 py-7 text-center">
                  <p className="font-display text-2xl leading-none tracking-[-0.04em] text-ink">
                    {s.value}
                    <span className="ml-1.5 text-base tracking-normal text-ash3">
                      {s.unit}
                    </span>
                  </p>
                  <p className="mx-auto mt-3 max-w-[190px] text-xs leading-[1.5] text-ash3">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Niche marquee */}
      <div className="mt-24 border-y border-rule bg-black/40">
        <Marquee speed={44} className="py-6">
          {NICHES.map((n) => (
            <span key={n} className="flex items-center">
              <span className="whitespace-nowrap px-7 text-base tracking-[-0.01em] text-ash2 md:text-base">
                {n}
              </span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-ash3/60" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

/* ========================================================== PROBLEMS ====== */
function Problems() {
  return (
    <section className="band">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] lg:gap-20">
          <Reveal>
            <SectionHead
              eyebrow="The usual problem"
              sub="Most businesses we audit are not short of customers. They are short of a clear, current, trustworthy way to receive the ones already looking."
            >
              Found on Google.
              <br />
              <span className="fade-line">Lost before the call.</span>
            </SectionHead>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2">
            {PROBLEMS.map((p, i) => (
              <Reveal key={p.n} delay={i * 80}>
                <div className="group h-full bg-void p-7 transition-colors duration-500 hover:bg-coal">
                  <span className="micro text-ash3">{p.n}</span>
                  <h3 className="t-h3 mt-5 text-ink">{p.title}</h3>
                  <p className="mt-3.5 text-sm leading-[1.62] text-ash2 text-pretty">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================================== SERVICES ====== */
function ServicesGrid() {
  return (
    <section className="band relative">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="What we do"
            sub="Three things, done properly, in a fixed order. Website, enquiry path, Google listing — and the ongoing work that keeps them correct."
          >
            One connected path
            <br />
            <span className="fade-line">from search to conversation.</span>
          </SectionHead>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 90}>
              <article className="cq-wrap group relative flex h-full flex-col bg-void p-8 transition-colors duration-500 hover:bg-coal lg:p-10">
                <div className="flex items-start justify-between gap-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md border border-rule bg-white/[0.03] text-ink transition-colors duration-500 group-hover:border-ember/30 group-hover:text-ember-soft">
                    <ServiceIcon name={s.icon} className="h-[21px] w-[21px]" />
                  </span>
                </div>

                <h3 className="t-h3 mt-7 text-ink">{s.title}</h3>
                <p className="mt-4 max-w-md text-base leading-[1.7] text-ash2 text-pretty">
                  {s.lede}
                </p>

                <ul className="mt-8 flex flex-1 flex-col gap-4">
                  {s.includes.slice(0, 5).map((x) => (
                    <li key={x} className="flex gap-3">
                      <svg viewBox="0 0 16 16" fill="none" className="mt-[5px] h-3 w-3 shrink-0">
                        <path
                          d="m3 8.4 3 3L13 4.6"
                          stroke="#4fd1a5"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm leading-[1.6] text-ash">{x}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border-t border-rule pt-5 lg:mt-9">
                  <p className="micro mb-3 text-ash2">Not included</p>
                  <p className="text-sm leading-[1.65] text-ash2">
                    {s.notIncluded.join(' · ')}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-12 flex justify-center lg:justify-end">
          <Button to="/services" variant="secondary" size="md">
            See the full service detail
          </Button>
        </Reveal>
      </div>
    </section>
  )
}

/* ========================================================== SHOWCASE ====== */
function Showcase() {
  const [active, setActive] = useState(0)

  const panels = [
    { key: 'audit', label: 'Free audit', node: <AuditMockup /> },
    { key: 'enquiry', label: 'Enquiry path', node: <EnquiryMockup /> },
    { key: 'profile', label: 'Google listing', node: <ProfileMockup /> },
    { key: 'delivery', label: 'Delivery board', node: <DeliveryMockup /> },
    { key: 'care', label: 'Monthly care', node: <CareMockup /> },
  ]

  return (
    <section className="band relative border-y border-rule bg-black/35">
      <div aria-hidden="true" className="hairline-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.45fr)] lg:items-center lg:gap-20">
          <Reveal>
            <SectionHead
              eyebrow="What you actually get"
              sub="Not a pitch deck. These are the working artefacts: the audit that starts the conversation, the listing that gets found, the enquiry path that gets tested, and the report that closes the month."
            >
              The work, not
              <br />
              <span className="fade-line">the promise.</span>
            </SectionHead>

            {/* Tab switcher. A grid rather than flex-wrap so the five controls
                sit on an even baseline (3 + 2 in a wrapped row read as a broken
                layout), and the last one spans the gap on narrow screens.
                Equal gap-x/gap-y stops the rows colliding. */}
            <div
              role="tablist"
              aria-label="Interactive samples"
              className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-5"
            >
              {panels.map((p, i) => (
                <button
                  key={p.key}
                  role="tab"
                  id={`sample-tab-${p.key}`}
                  aria-selected={active === i}
                  aria-controls="sample-panel"
                  onClick={() => setActive(i)}
                  className={`inline-flex w-full items-center justify-center rounded-full border px-3 py-2.5 text-center text-sm transition-all duration-300 ${
                    i === panels.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    active === i
                      ? 'border-ink bg-ink text-void'
                      : 'border-rule text-ash hover:border-rule-strong hover:text-ink'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <p className="mt-7 max-w-sm text-sm leading-[1.6] text-ash3">
              Interactive samples. Figures shown are illustrative of the format, not a
              performance claim about any business.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div
              key={panels[active].key}
              id="sample-panel"
              role="tabpanel"
              aria-labelledby={`sample-tab-${panels[active].key}`}
              className="anim-rise"
            >
              {panels[active].node}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ========================================================== NICHES ======== */
function NicheSwitch() {
  return (
    <section className="band">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="Where we focus"
            sub="Hotels first, clinics second. Narrow focus means we already know the questions, the language and the limits for your sector."
          >
            Built for two
            <br />
            <span className="fade-line">specific kinds of business.</span>
          </SectionHead>
        </Reveal>

        {/* Labels, not tabs: both cards below are always visible, so an
            active/inactive pair here would promise a toggle that does not
            exist. Static chips with identical treatment tell the truth. */}
        <p className="mt-12 flex flex-wrap items-center gap-2.5">
          <span className="mr-1 text-sm text-ash2">Both sectors, side by side:</span>
          {['Hotels & Homestays', 'Clinics & Practices'].map((l) => (
            <span
              key={l}
              className="rounded-full border border-rule bg-white/[0.02] px-4 py-2 text-sm text-ash"
            >
              {l}
            </span>
          ))}
        </p>

        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule lg:grid-cols-2">
          {[
            {
              head: 'Hotels & Homestays',
              line: 'A stay page that sells the room before they call.',
              body: 'Rooms, amenities, location and a one-tap enquiry — stated plainly, with your photographs, not stock ones.',
              ok: 'What we can do',
              no: 'What stays out of scope',
              allow: [
                'Property info and approved room descriptions',
                'Amenities, location and directions',
                'Enquiry links and booking-request routing',
              ],
              deny: [
                'Live availability or confirmed reservations',
                'Automated rate, discount or refund promises',
              ],
            },
            {
              head: 'Clinics & Practices',
              line: 'An administrative site. Strictly that.',
              body: 'Approved business and practitioner information, timings, location and administrative FAQs — with a clear, authorised approver behind every claim.',
              ok: 'What we can do',
              no: 'What stays out of scope',
              allow: [
                'Approved business and practitioner information',
                'Timings, location and administrative FAQs',
                'Appointment requests, framed as requests',
              ],
              deny: [
                'Diagnosis, medical advice or prescriptions',
                'Patient records or sensitive health data',
                'Treatment recommendations or outcome claims',
              ],
            },
          ].map((n, i) => (
            <Reveal key={n.head} delay={i * 90}>
              <div className="flex h-full flex-col bg-void p-8 lg:p-10">
                  <p className="micro text-ash2">{n.head}</p>
                  {/* Reserved line counts (in em, so they scale with the fluid
                      display size) keep both cards starting their sub-headings
                      at the same height even when a heading wraps differently. */}
                  <h3 className="t-h3 mt-5 min-h-[2.1em] text-ink">{n.line}</h3>
                  <p className="mt-3.5 min-h-[4.9em] text-sm leading-[1.65] text-ash2 text-pretty">
                    {n.body}
                  </p>

                  <div className="mt-8 grid gap-7 sm:grid-cols-2">
                    <div>
                      <p className="micro mb-3.5 text-mint">{n.ok}</p>
                      <ul className="flex flex-col gap-2.5">
                        {n.allow.map((a) => (
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
                      <p className="micro mb-3.5 text-ember-soft">{n.no}</p>
                      <ul className="flex flex-col gap-2.5">
                        {n.deny.map((a) => (
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
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ======================================================= WORK EXAMPLES ==== */
function WorkExamples() {
  const toneMap = {
    ember: { border: 'rgba(232,146,47,0.28)', bg: 'rgba(232,146,47,0.07)', text: '#f4b866' },
    sky: { border: 'rgba(95,179,240,0.28)', bg: 'rgba(95,179,240,0.07)', text: '#9ecdf5' },
    mint: { border: 'rgba(79,209,165,0.28)', bg: 'rgba(79,209,165,0.07)', text: '#7fe0c0' },
  }

  return (
    <section className="band relative border-y border-rule bg-black/35">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="Recent work"
            sub="Three recent builds. Each one is a different shape of problem — a tight budget, a sensitive sector, and a site that needed keeping alive."
          >
            Three deliveries
            <br />
            <span className="fade-line">from the last quarter.</span>
          </SectionHead>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {WORK_EXAMPLES.map((w, i) => {
            const t = toneMap[w.tone]
            return (
              <Reveal key={w.title} delay={i * 100}>
                <article
                  className="group relative h-full overflow-hidden rounded-lg border bg-void p-7 transition-colors duration-500 hover:bg-coal"
                  style={{ borderColor: t.border }}
                >
                  <span
                    className="micro inline-block rounded-full px-2.5 py-1"
                    style={{ color: t.text, background: t.bg, border: `1px solid ${t.border}` }}
                  >
                    {w.tag}
                  </span>

                  <h3 className="mt-5 font-display text-xl tracking-[-0.03em] text-ink">
                    {w.title}
                  </h3>

                  <ul className="mt-5 flex flex-col gap-2.5">
                    {w.what.map((x) => (
                      <li key={x} className="flex gap-2.5 text-sm leading-[1.55] text-ash2">
                        <span
                          className="mt-[7px] h-1 w-1 shrink-0 rounded-full"
                          style={{ background: t.text }}
                        />
                        {x}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t border-rule pt-4">
                    <p className="text-xs text-ash3">{w.outcome}</p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={140} className="mt-9">
          <p className="text-sm text-ash3">
            Illustrative examples of the shape of delivery. Names shown are representative; a
            named case study is published only with the client’s written permission.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================================ FREE TOOLS === */
function ToolsTeaser() {
  /* Illustrative figures, labelled as such — the real ones are on /tools. */
  const rows = [
    { l: 'Gross billing', v: '₹6,69,960', tone: 'ink' },
    { l: 'OTA commission (65% at 18%)', v: '−₹78,385', tone: 'ember' },
    { l: 'Gateway, cancellations, discounts', v: '−₹83,578', tone: 'ember' },
    { l: 'Variable cost of the stay', v: '−₹1,11,759', tone: 'muted' },
    { l: 'Fixed cost + depreciation', v: '−₹2,62,500', tone: 'muted' },
    { l: 'Tax on profit', v: '−₹33,434', tone: 'muted' },
  ]

  return (
    <section className="band border-t border-rule">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <Reveal>
            <SectionHead eyebrow={TOOLS.teaser.eyebrow} sub={TOOLS.teaser.sub}>
              {TOOLS.teaser.line1}
              <br />
              <span className="fade-line">{TOOLS.teaser.line2}</span>
            </SectionHead>

            <ul className="mt-9 flex flex-col gap-3.5">
              {TOOLS.teaser.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <svg viewBox="0 0 16 16" fill="none" className="mt-[5px] h-3 w-3 shrink-0">
                    <path
                      d="m3 8.4 3 3L13 4.6"
                      stroke="#4fd1a5"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm leading-[1.55] text-ash">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to={TOOLS.teaser.cta.to} variant="primary" size="lg">
                {TOOLS.teaser.cta.label}
              </Button>
              <Button to={TOOLS.teaser.secondary.to} variant="secondary" size="lg">
                {TOOLS.teaser.secondary.label}
              </Button>
            </div>

            <p className="mt-6 flex items-center gap-2.5 text-xs text-ash3">
              <ServiceIcon name="calculator" className="h-4 w-4 shrink-0" />
              Free, no sign-up, and your numbers never leave your own device.
            </p>
          </Reveal>

          <Reveal delay={130}>
            <div className="card-dark overflow-hidden rounded-xl">
              <div className="flex items-center justify-between border-b border-rule px-5 py-3.5">
                <span className="flex min-w-0 items-center gap-2.5">
                  <ServiceIcon name="calculator" className="h-3.5 w-3.5 shrink-0 text-ash2" />
                  <span className="truncate text-xs text-ink">Profit & leak calculator</span>
                </span>
                <span className="micro shrink-0 text-ash3">Sample</span>
              </div>

              <div className="p-5">
                <p className="micro text-ash3">Net profit this month</p>
                <p className="mt-2 font-display text-2xl leading-none tracking-[-0.045em] text-ink">
                  ₹1,00,303
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="flex items-center gap-2 text-xs text-mint">
                    <Dot tone="mint" />
                    Healthy · 19.7% margin
                  </span>
                  <span className="text-xs text-ash3">Hotel · 14 rooms · 62% occupancy</span>
                </div>

                <div className="mt-5 flex flex-col">
                  {rows.map((r) => (
                    <div
                      key={r.l}
                      className="flex items-baseline justify-between gap-4 border-t border-rule-faint py-2.5"
                    >
                      <span className="min-w-0 text-xs text-ash2">{r.l}</span>
                      <span
                        className={`shrink-0 text-xs tabular-nums ${
                          r.tone === 'ember'
                            ? 'text-ember-soft'
                            : r.tone === 'muted'
                              ? 'text-ash3'
                              : 'text-ink'
                        }`}
                      >
                        {r.v}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xs text-ash2">Revenue leaked before you see it</span>
                    <span className="shrink-0 text-xs tabular-nums text-ember-soft">24.2%</span>
                  </div>
                  <Meter value={78} tone="ember" className="mt-2.5" />
                </div>

                <p className="mt-5 border-t border-rule pt-4 text-xs leading-[1.6] text-ash3">
                  Illustrative figures for the shape of the output, not a claim about any business.
                  Your own numbers go in on the tools page.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ======================================================= REPORT TEASER ==== */
function ReportTeaser() {
  /* Sample figures, labelled as such — the real ones come from the founder's
     own answers on /report. */
  const pillars = [
    { l: 'Findability', v: 82 },
    { l: 'Credibility', v: 46 },
    { l: 'Convertibility', v: 35 },
    { l: 'Money', v: 58 },
  ]

  return (
    <section className="band border-t border-rule">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <Reveal>
            <SectionHead eyebrow={REPORT.teaser.eyebrow} sub={REPORT.teaser.sub}>
              {REPORT.teaser.line1}
              <br />
              <span className="fade-line">{REPORT.teaser.line2}</span>
            </SectionHead>

            <ul className="mt-9 flex flex-col gap-3.5">
              {REPORT.teaser.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <svg viewBox="0 0 16 16" fill="none" className="mt-[5px] h-3 w-3 shrink-0">
                    <path
                      d="m3 8.4 3 3L13 4.6"
                      stroke="#4fd1a5"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm leading-[1.6] text-ash">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to={REPORT.teaser.cta.to} variant="primary" size="lg">
                {REPORT.teaser.cta.label}
              </Button>
              <Button to={REPORT.teaser.secondary.to} variant="secondary" size="lg">
                {REPORT.teaser.secondary.label}
              </Button>
            </div>

            <p className="mt-6 flex items-center gap-2.5 text-xs text-ash3">
              <ServiceIcon name="lock" className="h-4 w-4 shrink-0" />
              Runs in your browser. Nothing uploaded, nothing stored by us.
            </p>
          </Reveal>

          <Reveal delay={130}>
            <div className="card-dark overflow-hidden rounded-xl">
              <div className="flex items-center justify-between border-b border-rule px-5 py-3.5">
                <span className="flex min-w-0 items-center gap-2.5">
                  <ServiceIcon name="doc" className="h-3.5 w-3.5 shrink-0 text-ash2" />
                  <span className="truncate text-xs text-ink">Business report</span>
                </span>
                <span className="micro shrink-0 text-ash3">Sample</span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-5">
                  <span className="font-display text-3xl leading-none tracking-[-0.045em] text-ember-soft">
                    54
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-ink">Leaky</p>
                    <p className="mt-1.5 text-xs leading-[1.5] text-ash3">
                      Visible, but most people who find you leave without contacting you.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3.5">
                  {pillars.map((x) => (
                    <div key={x.l}>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-xs text-ash2">{x.l}</span>
                        <span className="text-xs tabular-nums text-ash3">{x.v}/100</span>
                      </div>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                        <div className="h-full rounded-full bg-ink" style={{ width: `${x.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-6 border-t border-rule pt-4 text-xs leading-[1.6] text-ash2">
                  <span className="text-ink">Costing the most:</span> no one-tap WhatsApp —
                  reaching you means copying a number into a phone.
                </p>

                <p className="mt-4 border-t border-rule-faint pt-4 text-xs leading-[1.6] text-ash3">
                  Illustrative figures for the shape of the output. Your score comes from your own
                  answers on the report page.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ========================================================== PRICING ======= */
function PricingPreview() {
  return (
    <section className="band">
      <div className="shell">
        <Reveal>
          {/* Same three columns as the grid below, so the button's right edge
              is the third card's right edge rather than a free-floating one. */}
          <div className="grid gap-8 lg:grid-cols-3 lg:items-end lg:gap-6">
            <div className="min-w-0 lg:col-span-2">
              <SectionHead
                eyebrow="Packages"
                sub="One-time build, or an ongoing plan. No hidden tiers, no annual lock-in to get a better number."
              >
                Priced in rupees.
                <br />
                <span className="fade-line">Scoped in writing.</span>
              </SectionHead>
            </div>

            <Reveal delay={100} className="lg:justify-self-end">
              <Button to="/pricing" variant="secondary" size="lg">
                Compare all packages
              </Button>
            </Reveal>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <article
                className={`group relative flex h-full flex-col overflow-hidden rounded-xl border p-7 transition-all duration-500 lg:p-8 ${
                  p.highlight
                    ? 'border-ember/35 bg-coal glow-ember'
                    : 'border-rule bg-void hover:border-rule-strong'
                }`}
              >
                {p.highlight && (
                  <span className="absolute right-6 top-6 rounded-full border border-ember/35 bg-ember/10 px-2.5 py-1 micro text-ember-soft">
                    {p.badge || 'Most chosen'}
                  </span>
                )}

                <h3 className="font-display text-xl tracking-[-0.03em] text-ink">
                  {p.name}
                </h3>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl leading-none tracking-[-0.045em] text-ink">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-ash3">{p.priceNote}</span>
                </div>

                <p className="mt-5 text-sm leading-[1.6] text-ash2 text-pretty">{p.tagline}</p>
                <p className="mt-2 text-xs text-ash3">
                  Taxable value ₹{p.taxable.toLocaleString('en-IN')} + GST{' '}
                  ₹{p.gst.toLocaleString('en-IN')}
                </p>

                <div className="mt-6 flex items-center gap-2.5 rounded-md border border-rule-faint bg-white/[0.02] px-3.5 py-2.5">
                  <ServiceIcon name="clock" className="h-3.5 w-3.5 shrink-0 text-ash2" />
                  <span className="text-xs text-ash">
                    Includes <span className="text-ink">{p.support}</span> · {p.revisions}
                  </span>
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {p.includes.slice(0, 5).map((x) => (
                    <li key={x} className="flex gap-2.5 text-sm leading-[1.5] text-ash2">
                      <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
                        <path d="m3 8.4 3 3L13 4.6" stroke="#4fd1a5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {x}
                    </li>
                  ))}
                  {p.includes.length > 5 && (
                    <li className="pl-[22px] text-sm font-medium text-ash2">
                      + {p.includes.length - 5} more in the package
                    </li>
                  )}
                </ul>

                <Button
                  href={whatsappLink(p.cta.message)}
                  variant={p.highlight ? 'accent' : 'secondary'}
                  size="md"
                  className="mt-7 w-full"
                >
                  {p.cta.label}
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================== FAQ ======= */
function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="band relative border-t border-rule">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-20">
          <Reveal>
            <div id="faq" className="scroll-mt-28">
              <SectionHead eyebrow="Questions">
                Everything people
                <br />
                <span className="fade-line">ask us first.</span>
              </SectionHead>
            </div>
            <p className="mt-7 max-w-sm text-sm leading-[1.6] text-ash2">
              If something is missing, ask it on WhatsApp. A straight answer costs nothing.
            </p>
            <Button
              href={whatsappLink(ENQUIRY_MESSAGES.general)}
              variant="secondary"
              size="md"
              className="mt-6"
            >
              <WhatsAppGlyph className="h-3.5 w-3.5 text-mint" />
              Ask a question
            </Button>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex flex-col">
              {FAQS.map((f, i) => {
                const isOpen = open === i
                return (
                  <div key={f.q} className="border-b border-rule first:border-t">
                    <button
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`text-base leading-[1.45] transition-colors duration-300 ${
                          isOpen ? 'text-ink' : 'text-ash hover:text-ink'
                        }`}
                      >
                        {f.q}
                      </span>
                      <span
                        className={`relative mt-1.5 h-3.5 w-3.5 shrink-0 transition-transform duration-400 ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      >
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink" />
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink" />
                      </span>
                    </button>

                    <div
                      className="grid transition-all duration-500"
                      style={{
                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                        opacity: isOpen ? 1 : 0,
                        transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-7 pr-10 text-sm leading-[1.68] text-ash2 text-pretty">
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ============================================================= PAGE ======= */
export default function Home() {
  useMeta(
    null,
    'Nextera Solution builds affordable-premium websites, WhatsApp enquiry paths and website, automation, online presence and WhatsApp growth systems for businesses across India. Clear scope, tested enquiry paths, no guaranteed rankings.',
  )

  return (
    <>
      <Hero />
      <Problems />
      <ServicesGrid />
      <Showcase />
      <NicheSwitch />
      <WorkExamples />
      <ToolsTeaser />
      <ReportTeaser />
      <PricingPreview />
      <Faq />
      <CtaBand showHatch />
    </>
  )
}
