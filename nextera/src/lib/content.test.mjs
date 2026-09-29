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
   Service catalogue & bundle pricing — Services & Pricing v1.1 (29 Sep 2026).
   These mirror the founder's document exactly; if it is revised, update both.
   -------------------------------------------------------------------------- */
import {
  SERVICES,
  PACKAGES,
  ADD_ONS,
  SUPPORT_PLANS,
  COMPONENT_VALUES,
  GROWTH_FRAMEWORK,
  PRICING_FAQS,
  PAYMENT_TERMS,
  WHAT_HAPPENS_NEXT,
  FOOTER_LINKS,
  HERO,
} from './content.js'

test('the catalogue is the four core services from the document', () => {
  assert.deepEqual(
    SERVICES.map((s) => s.title),
    [
      'Premium Website Development & Database',
      'Smart Customer Experience System',
      'Online Presence & Marketing Infrastructure',
      'WhatsApp Automation & CRM',
    ],
  )
})

test('every service carries its full detail set', () => {
  for (const s of SERVICES) {
    assert.equal(s.includes.length, 10, `${s.id}: 10 inclusions`)
    assert.equal(s.process.length, 5, `${s.id}: 5 process steps`)
    assert.equal(s.faqs.length, 2, `${s.id}: 2 FAQs`)
    assert.ok(s.audience.length >= 5, `${s.id}: who it is for`)
    assert.ok(s.lede && s.body, `${s.id}: lede + body`)
    assert.equal(s.startingPoint, 'Custom quote')
    assert.ok(
      ENQUIRY_MESSAGES[s.id],
      `${s.id} has no WhatsApp enquiry message`,
    )
  }
})

test('bundles are Silver 42,000 / Gold 85,000 / Platinum 1,05,000 one-time', () => {
  assert.deepEqual(
    PACKAGES.map((p) => [p.id, p.price, p.priceNote]),
    [
      ['silver', 42000, 'one-time'],
      ['gold', 85000, 'one-time'],
      ['platinum', 105000, 'one-time'],
    ],
  )
})

test('the stated list values and savings are the ones in the document', () => {
  const gold = PACKAGES.find((p) => p.id === 'gold')
  const plat = PACKAGES.find((p) => p.id === 'platinum')
  assert.equal(gold.highlight, true)
  assert.equal(gold.badge, 'Best value')
  assert.equal(gold.listValue, 91500)
  assert.equal(gold.save, 6500)
  assert.equal(gold.listValue - gold.save, gold.price)
  assert.equal(plat.listValue, 111500)
  assert.equal(plat.save, 6500)
  assert.equal(plat.listValue - plat.save, plat.price)
})

test('every bundle CTA has a WhatsApp message and free support period', () => {
  for (const p of PACKAGES) {
    assert.ok(ENQUIRY_MESSAGES[p.id], `${p.id}: missing enquiry message`)
    assert.match(p.support, /free support$/)
    assert.ok(p.includes.length >= 6, `${p.id}: inclusions`)
  }
})

test('the supporting sections match the document lengths', () => {
  assert.equal(ADD_ONS.length, 9)
  assert.equal(SUPPORT_PLANS.length, 3)
  assert.equal(COMPONENT_VALUES.length, 7)
  assert.equal(GROWTH_FRAMEWORK.length, 5)
  assert.equal(PRICING_FAQS.length, 5)
  assert.equal(PAYMENT_TERMS.length, 5)
  assert.equal(WHAT_HAPPENS_NEXT.length, 5)
  for (const s of SUPPORT_PLANS) assert.equal(s.price, 'Custom quote')
})

test('component values sum to the standalone total in §4', () => {
  const total = COMPONENT_VALUES.reduce((n, c) => n + c.value, 0)
  assert.equal(total, 131500)
  const goldSum = COMPONENT_VALUES.filter((c) => c.gold).reduce((n, c) => n + c.value, 0)
  assert.equal(goldSum, PACKAGES.find((p) => p.id === 'gold').listValue)
})

test('footer links point at anchors that exist on the new pages', () => {
  const serviceIds = SERVICES.map((s) => s.id)
  const bundleIds = PACKAGES.map((p) => p.id)
  for (const group of FOOTER_LINKS) {
    for (const link of group.links) {
      const m = link.to.match(/^\/(services|pricing)#(.+)$/)
      if (!m) continue
      const pool = m[1] === 'services' ? serviceIds : [...bundleIds, 'addons', 'support', 'terms', 'exclusions']
      assert.ok(pool.includes(m[2]), `broken anchor ${link.to}`)
    }
  }
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

/* A stale anchor is a dead click that no build step catches — HERO.primary
   pointed at /pricing#pilot after the bundles were renamed. */
test('every hashed link in the content points at a real section', () => {
  const pools = {
    services: SERVICES.map((s) => s.id),
    pricing: [...PACKAGES.map((p) => p.id), 'addons', 'support', 'terms', 'exclusions'],
  }
  const targets = [
    HERO.primary.to,
    HERO.secondary.to,
    ...FOOTER_LINKS.flatMap((g) => g.links.map((l) => l.to)),
  ]
  let checked = 0
  for (const to of targets) {
    const m = to.match(/^\/(services|pricing)#(.+)$/)
    if (!m) continue
    checked += 1
    assert.ok(pools[m[1]].includes(m[2]), `broken anchor: ${to}`)
  }
  assert.ok(checked >= 8, `expected to validate several anchors, checked ${checked}`)
})
