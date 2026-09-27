/**
 * report.js — the business health report engine.
 *
 * Pure and browser-free: it takes what a founder typed plus the links they
 * pasted, and returns scored findings, weak points, a competitor gap and an
 * action plan. Nothing here touches the network or the DOM, so it runs under
 * node:test and renders on the server.
 *
 * What this deliberately does NOT do is fetch anybody's website. A static page
 * cannot read another origin's HTML, so every link check below is a check on
 * the address itself, and the presence findings come from the founder's own
 * answers. The UI says so plainly rather than implying a scan happened.
 */

import {
  BUSINESS_TYPES,
  getType,
  presetValues,
  computeMetrics,
  formatINR,
  formatCompactINR,
  formatNumber,
  formatPct,
} from './calculator.js'

/* ------------------------------------------------------------------ *
 * 1. Links — what can honestly be said about an address alone
 * ------------------------------------------------------------------ */

export const PLATFORMS = [
  /* Each rule is a host pattern plus an optional path pattern. Host and path
     are kept separate on purpose: an earlier version put "/maps" inside the
     host regex, which can never match a hostname, so real Google profile
     links were detected as "your own website". */
  { id: 'maps', label: 'Google Business Profile', kind: 'listing', rules: [
    { host: /^maps\.app\.goo\.gl$/ },
    { host: /^goo\.gl$/ },
    { host: /^(www\.)?google\.[a-z.]+$/, path: /^\/maps(\/|$)/ },
  ] },
  { id: 'booking', label: 'Booking.com', kind: 'ota', rules: [{ host: /(^|\.)booking\.com$/ }] },
  { id: 'makemytrip', label: 'MakeMyTrip', kind: 'ota', rules: [{ host: /(^|\.)makemytrip\.com$/ }] },
  { id: 'agoda', label: 'Agoda', kind: 'ota', rules: [{ host: /(^|\.)agoda\.com$/ }] },
  { id: 'goibibo', label: 'Goibibo', kind: 'ota', rules: [{ host: /(^|\.)goibibo\.com$/ }] },
  { id: 'expedia', label: 'Expedia', kind: 'ota', rules: [{ host: /(^|\.)expedia\./ }] },
  { id: 'tripadvisor', label: 'Tripadvisor', kind: 'ota', rules: [{ host: /(^|\.)tripadvisor\./ }] },
  { id: 'airbnb', label: 'Airbnb', kind: 'ota', rules: [{ host: /(^|\.)airbnb\./ }] },
  { id: 'zomato', label: 'Zomato', kind: 'ota', rules: [{ host: /(^|\.)zomato\.com$/ }] },
  { id: 'swiggy', label: 'Swiggy', kind: 'ota', rules: [{ host: /(^|\.)swiggy\.com$/ }] },
  { id: 'practo', label: 'Practo', kind: 'ota', rules: [{ host: /(^|\.)practo\.com$/ }] },
  { id: 'justdial', label: 'Justdial', kind: 'listing', rules: [{ host: /(^|\.)justdial\.com$/ }] },
  { id: 'sulekha', label: 'Sulekha', kind: 'listing', rules: [{ host: /(^|\.)sulekha\.com$/ }] },
  { id: 'indiamart', label: 'IndiaMART', kind: 'listing', rules: [{ host: /(^|\.)indiamart\.com$/ }] },
  { id: 'instagram', label: 'Instagram', kind: 'social', rules: [{ host: /(^|\.)instagram\.com$/ }] },
  { id: 'facebook', label: 'Facebook', kind: 'social', rules: [{ host: /(^|\.)(facebook\.com|fb\.com|fb\.me)$/ }] },
  { id: 'youtube', label: 'YouTube', kind: 'social', rules: [{ host: /(^|\.)(youtube\.com|youtu\.be)$/ }] },
  { id: 'whatsapp', label: 'WhatsApp', kind: 'contact', rules: [{ host: /(^|\.)(wa\.me|whatsapp\.com)$/ }] },
]

/** Which known platform an address belongs to, or null for an unknown host. */
export function detectPlatform(host, pathname = '/') {
  return (
    PLATFORMS.find((p) => p.rules.some((r) => r.host.test(host) && (!r.path || r.path.test(pathname)))) ||
    null
  )
}

/* Borrowed addresses — free hosts and profile pages that are not your own. */
const BORROWED = [
  { re: /\.blogspot\./i, name: 'a Blogspot address' },
  { re: /\.wixsite\.com$/i, name: 'a Wix subdomain' },
  { re: /\.weebly\.com$/i, name: 'a Weebly subdomain' },
  { re: /\.wordpress\.com$/i, name: 'a WordPress.com subdomain' },
  { re: /^sites\.google\.com$/i, name: 'a Google Sites page' },
  { re: /^linktr\.ee$/i, name: 'a link-in-bio page' },
  { re: /^(goo\.gl|bit\.ly|tinyurl\.com|t\.co)$/i, name: 'a shortened link' },
  { re: /\.github\.io$/i, name: 'a free GitHub page' },
]

const LINK_SLOTS = [
  { id: 'website', label: 'Website', hint: 'Your own address, e.g. tajviewagra.in', expects: 'website' },
  { id: 'maps', label: 'Google Business Profile', hint: 'The Maps link customers see', expects: 'listing' },
  { id: 'ota', label: 'OTA / booking listing', hint: 'MakeMyTrip, Booking, Agoda, Practo…', expects: 'ota' },
  { id: 'listing', label: 'Directory listing', hint: 'Justdial, Sulekha, IndiaMART…', expects: 'listing' },
]

export { LINK_SLOTS }

/**
 * Parse one pasted address. Tolerates missing scheme, stray spaces and the
 * common "www." paste, and returns the checks that can be made offline.
 */
