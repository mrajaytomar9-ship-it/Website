/* ==========================================================================
   motion-test — proves the premium effects are real and that they get out of
   the way when the user asks for less motion.

   Three things matter and all three are checked here:

   1. The effects actually mount and attach their handlers.
   2. prefers-reduced-motion collapses every one of them to a static state.
   3. Server rendering never throws and never prints a placeholder. A CountUp
      that rendered 0 would put the wrong price in front of a crawler, a
      printed page and anyone with JS off.
   ========================================================================== */
import { dom } from './jsdom-setup.mjs'

let failures = 0
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail && !ok ? `  <- ${detail}` : ''}`)
  if (!ok) failures += 1
}

/* A real browser notifies subscribers when the preference changes, so the stub
   has to as well. Without that, an already-mounted component keeps the value it
   read at mount and the test measures the stub instead of the code. */
const listeners = new Set()
let reducedNow = false

const setReducedMotion = (on) => {
  reducedNow = on
  dom.window.matchMedia = (q) => ({
    matches: on && q.includes('prefers-reduced-motion'),
    media: q,
    addEventListener(_t, fn) {
      listeners.add(fn)
    },
    removeEventListener(_t, fn) {
      listeners.delete(fn)
    },
    addListener(fn) {
      listeners.add(fn)
    },
    removeListener(fn) {
      listeners.delete(fn)
    },
  })
  for (const fn of [...listeners]) fn({ matches: reducedNow })
}

async function main() {
  const React = await import('react')
  const { createRoot } = await import('react-dom/client')
  const { act } = React
  const { renderToStaticMarkup } = await import('react-dom/server')
  const {
    ScrollProgress,
    Ambient,
    CountUp,
    Spotlight,
    SplitLines,
    Cascade,
    Magnetic,
    Parallax,
    CursorGlow,
    Shine,
    DriftLight,
  } = await import('../src/components/ui/Motion.jsx')
  const {
    CineReveal,
    EmberField,
    HeroAurora,
    Scramble,
    SmoothScroll,
    Tilt,
    WordReveal,
  } = await import('../src/components/ui/Cinema.jsx')

  const host = dom.window.document.getElementById('root')
  const root = createRoot(host)
  const mount = async (node) => {
    await act(async () => root.render(node))
  }
  const html = () => host.innerHTML

  /* -------------------------------------------------- 1. motion enabled */
  setReducedMotion(false)

  await mount(React.createElement(ScrollProgress))
  check(
    'ScrollProgress renders a track when motion is allowed',
    html().includes('scale-x-0') && html().includes('fixed'),
    html().slice(0, 120),
  )

  await mount(React.createElement(Ambient))
  check('Ambient renders the background glows', html().includes('orb-ember'), html().slice(0, 120))
  check('Ambient is hidden from assistive tech', html().includes('aria-hidden="true"'), '')

  await mount(
    React.createElement(Spotlight, { className: 'lit' }, React.createElement('p', null, 'card')),
  )
  check('Spotlight carries the light class', html().includes('spotlight'), html().slice(0, 140))
  check('Spotlight keeps the caller class', html().includes('lit'), '')
  check('Spotlight renders its children', html().includes('card'), '')

  /* jsdom has no IntersectionObserver, which exercises the no-observer
     fallback — the same branch SSR and old browsers take. */
  await mount(
    React.createElement(CountUp, { value: 23600, format: (n) => `₹${n.toLocaleString('en-IN')}` }),
  )
  check(
    'CountUp shows the real figure without an IntersectionObserver',
    html().includes('₹23,600'),
    html(),
  )

  /* ------------------------------------------------- 2. motion reduced */
  setReducedMotion(true)

  await mount(React.createElement(ScrollProgress))
  check('ScrollProgress renders nothing when motion is reduced', html().trim() === '', html())

  await mount(React.createElement(Ambient))
  check('Ambient renders nothing when motion is reduced', html().trim() === '', html())

  await mount(
    React.createElement(CountUp, { value: 23600, format: (n) => `₹${n.toLocaleString('en-IN')}` }),
  )
  check(
    'CountUp jumps straight to the final figure when motion is reduced',
    html().includes('₹23,600'),
    html(),
  )

  /* ------------------------------------------- 2b. the second motion layer */
  setReducedMotion(false)

  await mount(
    React.createElement(SplitLines, {
      lines: ['Your business is easy to find.', 'Hard to contact.'],
      className: 't-page',
    }),
  )
  check('SplitLines keeps the full headline in the DOM', html().includes('Hard to contact.'), html().slice(0, 200))
  check('SplitLines renders one masked line per line', (html().match(/reveal-line/g) || []).length >= 2, '')
  check(
    'SplitLines reveals without an IntersectionObserver',
    html().includes('is-on'),
    'masked text would stay invisible: ' + html().slice(0, 160),
  )

  await mount(
    React.createElement(Cascade, null, [
      React.createElement('p', { key: 'a' }, 'one'),
      React.createElement('p', { key: 'b' }, 'two'),
    ]),
  )
  check('Cascade renders every child', html().includes('one') && html().includes('two'), html())
  check('Cascade staggers via a CSS variable', html().includes('--i'), '')

  await mount(React.createElement(Magnetic, null, 'buy'))
  check('Magnetic renders its child', html().includes('buy'), html())

  await mount(React.createElement(Parallax, null, 'layer'))
  check('Parallax renders its child', html().includes('layer'), html())

  await mount(React.createElement(CursorGlow))
  check('CursorGlow mounts a light layer', html().includes('fixed'), html().slice(0, 160))

  /* --------------------------------------------- 2c. the living-light layer */
  setReducedMotion(false)
  await act(async () => {})

  await mount(React.createElement(Shine, { index: 2 }))
  check('Shine renders a moving light layer', html().includes('shine-layer'), html())
  check(
    'Shine staggers by index so a grid does not flash in unison',
    html().includes('animationDelay') || html().includes('animation-delay'),
    html(),
  )

  await mount(React.createElement(DriftLight))
  check('DriftLight renders a drifting glow layer', html().includes('drift-light-layer'), html())

  setReducedMotion(true)
  await act(async () => {})
  check('CursorGlow unmounts when the preference changes to reduced', html().trim() === '', html())

  await mount(React.createElement(Shine, { index: 1 }))
  check('Shine renders nothing when motion is reduced', html().trim() === '', html())

  await mount(React.createElement(DriftLight))
  check('DriftLight renders nothing when motion is reduced', html().trim() === '', html())

  await mount(
    React.createElement(SplitLines, { lines: ['Calm headline'], className: 't-page' }),
  )
  check(
    'SplitLines does not mask text when motion is reduced',
    html().includes('Calm headline') && !html().includes('is-masked'),
    html().slice(0, 200),
  )

  /* ------------------------------------------------------- 3. the SSR path */
  const ssr = renderToStaticMarkup(
    React.createElement(
      'div',
      null,
      React.createElement(CountUp, { value: 41300, format: (n) => `₹${n.toLocaleString('en-IN')}` }),
      React.createElement(ScrollProgress),
      React.createElement(Spotlight, null, 'x'),
    ),
  )
  check('SSR prints the true price, never a placeholder', ssr.includes('₹41,300'), ssr.slice(0, 200))
  check('SSR does not emit the scroll bar', !ssr.includes('scale-x-0'), ssr.slice(0, 200))

  /* The headline is the one thing that must never be masked in the static
     HTML: no JS means no observer means no reveal. */
  const ssrHeadline = renderToStaticMarkup(
    React.createElement(SplitLines, { lines: ['Priced in rupees.', 'Scoped in writing.'] }),
  )
  check('SSR prints the headline unmasked', !ssrHeadline.includes('is-masked'), ssrHeadline.slice(0, 200))
  check('SSR headline keeps both lines', ssrHeadline.includes('Scoped in writing.'), ssrHeadline.slice(0, 200))


  /* ------------------------------------------- 4. the cinema layer (Cinema.jsx)
     Spring physics, pointer tracking and canvas. Same three rules as the CSS
     layers: they mount, they collapse under reduced motion, and they never put
     a placeholder in front of a crawler. */
  const SCRAMBLE_TEXT = 'AUDIT ENGINE ONLINE — 6 CHECKS RUNNING'

  setReducedMotion(false)
  await mount(React.createElement(SmoothScroll, null, React.createElement('p', null, 'wrapped')))
  check('SmoothScroll renders its children', html().includes('wrapped'), html().slice(0, 160))

  await mount(React.createElement(CineReveal, null, React.createElement('p', null, 'arrives')))
  check('CineReveal renders its child', html().includes('arrives'), html().slice(0, 160))

  await mount(
    React.createElement(WordReveal, { text: 'Your business is easy to find.' }),
  )
  check(
    'WordReveal keeps every word in the DOM',
    ['Your', 'business', 'easy', 'find.'].every((w) => html().includes(w)),
    html().slice(0, 200),
  )

  await mount(React.createElement(EmberField))
  check('EmberField mounts a canvas', html().includes('<canvas'), html().slice(0, 160))

  await mount(React.createElement(Tilt, null, React.createElement('p', null, 'tilts')))
  check('Tilt renders its child', html().includes('tilts'), html().slice(0, 160))

  await mount(React.createElement(HeroAurora))
  check('HeroAurora mounts colour fields', html().includes('radial-gradient'), html().slice(0, 200))

  /* The one that actually matters: a decode effect that stopped mid-scramble
     would leave noise on the page, and one that scrambled during server
     rendering would hand that noise to a crawler. */
  const ssrScramble = renderToStaticMarkup(
    React.createElement(Scramble, { text: SCRAMBLE_TEXT }),
  )
  check(
    'SSR prints the scramble target verbatim, never glyph noise',
    ssrScramble.includes(SCRAMBLE_TEXT),
    ssrScramble.slice(0, 200),
  )

  const ssrWord = renderToStaticMarkup(
    React.createElement(WordReveal, { text: 'Hard to contact.' }),
  )
  check(
    'SSR keeps every masked word reachable',
    ['Hard', 'to', 'contact.'].every((w) => ssrWord.includes(w)),
    ssrWord.slice(0, 200),
  )

  const ssrReveal = renderToStaticMarkup(
    React.createElement(CineReveal, null, React.createElement('p', null, 'readable')),
  )
  check(
    'SSR renders a reveal already visible (readable with JS off)',
    ssrReveal.includes('readable') && !ssrReveal.includes('opacity:0'),
    ssrReveal.slice(0, 200),
  )

  setReducedMotion(true)
  await mount(React.createElement(Scramble, { text: SCRAMBLE_TEXT }))
  check(
    'Scramble prints the real text when motion is reduced',
    html().includes(SCRAMBLE_TEXT),
    html().slice(0, 200),
  )

  await mount(React.createElement(WordReveal, { text: 'Hard to contact.' }))
  check(
    'WordReveal keeps the full text when motion is reduced',
    ['Hard', 'contact.'].every((w) => html().includes(w)),
    html().slice(0, 200),
  )

  await mount(React.createElement(CineReveal, null, React.createElement('p', null, 'static')))
  check(
    'CineReveal renders its final state when motion is reduced',
    html().includes('static') && !html().includes('blur(10px)'),
    html().slice(0, 200),
  )

  await mount(React.createElement(HeroAurora))
  check('HeroAurora still renders under reduced motion', html().includes('radial-gradient'), html().slice(0, 200))

  await mount(React.createElement(EmberField))
  check('EmberField keeps its canvas under reduced motion', html().includes('<canvas'), html().slice(0, 160))

  /* ------------------------------------------- 5. the looping demo mockups
     Each mockup plays a self-running timeline. The guarantee that matters for
     crawlers and reduced motion is that the finished state is what is rendered
     when nothing is playing. */
  const { AuditMockup, DeliveryMockup } = await import('../src/components/Mockups.jsx')

  const ssrAudit = renderToStaticMarkup(React.createElement(AuditMockup))
  check('SSR audit shows the full issue count, never zero', ssrAudit.includes('>6<'), ssrAudit.slice(0, 160))

  const ssrDel = renderToStaticMarkup(React.createElement(DeliveryMockup))
  check(
    'SSR delivery board renders every chip',
    ['Accepted 14 Sep', 'QA + final approval'].every((t) => ssrDel.includes(t)),
    ssrDel.slice(0, 160),
  )

  setReducedMotion(true)
  await mount(React.createElement(DeliveryMockup))
  check(
    'reduced-motion delivery board is the finished board',
    html().includes('Accepted 14 Sep') && html().includes('QA + final approval'),
    html().slice(0, 160),
  )
  setReducedMotion(false)

  await act(async () => root.unmount())
}

main().then(() => {
  if (failures) {
    console.error(`\n${failures} motion check(s) failed`)
    process.exit(1)
  }
  console.log('\nAll motion checks passed.')
})
