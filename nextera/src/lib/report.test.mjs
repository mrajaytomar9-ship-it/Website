import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  parseLink,
  linkFindings,
  LINK_SLOTS,
  buildChecks,
  scoreChecks,
  gradeFor,
  buildWeakPoints,
  buildPlan,
  compareCompetitors,
  lookupLinks,
  defaultInput,
  emptyCompetitor,
  retype,
  validate,
  validateLead,
  buildReport,
  reportToText,
  reportToHtml,
  reportToCsv,
  scoreLabel,
} from './report.js'

/* A realistic, deliberately weak hotel: it should score badly and say why. */
function weakHotel() {
  const input = defaultInput('hotel')
  input.name = 'Guest House Taj View'
  input.links = {
    website: 'http://tajview.blogspot.com',
    maps: 'https://maps.app.goo.gl/abc123',
    ota: 'https://www.makemytrip.com/hotels/taj-view-agra',
    listing: '',
  }
  input.presence = {
    photos: 9,
    reviews: 12,
    rating: 4.1,
    updatedDays: 210,
    consistentNAP: false,
    whatsappCta: false,
    enquiryForm: false,
    responseHours: 9,
    pricesShown: false,
    languages: 1,
  }
  return input
}

/* ---------------------------------------------------------------- links --- */

test('parseLink tolerates a bare domain and adds the scheme', () => {
  const p = parseLink('tajviewagra.in')
  assert.equal(p.ok, true)
  assert.equal(p.host, 'tajviewagra.in')
  assert.equal(p.isSecure, true)
  assert.equal(p.isOwnWebsite, true)
})

test('parseLink recognises the platforms a founder actually pastes', () => {
  const cases = [
    ['https://www.makemytrip.com/hotels/x', 'makemytrip'],
    ['https://www.booking.com/hotel/in/taj.html', 'booking'],
    ['https://www.practo.com/agra/dr-sharma', 'practo'],
    ['https://www.justdial.com/Agra/Taj-View', 'justdial'],
    ['https://www.google.com/maps/place/Taj+View', 'maps'],
    ['https://maps.app.goo.gl/abc', 'maps'],
    ['https://www.zomato.com/agra/x', 'zomato'],
    ['https://instagram.com/tajview', 'instagram'],
  ]
  for (const [url, id] of cases) {
    assert.equal(parseLink(url).platform?.id, id, `${url} should be ${id}`)
  }
})

test('parseLink rejects things that are not addresses', () => {
  assert.equal(parseLink('').empty, true)
  assert.equal(parseLink('   ').empty, true)
  assert.equal(parseLink('not a link').ok, false)
  assert.equal(parseLink('https://localhost').ok, false)
  assert.equal(parseLink('192.168.0.1').ok, false)
})

test('parseLink flags borrowed addresses as not owned', () => {
  assert.equal(parseLink('https://tajview.blogspot.com').borrowed?.name, 'a Blogspot address')
  assert.equal(parseLink('https://tajview.wixsite.com/home').borrowed?.name, 'a Wix subdomain')
  assert.equal(parseLink('https://linktr.ee/tajview').borrowed?.name, 'a link-in-bio page')
  assert.equal(parseLink('https://tajviewagra.in').borrowed, null)
})

test('linkFindings reports http, borrowed hosts and short Maps links', () => {
  const slot = LINK_SLOTS.find((s) => s.id === 'website')
  const http = linkFindings(parseLink('http://tajviewagra.in'), slot)
  assert.ok(http.some((f) => f.text.includes('not https')))

  const borrowed = linkFindings(parseLink('https://tajview.wixsite.com/x'), slot)
  assert.equal(borrowed.find((f) => f.text.includes('Wix subdomain')).tone, 'missing')

  const mapsSlot = LINK_SLOTS.find((s) => s.id === 'maps')
  const short = linkFindings(parseLink('https://maps.app.goo.gl/abc'), mapsSlot)
  assert.ok(short.some((f) => f.text.includes('shortened Maps share link')))
})

