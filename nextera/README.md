# Nextera Solution — website

A premium, multi-page marketing site for **Nextera Solution** — website, WhatsApp
enquiry path and Google Business Profile work for hotels and clinics in Agra.

Built with **Vite + React 18 + Tailwind CSS v4 + React Router**.

---

## 1. Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production bundle → dist/
npm run preview  # serve the built bundle locally
```

```bash
npm test         # 33 assertions over the calculator engine (node:test, no deps)
npm run test:ui  # mounts the real /tools page in jsdom and types into it
npm run smoke    # server-renders every route and checks the tools page output
npm run check    # all of the above + production build + CSS class coverage
```

---

## 2. Before you publish — required changes

### 2.1 Contact details  ⚠️ REQUIRED

Open `src/lib/content.js` and edit `CONTACT_DETAILS`:

```js
export const CONTACT_DETAILS = {
  phoneDisplay: '+91 98765 43210',   // ← replace
  phoneRaw:     '+919876543210',     // ← replace (no spaces, country code first)
  email:        'hello@nexterasolution.in', // ← replace
  // …
}
```

`phoneRaw` is what every WhatsApp deep link uses, so it must be digits only with
the country code and no `+`, spaces or dashes. Getting this wrong silently breaks
every WhatsApp button on the site.

Both values are currently **placeholders**. Your business requirements (BR-013,
and `SALES-002` in the Sales SOP) explicitly forbid publishing invented contact
details, so these must be real before the site goes live.

### 2.2 Prices  ⚠️ CHECK BEFORE PUBLISHING

All three package prices in `src/lib/content.js` → `PACKAGES` come from the
**proposed** figures in your service catalogue:

| Package | Price | Source |
|---|---|---|
| Presence Pilot | ₹6,000 one-time | `PKG-PILOT-01` |
| Presence Foundation | ₹15,000 one-time | `PKG-FOUNDATION-01` |
| Care & Presence | ₹4,000 / month | `PKG-CARE-01` |

These are marked `commercial_status: PROPOSED` in
`07_SERVICE_CATALOGUE_AND_PRICING.md`, tied to `DEC-035`, which is **not yet
approved**. Either get `DEC-035` approved, or edit the `price` fields here before
publishing. They appear in four places, all driven from the same object:

- home page package preview
- `/pricing` cards
- the `/pricing` comparison table
- the contact page package chips

### 2.3 Work examples

`WORK_EXAMPLES` in `src/lib/content.js` are **illustrative examples of the shape of
delivery**, not real client records. They are labelled as such on the page. Replace
them with real, permission-approved projects before launch, or keep the disclaimer.

### 2.4 SEO

`index.html` holds the default title, description and canonical URL. Update
`https://nexterasolution.in/` to your real domain. Individual page titles are set
in `src/components/Layout.jsx` via the `title` prop on each `<Route>`.

---

## 3. Editing content

**All site copy lives in one file: `src/lib/content.js`.** You should not need to
touch a component to change a price, a feature list or a FAQ.

| Export | What it drives |
|---|---|
| `CONTACT_DETAILS` | Phone, email, location, response time |
| `NAV` | Main navigation (both desktop and mobile) |
| `HERO` | Home page headline, sub-copy, hero stats |
| `NICHES` | The scrolling marquee strips |
| `PROBLEMS` | Home "found on Google, lost before the call" grid |
| `SERVICES` | All four service pages, plus the home services grid |
| `PACKAGES` | Every price and package list on the site |
| `COMMERCIAL_TERMS` | Payment, revisions, client duties, honest limits |
| `PROCESS` | `/process` timeline and `/about` commitments |
| `NICHES_DETAIL` | Hotel / clinic scope boundaries on `/services` |
| `DIFFERENTIATORS` | "Where we hold the line" grid |
| `WORK_EXAMPLES` | Recent work cards |
| `FAQS` | Home accordion |
| `TRUST_FOOTNOTES` | `/about` integrity section |
| `FOOTER_LINKS` | Footer link columns |
| `TOOLS` | `/tools` page copy, assumptions, FAQ, home teaser |

