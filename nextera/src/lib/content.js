/* =============================================================================
   NEXTERA — CONTENT SOURCE OF TRUTH
   Everything on the site is rendered from this file.

   SOURCING MAP (see /home/user/uploads)
   · Brand, market, positioning .......... 05_BRD.md §1, §5 / 03_DECISION_REGISTER.md §6.1
   · Packages & prices ................. 07_SERVICE_CATALOGUE_AND_PRICING.md §5–7
   · Services, exclusions ............. 07_SERVICE_CATALOGUE_AND_PRICING.md §4, §5–7
   · Hotel / clinic boundaries ......... 07_SERVICE_CATALOGUE_AND_PRICING.md §8
   · Revisions, payment, client duties . 07_SERVICE_CATALOGUE_AND_PRICING.md §9, §10, §12
   · Claims discipline (no guarantees) . 13_SALES_SOP.md §2 (SALES-003)
   · Privacy posture .................. 17_SECURITY_PRIVACY_AND_COMPLIANCE.md §12, §13

   ⚠️ CONTACT_DETAILS below are PLACEHOLDERS. Per BR-013 / SALES-002 the site must
   never invent a contact detail. Replace them with the real business number and
   email before publishing.
   ============================================================================= */

export const CONTACT_DETAILS = {
  /* TODO(founder): replace with the real Nextera Solution business number. */
  phoneDisplay: '+91 98765 43210',
  phoneRaw: '+919876543210',
  /* TODO(founder): replace with the real monitored business email. */
  email: 'hello@nexterasolution.in',
  city: 'Agra',
  region: 'Uttar Pradesh',
  country: 'India',
  /* Response-time expectation. Support hours are still UNDECIDED per DEC-047,
     so this is deliberately soft rather than a contractual promise. */
  responseNote: 'Usually replied to within one working day',
  businessHoursLabel: 'Mon – Sat · 10:00 – 19:00 IST',
}

/** Builds a wa.me deep link with a pre-filled enquiry message. */
export function whatsappLink(message) {
  const text = encodeURIComponent(message)
  return `https://wa.me/${CONTACT_DETAILS.phoneRaw.replace(/\D/g, '')}?text=${text}`
}

export const ENQUIRY_MESSAGES = {
  general:
    "Hi Nextera Solution, I found you online. I'm interested in improving my business's website and enquiry path. Could we talk?",
  pilot:
    "Hi Nextera Solution, I'd like details about the Presence Pilot package (one-page website + WhatsApp enquiry).",
  foundation:
    "Hi Nextera Solution, I'd like details about the Presence Foundation package (multi-page website + Google Business Profile).",
  care:
    "Hi Nextera Solution, I have an existing website and I'm interested in Care & Presence (monthly maintenance).",
  tools:
    "Hi Nextera Solution — I ran my numbers through the free profit & leak calculator on your site. Could you sanity-check what it is telling me?",
  report:
    "Hi Nextera Solution — I generated the free business report on your site and I'd like to talk about what it found.",
}

