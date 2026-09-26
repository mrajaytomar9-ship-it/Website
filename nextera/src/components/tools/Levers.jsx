import { LEVERS, formatINR, formatNumber, formatPct, leverDelta } from '../../lib/calculator'
import { Meter } from './fields'

/**
 * What-if panel. Every slider re-runs the whole model through applyLevers, so
 * the scenario uses the same maths as the base numbers — not an approximation.
 */
export default function Levers({ levers, setLever, onReset, base, scenario }) {
  const delta = leverDelta(base, scenario)
  const active = Object.entries(levers).some(([k, v]) => Number(v) !== 0)
  const improved = delta.netProfit > 0

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
      {/* -------------------------------------------------------- CONTROLS */}
      <div className="overflow-hidden rounded-[20px] border border-rule bg-void">
        <header className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
          <h3 className="text-[14px] tracking-[-0.01em] text-ink">Move one thing at a time</h3>
          <button
            type="button"
            onClick={onReset}
            disabled={!active}
            className={`micro transition-colors ${
              active ? 'text-ash hover:text-ink' : 'cursor-default text-ash3/60'
            }`}
          >
            Reset
          </button>
        </header>

        <div className="flex flex-col divide-y divide-white/[0.04]">
          {LEVERS.map((l) => {
            const value = Number(levers[l.k] || 0)
            const min = l.min ?? 0
            return (
              <div key={l.k} className="px-5 py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-[13.5px] text-ink">{l.label}</span>
                  <span className="flex items-center gap-1.5">
                    <input
                      type="text"
                      inputMode="numeric"
                      aria-label={`${l.label}, in ${l.unit}`}
                      value={String(levers[l.k] ?? 0)}
                      onChange={(e) =>
                        setLever(l.k, e.target.value.replace(/[^0-9.\-]/g, ''))
                      }
                      className="w-[64px] rounded-lg border border-rule bg-white/[0.02] px-2 py-1.5 text-right text-[13px] tabular-nums text-ink outline-none focus:border-rule-strong"
                    />
                    <span className="w-[46px] text-[11px] text-ash3">{l.unit}</span>
                  </span>
                </div>

                <input
                  type="range"
                  min={min}
                  max={l.max}
                  step={l.step}
                  value={Math.min(l.max, Math.max(min, value))}
                  onChange={(e) => setLever(l.k, e.target.value)}
                  aria-label={`${l.label} slider`}
                  className="mt-3"
                />

                <p className="mt-1 text-[11.5px] leading-[1.5] text-ash3">{l.hint}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* --------------------------------------------------------- OUTCOME */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-[20px] border border-rule bg-coal">
          <header className="border-b border-rule px-5 py-3.5">
            <h3 className="text-[14px] tracking-[-0.01em] text-ink">With these changes</h3>
          </header>

          <div className="px-5 py-6">
            <p className="micro text-ash3">Net profit becomes</p>
            <p
              className={`mt-2.5 font-display text-[32px] leading-none tracking-[-0.04em] tabular-nums ${
                scenario.profit.netProfit < 0 ? 'text-[#f0705a]' : 'text-ink'
              }`}
            >
              {formatINR(scenario.profit.netProfit)}
            </p>

            <p
              className={`mt-3 text-[13.5px] tabular-nums ${
                improved ? 'text-mint' : delta.netProfit < 0 ? 'text-[#f0705a]' : 'text-ash2'
              }`}
            >
              {delta.netProfit === 0
                ? 'No change yet — move a slider.'
                : `${delta.netProfit > 0 ? '+' : '−'}${formatINR(Math.abs(delta.netProfit))} a month (${
                    delta.netProfit > 0 ? '+' : '−'
                  }${formatPct(Math.abs(delta.netMargin), 1)} margin)`}
            </p>

            <Meter
              value={Math.min(100, (Math.abs(delta.netProfit) / Math.max(1, Math.abs(base.profit.netProfit))) * 100)}
              tone={improved ? 'mint' : delta.netProfit < 0 ? 'red' : 'ink'}
              className="mt-5"
            />

            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule">
              <div className="bg-void px-4 py-4">
                <p className="micro text-ash3">A year of it</p>
                <p className="mt-2 font-display text-[17px] tabular-nums text-ink">
                  {delta.netProfit === 0 ? '—' : formatINR(delta.netProfit * 12)}
                </p>
              </div>
              <div className="bg-void px-4 py-4">
                <p className="micro text-ash3">Leak change</p>
                <p className="mt-2 font-display text-[17px] tabular-nums text-ember-soft">
                  {delta.leak === 0 ? '—' : `${delta.leak > 0 ? '+' : '−'}${formatINR(Math.abs(delta.leak))}`}
                </p>
              </div>
            </div>

            <dl className="mt-5 flex flex-col gap-2.5">
              <Line
                k="Net margin"
                v={`${formatPct(base.profit.netMargin)} → ${formatPct(scenario.profit.netMargin)}`}
              />
              <Line
                k="Break-even"
                v={`${formatNumber(base.breakEven.units, 0)} → ${formatNumber(
                  scenario.breakEven.units,
                  0,
                )} ${base.type.unit}s`}
              />
              {base.target.target > 0 && (
                <Line
                  k="Gap to target"
                  v={`${formatINR(Math.abs(base.target.gap))} → ${formatINR(
                    Math.abs(scenario.target.gap),
                  )}`}
                />
              )}
            </dl>

            <p className="mt-5 border-t border-rule pt-4 text-[11.5px] leading-[1.6] text-ash3">
              Scenarios re-run the full model, so compounding effects are included. They still assume
              customers behave the same way — a price rise that costs you bookings will not show up
              here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Line({ k, v }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[12.5px] text-ash3">{k}</dt>
      <dd className="text-[12.5px] tabular-nums text-ash">{v}</dd>
    </div>
  )
}