test('linkFindings warns when an OTA slot gets a non-booking link', () => {
  const slot = LINK_SLOTS.find((s) => s.id === 'ota')
  const findings = linkFindings(parseLink('https://instagram.com/tajview'), slot)
  assert.ok(findings.some((f) => f.text.includes('as a booking platform')))
})

/* --------------------------------------------------------------- checks --- */

test('an unanswered question is excluded, not counted as a failure', () => {
  const input = defaultInput('clinic')
  input.name = 'Sharma Clinic'
  input.links = { website: '', maps: 'https://www.google.com/maps/place/Sharma+Clinic', ota: '', listing: '' }
  /* every presence question left blank */
  const checks = buildChecks({ ...input, metrics: null })
  const blank = checks.filter((c) => ['photos', 'reviews', 'rating', 'freshness', 'response', 'languages'].includes(c.id))
  assert.ok(blank.length >= 6)
  for (const c of blank) assert.equal(c.status, 'na', `${c.id} should be unanswered, got ${c.status}`)
})

test('a weak hotel scores its pillars honestly', () => {
  const input = weakHotel()
  const report = buildReport(input)
  const byId = Object.fromEntries(report.score.pillars.map((p) => [p.id, p.score]))

  assert.ok(byId['find'] < 90, 'findability should lose points for 9 photos')
  assert.ok(byId.trust < 40, 'credibility should be poor')
  assert.ok(byId.convert < 25, 'convertibility should be poor')
  assert.ok(report.score.overall < 55)
  assert.equal(report.score.grade.label, gradeFor(report.score.overall).label)
})

test('checks add up: statuses sum to the total and the score is in range', () => {
  const report = buildReport(weakHotel())
  const c = report.score.counts
  assert.equal(c.ok + c.weak + c.missing + c.na, report.score.total)
  assert.ok(report.score.overall >= 0 && report.score.overall <= 100)
  assert.equal(report.score.answered, c.ok + c.weak + c.missing)
})

test('a strong business scores strongly', () => {
  const input = defaultInput('hotel')
  input.name = 'Taj View Agra'
  input.links = {
    website: 'https://tajviewagra.in',
    maps: 'https://www.google.com/maps/place/Taj+View+Agra',
    ota: 'https://www.makemytrip.com/hotels/taj-view',
    listing: 'https://www.justdial.com/Agra/Taj-View',
  }
  input.presence = {
    photos: 42,
    reviews: 240,
    rating: 4.6,
    updatedDays: 12,
    consistentNAP: true,
    whatsappCta: true,
    enquiryForm: true,
    responseHours: 1,
    pricesShown: true,
    languages: 2,
  }
  const report = buildReport(input)
  assert.ok(report.score.overall >= 80, `expected a strong score, got ${report.score.overall}`)
  /* Presence is clean; the only weak points left come from the hotel preset's
     economics (a 24% leak and a missed target), which is the point of the
     money pillar. */
  assert.ok(
    report.weakPoints.every((w) => w.pillar === 'money'),
    `presence should be clean, got ${report.weakPoints.map((w) => w.id).join(', ')}`,
  )
})

/* -------------------------------------------------------------- scoring --- */

test('scoreChecks weights by check weight and skips unanswered', () => {
  const { pillars, overall } = scoreChecks([
    { pillar: 'find', status: 'ok', weight: 3 },
    { pillar: 'find', status: 'missing', weight: 1 },
    { pillar: 'find', status: 'na', weight: 100 }, // must not drag the score down
  ])
  const find = pillars.find((p) => p.id === 'find')
  assert.equal(find.score, 75) // 3 / 4
  assert.equal(overall, 75)
})

test('gradeFor bands', () => {
  assert.equal(gradeFor(95).label, 'Strong')
  assert.equal(gradeFor(70).label, 'Working, with gaps')
  assert.equal(gradeFor(50).label, 'Leaky')
  assert.equal(gradeFor(20).label, 'At risk')
  assert.equal(gradeFor(null).label, 'Not enough to score')
})

