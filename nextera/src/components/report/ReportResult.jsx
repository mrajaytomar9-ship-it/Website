import { useId } from 'react'
import { formatINR, formatPct, formatNumber } from '../../lib/calculator'
import { scoreLabel } from '../../lib/report'
import { Row, StatTile } from '../tools/fields'
import { FieldShell } from '../tools/fields'
import { Dot } from '../ui/Primitives'
import Button from '../ui/Button'

/* -------------------------------------------------------------------------- */
const TONE_CLASS = {
  mint: 'text-mint',
  sky: 'text-sky',
  ember: 'text-ember-soft',
  red: 'text-[#f0705a]',
  ink: 'text-ink',
}
const TONE_STROKE = {
  mint: '#4fd1a5',
  sky: '#5fb3f0',
  ember: '#e8922f',
  red: '#f0705a',
  ink: '#f4f4f2',
}
const STATUS_META = {
  ok: { word: 'Good', cls: 'text-mint', dot: 'mint' },
  weak: { word: 'Weak', cls: 'text-ember-soft', dot: 'ember' },
  missing: { word: 'Missing', cls: 'text-[#f0705a]', dot: 'ember' },
  na: { word: 'Not answered', cls: 'text-ash3', dot: 'ink' },
}

/* -------------------------------------------------------------------------- */
/** The score as a ring. Pure SVG so it prints and screenshots identically. */
function ScoreRing({ score, tone }) {
  const r = 52
  const c = 2 * Math.PI * r
  const pctScore = score === null ? 0 : Math.max(0, Math.min(100, score))
  return (
    <svg viewBox="0 0 128 128" className="h-[128px] w-[128px] shrink-0" role="img" aria-label={`Presence score ${scoreLabel(score)} out of 100`}>
      <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="7" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke={TONE_STROKE[tone] || '#f4f4f2'}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * pctScore) / 100}
        transform="rotate(-90 64 64)"
      />
      <text
        x="64"
        y="70"
        textAnchor="middle"
        className="fill-ink font-display"
        style={{ fontSize: 34, letterSpacing: '-0.04em' }}
      >
        {scoreLabel(score)}
      </text>
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
function PillarBar({ pillar }) {
  const width = pillar.score === null ? 0 : Math.round(pillar.score)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-ink">{pillar.label}</span>
        <span className="text-xs tabular-nums text-ash2">
          {pillar.score === null ? 'not answered' : `${width}/100`}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-700"
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-[1.55] text-ash3">{pillar.blurb}</p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
function CheckList({ checks, title }) {
  return (
    <div>
      <h4 className="micro mb-3 text-ash2">{title}</h4>
      <ul className="flex flex-col gap-4">
        {checks.map((c) => {
          const meta = STATUS_META[c.status]
          return (
            <li key={c.id} className="border-t border-rule-faint pt-4 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-sm text-ink">{c.label}</span>
                <span className={`inline-flex items-center gap-2 text-xs ${meta.cls}`}>
                  <Dot tone={meta.dot} />
                  {meta.word}
                </span>
              </div>
              <p className="mt-2 text-xs leading-[1.6] text-ash2">{c.finding}</p>
              <p className="mt-2 text-xs leading-[1.6] text-ash3">
                <span className="text-ash2">What to do: </span>
                {c.fix}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
export default function ReportResult({
  report,
  unlocked,
  lead,
  setLead,
  onUnlock,
  onPrint,
  onDownload,
  onSend,
  leadErrors,
}) {
  const nameId = useId()
  const waId = useId()
  const g = report.score.grade
  const m = report.money.metrics
  const topThree = report.weakPoints.slice(0, 3)

  return (
    <div className="flex flex-col gap-5" id="report">
      {/* ------------------------------------------------------- the score */}
      <section className="overflow-hidden rounded-lg border border-rule bg-void">
        <header className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
          <h3 className="text-sm tracking-[-0.01em] text-ink">Your presence score</h3>
          <span className="micro text-ash3">
            {report.score.answered} of {report.score.total} checks answered
          </span>
        </header>

        <div className="flex flex-col gap-7 p-5 sm:flex-row sm:items-center sm:p-7">
          <ScoreRing score={report.score.overall} tone={g.tone} />
          <div className="min-w-0">
            <p className={`font-display text-xl tracking-[-0.03em] ${TONE_CLASS[g.tone]}`}>{g.label}</p>
            <p className="mt-3 max-w-lg text-sm leading-[1.65] text-ash2">{g.body}</p>
            <p className="mt-4 text-xs leading-[1.6] text-ash3">
              {report.score.counts.ok} good · {report.score.counts.weak} weak ·{' '}
              {report.score.counts.missing} missing
              {report.score.counts.na ? ` · ${report.score.counts.na} left blank` : ''}
            </p>
          </div>
        </div>

        <div className="grid gap-6 border-t border-rule p-5 sm:grid-cols-2 sm:p-7">
          {report.score.pillars.map((p) => (
            <PillarBar key={p.id} pillar={p} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- first three things */}
      <section className="overflow-hidden rounded-lg border border-rule bg-void">
        <header className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
          <h3 className="text-sm tracking-[-0.01em] text-ink">The three things costing you most</h3>
          <span className="micro text-ash3">Ranked by impact</span>
        </header>
        <div className="p-5 sm:p-7">
          {topThree.length ? (
            <ol className="flex flex-col gap-6">
              {topThree.map((w, i) => (
                <li key={w.id} className="flex gap-4">
                  <span className="mt-0.5 font-display text-xl leading-none tracking-[-0.03em] text-ash3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-ink">{w.label}</p>
                    <p className="mt-2 text-xs leading-[1.6] text-ash2">{w.finding}</p>
                    <p className="mt-2 text-xs leading-[1.6] text-ash">{w.fix}</p>
                    <p className="mt-2.5 text-xs text-ash3">
                      {w.impact} impact · {w.effortLabel}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm leading-[1.6] text-ash2">
              Nothing you answered came back weak or missing. Fill in more of the questions and the
              weaker areas will surface here.
            </p>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------- the unlock */}
      {unlocked ? (
        <section className="overflow-hidden rounded-lg border border-rule bg-void">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
            <h3 className="text-sm tracking-[-0.01em] text-ink">Take it with you</h3>
            <span className="micro text-ash3">Prepared for {lead.name}</span>
          </header>
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:flex-wrap sm:p-7">
            <Button as="button" variant="primary" size="md" onClick={onPrint}>
              Print or save as PDF
            </Button>
            <Button as="button" variant="secondary" size="md" onClick={onDownload}>
              Download the report
            </Button>
            <Button as="button" variant="accent" size="md" onClick={onSend}>
              Send it to us on WhatsApp
            </Button>
          </div>
          <p className="border-t border-rule-faint px-5 py-3.5 text-xs leading-[1.6] text-ash3 sm:px-7">
            Printing opens the same document the download produces, on white, because a black page
            is expensive and unreadable on paper. Sending opens WhatsApp with the summary already
            written — nothing leaves your browser until you press send there.
          </p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-lg border border-ember/30 bg-coal">
          <header className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
            <h3 className="text-sm tracking-[-0.01em] text-ink">Unlock the full report</h3>
            <span className="micro text-ash3">Free</span>
          </header>
          <div className="p-5 sm:p-7">
            <p className="max-w-xl text-sm leading-[1.65] text-ash2">
              Every check, the money breakdown, the competitor gap and the downloadable report.
              Your name and number let us send it back and follow up — they are held in this
              browser only, and nothing is uploaded.
            </p>
            <form
              className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault()
                onUnlock()
              }}
            >
              <FieldShell id={nameId} label="Your name" error={leadErrors.name}>
                <input
                  id={nameId}
                  type="text"
                  autoComplete="name"
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                  placeholder="e.g. Ravi Sharma"
                  className="field"
                />
              </FieldShell>
              <FieldShell
                id={waId}
                label="WhatsApp number"
                hint="So the report can reach you"
                error={leadErrors.whatsapp}
              >
                <input
                  id={waId}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={lead.whatsapp}
                  onChange={(e) => setLead({ ...lead, whatsapp: e.target.value })}
                  placeholder="e.g. 98123 45678"
                  className="field"
                />
              </FieldShell>
              <div className="sm:col-span-2">
                <Button as="button" type="submit" variant="primary" size="lg">
                  Show me the full report
                </Button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* ------------------------------------------------ the full breakdown */}
      {unlocked ? (
        <>
          <section className="overflow-hidden rounded-lg border border-rule bg-void">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
              <h3 className="text-sm tracking-[-0.01em] text-ink">The money, from your own numbers</h3>
              <span className="micro text-ash3">Per month</span>
            </header>
            <div className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
              <StatTile label="Gross billing" value={formatINR(m.revenue.grossRevenue)} />
              <StatTile
                label="Lost before you see it"
                value={formatINR(m.deductions.total)}
                sub={`${formatPct(m.deductions.rate)} of gross`}
                tone="ember"
              />
              <StatTile
                label="Net profit"
                value={formatINR(m.profit.netProfit)}
                sub={`${formatPct(m.profit.netMargin)} margin · ${m.verdict.label}`}
                tone={m.verdict.tone === 'mint' ? 'mint' : m.verdict.tone === 'red' ? 'red' : 'default'}
              />
              <StatTile
                label="Visible going missing"
                value={formatINR(report.money.visibleLeak)}
                sub="Leak plus the enquiries you could have served"
                tone="ember"
              />
            </div>
            <div className="border-t border-rule p-5 sm:p-7">
              <h4 className="micro mb-3 text-ash2">Where it leaks</h4>
              {report.money.leaks.length ? (
                <div>
                  {report.money.leaks.map((l) => (
                    <Row key={l.k} label={l.label} value={`−${formatINR(l.amount)}`} note={`${formatPct(l.share)} of gross`} tone="minus" />
                  ))}
                </div>
              ) : (
                <p className="text-xs leading-[1.6] text-ash3">
                  No deductions were entered, so there is nothing to show here yet.
                </p>
              )}
              <p className="mt-4 text-xs leading-[1.6] text-ash3">
                Break-even is {m.breakEven.units === null ? 'not computable from these numbers' : `${formatNumber(Math.ceil(m.breakEven.units))} ${report.business.unit}s a month`}.
                {' '}Verdict: {m.verdict.body}
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-rule bg-void">
            <header className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
              <h3 className="text-sm tracking-[-0.01em] text-ink">Every check</h3>
              <span className="micro text-ash3">{report.checks.length}</span>
            </header>
            <div className="flex flex-col gap-8 p-5 sm:p-7">
              {report.score.pillars.map((p) => (
                <CheckList
                  key={p.id}
                  title={p.label}
                  checks={report.checks.filter((c) => c.pillar === p.id)}
                />
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-rule bg-void">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
              <h3 className="text-sm tracking-[-0.01em] text-ink">Against the competitors you entered</h3>
              <span className="micro text-ash3">
                {report.competition.assessed
                  ? `Behind on ${report.competition.behind} · ahead on ${report.competition.ahead}`
                  : 'Not assessed'}
              </span>
            </header>
            <div className="p-5 sm:p-7">
              {report.competition.assessed ? (
                <>
                  <div className="flex flex-col gap-6">
                    {report.competition.rows.map((row) => (
                      <div key={row.name}>
                        <h4 className="text-sm text-ink">{row.name}</h4>
                        <div className="mt-3">
                          {row.cells.map((cell) => (
                            <div key={cell.k} className="flex items-baseline justify-between gap-4 border-t border-rule-faint py-2.5">
                              <span className="text-xs text-ash2">{cell.label}</span>
                              <span className="flex shrink-0 items-baseline gap-3 text-xs tabular-nums">
                                <span className="text-ink">{cell.mine ?? '—'}</span>
                                <span className="text-ash3">vs {cell.theirs ?? '—'}</span>
                                <span
                                  className={
                                    cell.verdict === 'behind'
                                      ? 'text-[#f0705a]'
                                      : cell.verdict === 'ahead'
                                        ? 'text-mint'
                                        : 'text-ash3'
                                  }
                                >
                                  {cell.verdict === 'na' ? '—' : cell.verdict}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {report.competition.gaps.length ? (
                    <p className="mt-6 border-t border-rule pt-4 text-xs leading-[1.65] text-ash2">
                      Where you lose most often: {report.competition.gaps.map((g) => g.label.toLowerCase()).join(', ')}.
                      Start with the first — it is the one showing up against the most competitors.
                    </p>
                  ) : null}
                  <p className="mt-4 text-xs leading-[1.6] text-ash3">
                    These figures were typed in from public listings by whoever filled this report.
                    They were not fetched, and they will drift as those listings change.
                  </p>
                </>
              ) : (
                <p className="text-sm leading-[1.65] text-ash2">
                  No competitor was named, so there is nothing to compare. Add one in section 05 and
                  the gap analysis appears here.
                </p>
              )}
            </div>
          </section>

          {report.links.length ? (
            <section className="overflow-hidden rounded-lg border border-rule bg-void">
              <header className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
                <h3 className="text-sm tracking-[-0.01em] text-ink">Your links, checked</h3>
                <span className="micro text-ash3">Address only</span>
              </header>
              <div className="flex flex-col gap-5 p-5 sm:p-7">
                {report.links.map((l) => (
                  <div key={l.slot.id} className="border-t border-rule-faint pt-4 first:border-t-0 first:pt-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="text-sm text-ink">{l.slot.label}</span>
                      <span className="break-all text-xs text-ash3">
                        {l.parsed.ok ? l.parsed.host : l.parsed.raw}
                      </span>
                    </div>
                    {l.parsed.platform ? (
                      <p className="mt-2 text-xs text-ash2">Recognised as {l.parsed.platform.label}.</p>
                    ) : null}
                    {l.findings.length ? (
                      <ul className="mt-2.5 flex flex-col gap-2">
                        {l.findings.map((f, i) => (
                          <li key={i} className="flex gap-2.5 text-xs leading-[1.6] text-ash2">
                            <span
                              className={`mt-[6px] h-1 w-1 shrink-0 rounded-full ${
                                f.tone === 'missing' ? 'bg-[#f0705a]' : f.tone === 'weak' ? 'bg-ember' : 'bg-ash3'
                              }`}
                            />
                            {f.text}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-ash3">Nothing wrong with the address itself.</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="overflow-hidden rounded-lg border border-rule bg-void">
            <header className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
              <h3 className="text-sm tracking-[-0.01em] text-ink">What to do, in order</h3>
              <span className="micro text-ash3">Cheapest first</span>
            </header>
            <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-3">
              {[
                { k: 'now', title: 'This week', items: report.plan.now },
                { k: 'next', title: 'This month', items: report.plan.next },
                { k: 'later', title: 'This quarter', items: report.plan.later },
              ].map((bucket) => (
                <div key={bucket.k}>
                  <h4 className="micro mb-3 text-ash2">{bucket.title}</h4>
                  {bucket.items.length ? (
                    <ul className="flex flex-col gap-3">
                      {bucket.items.map((w) => (
                        <li key={w.id} className="text-xs leading-[1.6] text-ash2">
                          <span className="text-ink">{w.label}.</span> {w.fix}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs leading-[1.6] text-ash3">Nothing at this weight.</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
