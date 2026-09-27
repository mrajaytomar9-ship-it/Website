import { useState } from 'react'
import {
  formatINR,
  formatNumber,
  formatPct,
  quickBreakEven,
  quickEnquiryValue,
  quickPricing,
} from '../../lib/calculator'
import { NumberField, Row } from './fields'

/* -------------------------------------------------------------------------- */
/* Three small calculators for the questions that come up mid-conversation.    */
/* Each one is self-contained: its own state, its own result, no shared form.  */
/* -------------------------------------------------------------------------- */

export default function QuickTools() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <BreakEvenTool />
      <PricingTool />
      <EnquiryTool />
    </div>
  )
}

/* ---------------------------------------------------------------- BREAK-EVEN */
function BreakEvenTool() {
  const [v, setV] = useState({ price: '1200', variablePct: '35', fixed: '180000', deductionPct: '18' })
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }))
  const r = quickBreakEven(v)

  return (
    <Card
      n="01"
      title="Break-even in units"
      lede="How many sales a month before the month stops losing money."
    >
      <div className="grid gap-5">
        <NumberField label="Average price" prefix="₹" value={v.price} onChange={set('price')} />
        <NumberField
          label="Variable cost, % of price"
          suffix="%"
          value={v.variablePct}
          onChange={set('variablePct')}
        />
        <NumberField
          label="Platform & discount leak, %"
          suffix="%"
          value={v.deductionPct}
          onChange={set('deductionPct')}
          hint="Commission, gateway fees, cancellations, discounts."
        />
        <NumberField label="Fixed cost per month" prefix="₹" value={v.fixed} onChange={set('fixed')} />
      </div>

      <Result>
        {r.feasible ? (
          <>
            <Big value={formatNumber(r.units, 0)} unit="sales a month" />
            <Row label="That is a day" value={`${formatNumber(r.perDay, 1)} sales`} tone="muted" />
            <Row label="Billing at break-even" value={formatINR(r.revenue)} tone="muted" />
            <Row label="Contribution per sale" value={formatINR(r.contribution)} tone="plus" />
          </>
        ) : (
          <Impossible text="A sale does not cover its own variable cost and leak, so no volume reaches break-even. Price or cost has to move first." />
        )}
      </Result>
    </Card>
  )
}

/* ------------------------------------------------------------------ PRICING */
function PricingTool() {
  const [v, setV] = useState({ cost: '420', marginPct: '30', deductionPct: '18' })
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }))
  const r = quickPricing(v)

  return (
    <Card
      n="02"
      title="Price for a target margin"
      lede="What to charge so the margin survives the platform and the delivery cost."
    >
      <div className="grid gap-5">
        <NumberField label="What it costs you" prefix="₹" value={v.cost} onChange={set('cost')} />
        <NumberField
          label="Margin you want"
          suffix="%"
          value={v.marginPct}
          onChange={set('marginPct')}
          hint="Margin on the money you keep, after the platform takes its share."
        />
        <NumberField
          label="Platform & payment deduction"
          suffix="%"
          value={v.deductionPct}
          onChange={set('deductionPct')}
        />
      </div>

      <Result>
        {r.feasible ? (
          <>
            <Big value={formatINR(r.price)} unit="charge this" />
            <Row label="Profit per sale" value={formatINR(r.profit)} tone="plus" />
            <Row label="Taken by the platform" value={formatINR(r.deductionCost)} tone="minus" />
            <Row label="Mark-up on cost" value={formatPct(r.markupOnCost, 0)} tone="muted" />
          </>
        ) : (
          <Impossible text="A 100% margin means charging infinitely. Ask for a number under 100 and the maths will answer." />
        )}
      </Result>
    </Card>
  )
}

/* ----------------------------------------------------------- ENQUIRY VALUE */
function EnquiryTool() {
  const [v, setV] = useState({
    enquiries: '200',
    replyRate: '55',
    conversion: '15',
    price: '1800',
    contributionPct: '55',
  })
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }))
  const r = quickEnquiryValue(v)

  return (
    <Card
      n="03"
      title="What an ignored enquiry costs"
      lede="The price of slow replies, in rupees, on your own conversion rate."
    >
      <div className="grid gap-5">
        <NumberField
          label="Enquiries a month"
          suffix="msgs"
          inputMode="numeric"
          value={v.enquiries}
          onChange={set('enquiries')}
        />
        <NumberField
          label="Answered properly, same day"
          suffix="%"
          value={v.replyRate}
          onChange={set('replyRate')}
        />
        <NumberField
          label="Of those, how many buy"
          suffix="%"
          value={v.conversion}
          onChange={set('conversion')}
        />
        <NumberField label="Average sale value" prefix="₹" value={v.price} onChange={set('price')} />
        <NumberField
          label="Contribution margin"
          suffix="%"
          value={v.contributionPct}
          onChange={set('contributionPct')}
          hint="What is left of a sale after the platform and the cost of delivering it."
        />
      </div>

      <Result>
        <Big value={formatINR(r.billing)} unit="of billing lost a month" />
        <Row label="Profit lost" value={formatINR(r.profit)} tone="minus" />
        <Row label="Enquiries ignored" value={formatNumber(r.missed, 0)} tone="muted" />
        <Row label="Cost per enquiry ignored" value={formatINR(r.perEnquiry)} tone="muted" />
        <Row label="A year of it" value={formatINR(r.billing * 12)} tone="minus" />
      </Result>
    </Card>
  )
}

/* ------------------------------------------------------------------ SHARED */
function Card({ n, title, lede, children }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-rule bg-void">
      <header className="border-b border-rule px-5 py-4">
        <span className="micro text-ash3">{n}</span>
        <h3 className="mt-2.5 text-base tracking-[-0.02em] text-ink">{title}</h3>
        <p className="mt-2 text-xs leading-[1.55] text-ash3">{lede}</p>
      </header>
      <div className="flex flex-1 flex-col p-5">{children}</div>
    </article>
  )
}

function Result({ children }) {
  return (
    <div className="mt-6 rounded-md border border-rule-faint bg-white/[0.02] p-4">
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

function Big({ value, unit }) {
  return (
    <div className="mb-2">
      <p className="font-display text-xl leading-none tracking-[-0.04em] tabular-nums text-ink">
        {value}
      </p>
      <p className="mt-2 text-xs text-ash3">{unit}</p>
    </div>
  )
}

function Impossible({ text }) {
  return (
    <p className="rounded-md border border-[#f0705a]/25 bg-[#f0705a]/[0.06] p-3.5 text-xs leading-[1.6] text-[#f0a795]">
      {text}
    </p>
  )
}
