import { useState } from 'react'
import {
  PACKAGES,
  COMMERCIAL_TERMS,
  CONTACT_DETAILS,
  whatsappLink,
  ENQUIRY_MESSAGES,
} from '../lib/content'
import PageHero from '../components/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import CtaBand from '../components/CtaBand'
import { SectionHead, Rule, Dot } from '../components/ui/Primitives'
import { WhatsAppGlyph } from '../components/Navbar'
import useMeta from '../hooks/useMeta'

export default function Pricing() {
  useMeta(
    'Pricing',
    'Presence Pilot ₹6,000, Presence Foundation ₹15,000, Care & Presence ₹4,000 per month. Payment terms, two revision rounds, and everything explicitly excluded from each package.',
  )

  const [openPkg, setOpenPkg] = useState('foundation')

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        line1="Priced in rupees."
        line2="Scoped in writing."
        sub="Three packages. No hidden tiers, no setup fee, no annual lock-in to unlock a better number. Every quote references a published package, or a written custom scope you have approved."
        meta={[
          { l: 'From', v: '₹6,000' },
          { l: 'Payment', v: '50% advance' },
          { l: 'Revisions', v: '2 rounds' },
          { l: 'Contract', v: 'Per project' },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          {PACKAGES.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className={`rounded-full border px-4 py-2.5 text-[13px] transition-colors ${
                p.highlight
                  ? 'border-ember/35 bg-ember/[0.08] text-ember-soft'
                  : 'border-rule text-ash hover:border-rule-strong hover:text-ink'
              }`}
            >
              {p.name}
            </a>
          ))}
          <a
            href="#terms"
            className="rounded-full border border-rule px-4 py-2.5 text-[13px] text-ash transition-colors hover:border-rule-strong hover:text-ink"
          >
            Terms
          </a>
        </div>
      </PageHero>

      {/* --------------------------------------------------- PACKAGE CARDS */}
      <section className="band border-t border-rule">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-3">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <article
                  id={p.id}
                  className={`flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[22px] border ${
                    p.highlight ? 'border-ember/35 bg-coal' : 'border-rule bg-void'
                  }`}
                >
                  {p.highlight && (
                    <div className="hatch h-[3px] w-full" style={{ opacity: 0.5 }} />
                  )}

                  <div className="flex flex-1 flex-col p-7 lg:p-8">
                    <div className="flex items-center justify-between">
                      <p className="micro text-ash3">{p.code}</p>
                      {p.highlight && (
                        <span className="rounded-full border border-ember/35 bg-ember/10 px-2.5 py-1 micro text-ember-soft">
                          Most chosen
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 font-display text-[25px] tracking-[-0.03em] text-ink">
                      {p.name}
                    </h2>

                    <div className="mt-6 flex items-baseline gap-1.5">
                      <span className="font-display text-[42px] leading-none tracking-[-0.045em] text-ink">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[13.5px] text-ash3">/ {p.priceNote}</span>
                    </div>

                    <p className="mt-5 text-[14.5px] leading-[1.62] text-ash2 text-pretty">
                      {p.tagline}
                    </p>

                    <div className="mt-6 rounded-lg border border-rule-faint bg-white/[0.02] px-4 py-3">
                      <p className="micro mb-1.5 text-ash3">Planning range</p>
                      <p className="text-[13.5px] text-ink">{p.turnaround}</p>
                      <p className="mt-1.5 text-[12px] leading-[1.5] text-ash3">
                        {p.turnaroundNote}
                      </p>
                    </div>

                    <p className="mt-6 text-[13.5px] leading-[1.6] text-ash text-pretty">
                      <span className="text-ink">Best for: </span>
                      {p.for}
                    </p>

                    <Button
                      href={whatsappLink(p.cta.message)}
                      variant={p.highlight ? 'accent' : 'secondary'}
                      size="md"
                      className="mt-7 w-full"
                    >
                      {p.cta.label}
                    </Button>

                    <button
                      onClick={() => setOpenPkg(openPkg === p.id ? null : p.id)}
                      className="mt-3 flex items-center justify-center gap-2 py-2.5 text-[12.5px] text-ash3 transition-colors hover:text-ink"
                    >
                      {openPkg === p.id ? 'Hide' : 'Show'} full scope
                      <span
                        className={`relative block h-2.5 w-2.5 transition-transform duration-400 ${
                          openPkg === p.id ? 'rotate-45' : ''
                        }`}
                      >
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                      </span>
                    </button>
                  </div>

                  {/* expandable full scope */}
                  <div
                    className="grid border-t border-rule transition-all duration-500"
                    style={{
                      gridTemplateRows: openPkg === p.id ? '1fr' : '0fr',
                      transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-6 p-7 lg:p-8">
                        <List
                          title="What is included"
                          tone="mint"
                          items={p.includes}
                        />

                        {p.allowanceTable && (
                          <div>
                            <p className="micro mb-3 text-mint">Monthly allowance</p>
                            <div className="flex flex-col">
                              {p.allowanceTable.map((a) => (
                                <div
                                  key={a.k}
                                  className="flex flex-col gap-1 border-b border-rule-faint py-3 last:border-b-0"
                                >
                                  <span className="text-[13.5px] text-ink">{a.k}</span>
                                  <span className="text-[12.5px] leading-[1.5] text-ash3">
                                    {a.v}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <List title="What is excluded" tone="red" items={p.excludes} />

                        {p.copyNote && (
                          <p className="rounded-lg border border-rule-faint bg-white/[0.02] p-4 text-[12.5px] leading-[1.62] text-ash3">
                            {p.copyNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* add-ons */}
          <Reveal delay={140} className="mt-6">
            <div className="rounded-[20px] border border-rule bg-coal p-7 lg:p-9">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
                <div>
                  <p className="micro mb-4 text-ash3">Add-ons & custom work</p>
                  <h2 className="t-h3 text-ink">
                    Need something
                    <br />
                    <span className="fade-line">outside these three?</span>
                  </h2>
                  <p className="mt-5 text-[14px] leading-[1.62] text-ash2 text-pretty">
                    That is a normal conversation, not a problem. We scope it, you decide, and it
                    is quoted separately — never quietly folded into a package it does not fit.
                  </p>
                </div>

                <div className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2">
                  {[
                    'Additional standard page',
                    'Additional language',
                    'Extra approved content',
                    'Additional revision round',
                    'Existing-site remediation',
                    'Specialised integration',
                  ].map((x) => (
                    <div key={x} className="flex items-center gap-2.5 bg-void px-5 py-4">
                      <Dot tone="ember" />
                      <span className="text-[13.5px] text-ash">{x}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------- COMPARISON TABLE */}
      <Comparison />

      {/* --------------------------------------------------- TERMS */}
      <section id="terms" className="band scroll-mt-24 border-t border-rule">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="The small print, made large"
              sub="These are the terms that decide whether a project goes smoothly. Better to read them here than to discover them halfway through."
            >
              The conditions
              <br />
              <span className="fade-line">that protect you too.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-2">
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
                    {g.items.map((x) => {
                      const red = g.tone === 'red'
                      return (
                        <li key={x} className="flex gap-3 text-[14px] leading-[1.6] text-ash2">
                          {red ? (
                            <svg viewBox="0 0 16 16" fill="none" className="mt-[5px] h-3 w-3 shrink-0">
                              <path d="M4 4l8 8M12 4l-8 8" stroke="#f0705a" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 16 16" fill="none" className="mt-[5px] h-3 w-3 shrink-0">
                              <path d="m3 8.4 3 3L13 4.6" stroke="#4fd1a5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          {x}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160} className="mt-8">
            <div
              id="exclusions"
              className="scroll-mt-28 rounded-2xl border border-rule p-8"
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
                      <path d="M4 4l8 8M12 4l-8 8" stroke="#f0705a" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    <span className="text-[13.5px] text-ash2">{x}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        line1="Want a number"
        line2="for your business?"
        sub="Send us your business name and what you are losing today. You will get a written scope and a fixed quote — usually the same day."
        primary={{ label: 'Request a quote', to: '/contact' }}
        showHatch
      />
    </>
  )
}

/* -------------------------------------------------------------------------- */
function List({ title, tone, items }) {
  const red = tone === 'red'
  return (
    <div>
      <p className={`micro mb-3.5 ${red ? 'text-ember-soft' : 'text-mint'}`}>{title}</p>
      <ul className="flex flex-col gap-2.5">
        {items.map((x) => (
          <li key={x} className="flex gap-2.5 text-[13.5px] leading-[1.55] text-ash2">
            {red ? (
              <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
                <path d="M4 4l8 8M12 4l-8 8" stroke="#f0705a" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
                <path d="m3 8.4 3 3L13 4.6" stroke="#4fd1a5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {x}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
const COMPARE_ROWS = [
  { k: 'One-time price', v: ['₹6,000', '₹15,000', '₹4,000 / month'] },
  { k: 'Standard pages', v: ['1 page', 'Up to 5', '—'] },
  { k: 'Content sections', v: ['Up to 6', 'Per page', '—'] },
  { k: 'Primary language', v: ['1', '1', '1'] },
  { k: 'Click-to-WhatsApp', v: [true, true, true] },
  { k: 'Enquiry form', v: ['1 minimal', 'Up to 2 entry points', 'Flow check'] },
  { k: 'GBP audit', v: [true, true, false] },
  { k: 'GBP corrections executed', v: [false, '1 approved batch', 'Up to 4 posts / updates'] },
  { k: 'Review-response drafts', v: [false, false, 'Up to 20 / month'] },
  { k: 'Monthly report', v: [false, false, true] },
  { k: 'Revision rounds', v: ['2', '2', 'Within allowance'] },
  { k: 'Planning range', v: ['3–5 days', '7–10 days', 'Monthly cycle'] },
  { k: 'Booking engine / payments', v: [false, false, false] },
  { k: 'Official WhatsApp API', v: [false, false, false] },
  { k: 'AI voice agent', v: [false, false, false] },
]

function Comparison() {
  return (
    <section className="band relative border-y border-rule bg-black/35">
      <div className="shell">
        <Reveal>
          <SectionHead eyebrow="Side by side">
            Every difference,
            <br />
            <span className="fade-line">in one table.</span>
          </SectionHead>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div className="overflow-x-auto rounded-2xl border border-rule">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-rule bg-white/[0.015]">
                  <th className="w-[32%] px-5 py-5 text-left text-[13px] font-normal text-ash3">
                    Feature
                  </th>
                  {PACKAGES.map((p) => (
                    <th
                      key={p.id}
                      className={`px-5 py-5 text-left ${
                        p.highlight ? 'text-ember-soft' : 'text-ink'
                      }`}
                    >
                      <span className="block text-[14px] text-ink">{p.name}</span>
                      <span className="micro mt-1.5 block text-ash3">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr
                    key={row.k}
                    className="border-b border-rule-faint transition-colors last:border-b-0 hover:bg-white/[0.012]"
                  >
                    <td className="px-5 py-4 text-[13.5px] text-ash2">{row.k}</td>
                    {row.v.map((cell, j) => (
                      <td key={j} className="px-5 py-4">
                        {cell === true ? (
                          <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-mint/15">
                            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                              <path d="m2.5 6.2 2.2 2.2L9.5 3.6" stroke="#4fd1a5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        ) : cell === false ? (
                          <span className="text-[15px] leading-none text-ash3">—</span>
                        ) : (
                          <span className="text-[13.5px] leading-[1.45] text-ash">{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-8">
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-rule bg-coal p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[15px] text-ink">Still not sure which fits?</p>
              <p className="mt-1.5 text-[13.5px] text-ash2">
                Tell us what the business does and we will tell you which one — or that none of
                them is worth paying for right now.
              </p>
            </div>
            <Button
              href={whatsappLink(ENQUIRY_MESSAGES.general)}
              variant="primary"
              size="md"
              className="shrink-0"
            >
              <WhatsAppGlyph className="h-3.5 w-3.5" />
              Ask on WhatsApp
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
