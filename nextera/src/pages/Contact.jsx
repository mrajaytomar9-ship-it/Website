import { useMemo, useState } from 'react'
import { CONTACT_DETAILS, PACKAGES, whatsappLink, ENQUIRY_MESSAGES, NICHES } from '../lib/content'
import PageHero from '../components/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import { WhatsAppGlyph } from '../components/Navbar'
import { Dot, Rule } from '../components/ui/Primitives'
import useMeta from '../hooks/useMeta'

/* -------------------------------------------------------------------------- */
/* A short, pre-filled enquiry builder. The output is a WhatsApp deep link, so  */
/* the form never silently discards anything and the founder sees the exact    */
/* message the lead is about to send.                                         */
/* -------------------------------------------------------------------------- */

const INTERESTS = [
  'A new website',
  'Fixing my current site',
  'WhatsApp enquiry setup',
  'Google Business Profile',
  'Monthly care & updates',
  'Something else',
]

const BUDGETS = [
  'Under ₹6,000',
  '₹6,000 – ₹15,000',
  '₹15,000 – ₹30,000',
  'Over ₹30,000',
  'Not sure yet',
]

const TIMELINES = ['As soon as possible', 'Within a month', 'Just exploring']

function buildMessage({ name, business, interest, budget, timeline, note, packageId }) {
  const pack = PACKAGES.find((p) => p.id === packageId)
  const lines = [
    "Hi Nextera Solution — I'd like to request a free audit.",
    '',
    `Name: ${name || '—'}`,
    `Business: ${business || '—'}`,
    `What I need: ${interest || '—'}`,
  ]
  if (pack) lines.push(`Package I'm considering: ${pack.name} (₹${pack.price.toLocaleString('en-IN')})`)
  if (budget) lines.push(`Budget range: ${budget}`)
  if (timeline) lines.push(`Timeline: ${timeline}`)
  if (note) lines.push('', note)
  lines.push('', 'Please share what you find in the audit.')
  return lines.join('\n')
}

