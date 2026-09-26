/* =============================================================================
   NEXTERA — FOUNDER CALCULATOR ENGINE
   -----------------------------------------------------------------------------
   Pure functions only: no React, no DOM, no side effects. Everything the
   /tools page displays is computed here so the maths can be read, tested and
   trusted independently of the interface.

   MODEL
   -----
   1. Volume        capacity × utilisation × period  →  billable units
   2. Billing       units × price + other revenue    →  gross revenue
   3. Deductions    platform commission, gateway, cancellations, discounts
                    (each a % of gross)             →  net revenue
   4. Missed demand enquiries nobody answered × conversion × price
                    — reported SEPARATELY, because it is revenue that was
                    never billed, not money taken out of money you billed.
   5. Costs         variable (COGS %) + fixed lines + depreciation
   6. Profit        gross profit → EBITDA → EBIT → tax → net profit → retained
   7. Break-even    cash fixed cost ÷ contribution per unit
   8. Gap           target net profit − actual, then four honest routes to it
   9. Levers        re-run the whole model with a "what if" change applied

   ASSUMPTIONS (stated on the page too)
   - Percentage costs scale with revenue; fixed costs do not.
   - Demand is assumed unchanged when price moves — real businesses lose some
     volume when they raise price, so treat price routes as an upper bound.
   - Estimates for planning, not accounting. Not tax or legal advice.
   ============================================================================= */

/* -------------------------------------------------------------------------- */
/* SMALL UTILITIES                                                             */
/* -------------------------------------------------------------------------- */

/** Accepts "₹1,200", "1200.5", "", null → finite number (0 when unusable). */
export function num(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value !== 'string') return 0
  const cleaned = value.replace(/[₹,\s]/g, '').replace(/[^0-9.\-]/g, '')
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return 0
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) ? n : 0
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

/** Percentages are clamped to a sane range so a typo cannot invert the model. */
export function pct(value) {
  return clamp(num(value), 0, 100)
}

function sum(list) {
  return list.reduce((t, x) => t + x, 0)
}

const inrFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** ₹12,34,567 — Indian digit grouping, no decimals. */
export function formatINR(value, { sign = false } = {}) {
  const n = num(value)
  const body = `₹${inrFormatter.format(Math.abs(Math.round(n)))}`
  if (n < 0) return `−${body}`
  if (sign && n > 0) return `+${body}`
  return body
}

/** Compact Indian notation: ₹950 · ₹12.4K · ₹5.2L · ₹1.34Cr. */
export function formatCompactINR(value) {
  const n = Math.abs(num(value))
  const neg = num(value) < 0 ? '−' : ''
  if (n >= 1e7) return `${neg}₹${(n / 1e7).toFixed(2)}Cr`
  if (n >= 1e5) return `${neg}₹${(n / 1e5).toFixed(2)}L`
  if (n >= 1e3) return `${neg}₹${(n / 1e3).toFixed(1)}K`
  return `${neg}₹${Math.round(n)}`
}

export function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num(value))
}

export function formatPct(value, decimals = 1) {
  const n = num(value)
  if (!Number.isFinite(n)) return '—'
  return `${n.toFixed(decimals)}%`
}

/* -------------------------------------------------------------------------- */
/* BUSINESS TYPES — what the fields are called, and realistic starting numbers */
/* -------------------------------------------------------------------------- */

