# Nextera Solution — website

A premium, multi-page marketing site for **Nextera Solution** — website, WhatsApp
enquiry path, automation and online presence work for businesses across India.

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
npm test         # 80 assertions: 33 calculator + 29 report + 18 contact & rate card
npm run test:motion   # 29 checks: motion mounts, reduced-motion collapses, SSR is honest
npm run test:ui  # mounts the real /tools page in jsdom and types into it
npm run smoke    # server-renders every route and checks the tools page output
npm run check:scale # type/radius steps stay inside their budget
npm run check    # everything above + production build + CSS class coverage
```

---

## 2. Before you publish — required changes

### 2.1 Contact details

The phone number is **live** (`+91 92343 77413`) and `content.test.mjs` fails the
build if `phoneRaw` stops being a valid Indian mobile or stops matching
`phoneDisplay`, because every WhatsApp button on the site is built from it.

The **email is still a placeholder** — replace it in `src/lib/content.js`:

```js
export const CONTACT_DETAILS = {
  phoneDisplay: '+91 92343 77413',   // live
  phoneRaw:     '+919234377413',     // live — digits only, country code first
  email:        'hello@nexterasolution.in', // ← still a placeholder
  // …
}
```

`phoneRaw` carries the country code with a leading `+` and no spaces: the `tel:`
links use it as-is (and `tel:+91…` is the correct international form), while
`whatsappLink()` strips every non-digit before building `wa.me/…`. One value
serves both. `content.test.mjs` asserts the digits, the display string and both
link forms, because a typo here silently breaks every contact button at once.

Both values are currently **placeholders**. Your business requirements (BR-013,
and `SALES-002` in the Sales SOP) explicitly forbid publishing invented contact
details, so these must be real before the site goes live.

### 2.2 Services, packages and prices

The whole catalogue comes from **"Nextera Solution — Complete Price Rate Card"
v1.0**. Every figure in `PACKAGES`, `AI_VOICE`, `MAINTENANCE_PLANS`,
`MARKETING_SERVICES`, `ADD_ONS`, `CORE_SERVICES`, `PACKAGE_EXAMPLES`,
`THIRD_PARTY_EXCLUDED`, `PAYMENT_MILESTONES` and `MONTHLY_TERMS` is transcribed
from it. Target market is India Tier 2 and Tier 3; all customer prices include
18% GST.

| Package | Taxable | GST | Customer price |
|---|---:|---:|---:|
| Basic / Starter | ₹20,000 | ₹3,600 | **₹23,600** |
| Business | ₹35,000 | ₹6,300 | **₹41,300** |
| Enterprise | ₹60,000 | ₹10,800 | **₹70,800 onwards** |

AI voice is a setup fee plus a monthly fee: Lite ₹14,999 + ₹4,999/mo, Business
Caller ₹29,999 + ₹9,999/mo, Enterprise ₹69,999 + ₹19,999/mo onwards. Maintenance
runs ₹1,499 / ₹2,999 / ₹5,999 per month.

Per §10 of the rate card, the site shows the **final GST-inclusive customer
price**; the taxable-value and GST breakup appears on the invoice (an example
breakup is rendered on `/pricing`).

> **Two rows in the source rate card are off by ₹1.** Enterprise AI Voice monthly
> and WhatsApp automation are both quoted as ₹16,949 + ₹3,051 = **₹20,000**, but
> the customer price is stated as **₹19,999** (19,999 ÷ 1.18 = 16,948.31, rounded
> up to 16,949). The site shows the ₹19,999 customer price and never publishes
> that split, so the discrepancy is not visible to customers — but it will show
> on an invoice if you itemize those two lines. Worth correcting at source.

Two layers keep this content honest, and they catch different mistakes:

- `content.test.mjs` (data) — the five service titles, all three package prices,
  the taxable + GST = total identity for each package, every AI voice setup and
  monthly fee, and the exact price arrays for maintenance, marketing and all 13
  add-ons. Change one number and it fails showing both values.
- `scripts/rate-card-content.mjs` + `npm run smoke` (rendered HTML) — **179
  items** from the rate card checked against the real `/services` and `/pricing`
  markup, so something that stops *rendering* is caught even if the data is fine.

They are not redundant. Changing Local SEO Growth from ₹9,999 to ₹9,998 is
invisible to the render check (₹9,999 still appears on the AI voice card) but
the data test fails immediately. Deleting a bullet entirely is the reverse.

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

Append to `SERVICES` in `src/lib/content.js` with a unique `id` and these fields —
`src/pages/Services.jsx` maps over the array, so no page edit is needed:

`id, icon, title, lede, body, audience[], includes[] (10), process[] (5),
faqs[{q,a}] (2), notIncluded[], startingPoint`

Also add a matching key to `ENQUIRY_MESSAGES` (the WhatsApp button reads
`ENQUIRY_MESSAGES[service.id]`), an entry in the `MOCKS` array in `Services.jsx`
at the same index, and a footer link to `/services#<id>`. Icons come from
`src/components/ServiceIcon.jsx`. `content.test.mjs` will fail until the field
counts and the enquiry message are in place.

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

