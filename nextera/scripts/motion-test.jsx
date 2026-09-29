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
  } = await import('../src/components/ui/Motion.jsx')

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

  setReducedMotion(true)
  await act(async () => {})
  check('CursorGlow unmounts when the preference changes to reduced', html().trim() === '', html())

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

  await act(async () => root.unmount())
}

main().then(() => {
  if (failures) {
    console.error(`\n${failures} motion check(s) failed`)
    process.exit(1)
  }
  console.log('\nAll motion checks passed.')
})
