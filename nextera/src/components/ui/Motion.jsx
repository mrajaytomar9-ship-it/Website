import { useCallback, useEffect, useRef, useState } from 'react'

/* ==========================================================================
   Motion primitives.

   Two rules govern everything in this file:

   1. Motion is decoration, never information. Nothing here may be the only
      way to understand something, and every effect must collapse to a static
      state under prefers-reduced-motion.
   2. Transform and opacity only. Anything that animates layout repaints the
      page on every frame, which is exactly where a "premium" site starts to
      feel cheap on a mid-range phone.

   All of it is SSR-safe: nothing touches window or document during render,
   so renderToStaticMarkup never throws.
   ========================================================================== */

/**
 * True when the user has asked the OS to reduce motion.
 *
 * `mounted` matters as much as the media query. The query can only be read in
 * an effect, so on the server it is unknowable — and guessing "motion on" put a
 * scroll bar into the static HTML and produced a hydration mismatch for anyone
 * with reduced motion, whose client tree omits it. Rendering nothing until
 * mount keeps server and client identical.
 */
export function useReducedMotion() {
  const [state, setState] = useState({ mounted: false, reduced: false })

  useEffect(() => {
    const read = () =>
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false

    setState({ mounted: true, reduced: read() })

    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setState({ mounted: true, reduced: mq.matches })
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  return state
}

/**
 * Writes --mx/--my on the element as a percentage, so the CSS radial gradient
 * in .spotlight can follow the cursor. Throttled to animation frames; a
 * pointermove fires far more often than the screen can use.
 */
export function useSpotlight(enabled = true) {
  const ref = useRef(null)
  const frame = useRef(0)

  const onPointerMove = useCallback(
    (e) => {
      if (!enabled) return
      const node = ref.current
      if (!node) return
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        const r = node.getBoundingClientRect()
        node.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
        node.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
      })
    },
    [enabled],
  )

  useEffect(() => () => frame.current && cancelAnimationFrame(frame.current), [])

  return { ref, onPointerMove }
}

/**
 * Spotlight — a surface that lights up under the cursor, optionally tilting
 * a few degrees in 3D. `ember` tints the light for highlighted cards.
 */
export function Spotlight({
  children,
  className = '',
  ember = false,
  tilt = 0,
  as: Tag = 'div',
  ...rest
}) {
  const { reduced } = useReducedMotion()
  /* The light is CSS-driven, so it can ship in the markup; only the tilt is
     JS-driven and it no-ops until we know the user's preference. */
  const active = !reduced
  const { ref, onPointerMove } = useSpotlight(active)
  const [style, setStyle] = useState({})

  const handleMove = (e) => {
    onPointerMove(e)
    if (!active || !tilt) return
    const node = ref.current
    if (!node) return
    const r = node.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setStyle({
      transform: `perspective(900px) rotateX(${(-py * tilt).toFixed(2)}deg) rotateY(${(
        px * tilt
      ).toFixed(2)}deg) translateY(-3px)`,
    })
  }

  const reset = () => {
    if (!active || !tilt) return
    setStyle({})
  }

  return (
    <Tag
      ref={ref}
      className={`spotlight ${ember ? 'spotlight-ember ' : ''}${tilt && active ? 'tilt ' : ''}${className}`}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * CountUp — counts a figure up once it scrolls into view. Falls back to the
 * final value immediately when motion is reduced, when the value is not a
 * finite number, or during SSR (so the printed page and the crawler both see
 * the real number, never a zero).
 */
export function CountUp({ value, format = (n) => String(n), duration = 1100, className = '' }) {
  const { reduced } = useReducedMotion()
  const ref = useRef(null)
  /* Start at the final value: the server, the printed page and a no-JS reader
     all see the real figure. The count-up only ever runs after mount. */
  const [shown, setShown] = useState(value)

  useEffect(() => {
    if (reduced || !Number.isFinite(value)) {
      setShown(value)
      return
    }
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(value)
      return
    }

    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration)
          /* easeOutExpo — fast off the mark, settles without overshoot */
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
          setShown(value * eased)
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.35 },
    )

    io.observe(node)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [value, duration, reduced])

  const n = shown === null ? value : shown
  return (
    <span ref={ref} className={`num-tab ${className}`}>
      {Number.isFinite(n) ? format(Math.round(n)) : format(value)}
    </span>
  )
}

/**
 * ScrollProgress — a hairline bar tracking how far down the page the reader
 * has got. Sits above the navbar; two pixels, so it never competes with it.
 */
export function ScrollProgress() {
  const { mounted, reduced } = useReducedMotion()
  const ref = useRef(null)

  useEffect(() => {
    if (reduced) return
    let raf = 0
    const update = () => {
      raf = 0
      const node = ref.current
      if (!node) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0
      node.style.transform = `scaleX(${pct / 100})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  if (!mounted || reduced) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
    >
      <div
        ref={ref}
        className="h-full origin-left scale-x-0"
        style={{
          background: 'linear-gradient(90deg, rgba(232,146,47,0.15), #e8922f, #f4b866)',
        }}
      />
    </div>
  )
}

/**
 * Ambient — the soft background glows behind a hero. Purely decorative, so it
 * is hidden from assistive tech and dropped entirely for reduced motion.
 */
export function Ambient({ className = '' }) {
  const { mounted, reduced } = useReducedMotion()
  /* Decorative, so it appears a frame after mount rather than in the static
     HTML — that also keeps the server and client trees identical. */
  if (!mounted || reduced) return null

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="orb orb-ember anim-orb"
        style={{ width: 520, height: 520, top: '-14%', left: '8%' }}
      />
      <div
        className="orb orb-cool anim-orb"
        style={{ width: 460, height: 460, top: '22%', right: '-6%', animationDelay: '-6s' }}
      />
    </div>
  )
}