export default function Contact() {
  useMeta(
    'Request a free audit',
    'Request a free website and Google Business Profile audit for your Agra business. No obligation, no cost — usually replied to within one working day.',
  )

  const [form, setForm] = useState({
    name: '',
    business: '',
    interest: '',
    budget: '',
    timeline: '',
    note: '',
    packageId: '',
  })
  const [copied, setCopied] = useState(false)
  const [touched, setTouched] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const message = useMemo(() => buildMessage(form), [form])
  const waHref = whatsappLink(message)

  const nameError = touched && !form.name.trim() ? 'Please add a name' : ''
  const businessError = touched && !form.business.trim() ? 'Please add a business name' : ''

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        line1="Request a free audit."
        line2="Pay nothing to start."
        sub="Tell us what your business does and where customers find you today. You will get a written list of what is actually wrong, in priority order — before any price is discussed."
        meta={[
          { l: 'Response time', v: '1 working day' },
          { l: 'Cost of the audit', v: 'Free' },
          { l: 'Obligation', v: 'None' },
          { l: 'Coverage', v: 'Agra' },
        ]}
      />

      <section className="band border-t border-rule">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
            {/* ------------------------------------------------------- FORM */}
            <Reveal>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setTouched(true)
                  window.open(waHref, '_blank', 'noopener,noreferrer')
                }}
                className="rounded-[22px] border border-rule bg-void p-7 lg:p-9"
                noValidate
              >
                <div className="flex items-center justify-between gap-4 border-b border-rule pb-6">
                  <div>
                    <h2 className="text-[19px] text-ink">Build your enquiry</h2>
                    <p className="mt-1.5 text-[13.5px] text-ash3">
                      Every field below fills a message you can see before sending.
                    </p>
                  </div>
                  <span className="hidden shrink-0 items-center gap-2 rounded-full border border-rule px-3 py-1.5 sm:inline-flex">
                    <Dot tone="mint" className="anim-pulse" />
                    <span className="micro text-ash2">Live preview</span>
                  </span>
                </div>

                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <Field label="Your name" error={nameError} required>
                    <input
                      value={form.name}
                      onChange={set('name')}
                      onBlur={() => setTouched(true)}
                      placeholder="e.g. Rakesh Sharma"
                      className={inputCls(nameError)}
                    />
                  </Field>

                  <Field label="Business name" error={businessError} required>
                    <input
                      value={form.business}
                      onChange={set('business')}
                      onBlur={() => setTouched(true)}
                      placeholder="e.g. Hotel Marigold Court"
                      className={inputCls(businessError)}
                    />
                  </Field>
                </div>

                <div className="mt-6">
                  <Field label="What do you need?">
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((i) => (
                        <Chip
                          key={i}
                          active={form.interest === i}
                          onClick={() =>
                            setForm((f) => ({ ...f, interest: f.interest === i ? '' : i }))
                          }
                        >
                          {i}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="mt-6">
                  <Field label="Considering a package" hint="optional">
                    <div className="flex flex-wrap gap-2">
                      <Chip
                        active={form.packageId === ''}
                        onClick={() => setForm((f) => ({ ...f, packageId: '' }))}
                      >
                        Not sure yet
                      </Chip>
                      {PACKAGES.map((p) => (
                        <Chip
                          key={p.id}
                          active={form.packageId === p.id}
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              packageId: f.packageId === p.id ? '' : p.id,
                            }))
                          }
                        >
                          {p.name} · ₹{p.price.toLocaleString('en-IN')}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <Field label="Budget range" hint="optional">
                    <div className="flex flex-wrap gap-2">
                      {BUDGETS.map((b) => (
                        <Chip
                          key={b}
                          active={form.budget === b}
                          onClick={() => setForm((f) => ({ ...f, budget: f.budget === b ? '' : b }))}
                        >
                          {b}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="Timeline" hint="optional">
                    <div className="flex flex-wrap gap-2">
                      {TIMELINES.map((t) => (
                        <Chip
                          key={t}
                          active={form.timeline === t}
                          onClick={() =>
                            setForm((f) => ({ ...f, timeline: f.timeline === t ? '' : t }))
                          }
                        >
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="mt-6">
                  <Field label="Anything we should know?" hint="optional">
                    <textarea
                      value={form.note}
                      onChange={set('note')}
                      rows={4}
                      placeholder="What are you losing? What have you already tried? Anything that would help us give a useful answer."
                      className={`${inputCls(false)} resize-none leading-[1.6]`}
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  className="group mt-8 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-ink text-[14px] font-medium text-void transition-all duration-300 hover:bg-white hover:shadow-[0_0_38px_-8px_rgba(255,255,255,0.45)] active:scale-[0.99]"
                >
                  <WhatsAppGlyph className="h-4 w-4" />
                  Send on WhatsApp
                </button>

                <p className="mt-4 text-center text-[12.5px] leading-[1.6] text-ash3">
                  Opens WhatsApp with your message pre-filled. Nothing is stored on this page
                  and nothing is sent anywhere except to our business number.
                </p>
              </form>
            </Reveal>

            {/* --------------------------------------------------- PREVIEW */}
            <Reveal delay={130}>
              <div className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-[22px] border border-rule bg-void">
                  {/* phone chrome */}
                  <div className="flex items-center justify-between border-b border-rule bg-coal px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-mint anim-pulse" />
                      <span className="text-[12.5px] text-ink">WhatsApp · Nextera Solution</span>
                    </div>
                    <span className="micro text-ash3">Preview</span>
                  </div>

                  <div className="bg-black/40 p-5">
                    <div className="rounded-[12px_12px_4px_12px] border border-rule bg-white/[0.035] px-4 py-3.5">
                      <pre className="whitespace-pre-wrap break-words font-sans text-[13px] leading-[1.6] text-ash">
                        {message}
                      </pre>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-rule px-5 py-4">
                    <span className="text-[12px] text-ash3">
                      {message.length} characters
                    </span>
                    <button
                      onClick={copyMessage}
                      className="rounded-full border border-rule px-3.5 py-2 text-[12.5px] text-ash transition-colors hover:border-rule-strong hover:text-ink"
                    >
                      {copied ? 'Copied' : 'Copy message'}
                    </button>
                  </div>
                </div>

                {/* direct contact */}
                <div className="mt-6 grid gap-3">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3.5 rounded-2xl border border-rule bg-void p-5 transition-colors hover:border-mint/30 hover:bg-coal"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rule bg-white/[0.03]">
                      <WhatsAppGlyph className="h-4 w-4 text-mint" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] text-ink">WhatsApp</span>
                      <span className="block text-[12.5px] text-ash3">{CONTACT_DETAILS.phoneDisplay}</span>
                    </span>
                    <span className="text-ash3 transition-transform duration-300 group-hover:translate-x-0.5">
                      <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                        <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </a>

                  <a
                    href={`tel:${CONTACT_DETAILS.phoneRaw.replace(/\s/g, '')}`}
                    className="group flex items-center gap-3.5 rounded-2xl border border-rule bg-void p-5 transition-colors hover:border-rule-strong hover:bg-coal"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rule bg-white/[0.03]">
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-ash">
                        <path
                          d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] text-ink">Call directly</span>
                      <span className="block text-[12.5px] text-ash3">{CONTACT_DETAILS.businessHoursLabel}</span>
                    </span>
                    <span className="text-ash3 transition-transform duration-300 group-hover:translate-x-0.5">
                      <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                        <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </a>

                  <a
                    href={`mailto:${CONTACT_DETAILS.email}`}
                    className="group flex items-center gap-3.5 rounded-2xl border border-rule bg-void p-5 transition-colors hover:border-rule-strong hover:bg-coal"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rule bg-white/[0.03]">
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-ash">
                        <rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="m4 8 8 5.5L20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] text-ink">Email</span>
                      <span className="block truncate text-[12.5px] text-ash3">
                        {CONTACT_DETAILS.email}
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- QUICK FAQ */}
      <section className="band border-t border-rule">
        <div className="shell">
          <Reveal>
            <h2 className="t-h2 text-ink">
              Before you write,
              <br />
              <span className="fade-line">three quick answers.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-3">
            {[
              {
                q: 'Is the audit really free?',
                a: 'Yes, and there is no obligation attached. We look at your site, your listing and the mobile enquiry path, and send you what we find.',
              },
              {
                q: 'Do you guarantee results?',
                a: 'No. We will not promise rankings, leads or bookings. We will tell you exactly what we will build and what we will test.',
              },
              {
                q: 'What if I cannot afford it?',
                a: 'Say so. A smaller first phase is usually better than a package you cannot comfortably pay for, and we would rather help you plan than sell you something that fails.',
              },
            ].map((f, i) => (
              <Reveal key={f.q} delay={i * 90}>
                <div className="h-full bg-void p-7">
                  <p className="text-[15.5px] text-ink">{f.q}</p>
                  <p className="mt-3 text-[13.5px] leading-[1.62] text-ash2 text-pretty">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* -------------------------------------------------------------------------- */
function inputCls(hasError) {
  return `w-full rounded-xl border bg-white/[0.022] px-4 py-3 text-[14px] text-ink placeholder:text-ash3/60 outline-none transition-colors duration-200 focus:bg-white/[0.045] ${
    hasError ? 'border-[#f0705a]/50' : 'border-rule focus:border-rule-strong'
  }`
}

function Field({ label, hint, required, error, children }) {
  return (
    <label className="block">
      <span className="mb-3 flex items-baseline gap-2">
        <span className="micro text-ash2">{label}</span>
        {required && <span className="text-[10px] text-ember">required</span>}
        {hint && <span className="text-[11px] text-ash3">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-2 block text-[12px] text-[#f0705a]">{error}</span>}
    </label>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-2 text-[12.5px] transition-all duration-250 ${
        active
          ? 'border-ink bg-ink text-void'
          : 'border-rule text-ash hover:border-rule-strong hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