export function parseLink(raw) {
  const text = String(raw || '').trim()
  if (!text) return { empty: true }

  const withScheme = /^https?:\/\//i.test(text) ? text : `https://${text.replace(/^\/+/, '')}`
  let url
  try {
    url = new URL(withScheme)
  } catch {
    return { ok: false, raw: text, error: 'That does not look like a web address.' }
  }

  const host = url.hostname.toLowerCase()
  if (!host || !host.includes('.') || host.endsWith('.') || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    return { ok: false, raw: text, error: 'That address has no usable domain.' }
  }

  const platform = detectPlatform(host, url.pathname)
  const borrowed = BORROWED.find((b) => b.re.test(host)) || null

  return {
    ok: true,
    raw: text,
    url,
    href: url.toString(),
    host,
    domain: host.replace(/^www\./, ''),
    platform,
    borrowed,
    isSecure: url.protocol === 'https:',
    isOwnWebsite: !platform && !borrowed,
    path: url.pathname,
  }
}

/** Findings about an address that need no network access. */
export function linkFindings(parsed, slot) {
  const out = []
  if (!parsed || parsed.empty) return out
  if (!parsed.ok) {
    out.push({ tone: 'missing', text: parsed.error })
    return out
  }
  if (!parsed.isSecure) {
    out.push({ tone: 'weak', text: 'It is served over http, not https — browsers mark that "Not secure".' })
  }
  if (parsed.borrowed) {
    out.push({
      tone: slot.expects === 'website' ? 'missing' : 'weak',
      text: `This is ${parsed.borrowed.name}, not an address you own. It cannot rank on your name and it disappears if the host changes its terms.`,
    })
  }
  if (parsed.platform?.id === 'maps' && /maps\.app\.goo\.gl|goo\.gl/.test(parsed.host)) {
    out.push({
      tone: 'weak',
      text: 'This is a shortened Maps share link. Open the profile in Maps and copy the address bar link instead — it carries your place name, which the short link does not.',
    })
  }
  if (slot.expects === 'ota' && parsed.platform?.kind !== 'ota') {
    out.push({ tone: 'weak', text: `We do not recognise ${parsed.host} as a booking platform — check this is the listing guests actually book through.` })
  }
  if (slot.expects === 'listing' && parsed.platform?.id === 'maps') {
    out.push({ tone: 'weak', text: 'This is your Google profile, not a directory listing. Both are worth having.' })
  }
  if (parsed.isOwnWebsite && parsed.path && parsed.path.length > 1) {
    out.push({ tone: 'note', text: `The link points at a deep page (${parsed.path}). Use your homepage as the main address.` })
  }
  return out
}

/* ------------------------------------------------------------------ *
 * 2. Sector expectations
 * ------------------------------------------------------------------ */

const SECTOR_EXPECTATIONS = {
  hotel: { listingLabel: 'OTA listing (MakeMyTrip, Booking, Agoda)', photoTarget: 25, reviewTarget: 100 },
  clinic: { listingLabel: 'Practo or Justdial listing', photoTarget: 10, reviewTarget: 60 },
  restaurant: { listingLabel: 'Zomato or Swiggy listing', photoTarget: 20, reviewTarget: 120 },
  coaching: { listingLabel: 'Google or Justdial listing', photoTarget: 8, reviewTarget: 30 },
  retail: { listingLabel: 'Google or Justdial listing', photoTarget: 10, reviewTarget: 40 },
  service: { listingLabel: 'Google or IndiaMART listing', photoTarget: 8, reviewTarget: 25 },
  other: { listingLabel: 'Google Business Profile', photoTarget: 8, reviewTarget: 25 },
}

export function expectations(typeId) {
  return SECTOR_EXPECTATIONS[typeId] || SECTOR_EXPECTATIONS.other
}

/* ------------------------------------------------------------------ *
 * 3. The questionnaire
 * ------------------------------------------------------------------ */

export const REPORT_FIELDS = [
  {
    group: 'What people find',
    fields: [
      { k: 'photos', label: 'Photos across your listings', hint: 'Rough total on Google plus any booking page', suffix: 'photos' },
      { k: 'reviews', label: 'Reviews you have', suffix: 'reviews' },
      { k: 'rating', label: 'Average rating', hint: 'Leave blank if you have none', suffix: '★' },
      { k: 'updatedDays', label: 'Days since you last updated anything', hint: 'Posts, photos, timings, offers', suffix: 'days' },
      { k: 'consistentNAP', label: 'Name, address and phone are identical everywhere', type: 'bool' },
    ],
  },
  {
    group: 'What happens next',
    fields: [
      { k: 'whatsappCta', label: 'A visitor can reach you on WhatsApp in one tap', type: 'bool' },
      { k: 'enquiryForm', label: 'There is a form or booking request that works', type: 'bool' },
      { k: 'responseHours', label: 'Typical time to answer a first message', suffix: 'hours' },
      { k: 'pricesShown', label: 'Rates or prices are visible without calling', type: 'bool' },
      { k: 'languages', label: 'Languages your enquiry path handles', suffix: 'languages' },
    ],
  },
]

/* ------------------------------------------------------------------ *
 * 4. Checks
 * ------------------------------------------------------------------ */

export const PILLARS = [
  { id: 'find', label: 'Findability', blurb: 'Can a stranger who is already looking actually reach you?', weight: 30 },
  { id: 'trust', label: 'Credibility', blurb: 'Once they land, do you look like the safe choice?', weight: 25 },
  { id: 'convert', label: 'Convertibility', blurb: 'Can they act on it without a phone call?', weight: 25 },
  { id: 'money', label: 'Money', blurb: 'What the month actually leaves you after everything.', weight: 20 },
]

const STATUS_VALUE = { ok: 1, weak: 0.5, missing: 0 }

