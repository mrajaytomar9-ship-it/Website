/* Temporary render smoke test — executes every page's real render path. */
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Route, Routes } from 'react-router-dom'
import Layout from '../src/components/Layout'
import Home from '../src/pages/Home'
import Services from '../src/pages/Services'
import Pricing from '../src/pages/Pricing'
import Tools from '../src/pages/Tools'
import Process from '../src/pages/Process'
import About from '../src/pages/About'
import Contact from '../src/pages/Contact'
import NotFound from '../src/pages/NotFound'

const routes = [
  ['/', Home],
  ['/services', Services],
  ['/pricing', Pricing],
  ['/tools', Tools],
  ['/process', Process],
  ['/about', About],
  ['/contact', Contact],
  ['/nope', NotFound],
]

const failures = []
const rendered = []
for (const [path, Page] of routes) {
  let html = ''
  try {
    html = renderToStaticMarkup(
      <StaticRouter location={path}>
        <Routes>
          <Route element={<Layout />}>
            <Route path={path === '/' ? '/' : path.slice(1)} element={<Page />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </StaticRouter>,
    )
  } catch (err) {
    failures.push(`${path}: threw ${err && err.message}`)
    continue
  }
  console.log(`${path.padEnd(11)} ${String(html.length).padStart(7)} chars`)
  rendered.push([path, html])
  if (path === '/tools') {
    globalThis.__toolsHtml = html
  }
}

const html = globalThis.__toolsHtml || ''
const must = [
  'Profit &amp; leak calculator',
  'Net profit this month',
  '₹1,00,303',
  '19.7%',
  'Break-even',
  'Full breakdown',
  'Move one thing at a time',
  'Break-even in units',
  'What an ignored enquiry costs',
  'Every assumption',
  'What kind of business?',
  'Rooms you can sell',
  'Average rate per room night',
  'OTA / aggregator commission',
  'Target',
  'Take it with you',
  'Download as CSV',
  'planning maths, not accounting',
]
for (const needle of must) {
  if (!html.includes(needle)) failures.push(`tools page is missing: ${needle}`)
}

/* ------------------------------------------------- structure & labelling */
function audit(path, markup) {
  const problems = []

  const h1s = (markup.match(/<h1[\s>]/g) || []).length
  if (h1s !== 1) problems.push(`${path}: ${h1s} <h1> elements, expected exactly one`)

  /* Every input needs a label: either an explicit for/id pair, an aria-label,
     or an enclosing <label> (implicit association, which the contact form uses). */
  const labels = new Set([...markup.matchAll(/<label[^>]*\sfor="([^"]+)"/g)].map((m) => m[1]))
  const wrapped = [...markup.matchAll(/<label\b[\s\S]*?<\/label>/g)].map((m) => [
    m.index,
    m.index + m[0].length,
  ])
  for (const m of markup.matchAll(/<input\b[^>]*>/g)) {
    const tag = m[0]
    const type = (tag.match(/type="([^"]+)"/) || [])[1]
    if (type === 'hidden') continue
    const id = (tag.match(/\sid="([^"]+)"/) || [])[1]
    const hasAria = /aria-label=/.test(tag)
    const isWrapped = wrapped.some(([start, end]) => m.index > start && m.index < end)
    if (!hasAria && !isWrapped && !(id && labels.has(id))) {
      problems.push(`${path}: input without a label — ${tag.slice(0, 70)}`)
    }
  }

  /* every button needs something a screen reader can read */
  for (const m of markup.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) {
    const text = m[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    if (!text && !/aria-label=/.test(m[0])) problems.push(`${path}: button with no accessible name`)
  }

  /* no element should be allowed to force the page wider than the viewport */
  for (const bad of ['min-width:100vw', 'w-screen']) {
    if (markup.includes(bad)) problems.push(`${path}: uses ${bad}`)
  }

  return problems
}

for (const [path, markup] of rendered) audit(path, markup).forEach((p) => failures.push(p))

/* --------------------------------------------------------------------------
   Per-page design budgets — the same two numbers a usability audit reports:
   distinct font sizes and distinct corner radii on the rendered page.
   Measured from the markup each route actually produces, so a one-off value
   anywhere in that page's tree shows up here.
   -------------------------------------------------------------------------- */
const BUDGET_SIZES = 10
const BUDGET_RADII = 6
const stripVariant = (c) => c.replace(/^(?:[a-z0-9-]+:)*/, '')
/* corner classes -> the scale step they resolve to */
const RADIUS_STEP = {
  '-sm': 'sm',
  '-md': 'md',
  '-lg': 'lg',
  '-xl': 'xl',
  '-full': 'full',
  '-br-sm': 'sm',
  '-bl-sm': 'sm',
}

console.log('\nper-page scale usage')
for (const [path, markup] of rendered) {
  const classes = [...markup.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/))
  const sizes = new Set()
  const radii = new Set()
  for (const raw of classes) {
    const c = stripVariant(raw)
    /* .micro is 12px — the same step as text-xs, not a new one */
    const t = c.match(/^text-(xs|sm|base|lg|xl|2xl|3xl)$/)
    if (t) sizes.add(t[1])
    else if (c === 'micro') sizes.add('xs')
    const d = c.match(/^(t-hero|t-page|t-h2|t-h3)$/)
    if (d) sizes.add(d[1])
    const r = c.match(/^rounded(-full|-sm|-md|-lg|-xl|-b[rl]-sm)?$/)
    if (r) radii.add(r[1] ? RADIUS_STEP[r[1]] : 'base')
  }
  console.log(
    `  ${path.padEnd(11)} ${String(sizes.size).padStart(2)} sizes   ${String(radii.size).padStart(2)} radii`,
  )
  if (sizes.size > BUDGET_SIZES) {
    failures.push(`${path}: ${sizes.size} distinct font sizes (budget ${BUDGET_SIZES})`)
  }
  if (radii.size > BUDGET_RADII) {
    failures.push(`${path}: ${radii.size} distinct radii (budget ${BUDGET_RADII})`)
  }
}

const toolsMarkup = globalThis.__toolsHtml || ''
const toolsInputs = (toolsMarkup.match(/<input\b/g) || []).length
if (toolsInputs < 30) failures.push(`tools page renders only ${toolsInputs} inputs, expected 30+`)
const toolsLabels = (toolsMarkup.match(/<label\b/g) || []).length
if (toolsLabels < 30) failures.push(`tools page renders only ${toolsLabels} labels, expected 30+`)
console.log(`\ntools page: ${toolsInputs} inputs, ${toolsLabels} labels`)

/* the nav and footer must offer the new page everywhere */
for (const needle of ['href="/tools"', '>Tools<']) {
  if (!html.includes(needle)) failures.push(`chrome is missing ${needle}`)
}

/* the home page must advertise the tools, and the nav must carry all 7 items */
const home = (rendered.find(([p]) => p === '/') || [])[1] || ''
for (const needle of ['Open the calculator', 'Know your leak', 'Profit &amp; leak calculator']) {
  if (!home.includes(needle)) failures.push(`home page is missing: ${needle}`)
}
const navItems = [...home.matchAll(/<nav[^>]*aria-label="Primary"[\s\S]*?<\/nav>/g)]
const navLinks = navItems.length ? (navItems[0][0].match(/<a /g) || []).length : 0
if (navLinks !== 6) failures.push(`desktop nav has ${navLinks} links, expected 6 (Home is the logo)`)
const footerTools = /Free tools[\s\S]{0,400}?Profit &amp; leak calculator/.test(home)
if (!footerTools) failures.push('footer is missing the Free tools column')

if (failures.length) {
  console.error('\nFAIL')
  for (const f of failures) console.error(' - ' + f)
  process.exit(1)
}
console.log('\nAll routes rendered; tools page content checks passed.')