### Type scale

Seven fixed steps plus four display sizes. Nothing else is allowed — a one-off
`text-[15px]` is exactly how an interface ends up with 22 sizes on one page.

| Utility | Size | Use |
|---|---|---|
| `text-xs` | 12px | Micro labels, footnotes, table rows. **12px is the floor** — no text on the site is smaller. |
| `text-sm` | 13px | List items, chips, buttons, secondary copy |
| `text-base` | 16px | Body copy and every form input |
| `text-lg` | 18px | Lead / section sub-headings |
| `text-xl` | 22px | Card titles |
| `text-2xl` | 30px | Large figures |
| `text-3xl` | 40px | Display figures |
| `.t-hero` / `.t-page` / `.t-h2` / `.t-h3` | fluid | Home hero / inner-page hero / section heading / card heading |

`.t-hero` and `.t-page` never appear on the same page, so every page renders at
most 10 distinct sizes. `npm run smoke` measures that per route and
`npm run check:scale` fails the build if anything drifts.

### Radius scale

`rounded-sm` 6px · `rounded-md` 12px · `rounded-lg` 16px · `rounded-xl` 20px ·
`rounded-full`. Five steps, no exceptions — `rounded`, `rounded-2xl` and any
`rounded-[Npx]` are rejected by `npm run check:scale`.

Utility classes worth knowing:

- `.shell` — 1360px max-width container
- `.band` — standard section vertical rhythm
- `.t-hero` / `.t-page` / `.t-h2` / `.t-h3` — display type scale
- `.fade-line` — gradient-faded second line of a headline
- `.micro` — 12px letter-spaced label, **sentence case** (all-caps is reserved
  for labels short enough to read at a glance)
- `.hatch` — diagonal stripe band (section separators)
- `.card-dark` / `.glass` — surface treatments
- `.cq-wrap` — establishes a container-query context for display type

**Important:** display headlines are sized in `cqi` (container query) units, not
`vw`. A headline inside a narrow grid column sizes to *its column*, not the
viewport. If you put a `.t-h2`/`.t-h3` inside a flex child that can shrink, add
`cq-wrap` to that child or give it a `flex-1` basis — otherwise the container can
collapse to zero width.

### Light, shadow and motion

Three shadow steps, all of them consumed: `--shadow-soft` (resting card),
`--shadow-lift` (hovered card), `--shadow-ember` (the highlighted package, also
used by `.glow-ember`). Each is layered — two tight shadows plus a wide soft one
— because a single large blur reads as a smudge on a black canvas.

