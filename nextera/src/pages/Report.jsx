import { useEffect, useMemo, useState } from 'react'
import { REPORT, whatsappLink, ENQUIRY_MESSAGES, CONTACT_DETAILS } from '../lib/content'
import {
  buildReport,
  defaultInput,
  validate,
  validateLead,
  reportToText,
  reportToHtml,
} from '../lib/report'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import ReportForm from '../components/report/ReportForm'
import ReportResult from '../components/report/ReportResult'
import { SectionHead } from '../components/ui/Primitives'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import ServiceIcon from '../components/ServiceIcon'
import useMeta from '../hooks/useMeta'

const STORE_KEY = 'nextera.report.v1'

/** Read back what this browser saved last time, tolerating a stale shape. */
function readStored() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function mergeInput(stored) {
  const base = defaultInput(stored?.input?.typeId || 'hotel')
  if (!stored?.input) return base
  const i = stored.input
  return {
    ...base,
    ...i,
    links: { ...base.links, ...(i.links || {}) },
    presence: { ...base.presence, ...(i.presence || {}) },
    values: { ...base.values, ...(i.values || {}) },
    competitors: Array.isArray(i.competitors) && i.competitors.length ? i.competitors : base.competitors,
    lead: { ...base.lead, ...(i.lead || {}) },
  }
}

