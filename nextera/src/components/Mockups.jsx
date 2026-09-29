import { Dot } from './ui/Primitives'
import { WhatsAppGlyph } from './Navbar'

/* =============================================================================
   MOCKUPS
   Nextera sells a service, not a dashboard — so the "product" visuals here are
   the artefacts a client actually receives: an audit, a listing, a phone
   enquiry path, a delivery board and a monthly report. All rendered in DOM so
   they stay crisp, responsive and themeable.
   ========================================================================== */

export function MockFrame({ label, meta, children, className = '', padded = true }) {
  return (
    <div
      className={`card-dark relative overflow-hidden rounded-xl ${className}`}
    >
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-rule px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-ember/80" />
          <span className="truncate text-xs font-medium tracking-[-0.01em] text-ink">
            {label}
          </span>
        </div>
        {meta && <span className="micro shrink-0 text-ash3">{meta}</span>}
      </div>
      <div className={padded ? 'p-5' : ''}>{children}</div>

      {/* soft top sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.045), transparent)' }}
      />
    </div>
  )
}

/* ---------------------------------------------------------------- 1. AUDIT */
const AUDIT_ROWS = [
  { label: 'Mobile usability', detail: 'Contact button below the fold', sev: 'high', pct: 92 },
  { label: 'Enquiry path', detail: 'Form posts to an unmonitored address', sev: 'high', pct: 84 },
  { label: 'Google listing', detail: 'Hours differ from the website', sev: 'med', pct: 61 },
  { label: 'Reviews', detail: '11 reviews unanswered', sev: 'med', pct: 48 },
  { label: 'Page speed', detail: '4.8s on a 4G connection', sev: 'low', pct: 27 },
  { label: 'Mobile layout', detail: 'Text below readable size', sev: 'ok', pct: 8 },
]

const SEV = {
  high: { label: 'Fix first', color: '#f0705a' },
  med: { label: 'Fix soon', color: '#e8a72f' },
  low: { label: 'Improve', color: '#5fb3f0' },
  ok: { label: 'Fine', color: '#4fd1a5' },
}

export function AuditMockup() {
  return (
    <MockFrame label="Website & listing audit" meta="Sample">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="micro mb-2.5 text-ash3">Issues found</p>
          <p className="font-display text-3xl leading-none tracking-[-0.04em] text-ink">
            6
          </p>
        </div>
        <div className="text-right">
          <p className="micro mb-2.5 text-ash3">Fixed by Silver</p>
          <p className="font-display text-3xl leading-none tracking-[-0.04em] text-mint">4</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3.5">
        {AUDIT_ROWS.map((r, i) => (
          <div key={r.label} className="group">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <Dot tone="ink" className="shrink-0" />
                <span className="truncate text-sm text-ink">{r.label}</span>
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-[3px] text-xs font-medium tracking-[0.04em]"
                style={{
                  color: SEV[r.sev].color,
                  background: `${SEV[r.sev].color}1a`,
                  border: `1px solid ${SEV[r.sev].color}33`,
                }}
              >
                {SEV[r.sev].label}
              </span>
            </div>
            <p className="mt-1.5 pl-[14px] text-xs text-ash3">{r.detail}</p>
            <div className="mt-2 ml-[14px] h-[3px] w-full overflow-hidden rounded-full bg-white/[0.055]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${r.pct}%`,
                  background: SEV[r.sev].color,
                  opacity: 0.85,
                  transition: `width 1.2s var(--ease-out-expo) ${i * 90}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </MockFrame>
  )
}

/* ------------------------------------------------- 2. ENQUIRY / PHONE PATH */
export function EnquiryMockup() {
  return (
    <MockFrame label="Enquiry path — tested" meta="Mobile" padded={false}>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-[minmax(0,1fr)_232px]">
        {/* left: the site strip */}
        <div className="border-b border-rule p-5 sm:border-b-0 sm:border-r">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-mint anim-pulse" />
            <span className="text-xs text-ash2">Landing page loaded</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {[
              { t: 'What is this place?', done: true },
              { t: 'What does a stay cost?', done: true },
              { t: 'Where exactly is it?', done: true },
            ].map((s) => (
              <div
                key={s.t}
                className="flex items-center gap-2.5 rounded-md border border-rule-faint bg-white/[0.02] px-3 py-2.5"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-mint/15">
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                    <path
                      d="m2.5 6.2 2.2 2.2L9.5 3.6"
                      stroke="#4fd1a5"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-xs text-ash">{s.t}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2.5 rounded-md border border-rule bg-white/[0.03] px-3 py-3">
            <WhatsAppGlyph className="h-4 w-4 shrink-0 text-mint" />
            <span className="text-xs text-ink">Message on WhatsApp</span>
            <span className="ml-auto micro text-ash3">1 tap</span>
          </div>
        </div>

        {/* right: the resulting chat */}
        <div className="flex flex-col bg-black/35 p-4">
          <div className="flex items-center gap-2.5 border-b border-rule-faint pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint/15">
              <WhatsAppGlyph className="h-3.5 w-3.5 text-mint" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs text-ink">Guest House Taj View</p>
              <p className="text-xs text-ash3">Online now</p>
            </div>
          </div>

          <div className="mt-3.5 flex flex-1 flex-col gap-2.5">
            <div
              className="ml-auto max-w-[88%] rounded-md rounded-br-sm px-3 py-2 text-xs leading-[1.5] text-black"
              style={{ background: 'linear-gradient(135deg,#5fe0b0,#3fc794)' }}
            >
              Hi — I saw your Stay Options page. Is a room available this weekend for 2 guests?
            </div>
            <div className="max-w-[86%] rounded-md rounded-bl-sm border border-rule bg-white/[0.045] px-3 py-2 text-xs leading-[1.5] text-ash">
              Namaste! Let me check with the front desk and confirm.
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-1.5 border-t border-rule-faint pt-3 text-xs text-ash3">
            <span className="h-1 w-1 rounded-full bg-mint" />
            Delivered · 4:41 PM
          </div>
        </div>
      </div>
    </MockFrame>
  )
}

/* ------------------------------------------------- 3. GOOGLE LISTING CARD */
export function ProfileMockup() {
  const rows = [
    { k: 'Phone', v: 'Corrected', good: true },
    { k: 'Hours', v: 'Corrected', good: true },
    { k: 'Website', v: 'Linked', good: true },
    { k: 'Photos', v: '+ 8 added', good: true },
    { k: 'Category', v: 'Unchanged', good: null },
    { k: 'Reviews', v: '11 awaiting reply', good: false },
  ]

  return (
    <MockFrame label="Google Business Profile" meta="Authorised changes">
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-rule bg-gradient-to-br from-ember/25 to-ember/5">
          <div className="flex h-full items-center justify-center font-display text-lg text-ember-soft">
            GT
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg tracking-[-0.02em] text-ink">
            Guest House Taj View
          </p>
          <p className="mt-1 text-xs text-ash2">Guest house · India</p>
          <div className="mt-2.5 flex items-center gap-2.5">
            <span className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="#e8a72f">
                  <path d="M6 .8l1.5 3.2 3.5.4-2.6 2.4.7 3.4L6 8.5 2.9 10.2l.7-3.4L1 4.4l3.5-.4L6 .8Z" />
                </svg>
              ))}
            </span>
            <span className="text-xs text-ash2">4.6 · 214 reviews</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2.5 border-t border-rule pt-4">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between gap-2">
            <span className="text-xs text-ash3">{r.k}</span>
            <span
              className={`flex items-center gap-1.5 text-xs ${
                r.good === true ? 'text-mint' : r.good === false ? 'text-ember-soft' : 'text-ash3'
              }`}
            >
              {r.good === true && (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                  <path d="m2.5 6.2 2.2 2.2L9.5 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {r.good === false && <span className="h-1 w-1 rounded-full bg-ember" />}
              {r.v}
            </span>
          </div>
        ))}
      </div>
    </MockFrame>
  )
}

/* ------------------------------------------------------ 4. DELIVERY BOARD */
const STAGES = [
  { k: 'Scope', items: ['Accepted 14 Sep'], done: true },
  { k: 'Input', items: ['Content approved', 'Photos received'], done: true },
  { k: 'Build', items: ['5 pages built', 'Enquiry paths wired'], done: true },
  { k: 'Review', items: ['Preview link sent', 'Round 2 feedback'], done: false, active: true },
  { k: 'Launch', items: ['QA + final approval'], done: false },
]

export function DeliveryMockup() {
  return (
    <MockFrame label="Delivery board" meta="Gold bundle">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {STAGES.map((s, i) => (
          <div key={s.k} className="relative">
            <div className="mb-2.5 flex items-center gap-1.5">
              <Dot tone={s.done ? 'mint' : s.active ? 'ember' : 'ink'} />
              <span
                className={`text-xs font-medium tracking-[0.02em] ${
                  s.done || s.active ? 'text-ink' : 'text-ash3'
                }`}
              >
                {s.k}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {s.items.map((it) => (
                <div
                  key={it}
                  className={`rounded-sm border px-2 py-1.5 text-xs leading-[1.35] ${
                    s.done
                      ? 'border-mint/20 bg-mint/[0.06] text-mint'
                      : s.active
                        ? 'border-ember/25 bg-ember/[0.07] text-ember-soft'
                        : 'border-rule-faint bg-white/[0.015] text-ash3'
                  }`}
                >
                  {it}
                </div>
              ))}
            </div>
            {i < STAGES.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 top-[7px] hidden h-px w-2 sm:block"
                style={{ background: s.done ? 'rgba(79,209,165,0.45)' : 'rgba(255,255,255,0.1)' }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-rule pt-4 sm:grid-cols-4">
        {[
          { l: 'Planning range', v: '7–10 days' },
          { l: 'Revision rounds', v: '2 included' },
          { l: 'Enquiry paths tested', v: '4 of 4' },
          { l: 'Open blockers', v: 'None' },
        ].map((s) => (
          <div key={s.l}>
            <p className="micro mb-1.5 text-ash3">{s.l}</p>
            <p className="font-display text-base tracking-[-0.02em] text-ink">{s.v}</p>
          </div>
        ))}
      </div>
    </MockFrame>
  )
}

/* -------------------------------------------------------- 5. MONTHLY CARE */
const CARE_ROWS = [
  { l: 'Small website updates', v: 2, max: 2 },
  { l: 'GBP posts / updates', v: 3, max: 4 },
  { l: 'Review-response drafts', v: 14, max: 20 },
  { l: 'Enquiry-flow checks', v: 1, max: 1 },
]

export function CareMockup() {
  return (
    <MockFrame label="Monthly care report" meta="Cycle 04">
      <div className="flex items-center justify-between">
        <div>
          <p className="micro mb-2 text-ash3">Allowance used</p>
          <p className="font-display text-2xl leading-none tracking-[-0.04em] text-ink">
            7<span className="text-ash3">/12</span>
          </p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <span
              key={i}
              className="h-6 w-[3px] rounded-full"
              style={{ background: i < 7 ? '#4fd1a5' : 'rgba(255,255,255,0.1)' }}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3.5 border-t border-rule pt-4">
        {CARE_ROWS.map((r, i) => (
          <div key={r.l}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-xs text-ash">{r.l}</span>
              <span className="shrink-0 text-xs tabular-nums text-ink">
                {r.v}
                <span className="text-ash3"> / {r.max}</span>
              </span>
            </div>
            <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.055]">
              <div
                className="h-full rounded-full bg-mint"
                style={{
                  width: `${(r.v / r.max) * 100}%`,
                  opacity: 0.8,
                  transition: `width 1.1s var(--ease-out-expo) ${i * 80}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-md border border-rule-faint bg-white/[0.02] p-3.5">
        <p className="micro mb-2 text-ash3">Next recommendation</p>
        <p className="text-xs leading-[1.55] text-ash">
          Add four room photos to the listing — the two most-requested stay types still have no
          image on the Google profile.
        </p>
      </div>
    </MockFrame>
  )
}

/* ------------------------------------------------------- 6. MINI: PHONE UI */
export function PhoneMockup({ title, lines, accent = 'mint' }) {
  return (
    <div className="relative mx-auto w-full max-w-[268px]">
      <div className="rounded-xl border border-rule-strong bg-coal p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
        <div className="overflow-hidden rounded-xl bg-black">
          {/* status bar */}
          <div className="flex items-center justify-between px-4 pb-2 pt-3 text-xs text-ash3">
            <span>9:41</span>
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-ash3" />
              <span className="h-1.5 w-1.5 rounded-full bg-ash3" />
              <span className="h-1.5 w-1.5 rounded-full bg-ash3" />
            </span>
          </div>
          <div className="px-4 pb-5 pt-2">
            <p className="micro mb-3 text-ash3">{title}</p>
            <div className="flex flex-col gap-2.5">
              {lines.map((l, i) => (
                <div
                  key={l}
                  className="rounded-md border px-3 py-2.5 text-xs leading-[1.45]"
                  style={{
                    borderColor: i === 0 ? 'rgba(79,209,165,0.28)' : 'rgba(255,255,255,0.06)',
                    background: i === 0 ? 'rgba(79,209,165,0.07)' : 'rgba(255,255,255,0.02)',
                    color: i === 0 ? '#eaf7f1' : '#a1a1a0',
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div
              className="mt-4 flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-medium text-black"
              style={{ background: accent === 'ember' ? '#f4b866' : '#5fe0b0' }}
            >
              {accent === 'ember' ? 'Request a call' : 'WhatsApp us'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