export const BUSINESS_TYPES = [
  {
    id: 'hotel',
    label: 'Hotel / Homestay',
    short: 'Hotel',
    icon: 'pin',
    unit: 'room night',
    blurb: 'OTA commission, occupancy, average daily rate, seasonality.',
    labels: {
      capacity: 'Rooms you can sell',
      price: 'Average rate per room night',
      otherRevenue: 'Other billing (F&B, extras)',
      onlineShare: 'Bookings through OTA / aggregators',
      commissionRate: 'OTA commission rate',
      cancellationRate: 'Cancellations & no-shows',
      cogsRate: 'Variable cost per booking',
    },
    hints: {
      capacity: 'Total sellable rooms, not beds.',
      price: 'Average realised rate, including all room types.',
      onlineShare: 'MakeMyTrip, Booking, Agoda, Goibibo, Airbnb…',
      cogsRate: 'Laundry, breakfast, amenities, housekeeping consumables.',
    },
    values: {
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
    },
  },
  {
    id: 'clinic',
    label: 'Clinic / Diagnostic',
    short: 'Clinic',
    icon: 'shield',
    unit: 'patient',
    blurb: 'Appointment slots, no-shows, aggregator commission, consumables.',
    labels: {
      capacity: 'Appointment slots per day',
      price: 'Average revenue per patient',
      otherRevenue: 'Procedures / diagnostics billing',
      onlineShare: 'Patients via aggregator apps',
      commissionRate: 'Aggregator commission rate',
      cancellationRate: 'No-shows & cancellations',
      cogsRate: 'Consumables per patient',
    },
    hints: {
      capacity: 'Every doctor’s chair, added together.',
      otherRevenue: 'Tests, procedures, pharmacy — billed on top.',
      onlineShare: 'Practo, Lybrate and similar listing platforms.',
      cogsRate: 'Gloves, kits, reagents, disposables.',
    },
    values: {
      volumeBasis: 'day',
      capacity: 32,
      utilisation: 68,
      daysOpen: 26,
      price: 750,
      otherRevenue: 90000,
      onlineShare: 20,
      commissionRate: 25,
      gatewayRate: 2,
      digitalDirectShare: 40,
      cancellationRate: 9,
      discountRate: 3,
      cogsRate: 18,
      staff: 140000,
      rent: 55000,
      utilities: 14000,
      marketing: 15000,
      software: 4000,
      maintenance: 6000,
      loanInterest: 18000,
      miscFixed: 5000,
      depreciation: 12000,
      ownerDraw: 60000,
      taxRate: 30,
      enquiries: 320,
      replyRate: 60,
      conversionRate: 18,
      targetNetProfit: 250000,
    },
  },
  {
    id: 'restaurant',
    label: 'Restaurant / Café',
    short: 'Restaurant',
    icon: 'spark',
    unit: 'bill',
    blurb: 'Covers, average bill, delivery-aggregator commission, food cost.',
    labels: {
      capacity: 'Covers you could serve per day',
      price: 'Average bill value',
      otherRevenue: 'Other billing (catering, events)',
      onlineShare: 'Orders via delivery aggregators',
      commissionRate: 'Aggregator commission rate',
      cancellationRate: 'Cancelled / returned orders',
      cogsRate: 'Food & packaging cost',
    },
    hints: {
      capacity: 'Seats × table turns, on a normal day.',
      onlineShare: 'Zomato, Swiggy and similar.',
      cogsRate: 'Raw food plus packaging — the number kitchens track.',
    },
    values: {
      volumeBasis: 'day',
      capacity: 90,
      utilisation: 55,
      daysOpen: 30,
      price: 420,
      otherRevenue: 0,
      onlineShare: 35,
      commissionRate: 27,
      gatewayRate: 2,
      digitalDirectShare: 60,
      cancellationRate: 4,
      discountRate: 8,
      cogsRate: 34,
      staff: 110000,
      rent: 70000,
      utilities: 26000,
      marketing: 10000,
      software: 3500,
      maintenance: 7000,
      loanInterest: 15000,
      miscFixed: 5000,
      depreciation: 8000,
      ownerDraw: 45000,
      taxRate: 25,
      enquiries: 180,
      replyRate: 50,
      conversionRate: 20,
      targetNetProfit: 180000,
    },
  },
  {
    id: 'coaching',
    label: 'Coaching / Institute',
    short: 'Coaching',
    icon: 'doc',
    unit: 'student',
    blurb: 'Active students, monthly fee, dropouts, teacher cost.',
    labels: {
      capacity: 'Student seats you can fill',
      price: 'Average fee per student per month',
      otherRevenue: 'Test series / material billing',
      onlineShare: 'Fees collected through platforms',
      commissionRate: 'Platform commission rate',
      cancellationRate: 'Dropouts & refunds',
      cogsRate: 'Material & platform cost per student',
    },
    hints: {
      capacity: 'Seats across all batches, at one time.',
      digitalDirectShare: 'Share of direct fees paid by card / gateway.',
    },
    values: {
      volumeBasis: 'month',
      capacity: 260,
      utilisation: 72,
      daysOpen: 30,
      price: 2200,
      otherRevenue: 25000,
      onlineShare: 12,
      commissionRate: 20,
      gatewayRate: 2,
      digitalDirectShare: 55,
      cancellationRate: 5,
      discountRate: 6,
      cogsRate: 12,
      staff: 150000,
      rent: 60000,
      utilities: 12000,
      marketing: 14000,
      software: 3000,
      maintenance: 4000,
      loanInterest: 8000,
      miscFixed: 4000,
      depreciation: 5000,
      ownerDraw: 50000,
      taxRate: 25,
      enquiries: 400,
      replyRate: 65,
      conversionRate: 22,
      targetNetProfit: 200000,
    },
  },
  {
    id: 'retail',
    label: 'Retail / Showroom',
    short: 'Retail',
    icon: 'layers',
    unit: 'order',
    blurb: 'Daily orders, average order value, marketplace commission, stock cost.',
    labels: {
      capacity: 'Orders you could fulfil per day',
      price: 'Average order value',
      otherRevenue: 'Other billing (services, installs)',
      onlineShare: 'Orders via marketplaces',
      commissionRate: 'Marketplace commission rate',
      cancellationRate: 'Returns, RTO & cancellations',
      cogsRate: 'Cost of goods sold',
    },
    hints: {
      onlineShare: 'Amazon, Flipkart, Meesho and similar.',
      cancellationRate: 'Include returned-to-origin shipping you absorb.',
    },
    values: {
      volumeBasis: 'day',
      capacity: 45,
      utilisation: 60,
      daysOpen: 28,
      price: 1150,
      otherRevenue: 0,
      onlineShare: 25,
      commissionRate: 15,
      gatewayRate: 2,
      digitalDirectShare: 70,
      cancellationRate: 6,
      discountRate: 7,
      cogsRate: 62,
      staff: 70000,
      rent: 48000,
      utilities: 9000,
      marketing: 8000,
      software: 2000,
      maintenance: 3000,
      loanInterest: 10000,
      miscFixed: 4000,
      depreciation: 3500,
      ownerDraw: 35000,
      taxRate: 25,
      enquiries: 220,
      replyRate: 60,
      conversionRate: 25,
      targetNetProfit: 120000,
    },
  },
  {
    id: 'service',
    label: 'Service / Agency',
    short: 'Service',
    icon: 'handshake',
    unit: 'client',
    blurb: 'Billable clients, average invoice, lead-source commission, delivery cost.',
    labels: {
      capacity: 'Clients you can serve per month',
      price: 'Average invoice value',
      otherRevenue: 'Retainers & add-ons',
      onlineShare: 'Clients from paid platforms',
      commissionRate: 'Platform commission rate',
      cancellationRate: 'Refunds & write-offs',
      cogsRate: 'Direct delivery cost',
    },
    hints: {
      cogsRate: 'Freelancers, subcontractors, direct project expenses.',
    },
    values: {
      volumeBasis: 'month',
      capacity: 26,
      utilisation: 75,
      daysOpen: 30,
      price: 18000,
      otherRevenue: 0,
      onlineShare: 20,
      commissionRate: 12,
      gatewayRate: 2,
      digitalDirectShare: 45,
      cancellationRate: 8,
      discountRate: 5,
      cogsRate: 18,
      staff: 130000,
      rent: 35000,
      utilities: 8000,
      marketing: 18000,
      software: 6000,
      maintenance: 2500,
      loanInterest: 12000,
      miscFixed: 5000,
      depreciation: 4000,
      ownerDraw: 70000,
      taxRate: 30,
      enquiries: 140,
      replyRate: 70,
      conversionRate: 25,
      targetNetProfit: 250000,
    },
  },
  {
    id: 'other',
    label: 'Something else',
    short: 'Custom',
    icon: 'target',
    unit: 'sale',
    blurb: 'Blank-ish starting point. Fill in your own numbers.',
    labels: {
      capacity: 'Units you could sell',
      price: 'Average price per unit',
      onlineShare: 'Sales through platforms',
      commissionRate: 'Platform commission rate',
      cogsRate: 'Variable cost per unit',
    },
    values: {
      volumeBasis: 'day',
      capacity: 100,
      utilisation: 50,
      daysOpen: 26,
      price: 500,
      otherRevenue: 0,
      onlineShare: 20,
      commissionRate: 15,
      gatewayRate: 2,
      digitalDirectShare: 40,
      cancellationRate: 4,
      discountRate: 4,
      cogsRate: 40,
      staff: 60000,
      rent: 30000,
      utilities: 8000,
      marketing: 6000,
      software: 1500,
      maintenance: 2500,
      loanInterest: 5000,
      miscFixed: 3000,
      depreciation: 3000,
      ownerDraw: 30000,
      taxRate: 25,
      enquiries: 150,
      replyRate: 60,
      conversionRate: 20,
      targetNetProfit: 100000,
    },
  },
]