/* calculator.js's num() coerces blanks to 0, which is right for a money field
   and wrong here: an unanswered question is not a failed one. These treat an
   empty field as "not answered" so it is excluded from scoring. */
const isAnswered = (v) => v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v))
const asNum = (v) => (isAnswered(v) ? Number(v) : NaN)

/** One band check: value → ok / weak / missing against two thresholds. */
const band = (value, okAt, weakAt, higherIsBetter = true) => {
  const v = asNum(value)
  if (!Number.isFinite(v)) return 'na'
  if (higherIsBetter) return v >= okAt ? 'ok' : v >= weakAt ? 'weak' : 'missing'
  return v <= okAt ? 'ok' : v <= weakAt ? 'weak' : 'missing'
}

const yesNo = (v) => (v === true ? 'ok' : v === false ? 'missing' : 'na')

/**
 * Build every check for this input. Checks that cannot be answered come back
 * as `na` and are excluded from scoring rather than counted as failures.
 */
export function buildChecks(input) {
  const type = getType(input.typeId)
  const exp = expectations(input.typeId)
  const links = input.links || {}
  const p = input.presence || {}
  const parsed = {
    website: parseLink(links.website),
    maps: parseLink(links.maps),
    ota: parseLink(links.ota),
    listing: parseLink(links.listing),
  }
  const checks = []
  const add = (c) => checks.push(c)

  /* --- findability --------------------------------------------------- */
  const ownSite = parsed.website.ok && parsed.website.isOwnWebsite
  add({
    id: 'website',
    pillar: 'find',
    label: 'A website of your own',
    status: !parsed.website.ok && !parsed.website.empty ? 'missing' : ownSite ? 'ok' : parsed.website.ok ? 'weak' : 'missing',
    weight: 5,
    effort: 'medium',
    finding: !parsed.website.ok && !parsed.website.empty
      ? parsed.website.error
      : ownSite
        ? `You have your own address: ${parsed.website.domain}.`
        : parsed.website.ok
          ? `${parsed.website.domain} is a borrowed address, not one you control.`
          : 'No website address was given, so everything you have lives on platforms you do not control.',
    fix: ownSite ? 'Keep the domain renewal in a calendar you actually check.' : 'Get a short .in or .com on your business name and put one clear page on it.',
  })

  if (parsed.website.ok) {
    add({
      id: 'website-https',
      pillar: 'find',
      label: 'Served over https',
      status: parsed.website.isSecure ? 'ok' : 'missing',
      weight: 2,
      effort: 'low',
      finding: parsed.website.isSecure ? `${parsed.website.domain} uses https.` : `${parsed.website.domain} is on http, so browsers show a warning before your content.',`,
      fix: 'A free certificate from your host or Cloudflare fixes this in an afternoon.',
    })
  }

  add({
    id: 'gmb',
    pillar: 'find',
    label: 'Google Business Profile',
    status: parsed.maps.ok ? 'ok' : 'missing',
    weight: 5,
    effort: 'low',
    finding: parsed.maps.ok ? 'You have a Google profile link.' : 'No Google profile link — for most Agra businesses this is the single biggest source of enquiries.',
    fix: 'Claim or create the profile on Google, verify it, and fill every field including timings and categories.',
  })

  if (parsed.maps.ok) {
    const short = /goo\.gl/.test(parsed.maps.host)
    add({
      id: 'gmb-link',
      pillar: 'find',
      label: 'A proper profile link, not a share shortcut',
      status: short ? 'weak' : 'ok',
      weight: 1,
      effort: 'low',
      finding: short ? 'This is a shortened share link, which carries no place name.' : 'The link points at the place itself.',
      fix: 'Copy the address from the browser once the profile is open in Maps.',
    })
  }

  const hasListing = parsed.ota.ok || parsed.listing.ok
  add({
    id: 'sector-listing',
    pillar: 'find',
    label: exp.listingLabel,
    status: hasListing ? 'ok' : 'missing',
    weight: 3,
    effort: 'low',
    finding: hasListing
      ? `Listed on ${[parsed.ota, parsed.listing].filter((l) => l.ok).map((l) => l.platform?.label || l.domain).join(' and ')}.`
      : `No ${exp.listingLabel.toLowerCase()} was given. In this sector that is where a large share of first contact starts.`,
    fix: `Create the listing, match the name and phone exactly to your Google profile, and add photographs.`,
  })

  add({
    id: 'photos',
    pillar: 'find',
    label: `At least ${exp.photoTarget} photographs`,
    status: band(p.photos, exp.photoTarget, Math.round(exp.photoTarget * 0.4)),
    weight: 3,
    effort: 'medium',
    finding: isAnswered(p.photos)
      ? `${formatNumber(Math.round(asNum(p.photos)))} photographs against a target of ${exp.photoTarget} for a ${type.label.toLowerCase()}.`
      : 'Photo count not given.',
    fix: 'Twenty to thirty well-lit photographs of the actual rooms, corridors, entrance and surroundings beat one polished brochure image.',
  })

  /* --- credibility ---------------------------------------------------- */
  add({
    id: 'reviews',
    pillar: 'trust',
    label: 'Enough reviews to be believed',
    status: band(p.reviews, exp.reviewTarget, Math.round(exp.reviewTarget * 0.3)),
    weight: 4,
    effort: 'high',
    finding: isAnswered(p.reviews)
      ? `${formatNumber(Math.round(asNum(p.reviews)))} reviews against a ${exp.reviewTarget} target for your sector.`
      : 'Review count not given.',
    fix: 'Ask at the moment of satisfaction — checkout, discharge, final class — with the link already open on your phone.',
  })

  const rating = asNum(p.rating)
  add({
    id: 'rating',
    pillar: 'trust',
    label: 'A rating that does not scare people off',
    status: band(p.rating, 4.3, 3.8),
    weight: 3,
    effort: 'high',
    finding: Number.isFinite(rating) ? `Average ${rating.toFixed(1)}★.` : 'No rating given.',
    fix: 'Reply to every review, and answer the critical ones with what you changed — a replied 3★ does less damage than an ignored one.',
  })

  add({
    id: 'freshness',
    pillar: 'trust',
    label: 'Updated in the last 90 days',
    status: band(p.updatedDays, 90, 180, false),
    weight: 2,
    effort: 'low',
    finding: isAnswered(p.updatedDays)
      ? `Last updated ${formatNumber(Math.round(asNum(p.updatedDays)))} days ago.`
      : 'Not given.',
    fix: 'One post a month with a real photograph keeps the profile looking alive; stale listings read as closed.',
  })

  add({
    id: 'nap',
    pillar: 'trust',
    label: 'Same name, address and phone everywhere',
    status: yesNo(p.consistentNAP),
    weight: 3,
    effort: 'low',
    finding:
      p.consistentNAP === true
        ? 'Your details match across listings.'
        : p.consistentNAP === false
          ? 'Your details differ between listings, which makes Google less sure which one is real.'
          : 'Not given.',
    fix: 'Pick one spelling of the name, one phone number and one address format, then correct every listing to match.',
  })

  add({
    id: 'brand-domain',
    pillar: 'trust',
    label: 'An address people can remember your name from',
    status: brandDomainStatus(parsed.website, input.name),
    weight: 1,
    effort: 'medium',
    finding: brandDomainFinding(parsed.website, input.name),
    fix: 'If the address has nothing to do with the business name, people will search the name and find somebody else.',
  })

  /* --- convertibility -------------------------------------------------- */
  add({
    id: 'whatsapp',
    pillar: 'convert',
    label: 'One-tap WhatsApp',
    status: yesNo(p.whatsappCta),
    weight: 5,
    effort: 'low',
    finding:
      p.whatsappCta === true
        ? 'A visitor can message you without typing a number.'
        : p.whatsappCta === false
          ? 'Reaching you means copying a number into a phone — most people do not.'
          : 'Not given.',
    fix: 'Put a WhatsApp action on every section with the page context already written into the message.',
  })

  add({
    id: 'enquiry',
    pillar: 'convert',
    label: 'A working enquiry or request path',
    status: yesNo(p.enquiryForm),
    weight: 4,
    effort: 'medium',
    finding:
      p.enquiryForm === true
        ? 'There is a form or booking request.'
        : p.enquiryForm === false
          ? 'There is no way to enquire other than calling.'
          : 'Not given.',
    fix: 'Keep it to three fields and test it on a phone, on mobile data, yourself.',
  })

  add({
    id: 'response',
    pillar: 'convert',
    label: 'Answers within two hours',
    status: band(p.responseHours, 2, 12, false),
    weight: 4,
    effort: 'medium',
    finding: isAnswered(p.responseHours)
      ? `A first message typically waits ${formatNumber(Math.round(asNum(p.responseHours)))} hours.`
      : 'Not given.',
    fix: 'Most enquiries go to whoever replies first. Two hours beats a better answer tomorrow.',
  })

  add({
    id: 'pricing',
    pillar: 'convert',
    label: 'Rates visible without a phone call',
    status: yesNo(p.pricesShown),
    weight: 3,
    effort: 'low',
    finding:
      p.pricesShown === true
        ? 'Rates are published.'
        : p.pricesShown === false
          ? 'Rates are hidden, so price shoppers leave and the rest call to ask.'
          : 'Not given.',
    fix: 'Publish a starting rate with what it includes. "From ₹X" filters the wrong enquiries out before they cost you time.',
  })

  add({
    id: 'languages',
    pillar: 'convert',
    label: 'An enquiry path in more than one language',
    status: band(p.languages, 2, 1),
    weight: 1,
    effort: 'high',
    finding: isAnswered(p.languages) ? `Handled in ${formatNumber(Math.round(asNum(p.languages)))} language(s).` : 'Not given.',
    fix: 'Hindi alongside English is usually enough in Agra; say on the page that you reply in both.',
  })

  /* --- money ----------------------------------------------------------- */
  const m = input.metrics
  if (m) {
    add({
      id: 'leak',
      pillar: 'money',
      label: 'Platform and discount leak under 12%',
      status: band(m.deductions.rate, 12, 20, false),
      weight: 5,
      effort: 'medium',
      finding: `${formatPct(m.deductions.rate)} of gross billing (${formatINR(m.deductions.total)}) goes to commission, gateways, cancellations and discounts before you see it.`,
      fix: 'Every direct booking avoids the commission on it. A direct rate that is fair but visible moves share without a price war.',
    })
    add({
      id: 'margin',
      pillar: 'money',
      label: 'Net margin of at least 15%',
      status: band(m.profit.netMargin, 15, 8),
      weight: 5,
      effort: 'high',
      finding: `Net margin ${formatPct(m.profit.netMargin)} — ${formatINR(m.profit.netProfit)} a month. Verdict: ${m.verdict.label}.`,
      fix: m.verdict.body,
    })
    add({
      id: 'safety',
      pillar: 'money',
      label: 'A safe distance above break-even',
      status: m.breakEven.units === null ? 'na' : band(m.breakEven.safetyPct, 25, 10),
      weight: 4,
      effort: 'medium',
      finding:
        m.breakEven.units === null
          ? 'Break-even cannot be computed from these numbers.'
          : `You break even at ${formatNumber(Math.ceil(m.breakEven.units))} ${type.unit}s and are ${formatPct(m.breakEven.safetyPct)} clear of it.`,
      fix: 'A thin safety margin means one bad month costs money rather than profit. Fixed cost is usually the faster lever than volume.',
    })
    add({
      id: 'missed',
      pillar: 'money',
      label: 'Enquiries answered before they go cold',
      status: band(m.demand.replyRate, 85, 60),
      weight: 4,
      effort: 'low',
      finding: `${formatPct(m.demand.replyRate)} of enquiries get an answer; ${formatNumber(Math.round(m.demand.unanswered))} a month do not, worth about ${formatINR(m.demand.servableMissedRevenue)} you could have served.`,
      fix: 'An unanswered enquiry is the most expensive item on this list, and the cheapest to fix.',
    })
    add({
      id: 'target',
      pillar: 'money',
      label: 'Hitting your own monthly target',
      status: m.target.met ? 'ok' : m.target.gap > m.target.target * 0.5 ? 'missing' : 'weak',
      weight: 3,
      effort: 'high',
      finding: m.target.met
        ? `Target met — ${formatINR(m.profit.netProfit)} against a target of ${formatINR(m.target.target)}.`
        : `${formatINR(m.target.gap)} short of the ${formatINR(m.target.target)} target.`,
      fix: 'The routes panel on the calculator shows the four cheapest ways to close that specific gap.',
    })
  }

  return checks
}

