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
  /* Live business number, supplied by the founder on 2026-09-29. */
  phoneDisplay: '+91 92343 77413',
  phoneRaw: '+919234377413',
  /* TODO(founder): replace with the real monitored business email. */
  email: 'hello@nexterasolution.in',
  /* Location changed from "Agra" to a national footprint on the founder's
     instruction, 2026-09-29. The Services & Pricing v1.1 document lists
     "Jaipur, Rajasthan, India" — confirm which to use. */
  city: 'India',
  region: '',
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
  silver:
    "Hi Nextera Solution, I'd like details about the Silver bundle (₹42,000 — website development).",
  gold:
    "Hi Nextera Solution, I'd like details about the Gold bundle (₹85,000 — website + customer experience + online presence).",
  platinum:
    "Hi Nextera Solution, I'd like details about the Platinum bundle (₹1,05,000 — the complete growth system).",
  web:
    "Hi Nextera Solution, I'd like a quote for premium website development & database.",
  cx:
    "Hi Nextera Solution, I'd like a quote for the smart customer experience system (enquiry automation & follow-ups).",
  presence:
    "Hi Nextera Solution, I'd like a quote for online presence & marketing infrastructure (local SEO, Google Business Profile, reviews).",
  whatsapp:
    "Hi Nextera Solution, I'd like a quote for WhatsApp automation & CRM.",
  support:
    "Hi Nextera Solution, I'd like details about your monthly support plans (Starter / Growth / Scale).",
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
  sub: 'Nextera Solution builds the website, the automation and the online presence that turn a search into a real conversation — for ambitious businesses across India.',
  primary: { label: 'See the bundles', to: '/pricing#silver' },
  secondary: { label: 'Request a free audit', to: '/contact' },
  stats: [
    { value: '₹42,000', unit: 'from', label: 'Silver bundle, one-time' },
    { value: '1–2', unit: 'weeks', label: 'Typical website delivery, by scope' },
    { value: '6', unit: 'months', label: 'Free support included with Platinum' },
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
/* -------------------------------------------------------------------------- */
/* SERVICE CATALOGUE — Nextera Solution "Services & Pricing" v1.1, §2          */
/* Four core categories. Every field below is transcribed from that document;   */
/* nothing is invented. Each can be bought alone or combined into a bundle.    */
/* -------------------------------------------------------------------------- */
export const SERVICES = [
  {
    id: 'web',
    icon: 'window',
    title: 'Premium Website Development & Database',
    lede: 'Premium digital storefronts built to convert visitors into customers.',
    body: 'Your website is your 24/7 salesperson. We build fast, secure, premium websites engineered to build trust and turn visitors into paying customers — not just pretty pages that sit there.',
    audience: [
      'Hotels & Resorts',
      'Clinics & Healthcare',
      'Restaurants',
      'Service Businesses',
      'Educational Institutes',
    ],
    includes: [
      'Custom website design (no templates)',
      'Online booking / enquiry system',
      'Fast loading — under 2.5 seconds',
      'Database & content management (CMS)',
      'Mobile-first responsive design',
      'Google Maps, reviews & trust badges',
      'SEO-ready structure from day one',
      'Speed optimization & performance tuning',
      'Lead capture forms & WhatsApp integration',
      'Basic analytics & conversion tracking',
    ],
    process: [
      'We study your business, competitors and customers',
      'We design a custom wireframe and visual concept for your approval',
      'We build, test and optimize your website',
      'We deploy and connect analytics',
      'We support, update and optimize as you grow',
    ],
    faqs: [
      {
        q: 'How long does website development take?',
        a: 'Most websites are delivered in 1–2 weeks depending on scope. A custom timeline is shared before work starts.',
      },
      {
        q: 'Will my website work on mobile?',
        a: 'Yes. Every website is mobile-first and tested on real devices. Most of your customers will visit from a phone.',
      },
    ],
    /* Priced separately — drawn from the document's Add-On Services list. */
    notIncluded: [
      'Logo & brand identity design',
      'Content writing & photography',
      'Multi-language support',
      'Video & 3D production',
    ],
    startingPoint: 'Custom quote',
  },
  {
    id: 'cx',
    icon: 'chat',
    title: 'Smart Customer Experience System',
    lede: 'Automated systems that answer, follow up and convert — even at 2 AM.',
    body: 'Most businesses lose customers because they respond too late. Our smart systems capture enquiries instantly, follow up automatically and nurture leads until they are ready to buy.',
    audience: [
      'Clinics & Doctors',
      'Hotels',
      'Real Estate',
      'Consultants',
      'Coaches & Trainers',
    ],
    includes: [
      'Instant enquiry response automation',
      'Repeated-customer loyalty automation',
      'Automated follow-up sequences',
      'Patient / client follow-up system',
      'Appointment booking automation',
      'Lead scoring & prioritization',
      'Smart reminders (SMS / WhatsApp)',
      'Detailed reports on response times',
      'Customer feedback & review generation',
      'Multi-channel inbox (all in one place)',
    ],
    process: [
      'We map your customer journey and find the gaps',
      'We design an automated system for each stage',
      'We set up and connect all tools',
      'We test every flow end-to-end',
      'We monitor results and refine monthly',
    ],
    faqs: [
      {
        q: 'Do I need to change my current tools?',
        a: 'Not necessarily. We build around what you already use and add what is missing.',
      },
      {
        q: 'How fast can responses be automated?',
        a: 'Instant. The moment an enquiry arrives, your automated reply is sent — usually within 5 seconds.',
      },
    ],
    notIncluded: ['Advanced analytics dashboards', 'Training sessions for your team'],
    startingPoint: 'Custom quote',
  },
  {
    id: 'presence',
    icon: 'pin',
    title: 'Online Presence & Marketing Infrastructure',
    lede: 'Get found, get trusted and get chosen — across Google and social.',
    body: 'Having a website is not enough if customers cannot find you. We build your complete digital presence infrastructure: search visibility, reviews, local listings and marketing foundations.',
    audience: [
      'Local Businesses',
      'Retail',
      'Restaurants',
      'Service Providers',
      'Franchises',
    ],
    includes: [
      'Local SEO (Google Maps ranking)',
      'Google Ads / Meta Ads setup',
      'Google Business Profile optimization',
      'Meta Pixel & GA4 analytics setup',
      'On-page SEO for all pages',
      'Review management & generation',
      'Content strategy basics',
      'Reputation monitoring',
      'Social media page setup & optimization',
      'Monthly performance reporting',
    ],
    process: [
      'We audit your current online presence',
      'We fix the foundations (listings, speed, content)',
      'We optimize your pages and profiles',
      'We launch campaigns and tracking',
      'We report results and scale what works',
    ],
    faqs: [
      {
        q: 'How long until I see SEO results?',
        a: 'Local SEO typically shows improvement in 4–8 weeks. Rankings build gradually with consistent optimization.',
      },
      {
        q: 'Do you run Google Ads?',
        a: 'Yes. We set up and manage Google and Meta ad campaigns with clear budgets and reporting.',
      },
    ],
    notIncluded: [
      'Google Ads management (monthly)',
      'Meta Ads management (monthly)',
      'Monthly SEO packages (monthly)',
    ],
    startingPoint: 'Custom quote',
  },
  {
    id: 'whatsapp',
    icon: 'whatsapp',
    title: 'WhatsApp Automation & CRM',
    lede: 'Your most-used app, turned into your most powerful sales channel.',
    body: 'Indian customers love WhatsApp. We turn it into a complete business tool — automated replies, catalogs, broadcasts, order updates and a simple CRM — so no customer is ever missed.',
    audience: [
      'Retail & E-commerce',
      'Clinics',
      'Hotels',
      'Coaching Institutes',
      'Wholesale & Distribution',
    ],
    includes: [
      'WhatsApp Business setup & optimization',
      'Order / booking updates automation',
      'Automated greetings & away messages',
      'Simple CRM to track every conversation',
      'Product / service catalog setup',
      'Team inbox for multiple staff',
      'Broadcast campaigns (with compliance)',
      'Automated replies & quick replies',
      'Click-to-WhatsApp on website & ads',
      'Analytics on response and conversion',
    ],
    process: [
      'We audit how you currently use WhatsApp',
      'We set up and optimize your business profile',
      'We build automation flows for your use case',
      'We train your team on the system',
      'We review performance and improve monthly',
    ],
    faqs: [
      {
        q: 'Is this the official WhatsApp Business API?',
        a: 'We start with the free WhatsApp Business app, which works for most businesses. The official API can be added when your volume grows.',
      },
      {
        q: 'Can I use WhatsApp for bulk marketing?',
        a: 'Yes, with proper consent and compliance. We follow WhatsApp policies to keep your number safe.',
      },
    ],
    notIncluded: ['Official WhatsApp Business API (added when your volume grows)'],
    startingPoint: 'Custom quote',
  },
]

/* -------------------------------------------------------------------------- */
/* BUNDLES — Services & Pricing v1.1, §3. All prices one-time, in INR.         */
/* -------------------------------------------------------------------------- */
export const PACKAGES = [
  {
    id: 'silver',
    name: 'Silver',
    price: 42000,
    priceNote: 'one-time',
    bestFor: 'Website Development only',
    tagline: 'Entry-level price. Custom-quoted for larger scopes.',
    for: 'You need a credible, fast website that captures enquiries — nothing else yet.',
    highlight: false,
    cta: { label: 'Enquire about Silver', message: ENQUIRY_MESSAGES.silver },
    turnaround: '1–2 weeks',
    turnaroundNote: 'depending on scope; a custom timeline is shared before work starts',
    support: '1-month free support',
    includes: [
      'Custom website (up to 5 pages)',
      'Basic SEO setup',
      'Mobile-first design',
      'Lead capture forms + WhatsApp button',
      'Hosting & domain configuration',
      '1-month free support',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 85000,
    priceNote: 'one-time',
    bestFor: 'Website + Customer Experience + Online Presence',
    tagline: 'List value ₹91,500 · you save ₹6,500.',
    for: 'You want the website and the systems that answer and follow up on every enquiry.',
    highlight: true,
    badge: 'Best value',
    listValue: 91500,
    save: 6500,
    cta: { label: 'Enquire about Gold', message: ENQUIRY_MESSAGES.gold },
    turnaround: 'Shared before work starts',
    turnaroundNote: 'a custom timeline is agreed at the consultation',
    support: '3-month free support',
    includes: [
      'Everything in Silver',
      'Automated enquiry response system',
      'Local SEO optimization',
      'Appointment booking automation',
      'Analytics & tracking setup',
      'Google Business Profile setup',
      '3-month free support',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 105000,
    priceNote: 'one-time',
    bestFor: 'Everything — complete growth system',
    tagline: 'List value ₹1,11,500 · you save ₹6,500.',
    for: 'You want the whole system: website, automation, presence and WhatsApp sales.',
    highlight: false,
    listValue: 111500,
    save: 6500,
    cta: { label: 'Enquire about Platinum', message: ENQUIRY_MESSAGES.platinum },
    turnaround: 'Shared before work starts',
    turnaroundNote: 'a custom timeline is agreed at the consultation',
    support: '6-month free support',
    includes: [
      'Everything in Gold',
      'WhatsApp automation & CRM setup',
      'Priority support',
      'Review generation system',
      'Monthly strategy review (6 months)',
      'Social media profile setup',
      '6-month free support',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* ADD-ON SERVICES — §6. Enhance any bundle or category.                       */
/* -------------------------------------------------------------------------- */
export const ADD_ONS = [
  { t: 'Logo & brand identity design', billing: 'One-time, custom quote' },
  { t: 'Content writing & photography', billing: 'One-time, custom quote' },
  { t: 'Google Ads management', billing: 'Monthly, custom quote' },
  { t: 'Meta Ads management', billing: 'Monthly, custom quote' },
  { t: 'Monthly SEO packages', billing: 'Monthly, custom quote' },
  { t: 'Advanced analytics dashboards', billing: 'One-time, custom quote' },
  { t: 'Multi-language support', billing: 'One-time, custom quote' },
  { t: 'Video & 3D production', billing: 'One-time, custom quote' },
  { t: 'Training sessions for your team', billing: 'One-time, custom quote' },
]

/* -------------------------------------------------------------------------- */
/* MONTHLY SUPPORT PLANS — §7. Every bundle includes a free support period;    */
/* after that these keep systems updated, secure and performing.               */
/* -------------------------------------------------------------------------- */
export const SUPPORT_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    best: 'Best for a new website that needs to stay online and secure.',
    includes: 'Updates, uptime monitoring, monthly report',
    price: 'Custom quote',
  },
  {
    id: 'growth',
    name: 'Growth',
    best: 'Best for businesses actively publishing and optimizing.',
    includes: 'Starter + content updates, optimization, priority support',
    price: 'Custom quote',
  },
  {
    id: 'scale',
    name: 'Scale',
    best: 'Best for teams running continuous growth campaigns.',
    includes: 'Growth + monthly strategy review, campaigns, everything',
    price: 'Custom quote',
  },
]

/* -------------------------------------------------------------------------- */
/* HOW BUNDLE PRICING IS BUILT — §4. Indicative standalone values, used only   */
/* to explain bundle savings. Final pricing depends on scope and timeline.     */
/* -------------------------------------------------------------------------- */
export const COMPONENT_VALUES = [
  { t: 'Website Development (Silver scope)', value: 42000, silver: true, gold: true, platinum: true },
  { t: 'Smart Customer Experience System', value: 28000, silver: false, gold: true, platinum: true },
  { t: 'Online Presence & Local SEO', value: 21500, silver: false, gold: true, platinum: true },
  { t: 'WhatsApp Automation & CRM', value: 25000, silver: false, gold: false, platinum: true },
  { t: 'Review generation system', value: 6000, silver: false, gold: false, platinum: true },
  { t: 'Social profile setup', value: 4000, silver: false, gold: false, platinum: true },
  { t: 'Priority & strategy support', value: 5000, silver: false, gold: false, platinum: true },
]

export const COMPONENT_VALUES_NOTE =
  'Component values are indicative and used only to explain bundle savings. Final project pricing always depends on scope, features and timeline.'

/* -------------------------------------------------------------------------- */
/* 5-STEP GROWTH FRAMEWORK — §8                                                */
/* -------------------------------------------------------------------------- */
export const GROWTH_FRAMEWORK = [
  { n: '01', t: 'Discover', d: 'We study your business, competitors and customers to find the real growth gaps.' },
  { n: '02', t: 'Design', d: 'We design a custom concept and system blueprint for your approval.' },
  { n: '03', t: 'Deploy', d: 'We build, test and launch your website, automation and tracking.' },
  { n: '04', t: 'Optimize', d: 'We measure performance, test what works and refine continuously.' },
  { n: '05', t: 'Scale', d: 'We compound results with campaigns, content and monthly strategy.' },
]

/* -------------------------------------------------------------------------- */
/* PRICING FAQ — §9                                                            */
/* -------------------------------------------------------------------------- */
export const PRICING_FAQS = [
  {
    q: 'Why do you not show exact prices?',
    a: 'Every business is different — scope, pages, features and timelines all vary. We share a clear, itemized quote after understanding your needs, so you pay only for what creates value.',
  },
  {
    q: 'What determines the final pricing?',
    a: 'The number of pages, features, integrations, design complexity, content needs and timeline. Your free consultation gives us everything needed for an accurate quote.',
  },
  {
    q: 'Do you offer payment plans?',
    a: 'Yes. Most projects are split into an advance and milestone payments. Flexible options are discussed during the consultation.',
  },
  {
    q: 'Are there any hidden charges?',
    a: 'No. Your quote includes everything listed. Hosting and domain costs are transparently itemized (and you own both).',
  },
  {
    q: 'What if I only need a website?',
    a: 'That is exactly what the Silver bundle covers. You can always add systems and support later.',
  },
]

/* -------------------------------------------------------------------------- */
/* PAYMENT TERMS — §10                                                         */
/* -------------------------------------------------------------------------- */
export const PAYMENT_TERMS = [
  'A booking advance confirms your project and reserves your delivery slot.',
  'The balance is split into milestone payments released as each stage is approved.',
  'All quotes are itemized; there are no hidden charges.',
  'Hosting and domain costs are billed transparently and owned by you.',
  'Refund policy: the advance is refundable if work has not started (within 7 days).',
]

export const WHAT_HAPPENS_NEXT = [
  { n: 'Step 1', d: 'Book a free 30-minute consultation.' },
  { n: 'Step 2', d: 'We understand your business, goals and current gaps.' },
  { n: 'Step 3', d: 'You receive a clear, itemized proposal and timeline.' },
  { n: 'Step 4', d: 'Approve the scope and pay the booking advance.' },
  { n: 'Step 5', d: 'We build, launch and optimize — with support built in.' },
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
    body: 'For a property like yours, the website usually has one job: convince someone that this specific place is worth the enquiry. That means the rooms, the amenities, the location and the route from the station — stated plainly, with photos that are yours, and a way to ask a question in one tap.',
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
    tag: 'Hotel',
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
    tag: 'Clinic',
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
    a: 'Most websites are delivered in 1–2 weeks depending on scope, and larger bundles take longer because more systems are involved. A custom timeline is shared before work starts — after scope acceptance, advance verification, all required inputs and a capacity check. That is a planning range, not an automatic deadline. Missing content or slow feedback moves the date, and we tell you rather than quietly absorbing it.',
  },
  {
    q: 'Do you guarantee more calls or bookings?',
    a: 'No. We cannot honestly guarantee rankings, enquiry volume, bookings or revenue, and we will not put it in writing to win the job. What we do commit to is the agreed website, the agreed enquiry path, tested and working, and a monthly report that separates what happened from what we can attribute it to.',
  },
  {
    q: 'What does the payment look like?',
    a: 'A booking advance confirms your project and reserves your delivery slot; the balance is split into milestone payments released as each stage is approved. Monthly support plans are billed in advance. Every price is confirmed in a written scope before any invoice is raised, and the advance is refundable if work has not started within 7 days.',
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
      { label: 'Website development', to: '/services#web' },
      { label: 'Customer experience system', to: '/services#cx' },
      { label: 'Online presence & SEO', to: '/services#presence' },
      { label: 'WhatsApp automation & CRM', to: '/services#whatsapp' },
    ],
  },
  {
    heading: 'Packages',
    links: [
      { label: 'Silver · ₹42,000', to: '/pricing#silver' },
      { label: 'Gold · ₹85,000', to: '/pricing#gold' },
      { label: 'Platinum · ₹1,05,000', to: '/pricing#platinum' },
      { label: 'Add-on services', to: '/pricing#addons' },
      { label: 'Monthly support plans', to: '/pricing#support' },
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
    { l: 'Checks', v: 'Up to 21' },
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
      'Scores up to 21 checks across four pillars: findability, credibility, convertibility and money. Two of them only apply once you have given the link they check.',
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
      'Up to 21 checks across findability, credibility, convertibility and money',
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
    'The starting numbers are realistic for a business of this shape in India. They are not your numbers — change every field that you know better.',

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