### Adding a service

Append to `SERVICES` with a unique `id`, then add a matching entry to
`SERVICE_META` in `src/pages/Services.jsx` and a `<ServiceSection>` call. Icons come
from `src/components/ServiceIcon.jsx` — add a new path there if you need one.

---

## 4. Design system

Defined as Tailwind v4 `@theme` tokens in `src/index.css`.

| Token | Value | Use |
|---|---|---|
| `--color-void` | `#000` | Page background |
| `--color-ink` | `#f4f4f2` | Primary text |
| `--color-ash` / `ash2` / `ash3` | 3 greys | Secondary → tertiary text |
| `--color-ember` | `#e8922f` | Brand accent, used sparingly |
| `--color-mint` | `#4fd1a5` | Positive states, WhatsApp, confirmations |
| `--color-rule` | `rgba(255,255,255,.075)` | Hairline borders |

Utility classes worth knowing:

- `.shell` — 1360px max-width container
- `.band` — standard section vertical rhythm
- `.t-hero` / `.t-h2` / `.t-h3` — display type scale
- `.fade-line` — gradient-faded second line of a headline
- `.micro` — 10px uppercase letter-spaced label
- `.hatch` — diagonal stripe band (section separators)
- `.card-dark` / `.glass` — surface treatments
- `.cq-wrap` — establishes a container-query context for display type

**Important:** display headlines are sized in `cqi` (container query) units, not
`vw`. A headline inside a narrow grid column sizes to *its column*, not the
viewport. If you put a `.t-h2`/`.t-h3` inside a flex child that can shrink, add
`cq-wrap` to that child or give it a `flex-1` basis — otherwise the container can
collapse to zero width.

---

## 5. Project structure

```
src/
  lib/content.js          ← all copy, prices, services, FAQ, tools wording
  lib/calculator.js       ← the calculation engine (pure functions, no React)
  lib/calculator.test.mjs ← node:test suite for that engine
  components/
    Layout.jsx            ← page shell, scroll manager, per-route <head>
    Navbar.jsx            ← desktop nav + mobile sheet + WhatsApp glyph
    Footer.jsx
    PageHero.jsx          ← interior page masthead
    CtaBand.jsx           ← the recurring call-to-action panel
    Mockups.jsx           ← the six "product" visuals (audit, chat, GBP…)
    ServiceIcon.jsx       ← icon set
    ui/
      Button.jsx          ← primary / secondary / ghost / accent variants
      Reveal.jsx          ← scroll-triggered fade + lift
      Marquee.jsx         ← infinite ticker
      Primitives.jsx      ← Grain, PageFrame, Rule, SectionHead, hooks
    tools/
      CalcForm.jsx        ← the input side, generated from FIELD_GROUPS
      CalcResults.jsx     ← P&L, leaks, break-even, gap, recommendations
      Levers.jsx          ← the what-if panel
      QuickTools.jsx      ← three small standalone calculators
      fields.jsx          ← shared inputs, rows, meters, tiles
  pages/
    Home.jsx  Services.jsx  Pricing.jsx  Tools.jsx
    Process.jsx  About.jsx  Contact.jsx  NotFound.jsx
scripts/
  ssr-smoke.jsx           ← renders all 8 routes to string and asserts content
  interaction-test.jsx    ← mounts /tools in jsdom and drives it like a user
  jsdom-setup.mjs         ← jsdom globals; must load before react-dom
  class-check.mjs         ← every utility class in src/ exists in the built CSS
```

---

## 5.1 The free tools page (`/tools`)

Four tools, all client-side, nothing uploaded.