export default function Report() {
  useMeta(
    'Free business report — presence, profit leak and weak points',
    'Answer a few questions and paste your links: Nextera Solution scores your online presence, counts the leak in your numbers, compares you with competitors you enter, and lists what to fix first. Runs in your browser, nothing uploaded.',
  )

  const stored = useMemo(readStored, [])
  const [input, setInput] = useState(() => mergeInput(stored))
  const [lead, setLead] = useState(() => ({
    name: stored?.lead?.name || '',
    whatsapp: stored?.lead?.whatsapp || '',
  }))
  const [unlocked, setUnlocked] = useState(() => stored?.unlocked === true)
  const [errors, setErrors] = useState({})
  const [leadErrors, setLeadErrors] = useState({})
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({ input, lead, unlocked }))
    } catch {
      /* private mode or a full quota — the report still works, it just is not remembered */
    }
  }, [input, lead, unlocked])

  /* The report is derived, never stored: it is always exactly what the inputs say. */
  const ready = useMemo(() => validate(input).ok, [input])
  const report = useMemo(() => (ready ? buildReport(input) : null), [ready, input])

  const onGenerate = () => {
    const v = validate(input)
    setErrors(v.errors)
    setTouched(true)
    if (!v.ok) return
    if (typeof document !== 'undefined') {
      document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  /* Re-check on every change once the founder has tried to generate, so the
     error clears the moment it is fixed rather than on the next attempt. */
  useEffect(() => {
    if (touched) setErrors(validate(input).errors)
  }, [input, touched])

  const onUnlock = () => {
    const v = validateLead(lead)
    setLeadErrors(v.errors)
    if (!v.ok) return
    setUnlocked(true)
    if (typeof document !== 'undefined') {
      window.setTimeout(
        () => document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        60,
      )
    }
  }

  /* ---------------------------------------------------------- exporting --- */
  const openDocument = () => {
    if (!report) return
    const html = reportToHtml(report, lead)
    if (typeof window === 'undefined') return
    /* A new window gets the same light document the download produces — the
       on-screen report is black, which is unreadable and expensive on paper. */
    const win = window.open('', '_blank')
    if (win) {
      win.document.open()
      win.document.write(html)
      win.document.close()
      win.focus()
      win.print()
      return
    }
    /* Popup blocked: fall back to printing the page itself. */
    window.print()
  }

  const downloadDocument = () => {
    if (!report || typeof window === 'undefined') return
    const html = reportToHtml(report, lead)
    const slug =
      report.business.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'business'
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nextera-report-${slug}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sendOnWhatsApp = () => {
    if (!report || typeof window === 'undefined') return
    window.open(whatsappLink(reportToText(report, lead)), '_blank', 'noopener,noreferrer')
  }

  const onReset = () => {
    setInput(defaultInput(input.typeId))
    setLead({ name: '', whatsapp: '' })
    setUnlocked(false)
    setErrors({})
    setLeadErrors({})
    setTouched(false)
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORE_KEY)
      } catch {
        /* nothing to clear */
      }
    }
  }

  return (
    <>
      <PageHero
        eyebrow={REPORT.eyebrow}
        line1={REPORT.line1}
        line2={REPORT.line2}
        sub={REPORT.sub}
        meta={REPORT.meta}
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button as="button" variant="primary" size="lg" onClick={onGenerate}>
            {REPORT.generateLabel}
          </Button>
          <Button to="/contact" variant="secondary" size="lg">
            Book the hand-done audit
          </Button>
        </div>
      </PageHero>

      {/* --------------------------------------------------------- the input */}
      <section className="band border-t border-rule" id="input">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:items-start lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <SectionHead eyebrow="Start here" sub={REPORT.generatingNote}>
                Four minutes
                <br />
                <span className="fade-line">of honest answers.</span>
              </SectionHead>

              <ul className="mt-8 flex flex-col gap-3.5">
                {REPORT.freePoints.map((b) => (
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

              <div className="mt-8 flex flex-col gap-3">
                <Button as="button" variant="primary" size="md" onClick={onGenerate}>
                  {REPORT.generateLabel}
                </Button>
                <Button as="button" variant="ghost" size="md" onClick={onReset}>
                  Clear everything
                </Button>
              </div>

              <p className="mt-6 flex items-start gap-2.5 text-xs leading-[1.6] text-ash3">
                <ServiceIcon name="lock" className="mt-[2px] h-3.5 w-3.5 shrink-0" />
                Answers are saved in this browser only. No account, no upload, no tracking.
              </p>
            </div>

            <ReportForm input={input} setInput={setInput} errors={errors} />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- the output */}
      <section className="band border-t border-rule bg-black/35" id="result">
        <div className="shell">
          <Reveal>
            <SectionHead eyebrow="Your report" sub="Everything below is derived from what you typed, in this browser, the moment you typed it.">
              What it says
              <br />
              <span className="fade-line">about where you are.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-12">
            {report ? (
              <ReportResult
                report={report}
                unlocked={unlocked}
                lead={lead}
                setLead={setLead}
                onUnlock={onUnlock}
                onPrint={openDocument}
                onDownload={downloadDocument}
                onSend={sendOnWhatsApp}
                leadErrors={leadErrors}
              />
            ) : (
              <div className="rounded-lg border border-rule bg-void p-7 sm:p-10">
                <p className="text-base leading-[1.7] text-ash2">
                  Give the business a name and at least one link — your website, your Google
                  profile, or a booking or directory listing — and the report appears here as you
                  answer.
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {Object.values(errors).map((e, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-[#f0705a]">
                      <span aria-hidden="true">·</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- method */}
      <section className="band border-t border-rule" id="method">
        <div className="shell">
          <Reveal>
            <SectionHead eyebrow={REPORT.method.eyebrow} sub={REPORT.method.lede}>
              {REPORT.method.title1}
              <br />
              <span className="fade-line">{REPORT.method.title2}</span>
            </SectionHead>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule lg:grid-cols-2">
            <Reveal>
              <div className="h-full bg-void p-7 lg:p-9">
                <p className="micro mb-4 text-mint">What it does</p>
                <ul className="flex flex-col gap-4">
                  {REPORT.method.does.map((d) => (
                    <li key={d} className="flex gap-3">
                      <svg viewBox="0 0 16 16" fill="none" className="mt-[5px] h-3 w-3 shrink-0">
                        <path
                          d="m3 8.4 3 3L13 4.6"
                          stroke="#4fd1a5"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm leading-[1.6] text-ash">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="h-full bg-void p-7 lg:p-9">
                <p className="micro mb-4 text-ember-soft">What it does not</p>
                <ul className="flex flex-col gap-4">
                  {REPORT.method.doesNot.map((d) => (
                    <li key={d} className="flex gap-3">
                      <svg viewBox="0 0 16 16" fill="none" className="mt-[4px] h-3 w-3 shrink-0">
                        <path
                          d="M4 4l8 8M12 4l-8 8"
                          stroke="#f0705a"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="text-sm leading-[1.6] text-ash2">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="mt-10 rounded-lg border border-rule-faint bg-white/[0.02] p-6">
              <p className="micro mb-3 text-ash2">How the score is weighted</p>
              <p className="max-w-3xl text-sm leading-[1.7] text-ash2">
                Findability 30 · Credibility 25 · Convertibility 25 · Money 20. Inside each pillar
                the individual checks carry their own weight — a website and a Google profile are
                worth more than a second language. A question left blank is excluded from the
                score, not marked down, so the number reflects what you actually answered.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- faq */}
      <section className="band border-t border-rule" id="report-faq">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-20">
            <Reveal>
              <SectionHead eyebrow="Questions">
                Before you
                <br />
                <span className="fade-line">fill it in.</span>
              </SectionHead>
              <Button
                href={whatsappLink(ENQUIRY_MESSAGES.report)}
                variant="secondary"
                size="md"
                className="mt-7"
              >
                Ask us something first
              </Button>
            </Reveal>

            <Reveal delay={110}>
              <div className="flex flex-col">
                {REPORT.faqs.map((f) => (
                  <details key={f.q} className="group border-b border-rule first:border-t">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-base leading-[1.5] text-ash transition-colors hover:text-ink">
                      {f.q}
                      <span
                        aria-hidden="true"
                        className="mt-2 h-3 w-3 shrink-0 transition-transform duration-300 group-open:rotate-45"
                      >
                        <span className="absolute h-px w-3 bg-ink" />
                        <span className="absolute mt-1.5 h-3 w-px -ml-1.5 bg-ink" />
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-7 pr-8 text-sm leading-[1.7] text-ash2 text-pretty">{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand
        line1="Want a person to look"
        line2="instead of a form?"
        sub={`The hand-done audit opens your listings, your competitors' and your enquiry path, and writes down what is wrong. ${CONTACT_DETAILS.responseNote}.`}
        primary={{ label: 'Request the audit', to: '/contact' }}
      />
    </>
  )
}