function brandDomainStatus(parsed, name) {
  if (!parsed.ok || !parsed.isOwnWebsite) return 'na'
  const words = String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
  if (!words.length) return 'na'
  const domain = parsed.domain.replace(/\.(in|com|net|co|org)(\.in)?$/g, '').replace(/[^a-z0-9]/g, '')
  const hit = words.some((w) => domain.includes(w) || w.includes(domain))
  return hit ? 'ok' : 'weak'
}

function brandDomainFinding(parsed, name) {
  if (!parsed.ok || !parsed.isOwnWebsite) return 'No own-domain website to judge.'
  const status = brandDomainStatus(parsed, name)
  if (status === 'na') return 'Give the business name and we can check the address against it.'
  return status === 'ok'
    ? `${parsed.domain} reads as ${name || 'your business'}.`
    : `${parsed.domain} has no obvious connection to ${name || 'the business name'}.`
}

/* ------------------------------------------------------------------ *
 * 5. Scoring
 * ------------------------------------------------------------------ */

export function scoreChecks(checks) {
  const pillars = PILLARS.map((pillar) => {
    const own = checks.filter((c) => c.pillar === pillar.id && c.status !== 'na')
    const weightSum = own.reduce((s, c) => s + c.weight, 0)
    const earned = own.reduce((s, c) => s + c.weight * (STATUS_VALUE[c.status] ?? 0), 0)
    const answered = own.length
    return {
      ...pillar,
      answered,
      total: checks.filter((c) => c.pillar === pillar.id).length,
      score: weightSum > 0 ? (earned / weightSum) * 100 : null,
    }
  })

  const scored = pillars.filter((p) => p.score !== null)
  const weightSum = scored.reduce((s, p) => s + p.weight, 0)
  const overall = weightSum > 0 ? scored.reduce((s, p) => s + p.weight * p.score, 0) / weightSum : null

  return { pillars, overall }
}