| Tool | What it answers |
|---|---|
| Profit & leak engine | Net profit, gross/operating margin, revenue leaked to commission, gateway, cancellations and discounts, revenue never billed, break-even, gap to target |
| What-if panel | What one change does — recover leaks, move bookings direct, change price, change fixed cost, answer more enquiries |
| Break-even in units | Sales per month/day before the month stops losing money |
| Price for a margin | What to charge so the margin survives the platform cut |
| Ignored-enquiry cost | What slow replies cost in rupees, on your own conversion rate |

**Everything numeric lives in `src/lib/calculator.js`** — pure functions, no
React, no DOM. The page only renders what that module returns. That is why the
engine has its own test suite (`npm test`, 33 assertions) and why a change to
the maths cannot silently disagree with the numbers on screen.

The model, in order:

1. `capacity × utilisation × period` → billable units
2. `units × price + other billing` → gross revenue
3. platform commission, gateway fee, cancellations, discounts (each a % of
   gross) → **net revenue**; the four are also reported individually as *leaks*
4. enquiries nobody answered × conversion × price → **missed revenue**, reported
   separately because it was never billed
5. variable cost (% of net revenue), fixed cost lines, depreciation
6. gross profit → EBITDA → EBIT → tax → **net profit** → retained after owner draw
7. break-even = cash fixed cost (less the contribution from non-unit billing)
   ÷ **marginal** contribution per unit
8. gap to target, with four costed routes to close it

The assumptions behind all of it are printed on the page itself
(`TOOLS.assumptions`), including the two choices that make this break-even
differ from an accountant's: depreciation is excluded from the cash cost base,
and non-unit billing is credited against fixed cost first.

To add a field: append it to the right group in `FIELD_GROUPS`, add a value for
it to every entry in `BUSINESS_TYPES`, and use it in `computeMetrics`. The form
picks the new field up automatically; per-type wording goes in that type's
`labels` / `hints` maps.

**Privacy:** inputs are stored in `localStorage` under `nextera.tools.v1` and
nowhere else. The only thing that can leave the device is a WhatsApp message the
founder deliberately sends, which contains the printed summary.

## 5.2 Responsive behaviour

The site is mobile-first and the layout is verified at three widths: phone
(≤640px), tablet (640–1279px) and desktop (≥1280px).

| Concern | Rule used |
|---|---|
| Container | `.shell` — 20px gutters, 40px from 768px, 56px from 1280px |
| Display type | `cqi` container units, not `vw`, so a headline sizes to its column |
| Wide tables | `overflow-x-auto` wrapper + `min-w-[720px]` table, with a "swipe sideways" hint below `md` |
| Mobile nav sheet | `.sheet-scroll` caps it at the viewport and lets it scroll (`100dvh` with a `100vh` fallback) — a seventh nav item no longer clips the buttons on a short phone |
| Form inputs | 16px below 640px so iOS Safari does not zoom the page on focus; 14px above |
| Tap targets | 46px fields, 48px sheet buttons |
| Fixed bottom bar (`/tools`) | `xl:hidden`, `env(safe-area-inset-bottom)` padding, plus a spacer so it never covers the footer |
| Calculator results | sticky right column from `xl`, single column with a live summary bar below it |
| Chip rows | horizontal scroll with `snap-x` on a phone, `flex-wrap` from `sm` |

Two checks guard this without a browser:

```bash
npm run check     # engine tests + interaction test + build + class coverage + smoke
npm run check:css # builds, then proves every utility class in src/ exists in
                  # the emitted stylesheet (a typo renders as a silent no-op)
npm run test:ui   # mounts the real Tools page in jsdom, types a new rate,
                  # types garbage, switches business type, moves a what-if
                  # lever — and asserts the numbers on screen equal the numbers
                  # computeMetrics() returns for the same inputs
npm run smoke     # server-renders all eight routes and asserts: the tools page
                  # contains its numbers and sections, every route has exactly
                  # one <h1>, every input has a label, every button has an
                  # accessible name, and the nav/footer/home all link to /tools
```

