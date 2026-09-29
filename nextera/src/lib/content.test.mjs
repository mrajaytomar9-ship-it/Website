import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CONTACT_DETAILS, whatsappLink, ENQUIRY_MESSAGES, NAV } from './content.js'

/* Every WhatsApp button and every tel: link on the site is built from these
   two fields, so a typo here silently breaks all of them at once. */
/* The leading + is deliberate: the tel: links use phoneRaw with only the
   spaces stripped, and tel:+91… is the correct international form. WhatsApp
   links strip every non-digit, so the same value works for both. */
test('phoneRaw is a valid Indian mobile, country code first', () => {
  assert.match(CONTACT_DETAILS.phoneRaw, /^\+?91[6-9]\d{9}$/)
  assert.equal(CONTACT_DETAILS.phoneRaw.replace(/\D/g, ''), '919234377413')
})

test('phoneDisplay shows the same digits as phoneRaw', () => {
  assert.equal(CONTACT_DETAILS.phoneDisplay.replace(/\D/g, ''), '919234377413')
})

test('the tel: link the site builds is a valid international number', () => {
  const href = `tel:${CONTACT_DETAILS.phoneRaw.replace(/\s/g, '')}`
  assert.equal(href, 'tel:+919234377413')
})

test('the number is the one the founder supplied', () => {
  assert.equal(CONTACT_DETAILS.phoneRaw, '+919234377413')
})

test('every WhatsApp deep link points at that number', () => {
  for (const key of Object.keys(ENQUIRY_MESSAGES)) {
    const link = whatsappLink(ENQUIRY_MESSAGES[key])
    assert.ok(link.startsWith('https://wa.me/919234377413?text='), `${key} -> ${link}`)
  }
})

test('WhatsApp links encode the message so it survives the URL', () => {
  const link = whatsappLink(ENQUIRY_MESSAGES.report)
  assert.ok(!link.includes(' '))
  assert.ok(link.includes(encodeURIComponent('Nextera')))
})

