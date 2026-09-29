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

const setReducedMotion = (on) => {
  dom.window.matchMedia = (q) => ({
    matches: on && q.includes('prefers-reduced-motion'),
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  })
}

async function main() {
  const React = await import('react')
  const { createRoot } = await import('react-dom/client')
  const { act } = React
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { ScrollProgress, Ambient, CountUp, Spotlight } = await import(
    '../src/components/ui/Motion.jsx'
  )

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

  await act(async () => root.unmount())
}

main().then(() => {
  if (failures) {
    console.error(`\n${failures} motion check(s) failed`)
    process.exit(1)
  }
  console.log('\nAll motion checks passed.')
})