export function gradeFor(score) {
  if (score === null) return { label: 'Not enough to score', tone: 'ink', body: 'Answer a few more questions and the score will appear.' }
  if (score >= 80) return { label: 'Strong', tone: 'mint', body: 'The basics are working. The gains left are marginal, so protect them rather than rebuild.' }
  if (score >= 65) return { label: 'Working, with gaps', tone: 'sky', body: 'Solid foundations with a handful of specific things holding the number down.' }
  if (score >= 45) return { label: 'Leaky', tone: 'ember', body: 'You are visible, but a lot of the people who find you leave without contacting you.' }
  return { label: 'At risk', tone: 'red', body: 'Most of the people already looking for you cannot reach you, or reach you and lose confidence.' }
}

/* ------------------------------------------------------------------ *
 * 6. Competitors
 * ------------------------------------------------------------------ */

export const COMPETITOR_FIELDS = [
  { k: 'name', label: 'Name', type: 'text' },
  { k: 'startPrice', label: 'Starting rate (₹)', type: 'number' },
  { k: 'photos', label: 'Photos', type: 'number' },
  { k: 'reviews', label: 'Reviews', type: 'number' },
  { k: 'rating', label: 'Rating', type: 'number' },
  { k: 'takesOnlineEnquiry', label: 'Takes enquiries online', type: 'bool' },
]

/** Deep links so the founder can read the real numbers off the competitor. */
export function lookupLinks(name, city) {
  const q = `${name || ''} ${city || ''}`.trim()
  if (!q) return null
  return {
    maps: `https://www.google.com/maps/search/${encodeURIComponent(q)}`,
    search: `https://www.google.com/search?q=${encodeURIComponent(`"${name || q}" ${city || ''}`.trim())}`,
  }
}

/**
 * Compare the founder against competitors they entered. Every number here is
 * typed by the founder from a public listing — we never fetch it, and the UI
 * says so next to the form.
 */
