import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_LEVERS,
  applyLevers,
  computeMetrics,
  formatINR,
  formatPct,
  presetValues,
} from '../lib/calculator'
import { TOOLS, CONTACT_DETAILS } from '../lib/content'
import PageHero from '../components/PageHero'
import Reveal from '../components/ui/Reveal'
import CtaBand from '../components/CtaBand'
import Button from '../components/ui/Button'
import { SectionHead, Dot } from '../components/ui/Primitives'
import CalcForm from '../components/tools/CalcForm'
import CalcResults from '../components/tools/CalcResults'
import Levers from '../components/tools/Levers'
import QuickTools from '../components/tools/QuickTools'
import useMeta from '../hooks/useMeta'

const STORE_KEY = 'nextera.tools.v1'

/* Values live in the form as strings so a founder can clear a field, type
   "1,200" or leave something half-written without the UI fighting them. The
   engine normalises all of it. */
function toStrings(preset) {
  return Object.fromEntries(
    Object.entries(preset).map(([k, v]) => [k, typeof v === 'string' ? v : String(v)]),
  )
}

function readStored() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function Tools() {
  useMeta(
    'Free tools — profit, leak & break-even calculator',
    'Free business calculators for hotels, clinics, restaurants and shops: net profit, revenue leaked to OTA commission and discounts, missed enquiries, break-even in units, and the gap to your target profit. Nothing is uploaded.',
  )

  const stored = useMemo(readStored, [])
  const [typeId, setTypeId] = useState(stored?.typeId || 'hotel')
  const [values, setValues] = useState(() =>
    stored?.values ? { ...toStrings(presetValues(stored?.typeId || 'hotel')), ...stored.values } : toStrings(presetValues('hotel')),
  )
  const [levers, setLevers] = useState(() => ({ ...DEFAULT_LEVERS, ...(stored?.levers || {}) }))

  /* Keep the founder's numbers on this device, and only on this device. */
  useEffect(() => {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({ typeId, values, levers }))
    } catch {
      /* private mode / storage disabled — the tools still work for this session */
    }
  }, [typeId, values, levers])

  const input = useMemo(() => ({ typeId, ...values }), [typeId, values])
  const metrics = useMemo(() => computeMetrics(input), [input])
  const scenario = useMemo(() => applyLevers(input, levers), [input, levers])

  const setValue = (k, v) => setValues((s) => ({ ...s, [k]: v }))
  const setLever = (k, v) => setLevers((s) => ({ ...s, [k]: v }))
  const loadPreset = (id) => {
    setTypeId(id)
    setValues(toStrings(presetValues(id)))
  }
  const clearAll = () =>
    setValues(Object.fromEntries(Object.keys(values).map((k) => [k, k === 'volumeBasis' ? 'day' : ''])))

  const scrollToResult = () => {
    document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const loss = metrics.profit.netProfit < 0

  return (
    <>
      <PageHero
        eyebrow={TOOLS.eyebrow}
        line1={TOOLS.line1}
        line2={TOOLS.line2}
        sub={TOOLS.sub}
        meta={TOOLS.meta}
      >
        <div className="flex flex-wrap gap-2">
          {[
            { href: '#profit-engine', label: 'Profit & leak calculator' },
            { href: '#scenarios', label: 'What-if scenarios' },
            { href: '#quick', label: 'Quick calculations' },
            { href: '#method', label: 'How the maths works' },
          ].map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="rounded-full border border-rule px-4 py-2.5 text-sm text-ash transition-colors hover:border-rule-strong hover:text-ink"
            >
              {c.label}
            </a>
          ))}
        </div>
      </PageHero>

      {/* ------------------------------------------------ MAIN CALCULATOR */}
      <section id="profit-engine" className="band scroll-mt-24 border-t border-rule">
        <div className="shell">
          <Reveal>
            <SectionHead eyebrow={TOOLS.calculator.eyebrow} sub={TOOLS.calculator.lede}>
              {TOOLS.calculator.title1}
              <br />
              <span className="fade-line">{TOOLS.calculator.title2}</span>
            </SectionHead>
          </Reveal>

          <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,400px)] xl:gap-8">
            <Reveal>
              <CalcForm
                typeId={typeId}
                onType={loadPreset}
                values={values}
                setValue={setValue}
                onReset={() => loadPreset(typeId)}
                onClear={clearAll}
              />
            </Reveal>

            <Reveal delay={120}>
              <div className="results-scroll">
                <CalcResults metrics={metrics} />
                <p className="mt-5 flex items-start gap-2.5 text-xs leading-[1.6] text-ash3">
                  <Dot tone="mint" className="mt-[6px] shrink-0" />
                  {TOOLS.calculator.savedNote}. Nothing is uploaded, and no account is involved.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- WHAT-IF */}
      <section
        id="scenarios"
        className="band relative scroll-mt-24 border-y border-rule bg-black/35"
      >
        <div aria-hidden="true" className="hairline-grid pointer-events-none absolute inset-0 opacity-25" />
        <div className="shell relative">
          <Reveal>
            <SectionHead
              eyebrow="What-if"
              sub="The most useful question is not “what is my profit?” but “what changes it?”. Move one thing at a time and the whole model re-runs on your own numbers."
            >
              Five levers,
              <br />
              <span className="fade-line">one honest answer each.</span>
            </SectionHead>
          </Reveal>

          <Reveal delay={120} className="mt-12">
            <Levers
              levers={levers}
              setLever={setLever}
              onReset={() => setLevers(DEFAULT_LEVERS)}
              base={metrics}
              scenario={scenario}
            />
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- QUICK TOOLS */}
      <section id="quick" className="band scroll-mt-24">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Quick calculations"
              sub="Three short answers for the questions that come up mid-conversation — with a supplier, a partner, or yourself at 11pm."
            >
              Small tools,
              <br />
              <span className="fade-line">same arithmetic.</span>
            </SectionHead>
          </Reveal>

          <Reveal delay={120} className="mt-12">
            <QuickTools />
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------- METHOD */}
      <section
        id="method"
        className="band scroll-mt-24 border-y border-rule bg-black/35"
      >
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-20">
            <Reveal>
              <SectionHead
                eyebrow="Method"
                sub="A calculator is only worth anything if you can see what it assumes. These are ours, including the ones that make our break-even differ from your accountant's."
              >
                Every assumption,
                <br />
                <span className="fade-line">written down.</span>
              </SectionHead>
            </Reveal>

            <div className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2">
              {TOOLS.assumptions.map((a, i) => (
                <Reveal key={a.t} delay={i * 70}>
                  <div className="h-full bg-void p-7">
                    <p className="text-base leading-[1.4] text-ink">{a.t}</p>
                    <p className="mt-3 text-sm leading-[1.62] text-ash2 text-pretty">{a.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- FAQ */}
      <section className="band border-t border-rule">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-20">
            <Reveal>
              <SectionHead eyebrow="Before you rely on it">
                Seven things
                <br />
                <span className="fade-line">worth knowing.</span>
              </SectionHead>
              <p className="mt-7 max-w-sm text-sm leading-[1.6] text-ash2">
                If a number looks wrong, it probably is — and the reason is usually one field. Send
                it to us and we will look at it with you.
              </p>
              <Button to="/contact" variant="secondary" size="md" className="mt-6">
                Ask about your numbers
              </Button>
            </Reveal>

            <Reveal delay={120}>
              <ToolsFaq />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand
        line1="Numbers are the easy part."
        line2="Fixing them is the work."
        sub={`If the calculator found a leak you cannot close on your own — a website nobody trusts, an enquiry path that breaks on a phone, a Google listing that disagrees with both — that is what we do. ${CONTACT_DETAILS.city}, hotels and clinics.`}
        primary={{ label: 'Request the free audit', to: '/contact' }}
        showHatch
      />

      {/* Phone-only summary bar: the result stays in reach while you type. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-black/85 backdrop-blur-xl xl:hidden">
        <div className="shell">
          <div className="safe-bottom flex items-center justify-between gap-4 pt-3">
            <div className="min-w-0">
              <p className="micro text-ash3">{loss ? 'Net loss / month' : 'Net profit / month'}</p>
              <p
                className={`mt-1 font-display text-lg leading-none tracking-[-0.03em] tabular-nums ${
                  loss ? 'text-[#f0705a]' : 'text-ink'
                }`}
              >
                {formatINR(metrics.profit.netProfit)}
                <span className="ml-2 text-xs tracking-normal text-ash3">
                  {formatPct(metrics.profit.netMargin)}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToResult}
              className="shrink-0 rounded-full bg-ink px-5 py-3 text-sm font-medium text-void transition-colors hover:bg-white"
            >
              Full breakdown
            </button>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="h-24 xl:hidden" />
    </>
  )
}

/* -------------------------------------------------------------------------- */
function ToolsFaq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="flex flex-col">
      {TOOLS.faqs.map((f, i) => {
        const isOpen = open === i
        return (
          <div key={f.q} className="border-b border-rule first:border-t">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-5 text-left"
            >
              <span
                className={`text-base leading-[1.45] transition-colors duration-300 ${
                  isOpen ? 'text-ink' : 'text-ash hover:text-ink'
                }`}
              >
                {f.q}
              </span>
              <span
                className={`relative mt-1.5 h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${
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
                <p className="max-w-2xl pb-6 pr-6 text-sm leading-[1.68] text-ash2 text-pretty">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