/* ----------------------------------------------------------- weak points --- */

test('weak points are ordered by weighted deficit and skip the good checks', () => {
  const report = buildReport(weakHotel())
  assert.ok(report.weakPoints.length > 0 && report.weakPoints.length <= 5)
  for (const w of report.weakPoints) assert.notEqual(w.status, 'ok')
  for (let i = 1; i < report.weakPoints.length; i++) {
    assert.ok(report.weakPoints[i - 1].deficit >= report.weakPoints[i].deficit, 'must be sorted by deficit')
  }
  assert.ok(report.weakPoints.every((w) => w.fix && w.finding), 'every weak point needs a finding and a fix')
})

test('the plan buckets by effort, cheapest first', () => {
  const report = buildReport(weakHotel())
  const { now, next, later } = report.plan
  assert.ok(now.every((w) => w.effort === 'low'))
  assert.ok(next.every((w) => w.effort === 'medium'))
  assert.ok(later.every((w) => w.effort === 'high'))
  assert.equal(now.length + next.length + later.length, report.weakPoints.length)
})

/* ----------------------------------------------------------- competitors --- */

test('competitor comparison is not assessed until a name is entered', () => {
  const input = weakHotel()
  input.competitors = [emptyCompetitor()]
  const c = compareCompetitors(input, input.competitors)
  assert.equal(c.assessed, false)
  assert.deepEqual(c.rows, [])
})

test('competitor comparison marks ahead, behind and level correctly', () => {
  const input = weakHotel()
  input.presence.photos = 30
  input.presence.reviews = 100
  input.presence.rating = 4.4
  input.presence.enquiryForm = true
  input.competitors = [
    { name: 'Rival One', startPrice: 2400, photos: 60, reviews: 100, rating: 4.8, takesOnlineEnquiry: false },
  ]
  const c = compareCompetitors(input, input.competitors)
  assert.equal(c.assessed, true)
  const cell = (k) => c.rows[0].cells.find((x) => x.k === k)
  assert.equal(cell('startPrice').verdict, 'level') // same rate
  assert.equal(cell('photos').verdict, 'behind') // 30 vs 60
  assert.equal(cell('reviews').verdict, 'level')
  assert.equal(cell('rating').verdict, 'behind') // 4.4 vs 4.8
  assert.equal(cell('takesOnlineEnquiry').verdict, 'ahead') // we take enquiries, they do not
  assert.equal(c.behind, 2)
  assert.equal(c.ahead, 1)
  assert.deepEqual(c.gaps.map((g) => g.k).sort(), ['photos', 'rating'])
})

test('lookupLinks builds a Maps and a search link for the competitor', () => {
  const l = lookupLinks('Hotel Sidhartha', 'Agra')
  assert.ok(l.maps.startsWith('https://www.google.com/maps/search/Hotel%20Sidhartha'))
  assert.ok(l.search.includes('Hotel%20Sidhartha'))
  assert.equal(lookupLinks('', ''), null)
})

/* ------------------------------------------------------------ validation --- */

test('a report needs a name, a type and at least one link', () => {
  const empty = defaultInput('hotel')
  const v = validate(empty)
  assert.equal(v.ok, false)
  assert.ok(v.errors.name)
  assert.ok(v.errors.links)

  const withLink = { ...empty, name: 'Taj View', links: { ...empty.links, website: 'tajviewagra.in' } }
  assert.equal(validate(withLink).ok, true)
})

test('a malformed link is reported against its own slot', () => {
  const input = { ...defaultInput('hotel'), name: 'Taj View', links: { website: '::::', maps: '', ota: '', listing: '' } }
  const v = validate(input)
  assert.equal(v.ok, false)
  assert.ok(v.errors['link-website'])
})

test('rating must be a plausible star rating', () => {
  const input = { ...weakHotel(), presence: { ...weakHotel().presence, rating: 9 } }
  assert.ok(validate(input).errors.rating)
})