/* -------------------------------------------------------------------------- */
/* NAVIGATION                                                                  */
/* -------------------------------------------------------------------------- */
export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Tools', to: '/tools' },
  { label: 'Report', to: '/report' },
  { label: 'Process', to: '/process' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

/* -------------------------------------------------------------------------- */
/* TRUST MARQUEE — niches we serve (DEC-003 priority: hotels, then clinics)    */
/* -------------------------------------------------------------------------- */
export const NICHES = [
  'Hotels & Homestays',
  'Dental Clinics',
  'Eye & Vision Clinics',
  'Physiotherapy',
  'Ayurvedic & Wellness',
  'Diagnostic Centres',
  'Coaching Institutes',
  'Boutiques & Showrooms',
  'Travel Agencies',
  'Restaurants & Cafés',
]

/* -------------------------------------------------------------------------- */
/* HERO                                                                        */
/* -------------------------------------------------------------------------- */
export const HERO = {
  line1: 'Your business is easy to find.',
  line2: 'Hard to contact.',
  sub: 'Nextera Solution builds the website, the WhatsApp enquiry path and the Google Business Profile that turn a search into a real conversation — for hotels and clinics across Agra.',
  primary: { label: 'Start with the Pilot', to: '/pricing#pilot' },
  secondary: { label: 'Request a free audit', to: '/contact' },
  stats: [
    { value: '3–5', unit: 'days', label: 'Pilot delivery, after inputs are in' },
    { value: '50%', unit: 'advance', label: 'Balance due before public launch' },
    { value: '2', unit: 'rounds', label: 'Consolidated revision rounds included' },
  ],
}

/* -------------------------------------------------------------------------- */
/* PROBLEM STATEMENT                                                           */
/* -------------------------------------------------------------------------- */
export const PROBLEMS = [
  {
    n: '01',
    title: 'No website, or a template that looks borrowed',
    body: 'A visitor decides in seconds. If the page does not clearly say what you are, where you are and how to reach you, they leave — and they do not tell you they left.',
  },
  {
    n: '02',
    title: 'The enquiry path breaks on mobile',
    body: 'A phone number that is hard to tap, a form that fails, a contact route that needs three steps. Every unnecessary step quietly costs you enquiries.',
  },
  {
    n: '03',
    title: 'Google Business Profile says something different',
    body: 'Wrong hours, old number, missing photos, unanswered reviews. Customers compare your listing to your website and trust the one that agrees with itself.',
  },
  {
    n: '04',
    title: 'Nobody follows up consistently',
    body: 'Enquiries arrive in a personal number, get answered once, and vanish. The work is not hard — the problem is that nothing is written down.',
  },
]

/* -------------------------------------------------------------------------- */
/* SERVICES — from 07_SERVICE_CATALOGUE_AND_PRICING.md §4                     */
/* -------------------------------------------------------------------------- */
export const SERVICES = [
  {
    id: 'web',
    icon: 'window',
    title: 'Websites',
    lede: 'One-page presence or a proper small multi-page site, built mobile-first around a single goal: a clear, low-friction enquiry path.',
    points: [
      {
        t: 'One responsive page',
        d: 'Up to six standard content sections, one primary language, your logo, colours and approved content.',
      },
      {
        t: 'Small multi-page site',
        d: 'Up to five standard pages on a shared design system — Home, Stay/Room Options, Property, Location, Contact.',
      },
      {
        t: 'Enquiry paths that work',
        d: 'Click-to-WhatsApp, an enquiry form, and up to two agreed entry points using one defined routing method.',
      },
      {
        t: 'Technical groundwork',
        d: 'Page titles, descriptions, logical structure, fast loads, and a staging preview you review before anything goes live.',
      },
    ],
    notIncluded: [
      'Booking engines and payment gateways',
      'Patient portals or record systems',
      'Official WhatsApp API or chatbot integrations',
      'Multi-location architecture and CMS migration',
    ],
  },
  {
    id: 'whatsapp',
    icon: 'chat',
    title: 'WhatsApp enquiry setup',
    lede: 'The shortest path between a customer who has decided to enquire and a human who can answer — tested end to end before launch.',
    points: [
      {
        t: 'Click-to-chat on every page',
        d: 'A pre-filled WhatsApp action that opens the right conversation with the right context, so you are not starting from zero.',
      },
      {
        t: 'One routing method, clearly defined',
        d: 'We agree where enquiries land, who watches it, and what happens if someone is unavailable — and it is written down.',
      },
      {
        t: 'Lightweight enquiry form',
        d: 'Only the fields the enquiry actually needs, reaching a destination you control. No unnecessary personal data collected.',
      },
      {
        t: 'Tested before launch',
        d: 'Every contact link and form is submitted and verified end to end. A screenshot is not proof that a submission arrived.',
      },
    ],
    notIncluded: [
      'Automated marketing blasts via WhatsApp Business API',
      '24/7 unattended response',
      'Official API messaging — not yet offered',
    ],
  },
  {
    id: 'gbp',
    icon: 'pin',
    title: 'Google Business Profile',
    lede: 'The listing most local customers actually see. We make it accurate, complete and consistent with your website.',
    points: [
      {
        t: 'Profile audit first',
        d: 'A prioritised list of what is wrong, what is missing, and what we can and cannot fix — before any work is quoted.',
      },
      {
        t: 'Authorized corrections',
        d: 'Contact details, hours, website URL, description and business information, using access you authorise and platform rules.',
      },
      {
        t: 'Ongoing upkeep',
        d: 'Up to four posts or updates per month under Care & Presence, where appropriate and authorized.',
      },
      {
        t: 'Review response drafts',
        d: 'Up to 20 drafted replies per month, in your voice. We respond to genuine reviews; we never write fake ones.',
      },
    ],
    notIncluded: [
      'Guaranteed verification or ranking',
      'Suspension recovery and ownership disputes',
      'Duplicate-profile resolution',
      'Keyword-stuffed business names or false categories',
    ],
  },
  {
    id: 'care',
    icon: 'shield',
    title: 'Care & Presence',
    lede: 'Monthly upkeep for a site we built, or a site you already have. Real recurring work, not a relabelled one-off project.',
    points: [
      {
        t: 'Two small updates a month',
        d: 'One existing page, up to three existing text or image blocks, per request. Anything bigger becomes a change request.',
      },
      {
        t: 'Enquiry-flow check',
        d: 'One scheduled cycle per month verifying that your contact paths still work end to end.',
      },
      {
        t: 'Monthly report',
        d: 'Work completed, issues found, available performance data with its source and limits, and one prioritised recommendation.',
      },
      {
        t: 'Honest allowances',
        d: 'Unused allowances do not roll over, and we do not publish filler content to justify a quota.',
      },
    ],
    notIncluded: [
      '24/7 support or unlimited requests',
      'Paid advertising or full SEO campaigns',
      'Emergency rebuilds of a pre-existing broken site',
      'Major redesigns',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* PACKAGES — 07_SERVICE_CATALOGUE_AND_PRICING.md §5, §6, §7                  */
/* NOTE: prices are PROPOSED, not approved (DEC-035). Edit in one place here. */
/* -------------------------------------------------------------------------- */
export const PACKAGES = [
  {
    id: 'pilot',
    name: 'Presence Pilot',
    price: 6000,
    priceNote: 'one-time',
    tagline: 'For a qualified business needing a clear first improvement without a full project.',
    for: 'You need to look credible and be contactable — fast — on a sensible budget.',
    cta: { label: 'Start with the Pilot', message: ENQUIRY_MESSAGES.pilot },
    turnaround: '3–5 working days',
    turnaroundNote: 'after scope acceptance, advance verification, inputs received and capacity confirmed',
    includes: [
      'One responsive page, up to six content sections',
      'One primary language',
      'Click-to-WhatsApp enquiry action',
      'One minimal enquiry form (where handling is available)',
      'Contact and location information',
      'Basic page title and description',
      'Google Business Profile audit with prioritised findings',
      'Staging preview, defined QA and handover',
    ],
    excludes: [
      'GBP correction execution',
      'Booking engine, patient portal, payment gateway',
      'Official WhatsApp API, chatbot or voice agent',
      'Ongoing SEO, ongoing maintenance, extra languages',
      'Photography, logo redesign, complex site migration',
    ],
    copyNote:
      'We turn your supplied, approved facts into concise website copy. That does not include extensive interviews, independent verification of every claim, or unlimited rewriting.',
    highlight: false,
  },
  {
    id: 'foundation',
    name: 'Presence Foundation',
    price: 15000,
    priceNote: 'one-time',
    tagline: 'For a business that needs a more complete website and coordinated public information.',
    for: 'You are ready for several real pages, one clean enquiry route, and a Google listing that matches the website.',
    cta: { label: 'Enquire about Foundation', message: ENQUIRY_MESSAGES.foundation },
    turnaround: '7–10 working days',
    turnaroundNote: 'after required inputs and capacity confirmation',
    includes: [
      'Up to five standard pages on a shared design system',
      'Your logo, colours and approved content',
      'Mobile-responsive implementation',
      'Up to two agreed enquiry entry points, one routing method',
      'Click-to-WhatsApp enquiry setup',
      'Page titles, descriptions and logical structure',
      'Google Business Profile audit',
      'One approved batch of routine GBP corrections',
      'Basic measurement setup where appropriate',
      'Staging, QA, launch and handover',
    ],
    excludes: [
      'Unlimited pages, complex CMS migration',
      'Multi-location architecture, custom integrations',
      'Backlink campaigns or full search strategy',
      'Everything excluded from the Pilot, unless explicitly added',
    ],
    copyNote:
      'Example structure for a hotel: Home · Stay Options · Property & Amenities · Location · Contact. For a clinic: Home · About · Services · Clinic Information · Contact. These are starting points, not fixed layouts.',
    highlight: true,
  },
  {
    id: 'care',
    name: 'Care & Presence',
    price: 4000,
    priceNote: 'per month',
    recurring: true,
    tagline: 'For ongoing upkeep of a site we built, or one you already have.',
    for: 'Your site is maintainable and you want it looked after without thinking about it every month.',
    cta: { label: 'Discuss monthly care', message: ENQUIRY_MESSAGES.care },
    turnaround: 'Monthly cycle',
    turnaroundNote: 'billed in advance under the recurring agreement',
    includes: [
      'Up to 2 small website updates',
      'Up to 4 GBP posts or updates, where appropriate and authorized',
      'Up to 20 review-response drafts',
      '1 enquiry-flow check cycle',
      '1 monthly report',
      '1 prioritised improvement recommendation',
    ],
    allowanceTable: [
      { k: 'Small website update', v: 'Covers one existing page, up to three existing text/image blocks' },
      { k: 'GBP post or update', v: 'Up to four per month, where appropriate and authorized' },
      { k: 'Review-response draft', v: 'Up to twenty per month' },
      { k: 'Enquiry-flow check', v: 'One scheduled cycle per month' },
      { k: 'Monthly report', v: 'One, with sources and limitations stated' },
    ],
    excludes: [
      'Daily monitoring or 24/7 support',
      'Unlimited requests or continuous lead generation',
      'Full SEO campaigns, paid ads, messaging usage',
      'Major malware recovery or full redesign',
      'Content needing specialist professional review',
    ],
    copyNote:
      'Before a retainer starts we check the stack, access, existing defects and backup feasibility. A pre-existing broken website is not automatically repaired under the monthly fee — that is assessed and scoped separately.',
    highlight: false,
  },
]

export const COMMERCIAL_TERMS = {
  payment: [
    '50% advance to begin work',
    '50% due before the site goes public, under agreed terms',
    'Monthly care is billed in advance under the recurring agreement',
  ],
  revisions: [
    'Two consolidated revision rounds are included',
    'A round is one organised feedback list against the current preview',
    'In-scope text changes, image swaps and minor layout adjustments within the agreed direction',
    'A new design direction, extra pages, extra languages or new integrations are change requests',
  ],
  whoIsResponsible: [
    'Accurate business information and approved claims',
    'One authorised decision-maker for approvals',
    'Licensed or owned images and text',
    'Timely, consolidated feedback',
    'Applicable payment as per the agreed milestones',
    'Staff participation if a new enquiry route requires it',
  ],
  honesty: [
    'No guaranteed rankings, leads, bookings or revenue',
    'No medical advice, diagnosis or clinical functionality',
    'No fake reviews, misleading credentials or unauthorised account control',
    'Third-party costs — domain, hosting, messaging, model usage — are disclosed, never absorbed silently',
  ],
}

/* -------------------------------------------------------------------------- */
/* PROCESS — 13_SALES_SOP.md + 05_BRD.md §12                                  */
/* -------------------------------------------------------------------------- */
export const PROCESS = [
  {
    n: '01',
    title: 'Free audit',
    body: 'We look at your website, your Google listing and the path a real customer takes on a phone. You get the findings first — before any conversation about money.',
    meta: 'You get: a written list of what is wrong, in priority order',
  },
  {
    n: '02',
    title: 'Short call',
    body: 'About 15–25 minutes, only if it is useful to you. We ask how customers find you today, who handles enquiries, and what you actually want to change.',
    meta: 'You get: a straight recommendation, including if the answer is "not yet"',
  },
  {
    n: '03',
    title: 'Scoped proposal',
    body: 'A written scope: exactly what gets built, what is explicitly excluded, what we need from you, the price, the timeline and the acceptance criteria.',
    meta: 'You get: one document you can read carefully before deciding',
  },
  {
    n: '04',
    title: 'Build and preview',
    body: 'We build on a staging link. You review it on your own phone, send one organised list of feedback, and we work through two rounds of revision.',
    meta: 'You get: a live preview link, not screenshots',
  },
  {
    n: '05',
    title: 'QA and launch',
    body: 'Every contact action and form is submitted and verified for real. Mobile layout, page speed, factual accuracy against what you approved — then you give the go-ahead.',
    meta: 'You get: a tested, published site and a handover of your assets and access',
  },
  {
    n: '06',
    title: 'Care, if you want it',
    body: 'Ongoing monthly upkeep with defined allowances, a monthly report, and one prioritised recommendation. Or you take it in-house with everything documented.',
    meta: 'You get: a site that stays correct after launch',
  },
]

/* -------------------------------------------------------------------------- */
/* NICHE BOUNDARIES — 07_SERVICE_CATALOGUE_AND_PRICING.md §8                  */
/* -------------------------------------------------------------------------- */
export const NICHES_DETAIL = [
  {
    id: 'hotels',
    label: 'Hotels & Homestays',
    headline: 'A stay page that sells the room before they call.',
    body: 'For properties in Agra, the website usually has one job: convince someone that this specific place is worth the enquiry. That means the rooms, the amenities, the location and the route from the station — stated plainly, with photos that are yours, and a way to ask a question in one tap.',
    allowed: [
      'Property information and approved room descriptions',
      'Amenities, location and directions',
      'Enquiry links and booking-request routing',
    ],
    notAllowed: [
      'Live availability or confirmed reservations',
      'Automated rate, discount or refund promises',
      'Any booking system without a verified integration',
    ],
  },
  {
    id: 'clinics',
    label: 'Clinics & Practices',
    headline: 'An administrative site. Strictly that.',
    body: 'Clinic content needs an authorised factual approver, and the boundary is simple: we present approved business and practitioner information, timings, location and administrative FAQs. We do not give medical advice, build patient-record systems, or make any clinical claim you have not approved in writing.',
    allowed: [
      'Approved business and practitioner information',
      'Timings, location and administrative FAQs',
      'Appointment requests, clearly framed as requests',
    ],
    notAllowed: [
      'Diagnosis, medical advice or prescription support',
      'Patient records or sensitive health-data collection',
      'Treatment recommendations or outcome claims',
      'Confirmed scheduling without authorisation',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* WHY / DIFFERENTIATION                                                      */
/* -------------------------------------------------------------------------- */
export const DIFFERENTIATORS = [
  {
    title: 'A defined scope, not a vibe',
    body: 'Every package states what is included, what is excluded, and what we need from you. No vague deliverables that quietly grow into a bigger invoice.',
  },
  {
    title: 'We test the enquiry, we do not assume it',
    body: 'We submit the form and tap the link ourselves. A screenshot proves nothing about whether an enquiry actually reached you.',
  },
  {
    title: 'Plain-language honesty',
    body: 'No guaranteed rankings. No guaranteed leads. If a service is not ready to sell — official WhatsApp automation, voice agents — we say so rather than pretending.',
  },
  {
    title: 'You own everything',
    body: 'Your domain, your profiles, your content and your access are yours. We retain only the reusable components we already built, and we say so in writing.',
  },
]

/* -------------------------------------------------------------------------- */
/* PROOF                                                                        */
/* -------------------------------------------------------------------------- */
/* Illustrative examples of the *shape* of delivery. Not client claims.
   Replace with real, permission-approved project records before publishing. */
export const WORK_EXAMPLES = [
  {
    tag: 'Hotel · Agra',
    title: 'Guest House Taj View',
    what: [
      'One-page presence built around rooms, amenities and location',
      'Click-to-WhatsApp on every section, pre-filled with page context',
      'GBP audit: 6 corrections + 3 unanswered reviews flagged',
    ],
    outcome: 'Planning range: 3–5 working days from input receipt',
    tone: 'ember',
  },
  {
    tag: 'Clinic · Agra',
    title: 'Brightline Dental Care',
    what: [
      'Four-page site with an approved-information-only content model',
      'Appointment request form collecting minimum necessary fields',
      'One batch of routine GBP corrections, client-authorized',
    ],
    outcome: 'Planning range: 7–10 working days from input receipt',
    tone: 'sky',
  },
  {
    tag: 'Ongoing · Monthly',
    title: 'Hotel Marigold Court',
    what: [
      'Monthly care: 2 updates, 3 GBP posts, 14 review replies',
      'One end-to-end enquiry-flow check across site and listing',
      'Monthly report separating activity from available performance data',
    ],
    outcome: 'Cycle closed with zero open critical issues',
    tone: 'mint',
  },
]

/* -------------------------------------------------------------------------- */
/* FAQ                                                                          */
/* -------------------------------------------------------------------------- */
export const FAQS = [
  {
    q: 'How fast can you go live?',
    a: 'The Presence Pilot is planned at 3–5 working days and Presence Foundation at 7–10 working days — but only after scope acceptance, advance verification, all required inputs and a capacity check. That is a planning range, not an automatic deadline. Missing content or slow feedback moves the date, and we tell you rather than quietly absorbing it.',
  },
  {
    q: 'Do you guarantee more calls or bookings?',
    a: 'No. We cannot honestly guarantee rankings, enquiry volume, bookings or revenue, and we will not put it in writing to win the job. What we do commit to is the agreed website, the agreed enquiry path, tested and working, and a monthly report that separates what happened from what we can attribute it to.',
  },
  {
    q: 'What does the payment look like?',
    a: 'The default structure is 50% advance to begin, and 50% due before the site goes public under agreed terms. Monthly Care & Presence is billed in advance. Every price is confirmed in a written scope before any invoice is raised.',
  },
  {
    q: 'Can I pay in instalments or get a discount?',
    a: 'Payment terms and any discount are decided by the founder after a scope conversation, not by an assistant or a chatbot. If the full package does not fit right now, a smaller first phase usually works better than a discount on something you cannot comfortably afford.',
  },
  {
    q: 'Do you work on existing websites?',
    a: 'For a monthly care plan, yes — but only after we have checked the technology, the access and any existing defects. A broken website is not automatically repaired under a monthly fee; that gets assessed and quoted separately.',
  },
  {
    q: 'Can you build a booking system or a patient portal?',
    a: 'Not as part of an initial package. A booking engine, payment gateway, patient-record system or official WhatsApp API integration needs its own scope, its own dependencies and a support plan. We will tell you early if that is the right route rather than forcing it into a package it does not fit.',
  },
  {
    q: 'What do you need from me to start?',
    a: 'Accurate business information, one person who can approve content, any images you own or have licensed, access to the Google listing if we are working on it, and one round of feedback on the preview. We send you one clear onboarding checklist so nothing is discovered late.',
  },
  {
    q: 'Who owns the website and the domain?',
    a: 'You do. The domain, the business profiles, the content and the access are yours. We retain only the reusable components that already existed in our toolkit, and that distinction is written into the agreement rather than left to assumption.',
  },
]

/* -------------------------------------------------------------------------- */
/* LEGAL / TRUST FOOTNOTES                                                     */
/* -------------------------------------------------------------------------- */
export const TRUST_FOOTNOTES = [
  {
    t: 'No ranking promises',
    d: 'Search results depend on factors outside anyone’s control. We sell the work we control, and we show you the data that is actually available.',
  },
  {
    t: 'Minimum-data enquiry forms',
    d: 'We collect only the fields your enquiry genuinely needs — and for clinics, explicitly no patient records, reports or health details.',
  },
  {
    t: 'You own the accounts',
    d: 'Your domain, listing and hosting stay under your ownership, with access delegated rather than transferred, so you are never locked in.',
  },
  {
    t: 'Cost disclosure',
    d: 'Domain, hosting, form handling, analytics and messaging costs are listed before you commit. No quiet recurring dependency.',
  },
]

export const FOOTER_LINKS = [
  {
    heading: 'Services',
    links: [
      { label: 'Websites', to: '/services#websites' },
      { label: 'WhatsApp enquiry setup', to: '/services#whatsapp' },
      { label: 'Google Business Profile', to: '/services#gbp' },
      { label: 'Care & Presence', to: '/services#care' },
    ],
  },
  {
    heading: 'Packages',
    links: [
      { label: 'Presence Pilot', to: '/pricing#pilot' },
      { label: 'Presence Foundation', to: '/pricing#foundation' },
      { label: 'Care & Presence', to: '/pricing#care' },
      { label: 'What is excluded', to: '/pricing#exclusions' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'How we work', to: '/process' },
      { label: 'About Nextera', to: '/about' },
      { label: 'Free audit request', to: '/contact' },
      { label: 'Common questions', to: '/#faq' },
    ],
  },
  {
    heading: 'Free tools',
    links: [
      { label: 'Business report generator', to: '/report' },
      { label: 'Profit & leak calculator', to: '/tools#profit-engine' },
      { label: 'What-if scenarios', to: '/tools#scenarios' },
      { label: 'Quick calculations', to: '/tools#quick' },
      { label: 'How the maths works', to: '/tools#method' },
    ],
  },
  {
    heading: 'Terms',
    links: [
      { label: 'Pricing basis', to: '/pricing#terms' },
      { label: 'What we never promise', to: '/about#integrity' },
      { label: 'Privacy approach', to: '/about#privacy' },
      { label: 'Request a callback', to: '/contact' },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* FREE REPORT — /report                                                      */
/* -------------------------------------------------------------------------- */
export const REPORT = {
  eyebrow: 'Free report',
  line1: 'Your business,',
  line2: 'on one honest page.',
  sub: 'Answer a few questions, paste the links you already have — your website, your Google profile, a booking or directory listing — and this builds a scored report: where you are visible, where people lose confidence, what the month actually leaves you, and what to fix first.',
  meta: [
    { l: 'Checks', v: '21' },
    { l: 'Time', v: 'About 4 minutes' },
    { l: 'Cost', v: 'Free' },
    { l: 'Uploads', v: 'None' },
  ],

  generateLabel: 'Jump to my report',
  generatingNote: 'The report updates as you type. Nothing is submitted anywhere.',

  freeTitle: 'Free, and it stays that way',
  freePoints: [
    'Your score and the three things costing you most, before you give us anything.',
    'The full breakdown, the money and the competitor gap unlock with a name and a number.',
    'Print it, download it as a single file, or send it to us on WhatsApp.',
  ],

  method: {
    eyebrow: 'What this is',
    title1: 'What it checks,',
    title2: 'and what it cannot.',
    lede: 'This page runs entirely in your browser. That is a real limitation, and it is better stated than hidden.',
    does: [
      'Scores 21 checks across four pillars: findability, credibility, convertibility and money.',
      'Checks each link you paste — the domain, https, whether the address is actually yours, and which platform it belongs to.',
      'Runs your numbers through the same profit, leak and break-even engine as the calculator.',
      'Compares you against competitors you enter, and ranks where you lose.',
    ],
    doesNot: [
      'It does not open your website or anybody else\u2019s. A page like this one cannot read another site\u2019s contents.',
      'It does not fetch review counts, ratings or competitor prices — you read those off the public listing and type them in.',
      'It does not rank you, predict enquiries, or promise any outcome. Nothing here is accounting or tax advice.',
      'It does not store or transmit anything. Refresh the page and your answers are still here, in this browser only.',
    ],
  },

  faqs: [
    {
      q: 'Is this the same as the audit you do by hand?',
      a: 'No. The paid audit is a person opening your listings, your competitors\u2019 listings and your enquiry path, and writing down what is wrong. This is you answering structured questions and getting the arithmetic and the priorities for free. Many people run this first and then decide whether the hand audit is worth it.',
    },
    {
      q: 'What do you do with my name and number?',
      a: 'They unlock the rest of the report and let us reply. They are kept in this browser and are not uploaded. If you press the WhatsApp button, your own WhatsApp opens with the summary already written — that is the only moment anything leaves your device, and you can delete it before sending.',
    },
    {
      q: 'How accurate is the score?',
      a: 'It is exactly as accurate as your answers. The weights are ours and they are published here: findability 30, credibility 25, convertibility 25, money 20. A question you leave blank is excluded rather than marked down, so an honest half-report beats a guessed full one.',
    },
    {
      q: 'Can you check a competitor for me?',
      a: 'Not from this page — we do not scrape. Each competitor row gives you a Google Maps and a Google search link, so you can read the real numbers off in about a minute and put them in.',
    },
  ],

  teaser: {
    eyebrow: 'Free report',
    line1: 'Four minutes,',
    line2: 'one honest page.',
    sub: 'Paste the links you already have and answer a few questions. You get a scored presence report, the leak in your numbers, and the three things worth fixing first.',
    bullets: [
      '21 checks across findability, credibility, convertibility and money',
      'Recognises Google, MakeMyTrip, Booking, Practo, Justdial and twelve more',
      'Print it, download it, or send it to us on WhatsApp',
    ],
    cta: { label: 'Generate my report', to: '/report' },
    secondary: { label: 'Just the calculator', to: '/tools#profit-engine' },
  },
}

/* -------------------------------------------------------------------------- */
/* FREE TOOLS — /tools                                                        */
/* -------------------------------------------------------------------------- */
/* The calculator itself (fields, presets, maths) lives in src/lib/calculator.js
   because it is logic, not copy. Everything written below is wording.        */

export const TOOLS = {
  eyebrow: 'Free tools',
  line1: 'Do the maths',
  line2: 'before you spend.',
  sub: 'A calculator built for how a hotel, clinic or restaurant actually bills — platform commission, no-shows, discounts, fixed cost, depreciation and tax. Put your real numbers in and it returns the profit, the leak, the break-even, and the gap to the number you actually want.',
  meta: [
    { l: 'Tools on this page', v: '4' },
    { l: 'Cost', v: 'Free' },
    { l: 'Your numbers', v: 'Stay in your browser' },
    { l: 'Sign-up', v: 'None' },
  ],

  calculator: {
    eyebrow: 'The main tool',
    title1: 'Your profit, your leak,',
    title2: 'your gap to target.',
    lede: 'Pick the closest business type to load realistic starting numbers, then replace them with your own. Every figure updates as you type — nothing is submitted anywhere.',
    resetLabel: 'Reload sample numbers',
    clearLabel: 'Clear everything',
    savedNote: 'Saved on this device only',
    resultTitle: 'Your month, honestly counted',
    leakTitle: 'Where the money goes before you see it',
    missedTitle: 'Revenue that never reached the bill',
    breakEvenTitle: 'Break-even',
    gapTitle: 'Gap to your target',
    routesTitle: 'Four ways to close it',
    adviceTitle: 'What these numbers are telling you',
    unitTitle: 'Per-unit economics',
  },

  /* Presets are starting points, and the page says so — this is the honesty
     line that keeps a founder from mistaking our numbers for theirs. */
  presetNote:
    'The starting numbers are realistic for a business of this shape in Agra. They are not your numbers — change every field that you know better.',

  assumptions: [
    {
      t: 'Percentages move with revenue, fixed costs do not',
      d: 'Commission, gateway fees, cancellations, discounts and variable cost are all treated as a share of billing. Rent, salaries and subscriptions are treated as due whatever happens.',
    },
    {
      t: 'Contribution is measured marginally',
      d: 'Break-even uses what one extra unit actually adds — price, minus the leak on it, minus its variable cost. Revenue that is not units × price (hotel F&B, clinic procedures) is credited against the fixed cost first.',
    },
    {
      t: 'Missed demand is never counted as profit',
      d: 'Enquiries nobody answered are shown separately, because that money was never billed. Folding it into revenue would flatter the number you are trying to check.',
    },
    {
      t: 'A price rise assumes customers stay',
      d: 'Real businesses lose some volume when they raise price, so treat the price route as an upper bound rather than a plan.',
    },
    {
      t: 'Depreciation is inside profit, outside break-even',
      d: 'It is a real cost of owning the asset, but it is not cash leaving the building this month, so the break-even line uses cash costs only.',
    },
    {
      t: 'This is planning maths, not accounting',
      d: 'It is not tax advice, not a substitute for your books, and it cannot see the cost line you forgot to enter. Check the output against one real month before you act on it.',
    },
  ],

  faqs: [
    {
      q: 'Is this financial or tax advice?',
      a: 'No. It is a planning tool that applies the arithmetic you give it. Your accountant sees your books, your depreciation schedule and your tax position — this page sees eight numbers you typed in. Use it to find the question worth asking them.',
    },
    {
      q: 'Where do my numbers go?',
      a: 'Nowhere. They are kept in your own browser’s local storage so you can come back to them, and nothing is sent to us or to anyone else. Clearing them is one button. The only thing that leaves your device is a WhatsApp message you deliberately send.',
    },
    {
      q: 'Why is “missed revenue” kept separate from profit?',
      a: 'Because it was never billed. Unanswered enquiries represent customers you did not get, not money taken out of money you received. Mixing the two would make a leaky enquiry path look like healthy demand.',
    },
    {
      q: 'My break-even looks different from my accountant’s.',
      a: 'Probably because of two choices: we exclude depreciation from the cash cost base, and we credit non-unit billing (F&B, procedures, add-ons) against fixed cost before dividing. Both are stated above, and both are defensible — just not identical to every other method.',
    },
    {
      q: 'My business is seasonal.',
      a: 'Use an average month, then run the what-if panel with a worse one — cut your utilisation and raise your cancellations. If the business only survives the good months, that is the finding, and it is better found here than in March.',
    },
    {
      q: 'My business type is not listed.',
      a: 'Choose “Something else”. The model is generic: units × price, minus what the platforms and your customers take, minus what it costs to deliver, minus what it costs to open the shutter. Every label is editable in the sense that you simply enter your own figures.',
    },
    {
      q: 'Will you look at my numbers with me?',
      a: 'Yes — that is the free audit. Send the summary the calculator produces and we will tell you which line we think is wrong, and whether a website or enquiry path would actually change it.',
    },
  ],

  /* Home-page teaser */
  teaser: {
    eyebrow: 'Free tools',
    line1: 'Know your leak',
    line2: 'before you buy anything.',
    sub: 'Before anyone sells you a website, an ad budget or a redesign, run your own numbers. Our free calculator shows your net profit, your platform and discount leak, your break-even and the gap to the number you want — in about four minutes.',
    bullets: [
      'Profit, loss and margin, line by line',
      'Revenue leaked to commission, discounts and no-shows',
      'Break-even in units, not in hope',
      'Four costed routes to a target profit',
    ],
    cta: { label: 'Open the calculator', to: '/tools' },
    secondary: { label: 'Or ask for the free audit', to: '/contact' },
  },
}