export function compareCompetitors(input, competitors) {
  const rows = (competitors || []).filter((c) => c && String(c.name || '').trim())
  if (!rows.length) return { rows: [], assessed: false, behind: 0, ahead: 0, gaps: [] }

  const p = input.presence || {}
  const self = {
    startPrice: asNum(input.values?.price),
    photos: asNum(p.photos),
    reviews: asNum(p.reviews),
    rating: asNum(p.rating),
    takesOnlineEnquiry: p.enquiryForm === true || p.whatsappCta === true,
  }

  const metrics = [
    { k: 'startPrice', label: 'Starting rate', better: 'lower', format: (v) => formatINR(v) },
    { k: 'photos', label: 'Photos', better: 'higher', format: (v) => formatNumber(Math.round(v)) },
    { k: 'reviews', label: 'Reviews', better: 'higher', format: (v) => formatNumber(Math.round(v)) },
    { k: 'rating', label: 'Rating', better: 'higher', format: (v) => `${Number(v).toFixed(1)}★` },
    { k: 'takesOnlineEnquiry', label: 'Online enquiry', better: 'higher', format: (v) => (v ? 'Yes' : 'No') },
  ]

  const compared = rows.map((c) => {
    const cells = metrics.map((met) => {
      const mine = self[met.k]
      const theirs = met.k === 'takesOnlineEnquiry' ? c.takesOnlineEnquiry === true : asNum(c[met.k])
      const both =
        met.k === 'takesOnlineEnquiry'
          ? true
          : Number.isFinite(mine) && Number.isFinite(theirs)
      let verdict = 'na'
      if (both) {
        if (met.k === 'takesOnlineEnquiry') {
          verdict = mine && !theirs ? 'ahead' : !mine && theirs ? 'behind' : 'level'
        } else if (Number(mine) === Number(theirs)) verdict = 'level'
        else {
          const iWin = met.better === 'higher' ? Number(mine) > Number(theirs) : Number(mine) < Number(theirs)
          verdict = iWin ? 'ahead' : 'behind'
        }
      }
      return {
        k: met.k,
        label: met.label,
        mine: Number.isFinite(mine) || typeof mine === 'boolean' ? met.format(mine) : null,
        theirs: Number.isFinite(theirs) || typeof theirs === 'boolean' ? met.format(theirs) : null,
        verdict,
      }
    })
    const behind = cells.filter((x) => x.verdict === 'behind').length
    const ahead = cells.filter((x) => x.verdict === 'ahead').length
    return { name: String(c.name).trim(), cells, behind, ahead }
  })

  /* Where the founder loses most often across all competitors. */
  const tally = {}
  for (const row of compared) {
    for (const cell of row.cells) {
      if (cell.verdict !== 'behind') continue
      tally[cell.k] = tally[cell.k] || { k: cell.k, label: cell.label, count: 0 }
      tally[cell.k].count += 1
    }
  }
  const gaps = Object.values(tally).sort((a, b) => b.count - a.count)

  return {
    rows: compared,
    assessed: true,
    behind: compared.reduce((s, r) => s + r.behind, 0),
    ahead: compared.reduce((s, r) => s + r.ahead, 0),
    gaps,
  }
}

/* ------------------------------------------------------------------ *
 * 7. Weak points and the plan
 * ------------------------------------------------------------------ */

const EFFORT_LABEL = { low: 'A day', medium: 'A week', high: 'A month or more' }

export function buildWeakPoints(checks, limit = 5) {
  return checks
    .filter((c) => c.status !== 'na' && c.status !== 'ok')
    .map((c) => ({
      ...c,
      deficit: (1 - (STATUS_VALUE[c.status] ?? 0)) * c.weight,
      impact: c.weight >= 5 ? 'High' : c.weight >= 3 ? 'Medium' : 'Low',
      effortLabel: EFFORT_LABEL[c.effort] || 'A week',
    }))
    .sort((a, b) => b.deficit - a.deficit || b.weight - a.weight)
    .slice(0, limit)
}

/**
 * The plan is the weak points ordered by what costs least to fix, because a
 * list of eleven things gets nothing done and a list of three gets three.
 */
export function buildPlan(weakPoints) {
  const order = { low: 0, medium: 1, high: 2 }
  const sorted = [...weakPoints].sort((a, b) => order[a.effort] - order[b.effort] || b.deficit - a.deficit)
  return {
    now: sorted.filter((w) => w.effort === 'low'),
    next: sorted.filter((w) => w.effort === 'medium'),
    later: sorted.filter((w) => w.effort === 'high'),
  }
}

/* ------------------------------------------------------------------ *
 * 8. Input defaults and validation
 * ------------------------------------------------------------------ */

export function emptyCompetitor() {
  return { name: '', startPrice: '', photos: '', reviews: '', rating: '', takesOnlineEnquiry: false }
}

export function defaultInput(typeId = 'hotel') {
  return {
    name: '',
    typeId,
    city: 'Agra',
    links: { website: '', maps: '', ota: '', listing: '' },
    presence: {
      photos: '',
      reviews: '',
      rating: '',
      updatedDays: '',
      consistentNAP: null,
      whatsappCta: null,
      enquiryForm: null,
      responseHours: '',
      pricesShown: null,
      languages: '',
    },
    values: presetValues(typeId),
    competitors: [emptyCompetitor()],
    lead: { name: '', whatsapp: '' },
  }
}

/** Switch business type without throwing away anything else they typed. */
export function retype(input, typeId) {
  return { ...input, typeId, values: presetValues(typeId) }
}

export function validate(input) {
  const errors = {}
  if (String(input.name || '').trim().length < 2) errors.name = 'Tell us what the business is called.'
  if (!BUSINESS_TYPES.some((t) => t.id === input.typeId)) errors.typeId = 'Pick the closest business type.'

  const slots = LINK_SLOTS.filter((s) => String(input.links?.[s.id] || '').trim())
  if (!slots.length) errors.links = 'Give at least one link — your website, Google profile, or a listing.'
  for (const slot of slots) {
    const parsed = parseLink(input.links[slot.id])
    if (!parsed.ok) errors[`link-${slot.id}`] = parsed.error
  }

  const rating = asNum(input.presence?.rating)
  if (Number.isFinite(rating) && (rating < 1 || rating > 5)) errors.rating = 'Rating is out of 5.'

  return { ok: Object.keys(errors).length === 0, errors }
}

export function validateLead(lead) {
  const errors = {}
  if (String(lead?.name || '').trim().length < 2) errors.name = 'We need a name to reply to.'
  const digits = String(lead?.whatsapp || '').replace(/\D/g, '')
  const local = digits.startsWith('91') ? digits.slice(2) : digits
  if (!/^[6-9]\d{9}$/.test(local)) errors.whatsapp = 'A 10-digit Indian mobile number, so the report can reach you.'
  return { ok: Object.keys(errors).length === 0, errors, normalised: `+91${local}` }
}