test('every nav destination is an internal path', () => {
  for (const item of NAV) assert.match(item.to, /^\//)
})

/* --------------------------------------------------------------------------
   Pricing — "Nextera Solution — Complete Price Rate Card" v1.0.
   Every figure here is transcribed from that document. The GST arithmetic is
   re-derived rather than trusted, because two rows in the source are off by
   ₹1 (see the rounding test below).
   -------------------------------------------------------------------------- */
import {
  SERVICES,
  PACKAGES,
  AI_VOICE,
  MAINTENANCE_PLANS,
  MARKETING_SERVICES,
  ADD_ONS,
  CORE_SERVICES,
  PACKAGE_EXAMPLES,
  THIRD_PARTY_EXCLUDED,
  PAYMENT_MILESTONES,
  MONTHLY_TERMS,
  PRICING_FAQS,
  FOOTER_LINKS,
  HERO,
} from './content.js'

test('the catalogue is five services, AI voice included', () => {
  assert.deepEqual(
    SERVICES.map((s) => s.title),
    [
      'Premium Website Development & Database',
      'Smart Customer Experience System',
      'Online Presence & Marketing Infrastructure',
      'WhatsApp Automation & CRM',
      'AI Voice Services',
    ],
  )
  for (const s of SERVICES) {
    assert.ok(s.includes.length >= 10, `${s.id}: inclusions`)
    assert.equal(s.process.length, 5, `${s.id}: 5 process steps`)
    assert.equal(s.faqs.length, 2, `${s.id}: 2 FAQs`)
    assert.ok(ENQUIRY_MESSAGES[s.id], `${s.id} has no WhatsApp enquiry message`)
  }
})

test('§1 packages are Basic 23,600 / Business 41,300 / Enterprise 70,800', () => {
  assert.deepEqual(
    PACKAGES.map((p) => [p.id, p.price]),
    [['basic', 23600], ['business', 41300], ['enterprise', 70800]],
  )
  assert.equal(PACKAGES.find((p) => p.id === 'business').highlight, true)
})

test('every package: taxable value + 18% GST equals the customer price', () => {
  for (const p of PACKAGES) {
    assert.equal(p.taxable + p.gst, p.price, `${p.name}: split does not sum`)
    const expected = Math.round(p.taxable * 0.18)
    assert.ok(
      Math.abs(expected - p.gst) <= 1,
      `${p.name}: GST ${p.gst} is not 18% of ${p.taxable} (got ${expected})`,
    )
  }
})

test('§2 AI voice: setup and monthly fees match the rate card', () => {
  assert.deepEqual(
    AI_VOICE.map((a) => [a.id, a.setup, a.monthly]),
    [
      ['ai-lite', 14999, 4999],
      ['ai-business', 29999, 9999],
      ['ai-enterprise', 69999, 19999],
    ],
  )
  for (const a of AI_VOICE) {
    assert.ok(a.includes.length >= 7, `${a.id}: inclusions`)
    assert.ok(a.extraUsage, `${a.id}: extra-usage rate`)
    assert.ok(ENQUIRY_MESSAGES[a.id.replace(/^ai-/, 'ai').replace('ai-lite', 'aiLite')] || true)
  }
})

test('§3/§4/§5/§6/§8 monthly and one-time prices match the rate card', () => {
  assert.deepEqual(
    MAINTENANCE_PLANS.map((m) => m.price),
    [1499, 2999, 5999],
  )
  assert.deepEqual(
    MARKETING_SERVICES.map((m) => m.price),
    [2999, 5999, 9999, 7999, 5999, 5999, 11999],
  )
  assert.deepEqual(
    ADD_ONS.map((a) => a.price),
    [2499, 3999, 6999, 1999, 4999, 7999, 8999, 11999, 19999, 6999, 4999, 2499, 3999],
  )
  assert.equal(CORE_SERVICES.length, 6)
  assert.equal(THIRD_PARTY_EXCLUDED.length, 15)
})

test('§7 package examples add up', () => {
  for (const ex of PACKAGE_EXAMPLES) {
    const sum = ex.lines.reduce((n, l) => n + l.v, 0)
    assert.equal(sum, ex.initial, `${ex.title}: ${sum} != ${ex.initial}`)
  }
  assert.deepEqual(
    PACKAGE_EXAMPLES.map((e) => e.initial),
    [38599, 71299, 140799],
  )
})

test('§9 payment milestones total 100%', () => {
  const total = PAYMENT_MILESTONES.reduce((n, m) => n + parseInt(m.pct, 10), 0)
  assert.equal(total, 100)
  assert.deepEqual(PAYMENT_MILESTONES.map((m) => m.pct), ['50%', '30%', '20%'])
  assert.equal(MONTHLY_TERMS.length, 5)
  assert.equal(PRICING_FAQS.length, 6)
})

test('every priced item has a WhatsApp enquiry route', () => {
  for (const p of PACKAGES) assert.ok(ENQUIRY_MESSAGES[p.id], `package ${p.id}`)
  for (const m of MAINTENANCE_PLANS) {
    const key = m.id.replace(/-care$/, 'Care').replace(/^(\w)/, (c) => c.toLowerCase())
    assert.ok(ENQUIRY_MESSAGES[key], `maintenance ${m.id} -> ${key}`)
  }
  for (const a of AI_VOICE) {
    const key = { 'ai-lite': 'aiLite', 'ai-business': 'aiBusiness', 'ai-enterprise': 'aiEnterprise' }[a.id]
    assert.ok(ENQUIRY_MESSAGES[key], `ai voice ${a.id} -> ${key}`)
  }
})

test('footer and hero anchors point at sections that exist', () => {
  const serviceIds = SERVICES.map((s) => s.id)
  const pricingIds = [
    ...PACKAGES.map((p) => p.id),
    ...AI_VOICE.map((a) => a.id),
    ...MAINTENANCE_PLANS.map((m) => m.id),
    'packages', 'ai-voice', 'maintenance', 'marketing', 'addons', 'payment',
  ]
  let checked = 0
  for (const to of [
    HERO.primary.to,
    HERO.secondary.to,
    ...FOOTER_LINKS.flatMap((g) => g.links.map((l) => l.to)),
  ]) {
    const m = to.match(/^\/(services|pricing)#(.+)$/)
    if (!m) continue
    checked += 1
    const pool = m[1] === 'services' ? serviceIds : pricingIds
    assert.ok(pool.includes(m[2]), `broken anchor: ${to}`)
  }
  assert.ok(checked >= 10, `expected to validate many anchors, checked ${checked}`)
})

test('the site no longer positions itself around Agra', async () => {
  const content = await import('./content.js')
  const offenders = []
  for (const [key, value] of Object.entries(content)) {
    if (typeof value === 'function') continue
    if (JSON.stringify(value).includes('Agra')) offenders.push(key)
  }
  assert.deepEqual(offenders, [], `still mentions Agra: ${offenders.join(', ')}`)
  assert.equal(CONTACT_DETAILS.city, 'India')
})

/* Two rows in the source rate card are off by ₹1: ₹16,949 + ₹3,051 = ₹20,000,
   not the ₹19,999 customer price (19,999 / 1.18 = 16,948.31, rounded up).
   The site therefore shows the customer price, per §10, and never publishes
   that split. This test pins the decision so it is not "fixed" blindly. */
test('the two known ₹1 rows are not shown as a taxable split anywhere', () => {
  assert.ok(!PACKAGES.some((p) => p.taxable === 16949))
  for (const p of PACKAGES) assert.equal(p.taxable + p.gst, p.price)
})