test('lead validation wants a reachable Indian mobile number', () => {
  assert.equal(validateLead({ name: 'Ravi', whatsapp: '9876543210' }).ok, true)
  assert.equal(validateLead({ name: 'Ravi', whatsapp: '+91 98765 43210' }).ok, true)
  assert.equal(validateLead({ name: 'Ravi', whatsapp: '+919876543210' }).normalised, '+919876543210')
  assert.equal(validateLead({ name: 'Ravi', whatsapp: '12345' }).ok, false)
  assert.equal(validateLead({ name: '', whatsapp: '9876543210' }).ok, false)
})

/* --------------------------------------------------------------- assembly --- */

test('retype swaps the preset numbers and keeps everything else', () => {
  const input = weakHotel()
  const next = retype(input, 'clinic')
  assert.equal(next.typeId, 'clinic')
  assert.equal(next.name, input.name)
  assert.equal(next.links.website, input.links.website)
  assert.notDeepEqual(next.values, input.values)
})

test('the report is deterministic for the same input', () => {
  const a = buildReport(weakHotel())
  const b = buildReport(weakHotel())
  assert.equal(a.score.overall, b.score.overall)
  assert.equal(reportToText(a), reportToText(b))
})

test('the money section reuses the calculator rather than re-deriving it', () => {
  const report = buildReport(weakHotel())
  assert.equal(Math.round(report.money.metrics.profit.netProfit), 100303)
  assert.equal(report.money.metrics.deductions.rate.toFixed(3), '24.175')
  /* leak + servable missed revenue, nothing invented */
  const m = report.money.metrics
  assert.equal(
    report.money.visibleLeak.toFixed(2),
    (m.deductions.total + m.demand.servableMissedRevenue).toFixed(2),
  )
})

/* --------------------------------------------------------------- exports --- */

test('the WhatsApp summary carries the score, the money and the top fixes', () => {
  const text = reportToText(buildReport(weakHotel()), { name: 'Ravi', whatsapp: '+919876543210' })
  assert.ok(text.includes('Guest House Taj View'))
  assert.ok(/Presence score: \d+\/100/.test(text))
  assert.ok(text.includes('Net profit:'))
  assert.ok(text.includes('First three things to fix:'))
  assert.ok(text.includes('Sent by Ravi'))
  assert.ok(text.includes('not accounting advice'))
  assert.ok(text.split('\n').filter((l) => /^\d\. /.test(l)).length === 3)
})

test('the HTML export escapes what the founder typed', () => {
  const input = weakHotel()
  input.name = '<script>alert("x")</script>'
  const html = reportToHtml(buildReport(input))
  assert.ok(!html.includes('<script>alert'))
  assert.ok(html.includes('&lt;script&gt;'))
  assert.ok(html.startsWith('<!doctype html>'))
  assert.ok(html.includes('</html>'))
  assert.ok(html.includes('not accounting, tax or legal advice'))
})

test('the CSV export has a header and one row per check', () => {
  const report = buildReport(weakHotel())
  const csv = reportToCsv(report)
  const lines = csv.split('\n')
  assert.equal(lines[0], '"Pillar","Check","Status","Weight","Finding","What to do"')
  assert.equal(lines.length, report.checks.length + 1)
})

test('scoreLabel never prints a decimal or NaN', () => {
  assert.equal(scoreLabel(null), '—')
  assert.equal(scoreLabel(83.6), '84')
})

test('every sector produces a full report without throwing', () => {
  for (const typeId of ['hotel', 'clinic', 'restaurant', 'coaching', 'retail', 'service', 'other']) {
    const input = defaultInput(typeId)
    input.name = `${typeId} business`
    input.links.website = `${typeId}example.in`
    const report = buildReport(input)
    assert.ok(report.score.total > 15, `${typeId} should produce a full check list`)
    assert.ok(reportToText(report).length > 200)
    assert.ok(reportToHtml(report).includes(typeId))
  }
})