/* ------------------------------------------------------------------ *
 * 9. Assemble
 * ------------------------------------------------------------------ */

export function buildReport(input) {
  const type = getType(input.typeId)
  const values = { typeId: input.typeId, ...input.values }
  const metrics = computeMetrics(values)

  const withMetrics = { ...input, metrics }
  const checks = buildChecks(withMetrics)
  const { pillars, overall } = scoreChecks(checks)
  const weakPoints = buildWeakPoints(checks, 5)
  const competition = compareCompetitors(input, input.competitors)
  const links = LINK_SLOTS.map((slot) => ({
    slot,
    parsed: parseLink(input.links?.[slot.id]),
    findings: linkFindings(parseLink(input.links?.[slot.id]), slot),
  })).filter((l) => !l.parsed.empty)

  const answered = checks.filter((c) => c.status !== 'na').length
  const counts = {
    ok: checks.filter((c) => c.status === 'ok').length,
    weak: checks.filter((c) => c.status === 'weak').length,
    missing: checks.filter((c) => c.status === 'missing').length,
    na: checks.filter((c) => c.status === 'na').length,
  }

  return {
    generatedAt: null,
    business: {
      name: String(input.name || '').trim() || 'This business',
      typeId: type.id,
      typeLabel: type.label,
      unit: type.unit,
      city: String(input.city || '').trim(),
    },
    score: {
      overall,
      grade: gradeFor(overall),
      pillars,
      answered,
      total: checks.length,
      counts,
    },
    checks,
    weakPoints,
    plan: buildPlan(weakPoints),
    money: {
      metrics,
      visibleLeak: metrics.deductions.total + metrics.demand.servableMissedRevenue,
      leaks: metrics.deductions.leaks.filter((l) => l.amount > 0).sort((a, b) => b.amount - a.amount),
    },
    competition,
    links,
  }
}

/* ------------------------------------------------------------------ *
 * 10. Exports
 * ------------------------------------------------------------------ */

/** The WhatsApp summary — deliberately short enough to read in one screen. */
export function reportToText(report, lead) {
  const g = report.score.grade
  const lines = [
    `Nextera business report — ${report.business.name}`,
    `${report.business.typeLabel}${report.business.city ? ` · ${report.business.city}` : ''}`,
    '',
    `Presence score: ${report.score.overall === null ? 'n/a' : `${Math.round(report.score.overall)}/100`} (${g.label})`,
    ...report.score.pillars
      .filter((p) => p.score !== null)
      .map((p) => `· ${p.label}: ${Math.round(p.score)}/100`),
    '',
    report.money.metrics.profit.netProfit
      ? `Net profit: ${formatINR(report.money.metrics.profit.netProfit)}/month · leak ${formatPct(report.money.metrics.deductions.rate)}`
      : 'Net profit: enter your numbers on the calculator for this line',
    `Money visible going missing each month: ${formatINR(report.money.visibleLeak)}`,
    '',
    'First three things to fix:',
    ...report.weakPoints.slice(0, 3).map((w, i) => `${i + 1}. ${w.label} — ${w.fix}`),
  ]
  if (lead?.name) lines.push('', `Sent by ${lead.name}${lead.whatsapp ? ` · ${lead.whatsapp}` : ''}`)
  lines.push('', 'Generated on nexterasolution.in/report — figures are estimates from the inputs given, not accounting advice.')
  return lines.join('\n')
}

/**
 * A self-contained HTML file. Light theme on purpose: this gets printed and
 * forwarded, and a black page wastes ink and reads badly on paper.
 */
