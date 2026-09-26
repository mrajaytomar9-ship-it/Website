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
}

/* -------------------------------------------------------------------------- */
/* NAVIGATION                                                                  */
/* -------------------------------------------------------------------------- */
export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
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
    code: 'SVC-WEB',
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
    code: 'SVC-WA',
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
    code: 'SVC-GBP',
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
    code: 'SVC-CARE',
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
    code: 'PKG-PILOT-01',
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
    code: 'PKG-FOUNDATION-01',
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
    code: 'PKG-CARE-01',
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
    heading: 'Terms',
    links: [
      { label: 'Pricing basis', to: '/pricing#terms' },
      { label: 'What we never promise', to: '/about#integrity' },
      { label: 'Privacy approach', to: '/about#privacy' },
      { label: 'Request a callback', to: '/contact' },
    ],
  },
]
