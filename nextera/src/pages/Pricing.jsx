import {
  PACKAGES,
  AI_VOICE,
  AI_VOICE_LIMITS,
  MAINTENANCE_PLANS,
  MARKETING_SERVICES,
  MARKETING_NOTE,
  ADD_ONS,
  CORE_SERVICES,
  CORE_SERVICES_NOTE,
  PACKAGE_EXAMPLES,
  THIRD_PARTY_EXCLUDED,
  THIRD_PARTY_NOTE,
  PAYMENT_MILESTONES,
  MONTHLY_TERMS,
  GST_POLICY,
  PRICING_FAQS,
  CONTACT_DETAILS,
  whatsappLink,
} from '../lib/content'
import { formatINR } from '../lib/calculator'
import PageHero from '../components/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import CtaBand from '../components/CtaBand'
import { SectionHead } from '../components/ui/Primitives'
import { Cascade, DriftLight, Shine, Spotlight } from '../components/ui/Motion'
import useMeta from '../hooks/useMeta'

const Tick = ({ tone = '#4fd1a5' }) => (
  <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
    <path
      d="m3 8.4 3 3L13 4.6"
      stroke={tone}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Cross = () => (
  <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
    <path d="M4 4l8 8M12 4l-8 8" stroke="#f0705a" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export default function Pricing() {
  useMeta(
    'Pricing',
    'Basic ₹23,600, Business ₹41,300, Enterprise ₹70,800 onwards — all including 18% GST. AI voice services, monthly maintenance, marketing, add-ons and payment terms, itemized.'
  )

  return (
    <>
      <PageHero
        eyebrow="Complete price rate card"
        line1="Locked pricing."
        line2="No hidden charges."
        sub="Every price below is the final customer price including 18% GST where applicable. One-time work, monthly services, AI usage and third-party costs are kept clearly separate, so you always know what you are paying for."
        meta={[
          { l: 'Websites from', v: '₹23,600' },
          { l: 'Maintenance from', v: '₹1,499/mo' },
          { l: 'AI voice from', v: '₹14,999' },
          { l: 'GST', v: '18% included' },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          {[
            { href: '#basic', label: 'Packages' },
            { href: '#ai-voice', label: 'AI voice' },
            { href: '#maintenance', label: 'Maintenance' },
            { href: '#marketing', label: 'Marketing' },
            { href: '#addons', label: 'Add-ons' },
            { href: '#payment', label: 'Payment terms' },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full border border-rule px-4 py-2.5 text-sm text-ash transition-colors hover:border-rule-strong hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
      </PageHero>

      {/* ------------------------------------------------ §1 MAIN PACKAGES */}
      <section id="packages" className="band scroll-mt-24 border-t border-rule">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="1. Main packages"
              sub="Three packages, priced for businesses in India's Tier 2 and Tier 3 cities. Each one builds on the last."
            >
              Pick the package that
              <br />
              <span className="fade-line">matches where you are.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.id} delay={i * 110}>
                <Spotlight
                  as="article"
                  id={p.id}
                  ember={p.highlight}
                  tilt={3}
                  className={`lit lit-hover shine edge-light relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-xl border p-7 ${
                    p.highlight
                      ? 'breathe border-ember/35 bg-ember/[0.04]'
                      : 'border-rule bg-void'
                  }`}
                >
                  <Shine index={i} />
                  <DriftLight />
                  {p.badge && (
                    <span className="micro absolute right-7 top-7 rounded-full border border-ember/35 bg-ember/[0.1] px-3 py-1 text-ember-soft">
                      {p.badge}
                    </span>
                  )}

                  <p className="micro text-ash3">Package</p>
                  <h3 className="mt-3 font-display text-xl tracking-[-0.03em] text-ink">
                    {p.name}
                  </h3>

                  <div className="mt-6 border-y border-rule py-6">
                    <p className="font-display text-3xl leading-none tracking-[-0.04em] text-ink">
                      {formatINR(p.price)}
                      {p.id === 'enterprise' && (
                        <span className="ml-1.5 text-base text-ash2">onwards</span>
                      )}
                    </p>
                    <p className="micro mt-2.5 text-ash3">{p.priceNote}</p>
                    <p className="mt-3 text-xs leading-[1.6] text-ash3">
                      Taxable value {formatINR(p.taxable)} + GST {formatINR(p.gst)}
                    </p>
                  </div>

                  <p className="mt-6 text-sm leading-[1.6] text-ash text-pretty">{p.tagline}</p>
                  <p className="mt-3 text-sm leading-[1.6] text-ash2 text-pretty">{p.for}</p>

                  <div className="mt-6 flex-1">
                    <p className="micro mb-4 text-mint">What is included</p>
                    <ul className="flex flex-col gap-2.5">
                      {p.includes.map((x) => (
                        <li key={x} className="flex gap-2.5 text-sm leading-[1.5] text-ash2">
                          <Tick />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {p.extra && (
                    <p className="mt-5 border-t border-rule pt-5 text-xs leading-[1.6] text-ash3">
                      {p.extra}
                    </p>
                  )}

                  <dl className="mt-6 flex flex-col gap-2 border-t border-rule pt-6 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ash3">Free support</dt>
                      <dd className="text-right text-ash2">{p.support}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ash3">Revisions</dt>
                      <dd className="text-right text-ash2">{p.revisions}</dd>
                    </div>
                  </dl>

                  <Button
                    href={whatsappLink(p.cta.message)}
                    variant={p.highlight ? 'primary' : 'secondary'}
                    size="md"
                    arrow
                    className="mt-7 w-full"
                  >
                    {p.cta.label}
                  </Button>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- §2 AI VOICE */}
      <section
        id="ai-voice"
        className="band relative scroll-mt-24 border-y border-rule bg-black/35"
      >
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="2. AI voice services"
              sub="A one-time setup fee plus a monthly service fee. Every plan includes a monthly minute allowance; extra usage is billed at a published per-minute rate."
            >
              Never miss
              <br />
              <span className="fade-line">another phone call.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {AI_VOICE.map((a, i) => (
              <Reveal key={a.id} delay={i * 110}>
                <Spotlight
                  as="article"
                  id={a.id}
                  ember={a.highlight}
                  tilt={3}
                  className={`lit lit-hover shine edge-light relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-xl border p-7 ${
                    a.highlight
                      ? 'breathe border-ember/35 bg-ember/[0.04]'
                      : 'border-rule bg-void'
                  }`}
                >
                  <Shine index={i + 2} tempo={11} />
                  {a.badge && (
                    <span className="micro absolute right-7 top-7 rounded-full border border-ember/35 bg-ember/[0.1] px-3 py-1 text-ember-soft">
                      {a.badge}
                    </span>
                  )}

                  <p className="micro text-ash3">AI voice</p>
                  <h3 className="mt-3 font-display text-xl tracking-[-0.03em] text-ink">
                    {a.name}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.6] text-ash2 text-pretty">{a.tagline}</p>

                  <div className="mt-6 flex flex-col gap-4 border-y border-rule py-6">
                    <div>
                      <p className="font-display text-2xl leading-none tracking-[-0.035em] text-ink">
                        {formatINR(a.setup)}
                      </p>
                      <p className="micro mt-2 text-ash3">{a.setupNote}</p>
                    </div>
                    <div>
                      <p className="font-display text-2xl leading-none tracking-[-0.035em] text-ember-soft">
                        {formatINR(a.monthly)}
                        <span className="ml-1 text-sm text-ash2">/mo</span>
                      </p>
                      <p className="micro mt-2 text-ash3">{a.monthlyNote}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex-1">
                    <p className="micro mb-4 text-mint">What is included</p>
                    <ul className="flex flex-col gap-2.5">
                      {a.includes.map((x) => (
                        <li key={x} className="flex gap-2.5 text-sm leading-[1.5] text-ash2">
                          <Tick />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-5 border-t border-rule pt-5 text-xs leading-[1.6] text-ash3">
                    Extra usage: <span className="text-ash2">{a.extraUsage}</span>
                  </p>

                  <Button
                    href={whatsappLink(a.cta.message)}
                    variant={a.highlight ? 'primary' : 'secondary'}
                    size="md"
                    arrow
                    className="mt-6 w-full"
                  >
                    {a.cta.label}
                  </Button>
                </Spotlight>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140} className="mt-8">
            <ul className="flex flex-col gap-2.5">
              {AI_VOICE_LIMITS.map((x) => (
                <li key={x} className="flex gap-2.5 text-xs leading-[1.6] text-ash3">
                  <Cross />
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------- §3 MONTHLY MAINTENANCE */}
      <section id="maintenance" className="band scroll-mt-24">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="3. Monthly website maintenance"
              sub="Every package includes a free support period. After that, these plans keep your site updated, secure and performing. AI monthly fees are separate."
            >
              After the free
              <br />
              <span className="fade-line">support period.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {MAINTENANCE_PLANS.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <Spotlight
                  as="div"
                  id={p.id}
                  className="lit lit-hover shine relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-xl border border-rule bg-void p-7"
                >
                  <Shine index={i + 3} tempo={12} />
                  <h3 className="font-display text-xl tracking-[-0.03em] text-ink">{p.name}</h3>
                  <p className="mt-3 text-sm leading-[1.6] text-ash2 text-pretty">{p.best}</p>

                  <p className="mt-6 font-display text-3xl leading-none tracking-[-0.04em] text-ink">
                    {formatINR(p.price)}
                    <span className="ml-1 text-base text-ash2">/mo</span>
                  </p>
                  <p className="micro mt-2 text-ash3">{p.priceNote}</p>

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-rule pt-6">
                    {p.includes.map((x) => (
                      <li key={x} className="flex gap-2.5 text-sm leading-[1.5] text-ash2">
                        <Tick />
                        {x}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={whatsappLink(p.cta.message)}
                    className="mt-6 inline-block text-sm text-ember-soft transition-colors hover:text-ink"
                  >
                    {p.cta.label} →
                  </a>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- §4 MARKETING + §5 ADD-ONS */}
      <section id="marketing" className="band scroll-mt-24 border-t border-rule">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="4. Monthly marketing services"
              sub="Ongoing services billed monthly. Advertising budget is never included in our fee."
            >
              Monthly marketing,
              <br />
              <span className="fade-line">priced per service.</span>
            </SectionHead>
          </Reveal>

          <Reveal delay={120} className="mt-14">
            <div className="overflow-hidden rounded-xl border border-rule bg-void">
              {MARKETING_SERVICES.map((m, i) => (
                <div
                  key={m.t}
                  className={`flex items-center justify-between gap-6 px-6 py-4 ${
                    i > 0 ? 'border-t border-rule' : ''
                  }`}
                >
                  <span className="text-sm text-ash">{m.t}</span>
                  <span className="shrink-0 text-sm text-ink">
                    {formatINR(m.price)}
                    <span className="ml-1 text-xs text-ash3">/month</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-[1.6] text-ash3">{MARKETING_NOTE}</p>
          </Reveal>

          <Reveal delay={160} className="mt-16">
            <div id="addons" className="scroll-mt-28">
              <p className="micro mb-5 text-ash3">5. One-time add-on services</p>
              <div className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
                <Cascade step={45} className="contents">
                {ADD_ONS.map((a) => (
                  <div
                    key={a.t}
                    className="flex h-full flex-col justify-between gap-4 bg-void p-6 transition-colors duration-500 hover:bg-coal"
                  >
                    <p className="text-sm leading-[1.5] text-ash">{a.t}</p>
                    <p className="text-sm text-ink">
                      {formatINR(a.price)}
                      {a.unit ? <span className="ml-1 text-xs text-ash3">{a.unit}</span> : null}
                    </p>
                  </div>
                ))}
                </Cascade>
              </div>
              <p className="mt-5 text-xs text-ash3">
                All add-on prices include 18% GST where applicable.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------- §6 CORE SERVICES + §7 EXAMPLES */}
      <section className="band relative border-y border-rule bg-black/35">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="6. Standalone core services"
              sub={CORE_SERVICES_NOTE}
            >
              Buying just
              <br />
              <span className="fade-line">one service?</span>
            </SectionHead>
          </Reveal>

          <Reveal delay={120} className="mt-14">
            <div className="overflow-hidden rounded-xl border border-rule bg-void">
              {CORE_SERVICES.map((c, i) => (
                <div
                  key={c.t}
                  className={`flex items-center justify-between gap-6 px-6 py-4 ${
                    i > 0 ? 'border-t border-rule' : ''
                  }`}
                >
                  <span className="text-sm text-ash">{c.t}</span>
                  <span className="shrink-0 text-sm text-ink">{c.price}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150} className="mt-16">
            <p className="micro mb-5 text-ash3">7. Package examples</p>
            <div className="grid gap-6 lg:grid-cols-3">
              {PACKAGE_EXAMPLES.map((ex) => (
                <div key={ex.id} className="rounded-xl border border-rule bg-void p-7">
                  <h3 className="text-base text-ink">{ex.title}</h3>
                  <dl className="mt-5 flex flex-col gap-2.5">
                    {ex.lines.map((l) => (
                      <div key={l.k} className="flex justify-between gap-4 text-sm">
                        <dt className="text-ash3">{l.k}</dt>
                        <dd className="text-ash2">{formatINR(l.v)}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-4 border-t border-rule pt-3 text-sm">
                      <dt className="text-ink">Initial project total</dt>
                      <dd className="text-ink">{formatINR(ex.initial)}</dd>
                    </div>
                    <div className="flex justify-between gap-4 text-sm">
                      <dt className="text-ash3">{ex.monthly.k}</dt>
                      <dd className="text-ash2">
                        {formatINR(ex.monthly.v)}
                        <span className="ml-1 text-xs text-ash3">
                          /mo{ex.monthly.note ? ` ${ex.monthly.note}` : ''}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------- §8 EXCLUDED + §9/§10 TERMS */}
      <section id="payment" className="band scroll-mt-24">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Third-party costs, payment terms and GST"
              sub="The part nobody enjoys reading and everybody needs. Better to read it here than to discover it on an invoice."
            >
              What is not included,
              <br />
              <span className="fade-line">and how you pay.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-xl border border-rule bg-void p-8">
                <p className="micro mb-5 text-ash3">8. Third-party costs excluded</p>
                <p className="mb-5 text-xs leading-[1.6] text-ash3">
                  The following are billed separately:
                </p>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {THIRD_PARTY_EXCLUDED.map((x) => (
                    <li key={x} className="flex gap-2.5 text-sm leading-[1.5] text-ash3">
                      <Cross />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <div className="flex h-full flex-col gap-8">
                <div className="rounded-xl border border-rule bg-void p-8">
                  <p className="micro mb-5 text-ash3">9. Payment structure</p>
                  <ul className="flex flex-col gap-3.5">
                    {PAYMENT_MILESTONES.map((m) => (
                      <li key={m.pct} className="flex items-baseline gap-4 text-sm">
                        <span className="font-display text-xl tracking-[-0.03em] text-ember-soft">
                          {m.pct}
                        </span>
                        <span className="text-ash2">{m.when}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="micro mt-7 mb-4 text-ash3">Monthly services</p>
                  <ul className="flex flex-col gap-2.5">
                    {MONTHLY_TERMS.map((x) => (
                      <li key={x} className="flex gap-2.5 text-sm leading-[1.5] text-ash2">
                        <Tick />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-rule bg-void p-8">
                  <p className="micro mb-4 text-ash3">10. GST display policy</p>
                  <p className="text-sm leading-[1.65] text-ash2 text-pretty">{GST_POLICY}</p>
                  <div className="mt-6 rounded-md border border-rule bg-white/[0.02] p-5">
                    <p className="micro mb-3 text-ash3">How an invoice reads</p>
                    <dl className="flex flex-col gap-1.5 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-ash3">Taxable value</dt>
                        <dd className="text-ash2">₹20,000</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-ash3">GST @18%</dt>
                        <dd className="text-ash2">₹3,600</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-rule pt-2">
                        <dt className="text-ink">Total</dt>
                        <dd className="text-ink">₹23,600</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140} className="mt-8">
            <p className="rounded-lg border border-rule p-6 text-xs leading-[1.65] text-ash3">
              {THIRD_PARTY_NOTE}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------- PRICING FAQ */}
      <section className="band border-t border-rule">
        <div className="shell">
          <Reveal>
            <SectionHead eyebrow="Pricing FAQ" sub="The questions that come up before anyone commits.">
              Straight answers
              <br />
              <span className="fade-line">about money.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-x-14 gap-y-8 lg:grid-cols-2">
            {PRICING_FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 70}>
                <div className="border-t border-rule pt-6">
                  <h3 className="text-base text-ink">{f.q}</h3>
                  <p className="mt-3 text-sm leading-[1.65] text-ash2 text-pretty">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        line1="Not sure which package fits?"
        line2="Book a free consultation."
        sub={`We will review your business, show you exactly what we would build, and give you a transparent, itemized quote — no pressure, no obligation. Call ${CONTACT_DETAILS.phoneDisplay} or message us on WhatsApp.`}
        showHatch
      />
    </>
  )
}