export function reportToHtml(report, lead) {
  const esc = (s) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  const g = report.score.grade
  const m = report.money.metrics
  const statusWord = { ok: 'Good', weak: 'Weak', missing: 'Missing', na: 'Not answered' }

  const checkRows = report.checks
    .map(
      (c) => `<tr>
        <td>${esc(c.label)}</td>
        <td class="s s-${c.status}">${statusWord[c.status]}</td>
        <td>${esc(c.finding)}</td>
        <td>${esc(c.fix)}</td>
      </tr>`,
    )
    .join('')

  const compRows = report.competition.rows
    .map(
      (r) => `<tr><th colspan="6">${esc(r.name)} — behind on ${r.behind}, ahead on ${r.ahead}</th></tr>` +
        r.cells
          .map(
            (c) =>
              `<tr><td>${esc(c.label)}</td><td>${esc(c.mine ?? '—')}</td><td>${esc(c.theirs ?? '—')}</td><td class="v-${c.verdict}">${c.verdict === 'na' ? '—' : c.verdict}</td></tr>`,
          )
          .join(''),
    )
    .join('')

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Business report — ${esc(report.business.name)}</title>
<style>
  :root { color-scheme: light }
  * { box-sizing: border-box }
  body { margin: 0; padding: 40px 20px; background: #f6f6f4; color: #14140f;
         font: 15px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif }
  .sheet { max-width: 860px; margin: 0 auto; background: #fff; border: 1px solid #e2e2dd; padding: 44px }
  h1 { font-size: 30px; line-height: 1.1; margin: 0 0 6px; letter-spacing: -0.02em }
  h2 { font-size: 19px; margin: 40px 0 12px; letter-spacing: -0.01em; border-bottom: 1px solid #e2e2dd; padding-bottom: 8px }
  h3 { font-size: 15px; margin: 22px 0 8px }
  p { margin: 0 0 12px }
  .muted { color: #6c6c66 }
  .score { display: flex; align-items: baseline; gap: 14px; margin: 22px 0 8px }
  .score b { font-size: 58px; line-height: 1; letter-spacing: -0.04em }
  .grade { font-size: 17px; font-weight: 600 }
  .pillars { display: grid; gap: 10px; margin: 20px 0 }
  .bar { height: 8px; background: #eceae4; overflow: hidden }
  .bar i { display: block; height: 100%; background: #14140f }
  table { width: 100%; border-collapse: collapse; font-size: 13.5px; margin: 12px 0 }
  th, td { text-align: left; padding: 9px 10px; border-bottom: 1px solid #eceae4; vertical-align: top }
  th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6c6c66 }
  .s { font-weight: 600; white-space: nowrap }
  .s-ok { color: #1c7a5c } .s-weak { color: #a8661a } .s-missing { color: #b3382c } .s-na { color: #8a8a84 }
  .v-behind { color: #b3382c; font-weight: 600 } .v-ahead { color: #1c7a5c; font-weight: 600 }
  .num { display: grid; grid-template-columns: repeat(auto-fit,minmax(150px,1fr)); gap: 14px; margin: 16px 0 }
  .num div { border: 1px solid #e2e2dd; padding: 14px }
  .num b { display: block; font-size: 24px; letter-spacing: -0.02em; margin-bottom: 4px }
  .num span { font-size: 12px; color: #6c6c66 }
  ol { padding-left: 20px } li { margin-bottom: 10px }
  footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e2dd; font-size: 12px; color: #6c6c66 }
  @media print { body { background: #fff; padding: 0 } .sheet { border: 0; padding: 0 } h2 { page-break-after: avoid } tr { page-break-inside: avoid } }
</style></head>
<body><div class="sheet">
  <p class="muted">Business report · Nextera Solution</p>
  <h1>${esc(report.business.name)}</h1>
  <p class="muted">${esc(report.business.typeLabel)}${report.business.city ? ` · ${esc(report.business.city)}` : ''}${lead?.name ? ` · prepared for ${esc(lead.name)}` : ''}</p>

  <div class="score">
    <b>${report.score.overall === null ? '—' : Math.round(report.score.overall)}</b>
    <span><span class="grade">${esc(g.label)}</span><br><span class="muted">out of 100, across ${report.score.answered} answered checks</span></span>
  </div>
  <p>${esc(g.body)}</p>

  <h2>Where you stand</h2>
  <div class="pillars">
    ${report.score.pillars
      .map(
        (p) => `<div><div style="display:flex;justify-content:space-between;font-size:13.5px">
          <span>${esc(p.label)}</span><span class="muted">${p.score === null ? 'not answered' : `${Math.round(p.score)}/100`}</span></div>
          <div class="bar"><i style="width:${p.score === null ? 0 : Math.round(p.score)}%"></i></div>
          <div class="muted" style="font-size:12.5px">${esc(p.blurb)}</div></div>`,
      )
      .join('')}
  </div>

  <h2>The money</h2>
  <div class="num">
    <div><b>${formatINR(m.revenue.grossRevenue)}</b><span>Gross billing / month</span></div>
    <div><b>${formatINR(m.deductions.total)}</b><span>Lost before you see it (${formatPct(m.deductions.rate)})</span></div>
    <div><b>${formatINR(m.profit.netProfit)}</b><span>Net profit (${formatPct(m.profit.netMargin)})</span></div>
    <div><b>${formatINR(report.money.visibleLeak)}</b><span>Visible going missing each month</span></div>
  </div>
  <p class="muted">${esc(m.verdict.body)}</p>

  <h2>First things to fix</h2>
  ${
    report.weakPoints.length
      ? `<ol>${report.weakPoints
          .map((w) => `<li><strong>${esc(w.label)}</strong> <span class="muted">(${esc(w.impact)} impact · ${esc(w.effortLabel)})</span><br>${esc(w.finding)}<br><em>${esc(w.fix)}</em></li>`)
          .join('')}</ol>`
      : '<p>Nothing scored as weak or missing among the questions answered.</p>'
  }

  <h2>Every check</h2>
  <table><thead><tr><th>Check</th><th>Status</th><th>What we saw</th><th>What to do</th></tr></thead>
  <tbody>${checkRows}</tbody></table>

  ${
    report.competition.assessed
      ? `<h2>Against the competitors you entered</h2>
         <p class="muted">These numbers were typed in from public listings by the person who filled this report — they were not fetched.</p>
         <table><tbody>${compRows}</tbody></table>`
      : ''
  }

  ${
    report.links.length
      ? `<h2>Links given</h2><table><tbody>${report.links
          .map(
            (l) =>
              `<tr><td>${esc(l.slot.label)}</td><td>${esc(l.parsed.ok ? l.parsed.href : l.parsed.raw)}</td><td>${l.findings
                .map((f) => esc(f.text))
                .join(' ')}</td></tr>`,
          )
          .join('')}</tbody></table>`
      : ''
  }

  <footer>
    Generated by the free Nextera Solution report tool. Every figure is an estimate derived from the inputs
    given above — it is not accounting, tax or legal advice, and it is not a promise of rankings, enquiries or
    bookings. No data was sent to a server: the report was produced in the browser that opened it.
  </footer>
</div></body></html>`
}

/** Plain-text dump of every check, for the founder who wants the raw list. */
export function reportToCsv(report) {
  const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`
  const head = ['Pillar', 'Check', 'Status', 'Weight', 'Finding', 'What to do']
  const rows = report.checks.map((c) => [
    c.pillar,
    c.label,
    c.status,
    c.weight,
    c.finding,
    c.fix,
  ])
  return [head, ...rows].map((r) => r.map(q).join(',')).join('\n')
}

/** Compact label used by the score ring and the summary bar. */
export function scoreLabel(score) {
  return score === null ? '—' : String(Math.round(score))
}

export { formatCompactINR }