export function getType(typeId) {
  return BUSINESS_TYPES.find((t) => t.id === typeId) || BUSINESS_TYPES[BUSINESS_TYPES.length - 1]
}

/** A fresh, blank set of values for a type (every field present). */
export function presetValues(typeId) {
  return { ...getType(typeId).values }
}

/** Field label for a type — falls back to the generic label. */
export function labelFor(field, type) {
  return (type && type.labels && type.labels[field.k]) || field.label
}

export function hintFor(field, type) {
  return (type && type.hints && type.hints[field.k]) || field.hint || ''
}

/* -------------------------------------------------------------------------- */
/* FORM SCHEMA — drives the whole calculator UI                                */
/* -------------------------------------------------------------------------- */

export const FIELD_GROUPS = [
  {
    id: 'volume',
    n: '01',
    title: 'Your revenue engine',
    note: 'How much you could sell, and how much of that you actually sell.',
    fields: [
      { k: 'capacity', label: 'Sellable units', type: 'int', min: 0 },
      {
        k: 'utilisation',
        label: 'How much of that you actually sell',
        type: 'pct',
        hint: 'Occupancy for a hotel, slot fill for a clinic, seat turns for a restaurant.',
      },
      { k: 'volumeBasis', label: 'Those units are counted', type: 'basis' },
      { k: 'daysOpen', label: 'Working days in the month', type: 'int', min: 1, max: 31 },
      { k: 'price', label: 'Average price per unit', type: 'money', min: 0 },
      {
        k: 'otherRevenue',
        label: 'Other billing in the month',
        type: 'money',
        min: 0,
        hint: 'Anything billed that is not units × price.',
      },
    ],
  },
  {
    id: 'channels',
    n: '02',
    title: 'Where the bookings come from',
    note: 'Every platform takes a cut. This is usually the largest silent leak.',
    fields: [
      { k: 'onlineShare', label: 'Share via platforms / aggregators', type: 'pct' },
      { k: 'commissionRate', label: 'Commission those platforms charge', type: 'pct' },
      { k: 'gatewayRate', label: 'Payment gateway fee', type: 'pct' },
      {
        k: 'digitalDirectShare',
        label: 'Direct payments taken by card / gateway',
        type: 'pct',
        hint: 'UPI is usually free; cards run around 2%.',
      },
    ],
  },
  {
    id: 'shrinkage',
    n: '03',
    title: 'What you bill but never keep',
    note: 'Cancellations and discounts are revenue that arrives and then leaves.',
    fields: [
      { k: 'cancellationRate', label: 'Cancellations, no-shows, returns', type: 'pct' },
      { k: 'discountRate', label: 'Discounts & freebies given', type: 'pct' },
    ],
  },
  {
    id: 'demand',
    n: '04',
    title: 'Enquiries you did not convert',
    note: 'Revenue that never reached the bill — measured separately, never hidden inside profit.',
    fields: [
      { k: 'enquiries', label: 'Enquiries received in the month', type: 'int', min: 0 },
      {
        k: 'replyRate',
        label: 'Answered properly, same day',
        type: 'pct',
        hint: 'Answered by a human with a real answer — not a forwarded message nobody read.',
      },
      { k: 'conversionRate', label: 'Of those answered, how many buy', type: 'pct' },
    ],
  },
  {
    id: 'variable',
    n: '05',
    title: 'Cost of delivering the work',
    note: 'Costs that rise and fall with how much you sell.',
    fields: [
      {
        k: 'cogsRate',
        label: 'Variable cost, as a share of what you keep',
        type: 'pct',
        hint: 'Material, consumables, packaging, direct delivery.',
      },
    ],
  },
  {
    id: 'fixed',
    n: '06',
    title: 'What it costs to open the shutter',
    note: 'Due every month whether you sell one unit or a hundred.',
    fields: [
      { k: 'staff', label: 'Staff & salaries', type: 'money', min: 0 },
      { k: 'rent', label: 'Rent & property', type: 'money', min: 0 },
      { k: 'utilities', label: 'Electricity, water, internet', type: 'money', min: 0 },
      { k: 'marketing', label: 'Marketing & advertising', type: 'money', min: 0 },
      { k: 'software', label: 'Software & subscriptions', type: 'money', min: 0 },
      { k: 'maintenance', label: 'Repairs & maintenance', type: 'money', min: 0 },
      { k: 'loanInterest', label: 'Loan interest / EMI interest', type: 'money', min: 0 },
      { k: 'miscFixed', label: 'Accountant, licences, misc', type: 'money', min: 0 },
    ],
  },
  {
    id: 'owner',
    n: '07',
    title: 'Depreciation, tax & you',
    note: 'The lines most rough calculations forget — and the ones that decide the real number.',
    fields: [
      { k: 'depreciation', label: 'Depreciation (per month)', type: 'money', min: 0 },
      { k: 'taxRate', label: 'Effective tax on profit', type: 'pct' },
      { k: 'ownerDraw', label: 'What you pay yourself each month', type: 'money', min: 0 },
    ],
  },
  {
    id: 'target',
    n: '08',
    title: 'The number you actually want',
    note: 'Set a target and the calculator works out the gap, and four ways to close it.',
    fields: [{ k: 'targetNetProfit', label: 'Target monthly net profit', type: 'money', min: 0 }],
  },
]

