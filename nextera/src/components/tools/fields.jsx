/**
 * Shared form controls for the calculator.
 * Built mobile-first: 46px tap targets, no number spinners, sliders for
 * percentages, and labels that are real <label> elements.
 */
import { useId } from 'react'

/* -------------------------------------------------------------------------- */
export function FieldShell({ id, label, hint, error, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2.5 flex items-baseline gap-2">
        <span className="micro text-ash2">{label}</span>
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-2 text-xs leading-[1.5] text-ash3">{hint}</p>
      ) : null}
      {error ? <p className="mt-2 text-xs text-[#f0705a]">{error}</p> : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/** Numeric text field. Text (not type="number") so commas, ₹ and blanks are
 *  tolerated and iOS shows the right keyboard without spinners. */
export function NumberField({
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  inputMode = 'decimal',
  placeholder = '0',
  align = 'right',
  id: idProp,
  className = '',
}) {
  const generated = useId()
  const id = idProp || generated
  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <div className="relative">
        {prefix && <span className="field-affix left-3.5">{prefix}</span>}
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          autoComplete="off"
          spellCheck="false"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`field tabular-nums ${prefix ? 'pl-8' : 'pl-3.5'} ${
            suffix ? 'pr-9' : 'pr-3.5'
          }`}
          style={{ textAlign: align }}
        />
        {suffix && <span className="field-affix right-3.5">{suffix}</span>}
      </div>
    </FieldShell>
  )
}

/* -------------------------------------------------------------------------- */
/** Percentage field: number box + slider. The slider is the mobile-friendly
 *  half; the number box is the precise half. They drive the same value. */
export function PctField({ label, hint, value, onChange, max = 100, step = 1, id: idProp }) {
  const generated = useId()
  const id = idProp || generated
  const numeric = Number.parseFloat(String(value ?? '').replace(/[^0-9.\-]/g, ''))
  const sliderValue = Number.isFinite(numeric) ? Math.min(max, Math.max(0, numeric)) : 0

  return (
    <div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,1fr)_116px] sm:items-end sm:gap-3">
        <FieldShell id={id} label={label} hint={hint}>
          <div className="relative">
            <input
              id={id}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="0"
              className="field pl-3.5 pr-8 tabular-nums"
              style={{ textAlign: 'right' }}
            />
            <span className="field-affix right-3.5">%</span>
          </div>
        </FieldShell>

        <div className="sm:pb-[13px]">
          <label htmlFor={`${id}-range`} className="sr-only">
            {label} (slider)
          </label>
          <input
            id={`${id}-range`}
            type="range"
            min={0}
            max={max}
            step={step}
            value={sliderValue}
            onChange={(e) => onChange(e.target.value)}
            aria-hidden="false"
          />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/** Two-option segmented control. */
export function Segmented({ label, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2.5 micro text-ash2">{label}</legend>
      <div className="flex w-full flex-wrap rounded-full border border-rule bg-white/[0.02] p-1 sm:w-auto sm:flex-nowrap">
        {options.map((o) => {
          const active = value === o.value
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={`min-w-0 flex-1 rounded-full px-3 py-2.5 text-center text-xs transition-colors duration-200 sm:flex-none sm:px-4 ${
                active ? 'bg-ink text-void' : 'text-ash hover:text-ink'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/* -------------------------------------------------------------------------- */
/** Read-only line in the results panel. */
export function Row({
  label,
  value,
  note,
  tone = 'default',
  strong = false,
  indent = false,
}) {
  const tones = {
    default: 'text-ink',
    muted: 'text-ash2',
    minus: 'text-[#f0a795]',
    plus: 'text-mint',
    ember: 'text-ember-soft',
    sky: 'text-sky',
  }
  return (
    <div
      className={`flex items-baseline justify-between gap-4 py-2.5 ${
        strong ? 'border-t border-rule' : ''
      }`}
    >
      <span
        className={`min-w-0 text-sm leading-[1.45] ${
          strong ? 'text-ink' : 'text-ash2'
        } ${indent ? 'pl-3.5' : ''}`}
      >
        {label}
        {note ? <span className="ml-2 text-xs text-ash3">{note}</span> : null}
      </span>
      <span
        className={`shrink-0 text-sm tabular-nums ${tones[tone]} ${
          strong ? 'font-medium' : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
export function Meter({ value, tone = 'ember', className = '' }) {
  const tones = {
    ember: 'bg-ember',
    mint: 'bg-mint',
    sky: 'bg-sky',
    red: 'bg-[#f0705a]',
    ink: 'bg-ash2',
  }
  return (
    <div className={`h-[3px] w-full overflow-hidden rounded-full bg-white/[0.055] ${className}`}>
      <div
        className={`h-full rounded-full ${tones[tone] || tones.ember}`}
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          opacity: 0.85,
          transition: 'width 0.7s var(--ease-out-expo)',
        }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
export function StatTile({ label, value, sub, tone = 'default' }) {
  const tones = {
    default: 'text-ink',
    mint: 'text-mint',
    ember: 'text-ember-soft',
    red: 'text-[#f0705a]',
    sky: 'text-sky',
  }
  return (
    <div className="bg-void px-4 py-4">
      <p className="micro text-ash3">{label}</p>
      <p
        className={`mt-2 break-words font-display text-lg leading-[1.15] tracking-[-0.03em] tabular-nums ${tones[tone]}`}
      >
        {value}
      </p>
      {sub ? <p className="mt-2 text-xs leading-[1.4] text-ash3">{sub}</p> : null}
    </div>
  )
}
