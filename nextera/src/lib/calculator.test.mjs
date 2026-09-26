/* =============================================================================
   Tests for the founder calculator engine.
   Run with:  npm test      (or: node --test src/lib/calculator.test.mjs)
   Plain node:test — no runner, no DOM, no build step. The page imports the
   same functions these tests call, so a pass here means the numbers a founder
   sees on /tools are the numbers verified below.
   ============================================================================= */

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  BUSINESS_TYPES,
  DEFAULT_LEVERS,
  FIELD_GROUPS,
  applyLevers,
  buildRecommendations,
  buildSummary,
  computeMetrics,
  formatCompactINR,
  formatINR,
  leverDelta,
  normalize,
  num,
  presetValues,
  quickBreakEven,
  quickEnquiryValue,
  quickPricing,
  toCSV,
} from './calculator.js'

/* The hotel preset, written out long-hand so every figure below is checkable
   against a calculator rather than against the implementation. */
const HOTEL = {
  typeId: 'hotel',
  volumeBasis: 'day',
  capacity: 14,
  utilisation: 62,
  daysOpen: 30,
  price: 2400,
  otherRevenue: 45000,
  onlineShare: 65,
  commissionRate: 18,
  gatewayRate: 2,
  digitalDirectShare: 25,
  cancellationRate: 6,
  discountRate: 5,
  cogsRate: 22,
  staff: 120000,
  rent: 65000,
  utilities: 18000,
  marketing: 12000,
  software: 2500,
  maintenance: 8000,
  loanInterest: 22000,
  miscFixed: 6000,
  depreciation: 9000,
  ownerDraw: 40000,
  taxRate: 25,
  enquiries: 240,
  replyRate: 55,
  conversionRate: 14,
  targetNetProfit: 200000,
}