| Class | What it does |
|---|---|
| `.lit` | resting shadow + a hairline highlight along the top edge |
| `.lit-hover` | lifts 3px and deepens the shadow on hover |
| `.spotlight` | radial light that follows the cursor (`--mx`/`--my`) |
| `.spotlight-ember` | same, tinted for the highlighted card |
| `.sheen` | a single diagonal light sweep on hover (used by `Button`) |
| `.tilt` | 3D tilt, driven by `--rx`/`--ry` |
| `.orb` + `.anim-orb` | slow-drifting ambient background glow |
| `.hairline-flow` | a gradient travelling along a 1px rule |
| `.reveal-line` / `.reveal-lines` | headline lines rising out from behind a mask |
| `.cascade` | children arriving one after another |
| `.ring-pulse` | breathing ember ring on the recommended card |
| `.edge-light` | a highlight running along a surface's top edge on hover |
| `.shine` + `.shine-layer` | a light band crossing a surface on a long loop |
| `.breathe` | a shadow that slowly deepens and releases |
| `.drift-light` + `.drift-light-layer` | a glow behind a panel that wanders |
| `.icon-pulse` | a slow glow pulse on small iconography |
| `.text-shimmer` | a light band passing through display text |
| `.streak` | light travelling along a hairline rule |
| `.aurora` | a slow morphing background field |
| `.num-tab` | tabular figures, so animating numbers do not jitter |

**Living light** is the layer that keeps moving without being asked. Two cost
rules govern it, because continuous animation is where a site starts to
fan-spin: transform and opacity are composited and free; `box-shadow` and
`background-position` repaint, so `.breathe` and `.text-shimmer` are reserved
for one or two featured elements and never used across a grid of cards.
`Shine`'s `index` staggers neighbours by ~1.45s so a row of cards reads as light
moving through a room rather than a strobe.

**Why the light layers are elements, not pseudo-elements.** A surface has
exactly one `::before` and one `::after`, and `.spotlight`, `.sheen` and
`.edge-light` already claim them. A second rule for the same pseudo-element does
not merge — it overwrites the first one's `background` outright, so the cursor
light would silently vanish from any card that also got a sweep. `Shine` and
`DriftLight` render real elements instead. `npm run check` runs
`scripts/pseudo-check.mjs`, which collects every class that styles a
pseudo-element and fails if any element in `src/` carries two of them on the
same one.

**The artefact mockups read as running systems.** The audit, enquiry path,
listing, delivery board and care report (`src/components/Mockups.jsx`) are the
closest thing this site has to a product demo, so each carries a live cue: a
radar line sweeping the audit and listing panels, progress bars that re-scan
(`.bar-live`, `scaleX` from 0 to a `--w` custom property on a staggered loop),
radiating live dots, a WhatsApp typing indicator, flowing dashes on the active
delivery stage, and care ticks that light up in sequence. Every one is transform
or opacity only, and the CSS collapses all of it to a static read under
`prefers-reduced-motion` (bars and ticks sit at their final value, the scan and
typing dots disappear).

**Gradient-clipped text needs an escape hatch.** `.fade-line` and
`.text-shimmer` both paint text with a clipped background and set the colour to
`transparent`. Printers skip backgrounds by default and forced-colors mode drops
background images, so without an explicit reset the second line of every
headline came off the page invisible. Both now fall back to solid text in
`@media print` and `@media (forced-colors: active)`.

The React side lives in `src/components/ui/Motion.jsx`: `Spotlight`, `CountUp`,
`ScrollProgress`, `Ambient`, `SplitLines`, `Cascade`, `Magnetic`, `Parallax`,
`CursorGlow` and the `useReducedMotion` / `useInView` hooks.

`CursorGlow` only mounts on `(hover: hover) and (pointer: fine)` — on touch there
is nothing to trail and the frame cost buys nothing. `Magnetic` pulls about 0.22
of the cursor offset; past roughly 10px it stops feeling responsive and starts
feeling drunk.

**Masked reveals can never trap content.** `SplitLines` and `Cascade` hide their
content until it is on screen, so an observer that never reports would leave a
headline permanently invisible — a worse failure than a headline that simply
appears without animating. Two guards: `useInView` forces `true` after 1.5s, and
neither component applies its masking class until after mount, so the server,
the printed page and a no-JS reader all get plain visible text.

**Two rules, both enforced:**

1. **Motion is decoration, never information.** Everything collapses to a static
   state under `prefers-reduced-motion` — the CSS effects via a media query, and
   `ScrollProgress` and `Ambient` by rendering nothing at all.
2. **Transform and opacity only.** Anything animating layout repaints every
   frame, which is where a "premium" site starts to feel cheap on a mid-range
   phone.

