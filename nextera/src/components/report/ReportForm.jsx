import { useId } from 'react'
import { BUSINESS_TYPES, getType } from '../../lib/calculator'
import {
  LINK_SLOTS,
  REPORT_FIELDS,
  COMPETITOR_FIELDS,
  expectations,
  parseLink,
  linkFindings,
  detectPlatform,
  lookupLinks,
} from '../../lib/report'
import { FieldShell, NumberField, Row } from '../tools/fields'
import { Dot } from '../ui/Primitives'
import ServiceIcon from '../ServiceIcon'

/* -------------------------------------------------------------------------- */
/** Plain text field on the shared shell. */
function TextField({ label, hint, value, onChange, placeholder, error, id: idProp, type = 'text' }) {
  const generated = useId()
  const id = idProp || generated
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        type={type}
        autoComplete="off"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field"
      />
    </FieldShell>
  )
}

/* -------------------------------------------------------------------------- */
/** Yes / No / Not sure. "Not sure" is a real answer here: an unanswered
 *  question is excluded from the score rather than counted as a failure. */
function YesNo({ label, hint, value, onChange }) {
  const id = useId()
  const options = [
    { label: 'Yes', v: true },
    { label: 'No', v: false },
    { label: 'Not sure', v: null },
  ]
  return (
    <fieldset>
      <legend id={`${id}-legend`} className="micro mb-2.5 text-ash2">
        {label}
      </legend>
      <div
        role="group"
        aria-labelledby={`${id}-legend`}
        className="inline-flex w-full rounded-full border border-rule bg-white/[0.02] p-1 sm:w-auto"
      >
        {options.map((o) => {
          const active = value === o.v
          return (
            <button
              key={o.label}
              type="button"
              onClick={() => onChange(o.v)}
              aria-pressed={active}
              className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-xs transition-colors duration-200 sm:flex-none ${
                active ? 'bg-ink text-void' : 'text-ash hover:text-ink'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
      {hint ? <p className="mt-2 text-xs leading-[1.5] text-ash3">{hint}</p> : null}
    </fieldset>
  )
}

/* -------------------------------------------------------------------------- */
/** A link field that says what it recognised as you type. */
function LinkField({ slot, value, onChange, error }) {
  const id = useId()
  const parsed = parseLink(value)
  const findings = parsed.ok ? linkFindings(parsed, slot) : []
  const worst = findings.find((f) => f.tone === 'missing' || f.tone === 'weak')

  return (
    <FieldShell
      id={id}
      label={slot.label}
      hint={slot.hint}
      error={error || (!parsed.ok && !parsed.empty ? parsed.error : null)}
    >
      <input
        id={id}
        type="url"
        inputMode="url"
        autoComplete="off"
        spellCheck="false"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://"
        className="field"
      />
      {parsed.ok ? (
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="inline-flex items-center gap-2 text-xs text-ash2">
            <Dot tone={parsed.isOwnWebsite ? 'sky' : 'ember'} />
            {parsed.platform ? parsed.platform.label : parsed.isOwnWebsite ? 'Your own website' : parsed.host}
          </span>
          {!parsed.isSecure ? <span className="text-xs text-[#f0705a]">Not https</span> : null}
        </div>
      ) : null}
      {worst ? (
        <p className="mt-2 text-xs leading-[1.55] text-ash2">{worst.text}</p>
      ) : null}
    </FieldShell>
  )
}

/* -------------------------------------------------------------------------- */
/** One competitor row, with the deep links that make filling it in quick. */
function CompetitorRow({ index, row, onChange, onRemove, city, canRemove }) {
  const id = useId()
  const links = lookupLinks(row.name, city)
  const set = (k, v) => onChange({ ...row, [k]: v })

  return (
    <div className="rounded-md border border-rule bg-void p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="micro text-ash2">Competitor {index + 1}</span>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove competitor ${index + 1}`}
            className="rounded-full border border-rule px-3 py-1.5 text-xs text-ash3 transition-colors hover:border-rule-strong hover:text-ink"
          >
            Remove
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {COMPETITOR_FIELDS.map((f) =>
          f.type === 'bool' ? (
            <div key={f.k} className="col-span-2 sm:col-span-3">
              <YesNo label={f.label} value={row[f.k] === true} onChange={(v) => set(f.k, v === true)} />
            </div>
          ) : (
            <TextField
              key={f.k}
              label={f.label}
              value={row[f.k]}
              onChange={(v) => set(f.k, v)}
              placeholder={f.k === 'name' ? 'e.g. Hotel Sidhartha' : ''}
            />
          ),
        )}
      </div>

      {links ? (
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule-faint pt-3.5 text-xs text-ash3">
          <span>Read the real numbers off:</span>
          <a
            href={links.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ash underline decoration-rule-strong underline-offset-4 transition-colors hover:text-ink"
          >
            Google Maps
          </a>
          <a
            href={links.search}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ash underline decoration-rule-strong underline-offset-4 transition-colors hover:text-ink"
          >
            Google search
          </a>
        </p>
      ) : null}
      <span id={id} className="sr-only">
        Competitor {index + 1} details
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/** Section wrapper with the numbered heading the tools page already uses. */
function Card({ n, title, note, children }) {
  return (
    <section className="overflow-hidden rounded-lg border border-rule bg-void">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3.5">
        <h3 className="text-sm tracking-[-0.01em] text-ink">{title}</h3>
        <span className="micro text-ash3">{n}</span>
      </header>
      <div className="p-5">{children}</div>
      {note ? (
        <p className="border-t border-rule-faint px-5 py-3.5 text-xs leading-[1.6] text-ash3">{note}</p>
      ) : null}
    </section>
  )
}

/* -------------------------------------------------------------------------- */
export default function ReportForm({ input, setInput, errors }) {
  const exp = expectations(input.typeId)
  const type = getType(input.typeId)

  const setField = (k, v) => setInput((s) => ({ ...s, [k]: v }))
  const setLink = (k, v) => setInput((s) => ({ ...s, links: { ...s.links, [k]: v } }))
  const setPresence = (k, v) => setInput((s) => ({ ...s, presence: { ...s.presence, [k]: v } }))
  const setValue = (k, v) => setInput((s) => ({ ...s, values: { ...s.values, [k]: v } }))

  const setCompetitor = (i, row) =>
    setInput((s) => ({ ...s, competitors: s.competitors.map((c, j) => (j === i ? row : c)) }))
  const addCompetitor = () =>
    setInput((s) =>
      s.competitors.length >= 3
        ? s
        : { ...s, competitors: [...s.competitors, { name: '', startPrice: '', photos: '', reviews: '', rating: '', takesOnlineEnquiry: false }] },
    )
  const removeCompetitor = (i) =>
    setInput((s) => ({ ...s, competitors: s.competitors.filter((_, j) => j !== i) }))

  return (
    <div className="flex flex-col gap-5">
      {/* ------------------------------------------------------- 01 basics */}
      <Card n="01" title="Who and where">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <TextField
            label="Business name"
            value={input.name}
            onChange={(v) => setField('name', v)}
            placeholder="e.g. Guest House Taj View"
            error={errors.name}
          />
          <TextField
            label="City"
            value={input.city}
            onChange={(v) => setField('city', v)}
            placeholder="Agra"
          />
        </div>

        <fieldset className="mt-5">
          <legend className="micro mb-2.5 text-ash2">Closest business type</legend>
          <div className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {BUSINESS_TYPES.map((t) => {
              const active = t.id === input.typeId
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setInput((s) => ({ ...s, typeId: t.id, values: s.values }))}
                  aria-pressed={active}
                  className={`flex shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2.5 text-xs transition-colors duration-200 ${
                    active ? 'border-ink bg-ink text-void' : 'border-rule text-ash hover:border-rule-strong hover:text-ink'
                  }`}
                >
                  <ServiceIcon name={t.icon} className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              )
            })}
          </div>
        </fieldset>
        {errors.typeId ? <p className="mt-2 text-xs text-[#f0705a]">{errors.typeId}</p> : null}
      </Card>

      {/* --------------------------------------------------------- 02 links */}
      <Card
        n="02"
        title="Your links"
        note="We check the address itself — the domain, whether it is https, whether it is yours, and which platform it belongs to. A page like this one cannot open somebody else's website and read it, so nothing here claims to have."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {LINK_SLOTS.map((slot) => (
            <LinkField
              key={slot.id}
              slot={slot}
              value={input.links[slot.id]}
              onChange={(v) => setLink(slot.id, v)}
              error={errors[`link-${slot.id}`]}
            />
          ))}
        </div>
        {errors.links ? <p className="mt-3 text-xs text-[#f0705a]">{errors.links}</p> : null}
      </Card>

      {/* --------------------------------------------- 03 / 04 the questions */}
      {REPORT_FIELDS.map((group, gi) => (
        <Card
          key={group.group}
          n={String(gi + 3).padStart(2, '0')}
          title={group.group}
          note={
            gi === 0
              ? `Targets used for a ${type.label.toLowerCase()}: ${exp.photoTarget}+ photographs and ${exp.reviewTarget}+ reviews. Leave anything blank you do not know — unanswered questions are left out of the score rather than marked down.`
              : null
          }
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.fields.map((f) =>
              f.type === 'bool' ? (
                <YesNo
                  key={f.k}
                  label={f.label}
                  value={input.presence[f.k]}
                  onChange={(v) => setPresence(f.k, v)}
                />
              ) : (
                <NumberField
                  key={f.k}
                  label={f.label}
                  hint={f.hint}
                  suffix={f.suffix}
                  value={input.presence[f.k]}
                  onChange={(v) => setPresence(f.k, v)}
                  error={errors[f.k]}
                />
              ),
            )}
          </div>
        </Card>
      ))}

      {/* ---------------------------------------------------- 05 competitors */}
      <Card
        n="05"
        title="Who you are up against"
        note="Optional, and typed in by you from public listings — we do not fetch competitor data. Open the links under each row, read the numbers off, and put them in. Leave the name blank to skip a row."
      >
        <div className="flex flex-col gap-4">
          {input.competitors.map((c, i) => (
            <CompetitorRow
              key={i}
              index={i}
              row={c}
              city={input.city}
              onChange={(row) => setCompetitor(i, row)}
              onRemove={() => removeCompetitor(i)}
              canRemove={input.competitors.length > 1}
            />
          ))}
        </div>
        {input.competitors.length < 3 ? (
          <button
            type="button"
            onClick={addCompetitor}
            className="mt-4 rounded-full border border-rule px-4 py-2.5 text-xs text-ash transition-colors hover:border-rule-strong hover:text-ink"
          >
            Add another competitor
          </button>
        ) : null}
      </Card>

      {/* -------------------------------------------------------- 06 summary */}
      <div className="rounded-lg border border-rule-faint bg-white/[0.02] p-5">
        <Row label="Checks in this report" value="Up to 21, across four pillars" />
        <Row label="Where it runs" value="Entirely in your browser" />
        <Row label="What is sent anywhere" value="Nothing, unless you press send" />
      </div>
    </div>
  )
}