const close = (actual, expected, tol = 1) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ±${tol}, got ${actual}`,
  )

/* ------------------------------------------------------------------ parsing */

test('num() survives the junk a form actually produces', () => {
  assert.equal(num('₹1,20,000'), 120000)
  assert.equal(num(' 2400.50 '), 2400.5)
  assert.equal(num(''), 0)
  assert.equal(num(null), 0)
  assert.equal(num(undefined), 0)
  assert.equal(num('abc'), 0)
  assert.equal(num('-500'), -500)
  assert.equal(num(NaN), 0)
})

test('formatINR() uses Indian digit grouping and a real minus sign', () => {
  assert.equal(formatINR(1234567), '₹12,34,567')
  assert.equal(formatINR(-4500), '−₹4,500')
  assert.equal(formatCompactINR(520000), '₹5.20L')
  assert.equal(formatCompactINR(12500000), '₹1.25Cr')
  assert.equal(formatCompactINR(950), '₹950')
})

test('normalize() clamps nonsense instead of inverting the model', () => {
  const i = normalize({ typeId: 'hotel', utilisation: 480, taxRate: -20, daysOpen: 999, price: 'abc' })
  assert.equal(i.utilisation, 100)
  assert.equal(i.taxRate, 0)
  assert.equal(i.daysOpen, 31)
  assert.equal(i.price, 0)
  assert.equal(i.typeId, 'hotel')
})

test('an unknown business type falls back rather than crashing', () => {
  const i = normalize({ typeId: 'spaceport' })
  assert.equal(i.typeId, 'other')
  assert.equal(computeMetrics({ typeId: 'spaceport' }).type.id, 'other')
})

test('every preset supplies every field the form asks for', () => {
  const keys = FIELD_GROUPS.flatMap((g) => g.fields.map((f) => f.k))
  for (const t of BUSINESS_TYPES) {
    for (const k of keys) {
      assert.ok(k in t.values, `${t.id} is missing ${k}`)
    }
    assert.deepEqual(Object.keys(presetValues(t.id)).sort(), keys.slice().sort())
  }
})

/* --------------------------------------------------------- revenue & leaks */

test('hotel preset: volume and gross billing', () => {
  const m = computeMetrics(HOTEL)
  close(m.volume.potentialUnits, 420) // 14 rooms × 30 days
  close(m.volume.units, 260.4, 0.01) // 62% occupancy
  close(m.volume.spareUnits, 159.6, 0.01)
  close(m.revenue.grossFromUnits, 624960) // 260.4 × ₹2,400
  close(m.revenue.grossRevenue, 669960) // + ₹45,000 F&B
})

test('hotel preset: every deduction, line by line', () => {
  const m = computeMetrics(HOTEL)
  const online = 669960 * 0.65 // 435,474
  close(m.revenue.onlineRevenue, online)
  close(m.revenue.directRevenue, 669960 - online)
  close(m.deductions.commission, online * 0.18) // 78,385.32
  close(m.deductions.gateway, (online + (669960 - online) * 0.25) * 0.02) // 9,881.91
  close(m.deductions.cancellations, 669960 * 0.06) // 40,197.60
  close(m.deductions.discounts, 669960 * 0.05) // 33,498.00
  close(m.deductions.total, 161962.83)
  close(m.revenue.netRevenue, 507997.17)
  close(m.profit.leakRate, 24.174, 0.01)
})

test('hotel preset: profit walks all the way down to what is retained', () => {
  const m = computeMetrics(HOTEL)
  close(m.costs.cogs, 111759.38) // 22% of net revenue
  close(m.costs.grossProfit, 396237.79)
  close(m.costs.fixedTotal, 253500) // 120+65+18+12+2.5+8+22+6 (thousands)
  close(m.profit.ebitda, 142737.79)
  close(m.profit.operatingProfit, 133737.79) // − ₹9,000 depreciation
  close(m.profit.tax, 33434.45) // 25% of a positive EBIT
  close(m.profit.netProfit, 100303.34)
  close(m.profit.retained, 60303.34) // after the ₹40,000 owner draw
  close(m.profit.netMargin, 19.745, 0.01)
  close(m.perDay.profit, 3343.44) // net profit ÷ 30 working days
})

test('losses are not taxed', () => {
  const m = computeMetrics({ ...HOTEL, price: 900, otherRevenue: 0 })
  assert.ok(m.profit.operatingProfit < 0, 'this scenario should lose money')
  assert.equal(m.profit.tax, 0)
  assert.equal(m.verdict.tone, 'red')
})

test('leaks are ranked largest first and never exceed gross billing', () => {
  const m = computeMetrics(HOTEL)
  const amounts = m.deductions.leaks.map((l) => l.amount)
  assert.deepEqual(amounts, [...amounts].sort((a, b) => b - a))
  assert.equal(m.deductions.leaks[0].k, 'commission')
  assert.ok(m.deductions.total < m.revenue.grossRevenue)
})

/* ------------------------------------------------------- missed demand ---- */

test('unanswered enquiries are reported separately, never as billed revenue', () => {
  const m = computeMetrics(HOTEL)
  close(m.demand.unanswered, 108) // 240 × (1 − 55%)
  close(m.demand.missedUnits, 15.12, 0.01) // 14% of those convert
  close(m.demand.missedRevenue, 36288) // 15.12 × ₹2,400
  close(m.demand.servableMissedRevenue, 36288) // 159.6 spare room nights available
  assert.equal(m.demand.capacityBlocked, false)
  // missed revenue must not have leaked into net revenue
  close(m.revenue.netRevenue, 507997.17)
})

test('missed demand is capped by spare capacity', () => {
  const m = computeMetrics({ ...HOTEL, capacity: 10, utilisation: 98, enquiries: 900 })
  assert.ok(m.demand.missedRevenue > m.demand.servableMissedRevenue)
  assert.equal(m.demand.capacityBlocked, true)
  close(m.demand.servableMissedUnits, m.volume.spareUnits, 0.01)
})

/* ------------------------------------------------------------ break-even -- */

test('hotel preset: break-even from marginal contribution per unit', () => {
  const m = computeMetrics(HOTEL)
  // A rupee of billing keeps (1 − 24.174% leak) × (1 − 22% variable) = 59.1435%
  close(m.unit.contributionRate, 59.1435, 0.001)
  close(m.unit.contributionPerUnit, 1419.44, 0.01) // ₹2,400 × 59.1435%
  close(m.unit.deductionPerUnit, 580.2, 0.01) // 2400 × 24.175%
  close(m.unit.variablePerUnit, 400.36, 0.01) // 2400 × 75.825% × 22%
  // F&B billing carries its own contribution, so it reduces the cost base
  close(m.unit.otherContribution, 26614.58)
  close(m.breakEven.fixedAfterOtherRevenue, 226885.42)
  close(m.breakEven.units, 159.84, 0.02) // 226,885.42 ÷ 1,419.44
  close(m.breakEven.utilisation, 38.06, 0.02)
  close(m.breakEven.safetyUnits, 100.56, 0.02)
  close(m.breakEven.safetyPct, 38.62, 0.02)
  assert.equal(m.breakEven.reached, true)
  // depreciation is non-cash, so it must not be inside the break-even cost base
  assert.equal(m.breakEven.cashFixed, m.costs.fixedTotal)
  // averaged net profit per room night, for the "what is one night worth" tile
  close(m.unit.avgNetProfitPerUnit, 385.19, 0.01)
})

test('break-even is refused, not invented, when a unit contributes nothing', () => {
  const m = computeMetrics({ ...HOTEL, price: 0, otherRevenue: 0 })
  assert.equal(m.unit.contributionPerUnit, 0)
  assert.equal(m.breakEven.reached, false)
  assert.equal(Number.isFinite(m.breakEven.units), false)
  assert.equal(m.target.routes.find((r) => r.k === 'units').feasible, false)
  // a price route still exists, but it cannot be expressed as a % of a zero price
  const priceRoute = m.target.routes.find((r) => r.k === 'price')
  assert.equal(priceRoute.feasible, true)
  assert.equal(priceRoute.asPct, null)
})

test('when non-unit billing alone covers the fixed cost, break-even is zero units', () => {
  // ₹500,000 × 59.1435% contribution = ₹295,718, above the ₹253,500 cash fixed cost
  const m = computeMetrics({ ...HOTEL, capacity: 0, otherRevenue: 500000 })
  assert.ok(m.breakEven.fixedAfterOtherRevenue < 0)
  assert.equal(m.breakEven.units, 0)
  assert.equal(m.breakEven.reached, true)
  assert.ok(m.breakEven.safetyUnits >= 0)
})

/* --------------------------------------------------------------- the gap -- */

test('hotel preset: gap to target and the four routes to close it', () => {
  const m = computeMetrics(HOTEL)
  close(m.target.gap, 99696.66) // 200,000 − 100,303.34
  assert.equal(m.target.met, false)

  const byKey = Object.fromEntries(m.target.routes.map((r) => [r.k, r]))

  // units route: gap ÷ (marginal contribution per unit × (1 − tax))
  //   = 99,696.66 ÷ (1,419.44 × 0.75) = 93.65 extra room nights
  close(byKey.units.value, 93.65, 0.02)
  // and that is not an abstraction: give the hotel exactly that much more
  // sellable capacity and the model really does land on the target
  const capacityForTarget = (260.4 + byKey.units.value) / (30 * 0.62)
  close(capacityForTarget, 19.0349, 0.001)
  const withCapacity = computeMetrics({ ...HOTEL, capacity: capacityForTarget })
  close(withCapacity.volume.units, 260.4 + byKey.units.value, 0.02)
  close(withCapacity.profit.netProfit, 200000, 50)

  // price route: gap ÷ (units × (1 − leak) × (1 − cogs) × (1 − tax))
  const expectedPriceRise =
    99696.66 / (260.4 * (1 - 0.241741) * (1 - 0.22) * 0.75)
  close(byKey.price.value, expectedPriceRise, 5)
  close(byKey.price.asPct, (expectedPriceRise / 2400) * 100, 0.2)

  // cost route: gap ÷ (1 − tax)
  close(byKey.cost.value, 132928.88, 5)

  // direct route: how many points of billing must leave the platforms
  //   99,696.66 ÷ (6,699.60 × 18% × 0.75) = 110.2 points — more than the 65
  //   points that exist, so the route is reported as capped and flagged.
  close(byKey.direct.value, 110.2, 0.2)
  close(byKey.direct.capped, 65, 0.001)
  assert.match(byKey.direct.note, /cannot close the gap/)
})

test('a met target reports no gap', () => {
  const m = computeMetrics({ ...HOTEL, targetNetProfit: 50000 })
  assert.equal(m.target.met, true)
  assert.ok(m.target.gap < 0)
})

/* ---------------------------------------------------------------- levers -- */

test('every lever moves profit in the direction a founder expects', () => {
  const base = computeMetrics(HOTEL)

  const lessLeak = applyLevers(HOTEL, { recoverLeak: 40 })
  assert.ok(lessLeak.profit.netProfit > base.profit.netProfit)
  close(lessLeak.deductions.total, base.deductions.total * 0.6, 1)

  const moreDirect = applyLevers(HOTEL, { otaShift: 20 })
  assert.ok(moreDirect.profit.netProfit > base.profit.netProfit)
  close(moreDirect.input.onlineShare, 45, 0.001)

  const dearer = applyLevers(HOTEL, { price: 10 })
  assert.ok(dearer.profit.netProfit > base.profit.netProfit)
  close(dearer.input.price, 2640, 0.001)

  const cheaper = applyLevers(HOTEL, { fixedCost: -15 })
  assert.ok(cheaper.profit.netProfit > base.profit.netProfit)
  close(cheaper.costs.fixedTotal, base.costs.fixedTotal * 0.85, 1)

  const dearerCosts = applyLevers(HOTEL, { fixedCost: 10 })
  assert.ok(dearerCosts.profit.netProfit < base.profit.netProfit)

  const betterReplies = applyLevers(HOTEL, { replyRate: 45 })
  assert.equal(betterReplies.demand.unanswered, 0)
  close(betterReplies.input.replyRate, 100, 0.001)
  // answering more enquiries must not change billed revenue
  close(betterReplies.revenue.netRevenue, base.revenue.netRevenue, 0.01)
})

test('lever deltas are the difference between two real runs', () => {
  const base = computeMetrics(HOTEL)
  const scenario = applyLevers(HOTEL, { recoverLeak: 50, fixedCost: -10 })
  const d = leverDelta(base, scenario)
  close(d.netProfit, scenario.profit.netProfit - base.profit.netProfit, 0.01)
  assert.ok(d.netProfit > 0)
  assert.ok(d.leak < 0)
})

test('zeroed levers reproduce the base numbers exactly', () => {
  const base = computeMetrics(HOTEL)
  const same = applyLevers(HOTEL, DEFAULT_LEVERS)
  close(same.profit.netProfit, base.profit.netProfit, 0.001)
  close(same.revenue.netRevenue, base.revenue.netRevenue, 0.001)
})

/* --------------------------------------------------------- recommendations */

test('recommendations come from the numbers, and only from the numbers', () => {
  const m = computeMetrics(HOTEL)
  const recs = buildRecommendations(m)
  assert.ok(recs.length > 0)
  assert.ok(recs.length <= 6)
  assert.ok(recs.some((r) => /commission/i.test(r.title)))
  assert.ok(recs.some((r) => /enquiries/i.test(r.title)))
  for (const r of recs) {
    assert.ok(r.title.length > 0)
    assert.ok(r.body.length > 0)
    assert.ok(['ember', 'sky', 'mint', 'red'].includes(r.tone))
    assert.ok(Number.isFinite(r.impact))
  }
})

test('an unreachable break-even is reported as such, not as "little room"', () => {
  // billing exists (F&B), but a unit contributes nothing, so break-even is ∞
  const m = computeMetrics({ ...HOTEL, price: 0, otherRevenue: 45000 })
  assert.ok(m.revenue.grossRevenue > 0)
  assert.equal(Number.isFinite(m.breakEven.units), false)
  const titles = buildRecommendations(m).map((r) => r.title)
  assert.ok(titles.includes('No break-even exists at these numbers'))
  assert.equal(titles.includes('Very little room above break-even'), false)
  // and no recommendation may print an infinity as if it were a number
  for (const r of buildRecommendations(m)) {
    assert.equal(r.body.includes('∞'), false, `recommendation prints an infinity: ${r.title}`)
    assert.equal(r.body.includes('Infinity'), false)
  }
})

test('a loss-making month says so', () => {
  const m = computeMetrics({ ...HOTEL, price: 900, otherRevenue: 0 })
  const recs = buildRecommendations(m)
  assert.ok(recs.some((r) => /break-even/i.test(r.title)))
})

/* ------------------------------------------------------------ output forms */

test('summary text and CSV carry the same headline numbers', () => {
  const m = computeMetrics(HOTEL)
  const text = buildSummary(m)
  assert.match(text, /Net profit: ₹1,00,303/)
  assert.match(text, /Total leak: ₹1,61,963/)
  assert.match(text, /Break-even: 160 room nights/)
  assert.match(text, /not accounting or tax advice/)

  const csv = toCSV(m)
  const lines = csv.split('\n')
  assert.equal(lines[0], 'Line,Amount (INR),Note')
  assert.ok(csv.includes('Net profit,100303'))
  assert.ok(csv.includes('Retained in the business,60303'))
  assert.equal(lines.length, 27) // header + 26 line items
})

test('CSV rows stay well formed and negative money is marked as a deduction', () => {
  const m = computeMetrics(HOTEL)
  const csv = toCSV(m)
  assert.ok(csv.includes('Staff & salaries,-120000,fixed'))
  assert.ok(csv.includes('Rent & property,-65000,fixed'))
  // labels containing commas must be quoted, or the columns shift
  assert.ok(csv.includes('"Electricity, water, internet",-18000,fixed'))
  assert.ok(csv.includes('"Accountant, licences, misc",-6000,fixed'))
  for (const line of csv.split('\n')) {
    const fields = parseCsvRow(line)
    assert.equal(fields.length, 3, `row is not three fields: ${line}`)
  }
})

/** Minimal RFC-4180 reader, so the test checks the file and not a guess about it. */
function parseCsvRow(line) {
  const out = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"'
        i += 1
      } else if (ch === '"') {
        quoted = false
      } else {
        cur += ch
      }
    } else if (ch === '"') {
      quoted = true
    } else if (ch === ',') {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}

/* ------------------------------------------------------------ quick tools */

test('quickBreakEven: 100k fixed, ₹1,000 price, 40% variable, 20% deductions', () => {
  const r = quickBreakEven({ price: 1000, variablePct: 40, fixed: 100000, deductionPct: 20 })
  close(r.contribution, 400, 0.001)
  close(r.units, 250, 0.001)
  close(r.revenue, 250000)
  close(r.perDay, 8.33, 0.01)
  assert.equal(r.feasible, true)
})

test('quickBreakEven: no contribution means no break-even', () => {
  const r = quickBreakEven({ price: 100, variablePct: 100, fixed: 50000 })
  assert.equal(r.feasible, false)
  assert.equal(Number.isFinite(r.units), false)
})

test('quickPricing: cost ₹300, 30% margin, 18% platform deduction', () => {
  const r = quickPricing({ cost: 300, marginPct: 30, deductionPct: 18 })
  close(r.price, 522.6, 0.05) // 300 ÷ (0.82 × 0.70)
  close(r.profit, 128.53, 0.05) // 522.6 × 0.82 − 300
  close(r.deductionCost, 94.07, 0.05)
  close(r.markupOnCost, 74.2, 0.1)
})

test('quickPricing: a 100% margin demand is refused, not faked', () => {
  const r = quickPricing({ cost: 300, marginPct: 100 })
  assert.equal(r.feasible, false)
  assert.equal(Number.isFinite(r.price), false)
})

test('quickEnquiryValue: what an ignored enquiry costs', () => {
  const r = quickEnquiryValue({
    enquiries: 200,
    replyRate: 50,
    conversion: 10,
    price: 2000,
    contributionPct: 40,
  })
  close(r.missed, 100)
  close(r.won, 10)
  close(r.billing, 20000)
  close(r.profit, 8000)
  close(r.perEnquiry, 100)
  close(r.perDay, 666.67, 0.01)
})

test('quick tools treat empty input as zero rather than NaN', () => {
  for (const r of [quickBreakEven(), quickPricing(), quickEnquiryValue()]) {
    for (const [k, v] of Object.entries(r)) {
      if (k === 'feasible') {
        assert.equal(typeof v, 'boolean')
      } else {
        assert.equal(typeof v, 'number', `${k} should be a number`)
        assert.equal(Number.isNaN(v), false, `${k} should not be NaN`)
      }
    }
  }
})

/* ------------------------------------------------------------- every type - */

test('every business preset produces finite, self-consistent numbers', () => {
  for (const t of BUSINESS_TYPES) {
    const m = computeMetrics({ typeId: t.id, ...t.values })
    const values = [
      m.revenue.grossRevenue,
      m.revenue.netRevenue,
      m.deductions.total,
      m.costs.grossProfit,
      m.profit.netProfit,
      m.profit.netMargin,
      m.unit.contributionPerUnit,
      m.target.gap,
    ]
    for (const v of values) {
      assert.equal(Number.isFinite(v), true, `${t.id} produced a non-finite figure`)
    }
    // identity: gross − deductions = net revenue
    close(m.revenue.grossRevenue - m.deductions.total, m.revenue.netRevenue, 0.01)
    // identity: net revenue − cogs = gross profit
    close(m.revenue.netRevenue - m.costs.cogs, m.costs.grossProfit, 0.01)
    // identity: gross profit − fixed − depreciation − tax = net profit
    close(
      m.costs.grossProfit - m.costs.fixedTotal - m.costs.depreciation - m.profit.tax,
      m.profit.netProfit,
      0.01,
    )
    assert.equal(buildSummary(m).length > 200, true)
    assert.ok(toCSV(m).includes('Net profit,'))
  }
})

test('an empty form is not diagnosed — it is simply waiting for numbers', () => {
  const empty = computeMetrics({ typeId: 'hotel' })
  assert.equal(empty.revenue.grossRevenue, 0)
  assert.equal(empty.verdict.tone, 'ink')
  assert.equal(empty.verdict.label, 'Waiting for numbers')
  assert.equal(empty.profit.netProfit, 0)
  assert.equal(empty.profit.netMargin, 0)
  /* No NaN anywhere, and the only non-finite or null values are the ones the
     interface already labels ("Not available", "Not reachable"). */
  const offenders = []
  const allowedNull = /^target\.routes\[\d+\]\.(value|asPct|capped)$/
  const walk = (node, path) => {
    if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${path}[${i}]`))
    if (node && typeof node === 'object') {
      return Object.entries(node).forEach(([k, v]) => walk(v, path ? `${path}.${k}` : k))
    }
    if (typeof node === 'number') {
      if (Number.isNaN(node)) offenders.push(`${path} is NaN`)
      if (!Number.isFinite(node) && path !== 'breakEven.units') {
        offenders.push(`${path} is not finite`)
      }
    }
    if (node === null && !allowedNull.test(path)) offenders.push(`${path} is null`)
  }
  walk(empty, '')
  assert.deepEqual(offenders, [])
  assert.equal(Number.isFinite(empty.breakEven.units), false)
  assert.equal(empty.breakEven.reached, false)
  assert.equal(buildRecommendations(empty).length, 0)
})
