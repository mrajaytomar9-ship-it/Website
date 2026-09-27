import { useState } from 'react'
import { TOOLS, whatsappLink, ENQUIRY_MESSAGES } from '../../lib/content'
import {
  buildRecommendations,
  buildSummary,
  formatCompactINR,
  formatINR,
  formatNumber,
  formatPct,
  toCSV,
} from '../../lib/calculator'
import { Meter, Row, StatTile } from './fields'
import { WhatsAppGlyph } from '../Navbar'

const TONE_TEXT = {
  mint: 'text-mint',
  ember: 'text-ember-soft',
  sky: 'text-sky',
  red: 'text-[#f0705a]',
  ink: 'text-ash2',
}
const TONE_BAR = {
  mint: 'bg-mint',
  ember: 'bg-ember',
  sky: 'bg-sky',
  red: 'bg-[#f0705a]',
  ink: 'bg-ash2',
}
const LEAK_TONE = { ember: 'ember', sky: 'sky', red: 'red', mint: 'mint' }

export default function CalcResults({ metrics, id = 'result' }) {
  const [showFixed, setShowFixed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  const { type, volume, revenue, deductions, demand, costs, profit, unit, breakEven, target } =
    metrics
  const recommendations = buildRecommendations(metrics)
  const summary = buildSummary(metrics)

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setCopyFailed(false)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopyFailed(true)
    }
  }

  function downloadCsv() {
    const blob = new Blob([toCSV(metrics)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nextera-${type.id}-calculation.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const loss = profit.netProfit < 0

  return (
    <div id={id} className="scroll-mt-24">
      {/* ------------------------------------------------------ HEADLINE */}
      <div
        className={`overflow-hidden rounded-xl border ${
          loss ? 'border-[#f0705a]/30' : 'border-rule'
        } bg-void`}
      >
        <div className="border-b border-rule px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <p className="micro text-ash3">{TOOLS.calculator.resultTitle}</p>
            <span className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${TONE_BAR[metrics.verdict.tone]}`} />
              <span className={`text-xs ${TONE_TEXT[metrics.verdict.tone]}`}>
                {metrics.verdict.label}
              </span>
            </span>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-6">
          <p className="micro text-ash3">
            {loss ? 'Net loss this month' : 'Net profit this month'}
          </p>
          <p
            className={`mt-2.5 font-display text-3xl leading-none tracking-[-0.045em] tabular-nums sm:text-3xl ${
              loss ? 'text-[#f0705a]' : 'text-ink'
            }`}
          >
            {formatINR(profit.netProfit)}
          </p>
          <p className="mt-3 text-sm leading-[1.5] text-ash2">
            {formatPct(profit.netMargin)} of net revenue
            {costs.ownerDraw > 0 ? (
              <>
                {' · '}
                <span className={profit.retained < 0 ? 'text-[#f0705a]' : 'text-ash'}>
                  {formatINR(profit.retained)} left after you pay yourself {formatINR(costs.ownerDraw)}
                </span>
              </>
            ) : null}
          </p>
          <p className="mt-4 text-xs leading-[1.6] text-ash3 text-pretty">
            {metrics.verdict.body}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px border-t border-rule bg-rule">
          <StatTile
            label="Net revenue"
            value={formatCompactINR(revenue.netRevenue)}
            sub={`${formatCompactINR(revenue.grossRevenue)} billed − ${formatPct(profit.leakRate, 0)} leak`}
          />
          <StatTile
            label="Revenue leaked"
            value={formatCompactINR(deductions.total)}
            tone="ember"
            sub="commission, gateway, cancellations, discounts"
          />
          <StatTile
            label="Never billed"
            value={formatCompactINR(demand.servableMissedRevenue)}
            tone={demand.servableMissedRevenue > 0 ? 'sky' : 'default'}
            sub={`${formatNumber(demand.unanswered, 0)} enquiries unanswered`}
          />
          <StatTile
            label="Break-even"
            value={
              Number.isFinite(breakEven.units)
                ? `${formatNumber(breakEven.units, 0)} ${type.unit}s`
                : 'Not reachable'
            }
            tone={breakEven.reached ? 'mint' : 'red'}
            sub={
              Number.isFinite(breakEven.units)
                ? `${formatPct(breakEven.utilisation, 0)} of what you can sell`
                : 'a unit does not cover its own cost'
            }
          />
        </div>
      </div>

      {/* ----------------------------------------------------------- P&L */}
      <Panel title="Profit & loss, line by line" step="A">
        <div className="flex flex-col">
          <Row
            label={`${formatNumber(volume.units, 1)} ${type.unit}s × ${formatINR(unit.price)}`}
            value={formatINR(revenue.grossFromUnits)}
            tone="muted"
          />
          {revenue.otherRevenue > 0 && (
            <Row label="Other billing" value={formatINR(revenue.otherRevenue)} tone="muted" />
          )}
          <Row label="Gross billing" value={formatINR(revenue.grossRevenue)} strong />

          {deductions.leaks.map((l) =>
            l.amount > 0 ? (
              <Row
                key={l.k}
                label={l.label}
                note={formatPct(l.share, 1)}
                value={`−${formatINR(l.amount)}`}
                tone="minus"
                indent
              />
            ) : null,
          )}
          <Row
            label="Net revenue"
            note={`−${formatPct(profit.leakRate, 1)} leak`}
            value={formatINR(revenue.netRevenue)}
            strong
          />

          <Row
            label={`Variable cost (${formatPct(costs.cogsRate, 0)})`}
            value={`−${formatINR(costs.cogs)}`}
            tone="minus"
            indent
          />
          <Row
            label="Gross profit"
            note={formatPct(profit.grossMargin)}
            value={formatINR(costs.grossProfit)}
            strong
          />

          <button
            type="button"
            onClick={() => setShowFixed((v) => !v)}
            aria-expanded={showFixed}
            className="mt-1 flex items-center justify-between gap-3 py-2.5 text-left"
          >
            <span className="text-sm text-ash2">
              Fixed cost
              <span className="ml-2 text-xs text-ash3">
                {costs.fixedLines.filter((f) => f.amount > 0).length} lines
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-sm tabular-nums text-[#f0a795]">
                −{formatINR(costs.fixedTotal)}
              </span>
              <span
                className={`relative block h-2.5 w-2.5 text-ash3 transition-transform duration-300 ${
                  showFixed ? 'rotate-45' : ''
                }`}
              >
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              </span>
            </span>
          </button>

          {showFixed && (
            <div className="mb-1 rounded-md border border-rule-faint bg-white/[0.015] px-4 py-1">
              {costs.fixedLines.map((f) => (
                <Row
                  key={f.k}
                  label={f.label}
                  value={f.amount > 0 ? `−${formatINR(f.amount)}` : '—'}
                  tone={f.amount > 0 ? 'minus' : 'muted'}
                />
              ))}
            </div>
          )}

          <Row
            label="Depreciation"
            value={costs.depreciation > 0 ? `−${formatINR(costs.depreciation)}` : '—'}
            tone="minus"
            indent
          />
          <Row
            label="Operating profit"
            note={formatPct(profit.operatingMargin)}
            value={formatINR(profit.operatingProfit)}
            strong
          />
          <Row
            label={`Tax (${formatPct(profit.taxRate, 0)})`}
            value={profit.tax > 0 ? `−${formatINR(profit.tax)}` : '—'}
            tone="minus"
            indent
          />
          <Row
            label={loss ? 'Net loss' : 'Net profit'}
            note={formatPct(profit.netMargin)}
            value={formatINR(profit.netProfit)}
            strong
            tone={loss ? 'minus' : 'plus'}
          />
          {costs.ownerDraw > 0 && (
            <>
              <Row
                label="Owner draw"
                value={`−${formatINR(costs.ownerDraw)}`}
                tone="minus"
                indent
              />
              <Row
                label="Retained in the business"
                value={formatINR(profit.retained)}
                strong
                tone={profit.retained < 0 ? 'minus' : 'plus'}
              />
            </>
          )}
        </div>

        <p className="mt-4 border-t border-rule-faint pt-4 text-xs leading-[1.55] text-ash3">
          Per working day: {formatINR(metrics.perDay.revenue)} net revenue ·{' '}
          {formatINR(metrics.perDay.profit)} {loss ? 'loss' : 'profit'}.
        </p>
      </Panel>

      {/* ---------------------------------------------------------- LEAKS */}
      <Panel title={TOOLS.calculator.leakTitle} step="B">
        <p className="mb-5 text-sm leading-[1.6] text-ash2 text-pretty">
          {formatINR(deductions.total)} of the {formatINR(revenue.grossRevenue)} you bill never
          reaches you. Ranked, largest first.
        </p>
        <div className="flex flex-col gap-4">
          {deductions.leaks.map((l) => (
            <div key={l.k}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 text-sm text-ash">{l.label}</span>
                <span className="shrink-0 text-sm tabular-nums text-ink">
                  {formatINR(l.amount)}
                  <span className="ml-1.5 text-xs text-ash3">{formatPct(l.share, 1)}</span>
                </span>
              </div>
              <Meter value={l.share * 3.2} tone={LEAK_TONE[l.tone] || 'ember'} className="mt-2" />
            </div>
          ))}
        </div>
      </Panel>

      {/* -------------------------------------------------- MISSED DEMAND */}
      <Panel title={TOOLS.calculator.missedTitle} step="C">
        <p className="text-sm leading-[1.62] text-ash2 text-pretty">
          {formatNumber(demand.enquiries, 0)} enquiries, {formatPct(demand.replyRate, 0)} answered
          properly. The {formatNumber(demand.unanswered, 0)} that were not would have produced{' '}
          {formatNumber(demand.missedUnits, 1)} {type.unit}s at your conversion rate.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-rule bg-rule">
          <StatTile label="Never billed" value={formatINR(demand.servableMissedRevenue)} tone="sky" />
          <StatTile
            label="Per enquiry ignored"
            value={
              demand.unanswered > 0
                ? formatINR(demand.servableMissedRevenue / demand.unanswered)
                : '—'
            }
          />
        </div>
        {demand.capacityBlocked && (
          <p className="mt-4 rounded-md border border-rule-faint bg-white/[0.02] p-3.5 text-xs leading-[1.55] text-ash3">
            Capped at the {formatNumber(volume.spareUnits, 0)} {type.unit}s you still have free.
            Beyond that, answering more enquiries needs more capacity, not more replies.
          </p>
        )}
        <p className="mt-4 text-xs leading-[1.55] text-ash3">
          Kept out of the profit figures above on purpose: this is billing that never happened,
          not money lost from billing that did.
        </p>
      </Panel>

      {/* ------------------------------------------------------ BREAK-EVEN */}
      <Panel title={TOOLS.calculator.breakEvenTitle} step="D">
        {Number.isFinite(breakEven.units) ? (
          <>
            <div className="flex items-baseline gap-3">
              <p className="font-display text-2xl leading-none tracking-[-0.04em] tabular-nums text-ink">
                {formatNumber(breakEven.units, 0)}
              </p>
              <p className="text-sm text-ash2">
                {type.unit}s a month · {formatPct(breakEven.utilisation)} utilisation
              </p>
            </div>
            <Meter
              value={Math.min(100, breakEven.utilisation)}
              tone={breakEven.reached ? 'mint' : 'red'}
              className="mt-5"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-ash3">
              <span>Break-even</span>
              <span>
                You sell {formatNumber(volume.units, 0)} · {formatPct(volume.utilisation, 0)}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-rule bg-rule">
              <StatTile
                label="Contribution per unit"
                value={formatINR(unit.contributionPerUnit)}
                sub={`${formatPct(unit.contributionRate, 0)} of the price survives leak + variable cost`}
              />
              <StatTile
                label={breakEven.reached ? 'Room above break-even' : 'Shortfall'}
                value={`${formatNumber(Math.abs(breakEven.safetyUnits), 0)} ${type.unit}s`}
                tone={breakEven.reached ? 'mint' : 'red'}
                sub={`${formatPct(Math.abs(breakEven.safetyPct), 0)} of current volume`}
              />
            </div>
            <p className="mt-4 text-xs leading-[1.55] text-ash3">
              Cash fixed cost {formatINR(breakEven.cashFixed)}
              {breakEven.otherContribution > 0
                ? `, less ${formatINR(breakEven.otherContribution)} contributed by non-unit billing`
                : ''}
              . Depreciation is excluded here because it is not cash leaving this month.
            </p>
          </>
        ) : (
          <p className="text-sm leading-[1.62] text-ash2">
            Break-even does not exist at these numbers: one {type.unit} does not cover the leak and
            variable cost attached to it, so volume cannot fix this. Price or cost has to move
            first.
          </p>
        )}
      </Panel>

      {/* ------------------------------------------------------- THE GAP */}
      {target.target > 0 && (
        <Panel title={TOOLS.calculator.gapTitle} step="E">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="micro text-ash3">Target</p>
              <p className="mt-2 font-display text-xl leading-none tracking-[-0.035em] tabular-nums text-ink">
                {formatINR(target.target)}
              </p>
            </div>
            <div className="text-right">
              <p className="micro text-ash3">{target.met ? 'Ahead by' : 'Short by'}</p>
              <p
                className={`mt-2 font-display text-xl leading-none tracking-[-0.035em] tabular-nums ${
                  target.met ? 'text-mint' : 'text-ember-soft'
                }`}
              >
                {formatINR(Math.abs(target.gap))}
              </p>
            </div>
          </div>

          {target.met ? (
            <p className="mt-5 text-sm leading-[1.62] text-ash2 text-pretty">
              You are past the target on these numbers. The useful question becomes what it takes to
              keep it there in your worst month — use the what-if panel below.
            </p>
          ) : (
            <>
              <p className="mt-5 text-sm leading-[1.62] text-ash2 text-pretty">
                {TOOLS.calculator.routesTitle}. Each one is costed on your own figures.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                {target.routes.map((r) => (
                  <div key={r.k} className="rounded-md border border-rule bg-white/[0.015] p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="text-sm text-ink">{r.label}</span>
                      <span
                        className={`text-sm tabular-nums ${
                          r.feasible ? 'text-ember-soft' : 'text-ash3'
                        }`}
                      >
                        {r.value === null || !r.feasible
                          ? 'Not available'
                          : `${formatNumber(r.value, r.value < 10 ? 1 : 0)} ${r.suffix}`}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-[1.55] text-ash3">{r.detail}</p>
                    {r.k === 'price' && r.asPct !== null && r.feasible && (
                      <p className="mt-1.5 text-xs text-ash2">
                        That is {formatPct(r.asPct, 1)} on today’s average price.
                      </p>
                    )}
                    {r.note && (
                      <p className="mt-2 border-t border-rule-faint pt-2 text-xs leading-[1.55] text-ember-soft">
                        {r.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>
      )}

      {/* ------------------------------------------------- RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <Panel title={TOOLS.calculator.adviceTitle} step="F">
          <div className="flex flex-col gap-4">
            {recommendations.map((r) => (
              <div key={r.title} className="border-l border-rule pl-4">
                <p className={`text-sm leading-[1.5] ${TONE_TEXT[r.tone]}`}>{r.title}</p>
                <p className="mt-1.5 text-xs leading-[1.6] text-ash2 text-pretty">{r.body}</p>
                {r.impact > 0 && r.impactLabel && (
                  <p className="mt-2 text-xs text-ash3">
                    Worth about {formatINR(r.impact)} a month — {r.impactLabel}.
                  </p>
                )}
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* ----------------------------------------------------------- SHARE */}
      <Panel title="Take it with you" step="G">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-11 items-center justify-center rounded-full border border-rule-strong text-sm text-ink transition-colors hover:bg-white/[0.06]"
          >
            {copied ? 'Copied' : 'Copy the summary'}
          </button>
          <a
            href={whatsappLink(`${ENQUIRY_MESSAGES.tools}\n\n${summary}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-void transition-colors hover:bg-white"
          >
            <WhatsAppGlyph className="h-3.5 w-3.5" />
            Send it to us
          </a>
          <button
            type="button"
            onClick={downloadCsv}
            className="inline-flex h-11 items-center justify-center rounded-full border border-rule text-sm text-ash transition-colors hover:border-rule-strong hover:text-ink sm:col-span-2"
          >
            Download as CSV
          </button>
        </div>
        {copyFailed && (
          <p className="mt-3 text-xs text-[#f0705a]">
            Your browser blocked the clipboard. Select the summary text manually, or use the CSV.
          </p>
        )}
        <p className="mt-4 text-xs leading-[1.6] text-ash3">
          Nothing here is sent anywhere unless you press “Send it to us”, which opens WhatsApp with
          the summary already written. Your inputs stay in this browser.
        </p>
      </Panel>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
function Panel({ title, step, children }) {
  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-rule bg-void">
      <header className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
        <h3 className="text-sm tracking-[-0.01em] text-ink">{title}</h3>
        {step && <span className="micro text-ash3">{step}</span>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}