export const LEVERS = [
  {
    k: 'recoverLeak',
    label: 'Recover platform & discount leaks',
    unit: '%',
    max: 100,
    step: 5,
    hint: 'Renegotiate commission, move repeat guests to direct, stop blanket discounting.',
  },
  {
    k: 'otaShift',
    label: 'Move bookings from platforms to direct',
    unit: 'points',
    max: 100,
    step: 5,
    hint: 'Percentage points of your billing moved off the aggregators.',
  },
  {
    k: 'price',
    label: 'Change your average price',
    unit: '%',
    max: 40,
    min: -30,
    step: 1,
    hint: 'Assumes demand holds — treat the result as an upper bound.',
  },
  {
    k: 'fixedCost',
    label: 'Change fixed monthly cost',
    unit: '%',
    max: 30,
    min: -40,
    step: 1,
    hint: 'Negative removes cost. Applies to every fixed line.',
  },
  {
    k: 'replyRate',
    label: 'Answer more enquiries, same day',
    unit: 'points',
    max: 100,
    step: 5,
    hint: 'Percentage points added to the share you answer properly.',
  },
]

export const DEFAULT_LEVERS = { recoverLeak: 0, otaShift: 0, price: 0, fixedCost: 0, replyRate: 0 }

/* -------------------------------------------------------------------------- */
/* NORMALISATION                                                               */
/* -------------------------------------------------------------------------- */

/** Turns whatever the form holds (strings, blanks, commas) into clean numbers. */
export function normalize(raw = {}) {
  const known = BUSINESS_TYPES.some((t) => t.id === raw.typeId)
  const typeId = known ? raw.typeId : 'other'
  const i = { typeId }
  for (const group of FIELD_GROUPS) {
    for (const f of group.fields) {
      if (f.type === 'basis') {
        i[f.k] = raw[f.k] === 'month' ? 'month' : 'day'
      } else if (f.type === 'pct') {
        i[f.k] = pct(raw[f.k])
      } else {
        i[f.k] = Math.max(f.min ?? 0, num(raw[f.k]))
      }
    }
  }
  i.daysOpen = clamp(i.daysOpen || 0, 0, 31)
  return i
}

/* -------------------------------------------------------------------------- */
/* THE MODEL                                                                   */
/* -------------------------------------------------------------------------- */