**Nothing renders before mount.** `useReducedMotion` can only read the media
query in an effect, so on the server the preference is unknowable. Guessing
"motion on" put a scroll bar into the static HTML *and* produced a hydration
mismatch for reduced-motion users, whose client tree omits it. `CountUp`
likewise starts at its final value, so the server, the printed page and a
no-JS reader all see the real price rather than a zero.

`npm run test:motion` (29 checks, part of `npm run check`) verifies all of it:
that the effects mount and carry their classes, that reduced motion collapses
every one of them, and that SSR prints the true figure, the true headline and no
scroll bar. It caught both SSR bugs above on its first run, and later caught
`useReducedMotion` reading a captured `MediaQueryList` instead of the change
event — the event is the canonical source and the only value that is definitely
correct at the moment the preference flips.

The test's `matchMedia` stub fires `change` notifications. A stub that swaps the
function silently does not: components already mounted keep the value they read
at mount, and the test ends up measuring the stub rather than the code.

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

## 5.1a The free business report (`/report`)

A lead-generation tool: a founder answers a short questionnaire, pastes the
links they already have, and gets a scored report.

**Inputs** — business name, type and city; four link slots (website, Google
profile, OTA/booking, directory); ten presence questions; the calculator's own
number fields; up to three competitors.

**Outputs** — a score out of 100 across four pillars (findability 30,
credibility 25, convertibility 25, money 20), the three highest-impact weak
points, the money breakdown, a competitor gap table, per-link findings, and a
plan ordered cheapest-first. Three exports: print/save as PDF, a self-contained
HTML download, and a pre-filled WhatsApp message.

**The gate** — the score and the top three weak points are free. The full
breakdown and the exports unlock on a name and a 10-digit Indian mobile number.
Both are kept in `localStorage` under `nextera.report.v1` and never uploaded;
the WhatsApp button is the only thing that sends data anywhere, and it is the
visitor who presses send.

**What it deliberately cannot do.** A static page cannot read another origin's
HTML, so nothing here fetches a website, a review count or a competitor's
prices. The link checks are checks on the *address* (scheme, domain, whether it
is a borrowed host, which platform it belongs to). The page says this in its own
"What it does not" panel — do not add copy that implies a scan happened.

| File | Role |
|---|---|
| `src/lib/report.js` | The engine: link parsing, up to 21 checks, scoring, competitor gap, exports. Pure and browser-free. |
| `src/lib/report.test.mjs` | 29 assertions over the engine |
| `src/components/report/ReportForm.jsx` | The questionnaire, with live link feedback |
| `src/components/report/ReportResult.jsx` | Score ring, gate, full breakdown, exports |
| `src/pages/Report.jsx` | State, persistence, and the three export handlers |

Scoring rule worth knowing: a question left blank returns `na` and is **excluded**
from the score, not marked down. `calculator.js`'s `num()` coerces blanks to `0`,
so `report.js` has its own `isAnswered()`/`asNum()` helpers — use those, not
`num()`, or an unanswered question becomes a failed one.

---

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

**Netlify's "Private / Share / Make public" bar.** That floating toolbar is
injected by Netlify on *draft/preview* deploys — it is not in this codebase
(`index.html` is a bare SPA shell and ships no third-party script). It disappears
when the deploy is the site's production deploy:

- connect the repository so `main` builds to the production deploy, **or**
- Site configuration → Access & security → **Site protection** → set to *Public*,
  and publish the build as the production deploy rather than a draft.

If it is still visible on the live URL, the URL being viewed is a deploy-preview
link, not the production one.

---

## 8. Content sourcing

Every claim on the site traces to your business documents:

| Site content | Source document |
|---|---|
| Positioning, hotel/clinic niches | `05_BRD.md` §1, §5 · `03_DECISION_REGISTER.md` §6.1 |
| Packages, AI voice, maintenance, marketing, add-ons, payment terms | `Complete Price Rate Card` v1.0 §1–§10 |
| Service descriptions (who it is for, inclusions, process, FAQs) | `Services & Pricing` v1.1 (29 Sep 2026) §2 |
| Hotel / clinic sector boundaries | `07_SERVICE_CATALOGUE_AND_PRICING.md` §8 |
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
