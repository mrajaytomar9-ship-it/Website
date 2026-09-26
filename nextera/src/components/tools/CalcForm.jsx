import { BUSINESS_TYPES, FIELD_GROUPS, getType, hintFor, labelFor } from '../../lib/calculator'
import { TOOLS } from '../../lib/content'
import ServiceIcon from '../ServiceIcon'
import { NumberField, PctField, Segmented } from './fields'

/**
 * The input side of the calculator. Rendered straight from FIELD_GROUPS so a
 * new line in the model appears in the form without editing this file.
 */
export default function CalcForm({ typeId, onType, values, setValue, onReset, onClear }) {
  const type = getType(typeId)
  const basis = values.volumeBasis === 'month' ? 'month' : 'day'

  return (
    <div>
      {/* ------------------------------------------------- BUSINESS TYPE */}
      <section className="overflow-hidden rounded-[20px] border border-rule bg-void">
        <header className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
          <h3 className="text-[14px] tracking-[-0.01em] text-ink">What kind of business?</h3>
          <span className="micro text-ash3">00</span>
        </header>

        <div className="p-5">
          {/* horizontal scroll on a phone, wrapped row from sm up */}
          <div className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {BUSINESS_TYPES.map((t) => {
              const active = t.id === typeId
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onType(t.id)}
                  aria-pressed={active}
                  className={`inline-flex shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2.5 text-[12.5px] transition-all duration-200 ${
                    active
                      ? 'border-ember/40 bg-ember/[0.09] text-ember-soft'
                      : 'border-rule text-ash hover:border-rule-strong hover:text-ink'
                  }`}
                >
                  <ServiceIcon name={t.icon} className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              )
            })}
          </div>

          <p className="mt-4 text-[12.5px] leading-[1.6] text-ash2">{type.blurb}</p>
          <p className="mt-3 rounded-lg border border-rule-faint bg-white/[0.02] p-3.5 text-[11.5px] leading-[1.6] text-ash3">
            {TOOLS.presetNote}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-rule px-3.5 py-2 text-[12px] text-ash transition-colors hover:border-rule-strong hover:text-ink"
            >
              {TOOLS.calculator.resetLabel}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-full border border-rule px-3.5 py-2 text-[12px] text-ash transition-colors hover:border-rule-strong hover:text-ink"
            >
              {TOOLS.calculator.clearLabel}
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- GROUPS */}
      {FIELD_GROUPS.map((group) => (
        <section
          key={group.id}
          id={`calc-${group.id}`}
          className="mt-5 scroll-mt-24 overflow-hidden rounded-[20px] border border-rule bg-void"
        >
          <header className="flex items-start justify-between gap-4 border-b border-rule px-5 py-3.5">
            <div className="min-w-0">
              <h3 className="text-[14px] tracking-[-0.01em] text-ink">{group.title}</h3>
              <p className="mt-1 text-[11.5px] leading-[1.5] text-ash3">{group.note}</p>
            </div>
            <span className="micro shrink-0 text-ash3">{group.n}</span>
          </header>

          <div className="grid gap-x-5 gap-y-6 p-5 sm:grid-cols-2">
            {group.fields.map((f) => {
              /* days are meaningless when units are counted monthly */
              if (f.k === 'daysOpen' && basis === 'month') return null

              const label = labelFor(f, type)
              const hint = hintFor(f, type)
              const value = values[f.k] ?? ''

              if (f.type === 'basis') {
                return (
                  <div key={f.k} className="sm:col-span-2">
                    <Segmented
                      label={label}
                      value={basis}
                      onChange={(v) => setValue(f.k, v)}
                      options={[
                        { value: 'day', label: 'Per day' },
                        { value: 'month', label: 'Per month' },
                      ]}
                    />
                    <p className="mt-2 text-[11.5px] text-ash3">
                      {basis === 'day'
                        ? `Monthly units = units per day × utilisation × working days.`
                        : `Monthly units = units × utilisation. Working days are not used.`}
                    </p>
                  </div>
                )
              }

              if (f.type === 'pct') {
                return (
                  <div key={f.k} className="sm:col-span-2">
                    <PctField
                      label={label}
                      hint={hint}
                      value={value}
                      onChange={(v) => setValue(f.k, v)}
                    />
                  </div>
                )
              }

              const suffixes = {
                capacity: type.unit,
                daysOpen: 'days',
                enquiries: 'enquiries',
              }

              return (
                <NumberField
                  key={f.k}
                  label={label}
                  hint={hint}
                  value={value}
                  onChange={(v) => setValue(f.k, v)}
                  prefix={f.type === 'money' ? '₹' : undefined}
                  suffix={suffixes[f.k]}
                  inputMode={f.type === 'int' ? 'numeric' : 'decimal'}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