export function computeMetrics(raw) {
  const i = normalize(raw)
  const type = getType(i.typeId)

  /* --- 1. volume ------------------------------------------------------- */
  const periodFactor = i.volumeBasis === 'month' ? 1 : i.daysOpen
  const potentialUnits = i.capacity * periodFactor
  const units = (potentialUnits * i.utilisation) / 100
  const grossFromUnits = units * i.price
  const grossRevenue = grossFromUnits + i.otherRevenue

  /* --- 2. channels & deductions ---------------------------------------- */
  const onlineRevenue = (grossRevenue * i.onlineShare) / 100
  const directRevenue = grossRevenue - onlineRevenue
  const commission = (onlineRevenue * i.commissionRate) / 100
  const digitalDirect = (directRevenue * i.digitalDirectShare) / 100
  const gateway = ((onlineRevenue + digitalDirect) * i.gatewayRate) / 100
  const cancellations = (grossRevenue * i.cancellationRate) / 100
  const discounts = (grossRevenue * i.discountRate) / 100
  const deductions = commission + gateway + cancellations + discounts
  const netRevenue = grossRevenue - deductions
  const deductionRate = grossRevenue > 0 ? deductions / grossRevenue : 0

  const leaks = [
    {
      k: 'commission',
      label: type.id === 'hotel' ? 'OTA / aggregator commission' : 'Platform commission',
      amount: commission,
      tone: 'ember',
    },
    { k: 'gateway', label: 'Payment gateway fee', amount: gateway, tone: 'sky' },
    { k: 'cancellation', label: 'Cancellations, no-shows, returns', amount: cancellations, tone: 'red' },
    { k: 'discount', label: 'Discounts & freebies', amount: discounts, tone: 'ember' },
  ]
    .map((l) => ({
      ...l,
      share: grossRevenue > 0 ? (l.amount / grossRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  /* --- 3. missed demand (never billed) --------------------------------- */
  const unanswered = i.enquiries * (1 - i.replyRate / 100)
  const missedUnits = (unanswered * i.conversionRate) / 100
  const missedRevenue = missedUnits * i.price
  const spareUnits = Math.max(0, potentialUnits - units)
  const servableMissedUnits = Math.min(missedUnits, spareUnits)
  const servableMissedRevenue = servableMissedUnits * i.price

  /* --- 4. costs -------------------------------------------------------- */
  const cogs = (netRevenue * i.cogsRate) / 100
  const grossProfit = netRevenue - cogs

  const fixedLines = [
    { k: 'staff', label: 'Staff & salaries', amount: i.staff },
    { k: 'rent', label: 'Rent & property', amount: i.rent },
    { k: 'utilities', label: 'Electricity, water, internet', amount: i.utilities },
    { k: 'marketing', label: 'Marketing & advertising', amount: i.marketing },
    { k: 'software', label: 'Software & subscriptions', amount: i.software },
    { k: 'maintenance', label: 'Repairs & maintenance', amount: i.maintenance },
    { k: 'loanInterest', label: 'Loan interest', amount: i.loanInterest },
    { k: 'miscFixed', label: 'Accountant, licences, misc', amount: i.miscFixed },
  ].sort((a, b) => b.amount - a.amount)

  const fixedTotal = sum(fixedLines.map((f) => f.amount))
  const ebitda = grossProfit - fixedTotal
  const operatingProfit = ebitda - i.depreciation
  const tax = Math.max(0, operatingProfit) * (i.taxRate / 100)
  const netProfit = operatingProfit - tax
  const retained = netProfit - i.ownerDraw

  /* --- 5. margins ------------------------------------------------------ */
  const margin = (v) => (netRevenue > 0 ? (v / netRevenue) * 100 : 0)
  const grossMargin = margin(grossProfit)
  const operatingMargin = margin(operatingProfit)
  const netMargin = margin(netProfit)
  const retainedMargin = margin(retained)
  const leakRate = grossRevenue > 0 ? (deductions / grossRevenue) * 100 : 0

  /* --- 6. unit economics ------------------------------------------------
     Contribution is measured MARGINALLY — what one more unit actually adds —
     not by spreading the whole month's deductions across the units sold.
     Average and marginal differ whenever there is revenue that is not
     units × price (hotel F&B, clinic procedures), and marginal is the number
     a decision needs.                                                     */
  const contributionRate = (1 - deductionRate) * (1 - i.cogsRate / 100)
  const contributionPerUnit = i.price * contributionRate
  const deductionPerUnit = i.price * deductionRate
  const variablePerUnit = i.price * (1 - deductionRate) * (i.cogsRate / 100)
  const avgRevenuePerUnit = units > 0 ? grossRevenue / units : 0
  const avgNetProfitPerUnit = units > 0 ? netProfit / units : 0
  const otherContribution = i.otherRevenue * contributionRate

  /* --- 7. break-even --------------------------------------------------- */
  // Depreciation is non-cash, so it is not part of the cash cost base.
  const cashFixed = fixedTotal
  const fixedAfterOtherRevenue = cashFixed - otherContribution
  const breakEvenUnits =
    contributionPerUnit > 0 ? Math.max(0, fixedAfterOtherRevenue) / contributionPerUnit : Number.POSITIVE_INFINITY
  const breakEvenUtilisation = potentialUnits > 0 ? (breakEvenUnits / potentialUnits) * 100 : 0
  const breakEvenRevenue = Number.isFinite(breakEvenUnits) ? breakEvenUnits * i.price : 0
  /* When break-even is unreachable there is no "room above it" to report —
     report zero rather than an infinity the interface would have to catch. */
  const safetyUnits = Number.isFinite(breakEvenUnits) ? units - breakEvenUnits : 0
  const safetyPct = Number.isFinite(breakEvenUnits) && units > 0 ? (safetyUnits / units) * 100 : 0

  /* --- 8. gap to target ------------------------------------------------ */
  const target = i.targetNetProfit
  const gap = target - netProfit
  const afterTax = 1 - i.taxRate / 100
  const profitPerRupeeOfPrice = contributionRate * afterTax

  const routes = [
    {
      k: 'units',
      label: `Sell more ${type.unit}s`,
      detail:
        contributionPerUnit > 0
          ? `Each extra ${type.unit} adds ${formatINR(contributionPerUnit * afterTax)} after tax.`
          : `An extra ${type.unit} does not cover its own cost yet — fix contribution first.`,
      value: contributionPerUnit > 0 ? gap / (contributionPerUnit * afterTax) : null,
      suffix: `extra ${type.unit}s / month`,
      feasible: contributionPerUnit > 0,
      note:
        contributionPerUnit > 0 && units > 0 && gap / (contributionPerUnit * afterTax) > spareUnits
          ? 'That is more than your unused capacity — you would need more rooms, slots or seats.'
          : '',
    },
    {
      k: 'price',
      label: 'Raise your average price',
      detail: 'Assumes customers keep buying at the new price.',
      value: units > 0 && profitPerRupeeOfPrice > 0 ? gap / (units * profitPerRupeeOfPrice) : null,
      suffix: 'more per unit',
      asPct:
        units > 0 && profitPerRupeeOfPrice > 0 && i.price > 0
          ? (gap / (units * profitPerRupeeOfPrice) / i.price) * 100
          : null,
      feasible: units > 0 && profitPerRupeeOfPrice > 0,
      note: '',
    },
    {
      k: 'cost',
      label: 'Take out fixed cost',
      detail: 'Rent, staffing, subscriptions, advertising — the lines due every month.',
      value: afterTax > 0 ? gap / afterTax : null,
      suffix: 'per month',
      feasible: afterTax > 0,
      note: '',
    },
    {
      k: 'direct',
      label: 'Move bookings off the platforms',
      detail: `Each point moved to direct saves ${formatINR(
        (grossRevenue / 100) * (i.commissionRate / 100) * afterTax,
      )} after tax.`,
      value:
        grossRevenue > 0 && i.commissionRate > 0
          ? gap / ((grossRevenue / 100) * (i.commissionRate / 100) * afterTax)
          : null,
      suffix: 'percentage points',
      feasible: grossRevenue > 0 && i.commissionRate > 0,
      note: '',
    },
  ].map((r) => {
    if (r.k === 'direct') {
      const beyond = r.value !== null && r.value > i.onlineShare
      return {
        ...r,
        capped: r.value === null ? null : Math.min(r.value, i.onlineShare),
        note: beyond
          ? `That is more than the ${formatPct(i.onlineShare, 0)} you currently send through platforms — this route alone cannot close the gap.`
          : r.note,
      }
    }
    return { ...r, capped: r.value }
  })

  /* --- 9. verdict ------------------------------------------------------ */
  const verdict =
    grossRevenue <= 0
      ? {
          tone: 'ink',
          label: 'Waiting for numbers',
          body: 'Enter your sellable units and your average price and the month will be counted here. Nothing is sent anywhere while you type.',
        }
      : verdictFor(netMargin, netProfit, breakEvenUtilisation, i.utilisation)

  return {
    input: i,
    type,
    volume: {
      capacity: i.capacity,
      potentialUnits,
      units,
      utilisation: i.utilisation,
      daysOpen: i.daysOpen,
      basis: i.volumeBasis,
      unit: type.unit,
      spareUnits,
    },
    revenue: {
      grossRevenue,
      grossFromUnits,
      otherRevenue: i.otherRevenue,
      onlineRevenue,
      directRevenue,
      netRevenue,
    },
    deductions: {
      commission,
      gateway,
      cancellations,
      discounts,
      total: deductions,
      rate: deductionRate * 100,
      leaks,
    },
    demand: {
      enquiries: i.enquiries,
      replyRate: i.replyRate,
      conversionRate: i.conversionRate,
      unanswered,
      missedUnits,
      missedRevenue,
      servableMissedUnits,
      servableMissedRevenue,
      capacityBlocked: missedUnits > spareUnits,
    },
    costs: {
      cogs,
      cogsRate: i.cogsRate,
      grossProfit,
      fixedLines,
      fixedTotal,
      depreciation: i.depreciation,
      ownerDraw: i.ownerDraw,
    },
    profit: {
      ebitda,
      operatingProfit,
      tax,
      taxRate: i.taxRate,
      netProfit,
      retained,
      grossMargin,
      operatingMargin,
      netMargin,
      retainedMargin,
      leakRate,
    },
    unit: {
      price: i.price,
      contributionRate: contributionRate * 100,
      contributionPerUnit,
      deductionPerUnit,
      variablePerUnit,
      avgRevenuePerUnit,
      avgNetProfitPerUnit,
      otherContribution,
      profitPerRupeeOfPrice,
    },
    breakEven: {
      cashFixed,
      otherContribution,
      fixedAfterOtherRevenue,
      units: breakEvenUnits,
      revenue: breakEvenRevenue,
      utilisation: breakEvenUtilisation,
      safetyUnits,
      safetyPct,
      reached: Number.isFinite(breakEvenUnits) && units >= breakEvenUnits,
    },
    target: {
      target,
      gap,
      met: gap <= 0,
      routes,
    },
    perDay: {
      revenue: i.daysOpen > 0 ? netRevenue / i.daysOpen : 0,
      profit: i.daysOpen > 0 ? netProfit / i.daysOpen : 0,
    },
    verdict,
  }
}

function verdictFor(netMargin, netProfit, breakEvenUtilisation, utilisation) {
  if (netProfit < 0) {
    return {
      tone: 'red',
      label: 'Losing money',
      body: 'Every month at these numbers takes money out of the business. The first move is not marketing — it is the largest deduction and the largest fixed line.',
    }
  }
  if (netMargin < 8) {
    return {
      tone: 'ember',
      label: 'Razor thin',
      body: 'Profitable on paper, but one bad month, one renegotiated commission or one staff change wipes it out.',
    }
  }
  if (netMargin < 18) {
    return {
      tone: 'sky',
      label: 'Working, not safe',
      body: 'You are making money, but not enough cushion to invest or absorb a slow season.',
    }
  }
  if (netMargin < 30) {
    return {
      tone: 'mint',
      label: 'Healthy',
      body: 'A margin that can absorb a slow month and still fund improvement.',
    }
  }
  return {
    tone: 'mint',
    label: 'Strong',
    body:
      breakEvenUtilisation > 0 && utilisation - breakEvenUtilisation > 20
        ? 'Strong margin with real room above break-even. The constraint is demand, not cost.'
        : 'Strong margin. Check it is not the result of under-counting a cost line.',
  }
}

/* -------------------------------------------------------------------------- */
/* WHAT-IF LEVERS                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Re-runs the whole model with a change applied, so scenarios use exactly the
 * same maths as the base numbers rather than an approximation of it.
 */
export function applyLevers(raw, levers = {}) {
  const i = normalize(raw)
  const l = { ...DEFAULT_LEVERS, ...levers }

  const keep = 1 - clamp(num(l.recoverLeak), 0, 100) / 100
  const costFactor = 1 + clamp(num(l.fixedCost), -100, 500) / 100
  const priceFactor = 1 + clamp(num(l.price), -95, 1000) / 100

  const next = {
    ...i,
    commissionRate: i.commissionRate * keep,
    gatewayRate: i.gatewayRate * keep,
    cancellationRate: i.cancellationRate * keep,
    discountRate: i.discountRate * keep,
    price: i.price * priceFactor,
    onlineShare: clamp(i.onlineShare - clamp(num(l.otaShift), 0, 100), 0, 100),
    replyRate: clamp(i.replyRate + clamp(num(l.replyRate), 0, 100), 0, 100),
    staff: i.staff * costFactor,
    rent: i.rent * costFactor,
    utilities: i.utilities * costFactor,
    marketing: i.marketing * costFactor,
    software: i.software * costFactor,
    maintenance: i.maintenance * costFactor,
    loanInterest: i.loanInterest * costFactor,
    miscFixed: i.miscFixed * costFactor,
  }

  const metrics = computeMetrics(next)
  return metrics
}

export function leverDelta(base, scenario) {
  return {
    netProfit: scenario.profit.netProfit - base.profit.netProfit,
    netMargin: scenario.profit.netMargin - base.profit.netMargin,
    leak: scenario.deductions.total - base.deductions.total,
    missed: scenario.demand.servableMissedRevenue - base.demand.servableMissedRevenue,
  }
}

/* -------------------------------------------------------------------------- */
/* DIAGNOSIS — recommendations derived from the numbers, not from a script     */
/* -------------------------------------------------------------------------- */

export function buildRecommendations(metrics) {
  const { deductions, demand, profit, costs, breakEven, volume, type, revenue, input } = metrics
  const out = []
  const afterTax = 1 - input.taxRate / 100

  const largestLeak = deductions.leaks[0]
  if (largestLeak && largestLeak.amount > 0 && largestLeak.share >= 4) {
    out.push({
      tone: 'ember',
      title: `${largestLeak.label} is your biggest single leak`,
      body: `${formatINR(largestLeak.amount)} a month — ${formatPct(
        largestLeak.share,
      )} of everything you bill${
        largestLeak.k === 'commission'
          ? `, because ${formatPct(input.onlineShare, 0)} of your billing runs through platforms at ${formatPct(
              input.commissionRate,
              0,
            )}`
          : ''
      }. Repeat customers who book you directly cost a fraction of this.`,
      impact: largestLeak.amount * 0.25 * afterTax,
      impactLabel: 'recovering a quarter of it',
    })
  }

  if (demand.servableMissedRevenue > 0) {
    out.push({
      tone: demand.servableMissedRevenue > profit.netProfit * 0.35 ? 'red' : 'sky',
      title: `${formatNumber(demand.unanswered, 0)} enquiries a month get no proper answer`,
      body: `At your conversion rate that is ${formatINR(
        demand.servableMissedRevenue,
      )} of billing you never see${
        demand.capacityBlocked
          ? ' (capped at the capacity you still have free)'
          : ''
      }. This is the cheapest revenue available to you: it needs a reply path, not advertising.`,
      impact: demand.servableMissedRevenue * 0.3 * (1 - deductions.rate / 100) * (1 - input.cogsRate / 100) * afterTax,
      impactLabel: 'answering a third of them properly',
    })
  }

  if (input.cancellationRate >= 6 && deductions.cancellations > 0) {
    out.push({
      tone: 'sky',
      title: `Cancellations cost ${formatINR(deductions.cancellations)} a month`,
      body: `${formatPct(
        input.cancellationRate,
        0,
      )} of billing is cancelled, no-shows or returned. A deposit or confirmation step usually removes a third of it without losing a genuine customer.`,
      impact: deductions.cancellations * 0.33 * afterTax,
      impactLabel: 'cutting it by a third',
    })
  }

  if (input.discountRate >= 6 && deductions.discounts > 0) {
    out.push({
      tone: 'ember',
      title: `Discounting gives away ${formatINR(deductions.discounts)} a month`,
      body: `${formatPct(
        input.discountRate,
        0,
      )} of billing leaves as discount. Worth checking whether it is buying bookings you would have got anyway.`,
      impact: deductions.discounts * 0.25 * afterTax,
      impactLabel: 'halving the giveaway',
    })
  }

  if (revenue.netRevenue > 0 && costs.fixedLines[0] && costs.fixedLines[0].amount / revenue.netRevenue > 0.3) {
    out.push({
      tone: 'sky',
      title: `${costs.fixedLines[0].label} is ${formatPct(
        (costs.fixedLines[0].amount / revenue.netRevenue) * 100,
        0,
      )} of what you keep`,
      body: `${formatINR(
        costs.fixedLines[0].amount,
      )} a month against ${formatINR(
        revenue.netRevenue,
      )} of net revenue. It is your largest fixed line — the first place to look when the month is thin.`,
      impact: costs.fixedLines[0].amount * 0.1 * afterTax,
      impactLabel: 'taking 10% out',
    })
  }

  if (revenue.netRevenue > 0 && input.marketing / revenue.netRevenue > 0.08) {
    out.push({
      tone: 'ember',
      title: 'Advertising is expensive relative to what it returns',
      body: `${formatINR(input.marketing)} a month is ${formatPct(
        (input.marketing / revenue.netRevenue) * 100,
        0,
      )} of net revenue. Before spending more, check what one enquiry currently costs you and how many you answer.`,
      impact: input.marketing * 0.2 * afterTax,
      impactLabel: 'spending a fifth less for the same enquiries',
    })
  }

  /* Break-even advice, but only once there are real numbers to advise on. */
  if (revenue.grossRevenue > 0) {
    if (!Number.isFinite(breakEven.units)) {
      out.push({
        tone: 'red',
        title: 'No break-even exists at these numbers',
        body: `One ${type.unit} does not cover the leak and the variable cost attached to it, so volume cannot rescue the month. Price or cost has to move before selling more means anything.`,
        impact: Math.abs(profit.netProfit),
        impactLabel: 'the monthly shortfall',
      })
    } else if (!breakEven.reached) {
      out.push({
        tone: 'red',
        title: 'You are below break-even',
        body: `Break-even is ${formatNumber(breakEven.units, 0)} ${type.unit}s a month (${formatPct(
          breakEven.utilisation,
          0,
        )} utilisation). You are at ${formatNumber(volume.units, 0)}. That gap has to close on volume, price or fixed cost — not on hope.`,
        impact: Math.abs(profit.netProfit),
        impactLabel: 'the monthly shortfall',
      })
    } else if (breakEven.safetyPct < 15) {
      out.push({
        tone: 'ember',
        title: 'Very little room above break-even',
        body: `You clear break-even by ${formatNumber(
          breakEven.safetyUnits,
          0,
        )} ${type.unit}s — ${formatPct(
          breakEven.safetyPct,
          0,
        )} of what you sell. One slow fortnight puts you under.`,
        impact: 0,
        impactLabel: '',
      })
    }
  }

  if (profit.retained < 0) {
    out.push({
      tone: 'ember',
      title: 'The business does not cover your draw',
      body: `After tax the business makes ${formatINR(
        profit.netProfit,
      )}, and you take ${formatINR(
        costs.ownerDraw,
      )}. Either the draw is funded from savings or from a cost line you are not counting.`,
      impact: Math.abs(profit.retained),
      impactLabel: 'the monthly hole',
    })
  }

  return out.slice(0, 6)
}

/* -------------------------------------------------------------------------- */
/* OUTPUT — summary text and CSV                                               */
/* -------------------------------------------------------------------------- */

export function buildSummary(metrics) {
  const { type, revenue, deductions, costs, profit, volume, breakEven, target, demand } = metrics
  const lines = [
    `Nextera founder calculation — ${type.label}`,
    '',
    `Volume: ${formatNumber(volume.units, 0)} ${type.unit}s / month (${formatPct(
      volume.utilisation,
      0,
    )} of ${formatNumber(volume.potentialUnits, 0)})`,
    `Gross billing: ${formatINR(revenue.grossRevenue)}`,
    `Platform commission: ${formatINR(deductions.commission)}`,
    `Payment gateway: ${formatINR(deductions.gateway)}`,
    `Cancellations / no-shows: ${formatINR(deductions.cancellations)}`,
    `Discounts: ${formatINR(deductions.discounts)}`,
    `Total leak: ${formatINR(deductions.total)} (${formatPct(profit.leakRate)})`,
    `Net revenue: ${formatINR(revenue.netRevenue)}`,
    `Variable cost: ${formatINR(costs.cogs)}`,
    `Gross profit: ${formatINR(costs.grossProfit)} (${formatPct(profit.grossMargin)})`,
    `Fixed cost: ${formatINR(costs.fixedTotal)}`,
    `Depreciation: ${formatINR(costs.depreciation)}`,
    `Operating profit: ${formatINR(profit.operatingProfit)} (${formatPct(profit.operatingMargin)})`,
    `Tax: ${formatINR(profit.tax)}`,
    `Net profit: ${formatINR(profit.netProfit)} (${formatPct(profit.netMargin)})`,
    `After owner draw: ${formatINR(profit.retained)}`,
    '',
    `Break-even: ${formatNumber(breakEven.units, 0)} ${type.unit}s (${formatPct(
      breakEven.utilisation,
      0,
    )} utilisation)`,
    `Missed revenue from unanswered enquiries: ${formatINR(demand.servableMissedRevenue)}`,
    target.target > 0
      ? target.met
        ? `Target ${formatINR(target.target)} met, ${formatINR(Math.abs(target.gap))} ahead`
        : `Gap to target ${formatINR(target.target)}: ${formatINR(target.gap)} short`
      : 'No target set',
    '',
    'Estimate only — planning maths, not accounting or tax advice.',
  ]
  return lines.join('\n')
}

export function toCSV(metrics) {
  const rows = [
    ['Line', 'Amount (INR)', 'Note'],
    ['Business type', '', metrics.type.label],
    ['Units sold per month', metrics.volume.units.toFixed(1), metrics.type.unit],
    ['Gross billing', round(metrics.revenue.grossRevenue), ''],
    ['Platform commission', -round(metrics.deductions.commission), 'leak'],
    ['Payment gateway', -round(metrics.deductions.gateway), 'leak'],
    ['Cancellations & no-shows', -round(metrics.deductions.cancellations), 'leak'],
    ['Discounts', -round(metrics.deductions.discounts), 'leak'],
    ['Net revenue', round(metrics.revenue.netRevenue), ''],
    ['Variable cost (COGS)', -round(metrics.costs.cogs), ''],
    ['Gross profit', round(metrics.costs.grossProfit), `${metrics.profit.grossMargin.toFixed(1)}% of net revenue`],
    ...metrics.costs.fixedLines.map((f) => [f.label, -round(f.amount), 'fixed']),
    ['Depreciation', -round(metrics.costs.depreciation), 'non-cash'],
    ['Operating profit', round(metrics.profit.operatingProfit), `${metrics.profit.operatingMargin.toFixed(1)}%`],
    ['Tax', -round(metrics.profit.tax), `${metrics.profit.taxRate}% of profit`],
    ['Net profit', round(metrics.profit.netProfit), `${metrics.profit.netMargin.toFixed(1)}% of net revenue`],
    ['Owner draw', -round(metrics.costs.ownerDraw), ''],
    ['Retained in the business', round(metrics.profit.retained), ''],
    ['Break-even units', Number.isFinite(metrics.breakEven.units) ? metrics.breakEven.units.toFixed(1) : 'not reachable', metrics.type.unit],
    ['Missed revenue (unanswered enquiries)', round(metrics.demand.servableMissedRevenue), 'never billed'],
  ]

  return rows
    .map((r) =>
      r
        .map((cell) => {
          const s = String(cell)
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
        })
        .join(','),
    )
    .join('\n')
}

function round(n) {
  return Math.round(num(n))
}

/* -------------------------------------------------------------------------- */
/* QUICK TOOLS — three small, self-contained calculators                       */
/* -------------------------------------------------------------------------- */

/** Break-even: how many units before the month stops losing money. */
export function quickBreakEven({ price = 0, variablePct = 0, fixed = 0, deductionPct = 0 } = {}) {
  const p = Math.max(0, num(price))
  const v = (p * pct(variablePct)) / 100
  const d = (p * pct(deductionPct)) / 100
  const contribution = p - v - d
  const f = Math.max(0, num(fixed))
  const units = contribution > 0 ? f / contribution : Number.POSITIVE_INFINITY
  return {
    contribution,
    units,
    revenue: Number.isFinite(units) ? units * p : 0,
    feasible: Number.isFinite(units),
    perDay: Number.isFinite(units) ? units / 30 : 0,
  }
}

/** Pricing: what a price must be to land a target margin. */
export function quickPricing({ cost = 0, marginPct = 0, deductionPct = 0 } = {}) {
  const c = Math.max(0, num(cost))
  const requested = num(marginPct)
  const d = pct(deductionPct)

  /* A 100% margin is not a price, it is a wish — refuse it rather than
     returning a number that looks usable. */
  if (!(requested < 100)) {
    return { price: Number.POSITIVE_INFINITY, profit: 0, deductionCost: 0, markupOnCost: 0, feasible: false }
  }

  const m = Math.max(0, requested)
  // price × (1 − deductions) × (1 − margin) = cost
  const denominator = (1 - d / 100) * (1 - m / 100)
  const price = denominator > 0 ? c / denominator : Number.POSITIVE_INFINITY
  return {
    price,
    profit: Number.isFinite(price) ? price * (1 - d / 100) - c : 0,
    deductionCost: Number.isFinite(price) ? (price * d) / 100 : 0,
    markupOnCost: c > 0 && Number.isFinite(price) ? ((price - c) / c) * 100 : 0,
    feasible: Number.isFinite(price),
  }
}

/** Enquiry value: what one unanswered enquiry costs you. */
export function quickEnquiryValue({
  enquiries = 0,
  replyRate = 0,
  conversion = 0,
  price = 0,
  contributionPct = 0,
} = {}) {
  const e = Math.max(0, num(enquiries))
  const missed = e * (1 - pct(replyRate) / 100)
  const won = (missed * pct(conversion)) / 100
  const billing = won * Math.max(0, num(price))
  return {
    missed,
    won,
    billing,
    profit: (billing * clamp(num(contributionPct), 0, 100)) / 100,
    perEnquiry: e > 0 ? billing / e : 0,
    perDay: billing / 30,
  }
}
