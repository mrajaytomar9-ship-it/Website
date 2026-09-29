import {
  PACKAGES,
  ADD_ONS,
  SUPPORT_PLANS,
  COMPONENT_VALUES,
  COMPONENT_VALUES_NOTE,
  SERVICES,
  PRICING_FAQS,
  PAYMENT_TERMS,
  WHAT_HAPPENS_NEXT,
  COMMERCIAL_TERMS,
  CONTACT_DETAILS,
  whatsappLink,
  ENQUIRY_MESSAGES,
} from '../lib/content'
import { formatINR } from '../lib/calculator'
import PageHero from '../components/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import CtaBand from '../components/CtaBand'
import { SectionHead } from '../components/ui/Primitives'
import useMeta from '../hooks/useMeta'

export default function Pricing() {
  useMeta(
    'Pricing',
    'Silver ₹42,000, Gold ₹85,000 and Platinum ₹1,05,000 — one-time bundle pricing. Add-on services, monthly support plans and payment terms, all itemized.'
  )

  return (
    <>
      <PageHero
        eyebrow="Bundle pricing"
        line1="Three bundles."
        line2="No hidden tiers."
        sub="Bundles are the most practical way to get a complete growth system. Each one combines several service categories at a lower total price than buying them separately. All prices are one-time and in Indian Rupees."
        meta={[
          { l: 'From', v: '₹42,000' },
          { l: 'Payment', v: 'Advance + milestones' },
          { l: 'Free support', v: 'Up to 6 months' },
          { l: 'Hidden charges', v: 'None' },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          {PACKAGES.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className={`rounded-full border px-4 py-2.5 text-sm transition-colors ${
                p.highlight
                  ? 'border-ember/35 bg-ember/[0.08] text-ember-soft'
                  : 'border-rule text-ash hover:border-rule-strong hover:text-ink'
              }`}
            >
              {p.name} · {formatINR(p.price)}
            </a>
          ))}
          {['addons', 'support', 'terms'].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full border border-rule px-4 py-2.5 text-sm text-ash transition-colors hover:border-rule-strong hover:text-ink"
            >
              {id === 'addons' ? 'Add-ons' : id === 'support' ? 'Support plans' : 'Terms'}
            </a>
          ))}
        </div>
      </PageHero>

      {/* ------------------------------------------------------ BUNDLE CARDS */}
      <section className="band border-t border-rule">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Service bundle pricing"
              sub="Buy one category on its own, or combine them into a bundle for a lower total price."
            >
              Pick the bundle that
              <br />
              <span className="fade-line">matches where you are.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.id} delay={i * 110}>
                <article
                  id={p.id}
                  className={`relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-xl border p-7 ${
                    p.highlight ? 'border-ember/35 bg-ember/[0.04]' : 'border-rule bg-void'
                  }`}
                >
                  {p.badge && (
                    <span className="micro absolute right-7 top-7 rounded-full border border-ember/35 bg-ember/[0.1] px-3 py-1 text-ember-soft">
                      {p.badge}
                    </span>
                  )}

                  <p className="micro text-ash3">Bundle</p>
                  <h3 className="mt-3 font-display text-xl tracking-[-0.03em] text-ink">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.55] text-ash2">{p.bestFor}</p>

                  <div className="mt-7 border-y border-rule py-6">
                    <p className="font-display text-3xl tracking-[-0.04em] text-ink">
                      {formatINR(p.price)}
                    </p>
                    <p className="micro mt-2 text-ash3">{p.priceNote}</p>
                    {p.listValue && (
                      <p className="mt-3 text-xs leading-[1.6] text-ash2">
                        List value {formatINR(p.listValue)} ·{' '}
                        <span className="text-mint">you save {formatINR(p.save)}</span>
                      </p>
                    )}
                  </div>

                  <p className="mt-6 text-sm leading-[1.6] text-ash text-pretty">{p.for}</p>

                  <div className="mt-6 flex-1">
                    <p className="micro mb-4 text-mint">What is included</p>
                    <ul className="flex flex-col gap-2.5">
                      {p.includes.map((x) => (
                        <li key={x} className="flex gap-2.5 text-sm leading-[1.5] text-ash2">
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            className="mt-[4px] h-3 w-3 shrink-0"
                          >
                            <path
                              d="m3 8.4 3 3L13 4.6"
                              stroke="#4fd1a5"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <dl className="mt-7 flex flex-col gap-2 border-t border-rule pt-6 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ash3">Delivery</dt>
                      <dd className="text-right text-ash2">{p.turnaround}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ash3">Free support</dt>
                      <dd className="text-right text-ash2">{p.support}</dd>
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
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140} className="mt-8">
            <p className="text-xs leading-[1.6] text-ash3">
              All final pricing is confirmed in a written proposal. This page is a service and
              pricing guide, not a binding contract. Prices in Indian Rupees (INR).
            </p>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------- HOW PRICING IS BUILT */}
      <section className="band relative border-y border-rule bg-black/35">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="How bundle pricing is built"
              sub="To keep pricing transparent, here is the indicative value of each component. Bundles discount the combined value — you pay less than buying each service separately."
            >
              What each part
              <br />
              <span className="fade-line">is worth on its own.</span>
            </SectionHead>
          </Reveal>

          <Reveal delay={120} className="mt-14">
            <div className="overflow-x-auto rounded-xl border border-rule bg-void">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-rule">
                    <th className="micro px-6 py-4 font-medium text-ash3">Component</th>
                    <th className="micro px-6 py-4 text-right font-medium text-ash3">
                      Standalone value
                    </th>
                    {PACKAGES.map((p) => (
                      <th
                        key={p.id}
                        className="micro px-6 py-4 text-right font-medium text-ash3"
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPONENT_VALUES.map((c) => (
                    <tr key={c.t} className="border-b border-rule">
                      <td className="px-6 py-4 text-sm text-ash">{c.t}</td>
                      <td className="px-6 py-4 text-right text-sm text-ash2">
                        {formatINR(c.value)}
                      </td>
                      {PACKAGES.map((p) => {
                        const key = p.id
                        const on = c[key]
                        return (
                          <td
                            key={key}
                            className={`px-6 py-4 text-right text-sm ${
                              on ? 'text-mint' : 'text-ash3'
                            }`}
                          >
                            {on ? formatINR(c.value) : '—'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                  <tr className="border-b border-rule">
                    <td className="px-6 py-4 text-sm text-ink">Bundle total</td>
                    <td className="px-6 py-4 text-right text-sm text-ash2">
                      {formatINR(COMPONENT_VALUES.reduce((n, c) => n + c.value, 0))}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-ash2">
                      {formatINR(PACKAGES.find((p) => p.id === 'silver').price)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-ash2">
                      {formatINR(PACKAGES.find((p) => p.id === 'gold').price)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-ash2">
                      {formatINR(PACKAGES.find((p) => p.id === 'platinum').price)}
                    </td>
                  </tr>
                  <tr className="border-b border-rule bg-white/[0.02]">
                    <td className="px-6 py-4 text-sm text-ink">You pay</td>
                    <td className="px-6 py-4 text-right text-sm text-ash3">—</td>
                    {PACKAGES.map((p) => (
                      <td key={p.id} className="px-6 py-4 text-right text-sm text-ink">
                        {formatINR(p.price)}
                        {p.save ? (
                          <span className="ml-2 text-xs text-mint">save {formatINR(p.save)}</span>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-xs leading-[1.6] text-ash3">{COMPONENT_VALUES_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------- CATEGORY STARTING POINTS */}
      <section className="band">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Category starting points"
              sub="Buying a single category? These are the entry points. Final quotes are tailored to your business."
            >
              Buying just
              <br />
              <span className="fade-line">one service?</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
                <div className="h-full rounded-xl border border-rule bg-void p-7">
                  <h3 className="font-display text-xl tracking-[-0.03em] text-ink">
                    {s.title.split(' & ')[0]}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.6] text-ash2 text-pretty">{s.lede}</p>
                  <p className="mt-4 text-xs leading-[1.6] text-ash3">
                    Recommended for {s.audience.slice(0, 3).join(', ')}.
                  </p>
                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-rule pt-5">
                    <span className="micro text-ash3">Starting point</span>
                    <span className="text-base text-ink">{s.startingPoint}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- ADD-ONS */}
      <section id="addons" className="band scroll-mt-24 border-t border-rule">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Add-on services"
              sub="Enhance any bundle or category with these optional services."
            >
              Extras, priced
              <br />
              <span className="fade-line">separately and openly.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {ADD_ONS.map((a, i) => (
              <Reveal key={a.t} delay={i * 60}>
                <div className="flex h-full flex-col justify-between gap-4 bg-void p-6">
                  <p className="text-sm leading-[1.5] text-ash">{a.t}</p>
                  <p className="micro text-ash3">{a.billing}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- SUPPORT PLANS */}
      <section id="support" className="band scroll-mt-24 border-t border-rule">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Monthly support plans"
              sub="Every bundle includes a free support period. After that, monthly plans keep your systems updated, secure and performing."
            >
              After the free
              <br />
              <span className="fade-line">period ends.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {SUPPORT_PLANS.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <div className="flex h-full flex-col rounded-xl border border-rule bg-void p-7">
                  <h3 className="font-display text-xl tracking-[-0.03em] text-ink">{p.name}</h3>
                  <p className="mt-3 text-sm leading-[1.6] text-ash2 text-pretty">{p.best}</p>
                  <p className="mt-5 flex-1 text-sm leading-[1.6] text-ash3">{p.includes}</p>
                  <div className="mt-6 border-t border-rule pt-5">
                    <p className="text-base text-ink">{p.price}</p>
                    <a
                      href={whatsappLink(ENQUIRY_MESSAGES.support)}
                      className="mt-2 inline-block text-sm text-ember-soft transition-colors hover:text-ink"
                    >
                      Ask about {p.name} →
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- PRICING FAQ */}
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

      {/* ---------------------------------------------- TERMS & PAYMENT */}
      <section id="terms" className="band scroll-mt-24 border-t border-rule">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Payment terms and what happens next"
              sub="These are the terms that decide whether a project goes smoothly. Better to read them here than to discover them halfway through."
            >
              The conditions
              <br />
              <span className="fade-line">that protect you too.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-xl border border-rule bg-void p-8">
                <p className="micro mb-5 text-ash3">Payment terms</p>
                <ul className="flex flex-col gap-3.5">
                  {PAYMENT_TERMS.map((x) => (
                    <li key={x} className="flex gap-3 text-sm leading-[1.6] text-ash2">
                      <svg viewBox="0 0 16 16" fill="none" className="mt-[5px] h-3 w-3 shrink-0">
                        <path
                          d="m3 8.4 3 3L13 4.6"
                          stroke="#4fd1a5"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <div className="rounded-xl border border-rule bg-void p-8">
                <p className="micro mb-5 text-ash3">What happens after you contact us</p>
                <ol className="flex flex-col">
                  {WHAT_HAPPENS_NEXT.map((s) => (
                    <li key={s.n} className="flex gap-4 border-t border-rule py-4 last:border-b">
                      <span className="micro shrink-0 pt-0.5 text-ember">{s.n}</span>
                      <span className="text-sm leading-[1.6] text-ash2">{s.d}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule md:grid-cols-2">
            {[
              { k: 'Payment', items: COMMERCIAL_TERMS.payment, tone: 'mint' },
              { k: 'Revisions', items: COMMERCIAL_TERMS.revisions, tone: 'sky' },
              { k: 'What we need from you', items: COMMERCIAL_TERMS.whoIsResponsible, tone: 'ember' },
              { k: 'What we will never do', items: COMMERCIAL_TERMS.honesty, tone: 'red' },
            ].map((g, i) => (
              <Reveal key={g.k} delay={i * 90}>
                <div className="h-full bg-void p-8">
                  <p className="micro mb-5 text-ash3">{g.k}</p>
                  <ul className="flex flex-col gap-3.5">
                    {g.items.map((x) => (
                      <li key={x} className="flex gap-3 text-sm leading-[1.6] text-ash2">
                        {g.tone === 'red' ? (
                          <svg viewBox="0 0 16 16" fill="none" className="mt-[5px] h-3 w-3 shrink-0">
                            <path
                              d="M4 4l8 8M12 4l-8 8"
                              stroke="#f0705a"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 16 16" fill="none" className="mt-[5px] h-3 w-3 shrink-0">
                            <path
                              d="m3 8.4 3 3L13 4.6"
                              stroke="#4fd1a5"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160} className="mt-8">
            <div
              id="exclusions"
              className="scroll-mt-28 rounded-lg border border-rule p-8"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.025), transparent)' }}
            >
              <p className="micro mb-5 text-ash3">Not sold, at any price</p>
              <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  'Fake or incentivised reviews',
                  'Misleading credentials or claims',
                  'Unauthorised account control',
                  'Guaranteed rankings or leads',
                  'Unfunded paid infrastructure',
                  'Unlimited revisions or development',
                ].map((x) => (
                  <div key={x} className="flex items-center gap-3">
                    <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3 shrink-0">
                      <path
                        d="M4 4l8 8M12 4l-8 8"
                        stroke="#f0705a"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-sm text-ash2">{x}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        line1="Let's build your growth system."
        line2="Book a free consultation."
        sub={`We will review your business, show you exactly what we would build, and give you a transparent, itemized quote — no pressure, no obligation. Call ${CONTACT_DETAILS.phoneDisplay} or message us on WhatsApp.`}
        showHatch
      />
    </>
  )
}