`test:ui` needs `react-dom` to be imported *after* the jsdom globals exist, or
React silently falls back to its legacy input handling and `onChange` never
fires. `scripts/jsdom-setup.mjs` installs the globals and `interaction-test.jsx`
imports React dynamically for exactly that reason — keep that order if you edit
either file.

Those two checks cover the ways a responsive layout usually dies without a
console error: a class that was never generated, and a component that throws
before it paints. Neither replaces looking at the site on a phone — the numbers
and the copy are still worth reading at 375px.

## 6. How the enquiry form works

The contact form is **WhatsApp-first**, by design — it matches your `SVC-WA-01`
service and needs no backend, so there is no lead database to lose or breach.

1. The user fills fields or taps chips.
2. A live preview renders the exact WhatsApp message that will be sent.
3. Submitting opens `wa.me/<number>?text=<encoded message>`.

Nothing is stored server-side and nothing is transmitted except that message to
your business number. This is stated on the page.

If you later want to *capture* leads in a database, the cleanest options are a
Formspree/Web3Forms endpoint (no server needed) or a Netlify/Vercel serverless
function. Add it as the `action` on the form in `src/pages/Contact.jsx`.

---

## 7. Deployment

Static output — any static host works, all have free tiers.

**Vercel / Netlify**
- Build command: `npm run build`
- Output directory: `dist`

**Routing:** the site uses client-side routes, so the host must rewrite unknown
paths to `index.html`. Both Vercel and Netlify handle this automatically for Vite
projects. For other hosts add:

```
/*  →  /index.html  (200 rewrite)
```

---

## 8. Content sourcing

Every claim on the site traces to your business documents:

| Site content | Source document |
|---|---|
| Positioning, Agra focus, hotel/clinic niches | `05_BRD.md` §1, §5 · `03_DECISION_REGISTER.md` §6.1 |
| Packages, prices, inclusions, exclusions | `07_SERVICE_CATALOGUE_AND_PRICING.md` §5–7 |
| Service definitions | `07_SERVICE_CATALOGUE_AND_PRICING.md` §4 |
| Hotel / clinic boundaries | `07_SERVICE_CATALOGUE_AND_PRICING.md` §8 |
| Revision + payment terms | `07_SERVICE_CATALOGUE_AND_PRICING.md` §9, §10, §12 |
| Sales process steps | `13_SALES_SOP.md` §5–14 |
| "No guaranteed outcomes" language | `13_SALES_SOP.md` §2 (`SALES-003`) |
| Minimum-data / privacy claims | `17_SECURITY_PRIVACY_AND_COMPLIANCE.md` §12, §13 |

The site deliberately never claims guaranteed rankings, leads or bookings, never
offers fake reviews, and never lists voice agents or official WhatsApp automation
as available — all of which follow directly from `SALES-003`, `BR-004` and §15 of
the service catalogue.

---

## 9. Accessibility & performance notes

- Respects `prefers-reduced-motion` globally.
- Keyboard focus rings on the brand accent.
- Skip-free but semantically correct: one `h1` per page, ordered headings,
  `aria-expanded` on the FAQ and mobile menu, `aria-pressed` on chips.
- Form controls keep real `<label>`/`htmlFor` pairs, `aria-expanded` on every
  disclosure, `aria-pressed` on chips and levers, and sliders duplicate their
  number box so a keyboard user is never trapped on a range input.
- Mockup visuals are real DOM, not images — they stay sharp at any resolution.
- The grain overlay is an inline SVG filter: no image request.
- Route-level code splitting — each page is its own chunk (~2–4 kB gzipped).

## 10. Known limitations

- Contact details are placeholders (see §2.1).
- Prices reflect the proposed, not-yet-approved figures (see §2.2).
- Fonts load from Google Fonts. If you later need the site to work fully offline
  or behind a strict CSP, self-host Inter and Inter Tight.
