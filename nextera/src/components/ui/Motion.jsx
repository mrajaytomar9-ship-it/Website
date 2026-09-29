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
    /* Read the event, not the captured MediaQueryList. A live browser keeps
       `mq.matches` current, but the event is the canonical source and is the
       only thing that is definitely correct at the moment of the change. */
    const apply = (e) =>
      setState({
        mounted: true,
        reduced: typeof e?.matches === 'boolean' ? e.matches : mq.matches,
      })
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
      {/* A third, slower field so the background never settles into a loop the
          eye can predict. */}
      <div
        className="orb orb-ember aurora"
        style={{
          width: 620,
          height: 620,
          top: '38%',
          left: '34%',
          opacity: 0.45,
          animationDelay: '-9s',
        }}
      />
    </div>
  )
}

/* ==========================================================================
   Second motion layer — the things that make a page feel inhabited rather
   than merely decorated.
   ========================================================================== */

/**
 * useInView — one-shot intersection flag. The `once` default is deliberate:
 * elements should arrive, not blink every time you scroll back past them.
 */
export function useInView({ threshold = 0.2, once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true)
            if (once) io.unobserve(e.target)
          } else if (!once) {
            setInView(false)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [threshold, once])

  /* Safety net. SplitLines and Cascade both hide their content until this
     flips, so an observer that never reports — a zero-height container, a
     display:none ancestor, an unusual browser — would leave a headline
     permanently invisible. That is a worse failure than a headline that
     simply appears without animating, so we force it after 1.5s. */
  useEffect(() => {
    if (inView) return
    const t = setTimeout(() => setInView(true), 1500)
    return () => clearTimeout(t)
  }, [inView])

  return { ref, inView }
}

/**
 * SplitLines — a display headline whose lines rise out from behind a mask,
 * staggered a few frames apart.
 *
 * The text itself is untouched: the same string sits in the DOM before and
 * after, so screen readers, search engines, print and a no-JS reader all get
 * the real headline. Only the transform changes, and `.reveal-lines.is-on`
 * in index.css is what performs it.
 *
 * The stagger delay is the one thing set inline, because it depends on how
 * many lines this particular heading happens to have.
 */
export function SplitLines({
  lines,
  className = '',
  lineClassName = '',
  as: Tag = 'h1',
  stagger = 95,
}) {
  const { mounted, reduced } = useReducedMotion()
  const { ref, inView } = useInView({ threshold: 0.15 })
  const list = Array.isArray(lines) ? lines : [lines]
  /* Off the server the lines start masked; with JS off or motion reduced they
     are simply visible, because the masking class is only applied once we know
     the reader is watching. */
  const mask = mounted && !reduced

  return (
    <Tag
      ref={ref}
      className={`reveal-lines ${mask && inView ? 'is-on' : ''} ${mask ? 'is-masked' : ''} ${className}`}
    >
      {list.map((line, i) => (
        <span className="reveal-line block" key={i}>
          <span className="block" style={{ transitionDelay: `${i * stagger}ms` }}>
            <span className={lineClassName}>{line}</span>
          </span>
        </span>
      ))}
    </Tag>
  )
}

/**
 * CursorGlow — one soft light that trails the pointer across the whole page.
 * Pointer devices only: on touch there is nothing to trail and the frame cost
 * buys nothing.
 */
export function CursorGlow() {
  const { mounted, reduced } = useReducedMotion()
  const ref = useRef(null)
  const frame = useRef(0)

  useEffect(() => {
    if (!mounted || reduced) return
    if (typeof window === 'undefined' || !window.matchMedia) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const node = ref.current
    if (!node) return
    let x = window.innerWidth / 2
    let y = 0
    let tx = x
    let ty = y

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (!frame.current) frame.current = requestAnimationFrame(loop)
    }
    /* Lerp towards the pointer so the light trails instead of snapping. */
    const loop = () => {
      x += (tx - x) * 0.14
      y += (ty - y) * 0.14
      node.style.transform = `translate3d(${x - 320}px, ${y - 320}px, 0)`
      frame.current =
        Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4
          ? requestAnimationFrame(loop)
          : 0
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [mounted, reduced])

  if (!mounted || reduced) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[640px] w-[640px] will-change-transform"
      style={{
        background:
          'radial-gradient(circle, rgba(232,146,47,0.075) 0%, rgba(232,146,47,0.03) 34%, transparent 66%)',
        transform: 'translate3d(-9999px,-9999px,0)',
      }}
    />
  )
}

/**
 * Magnetic — pulls its child a few pixels toward the cursor. Small on purpose:
 * past about 10px it stops feeling responsive and starts feeling drunk.
 */
export function Magnetic({ children, strength = 0.22, className = '' }) {
  const { mounted, reduced } = useReducedMotion()
  const ref = useRef(null)
  const [style, setStyle] = useState({})

  if (!mounted || reduced) {
    return <span className={className}>{children}</span>
  }

  const move = (e) => {
    const node = ref.current
    if (!node) return
    const r = node.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    setStyle({ transform: `translate3d(${dx * strength}px, ${dy * strength}px, 0)` })
  }

  return (
    <span
      ref={ref}
      className={`inline-block transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] ${className}`}
      onPointerMove={move}
      onPointerLeave={() => setStyle({})}
      style={style}
    >
      {children}
    </span>
  )
}

/**
 * Cascade — reveals children one after another as the group enters view.
 * Cheaper than N observers: one for the container, and CSS `--i` for the rest.
 */
export function Cascade({ children, className = '', step = 70, as: Tag = 'div' }) {
  const { mounted, reduced } = useReducedMotion()
  const { ref, inView } = useInView({ threshold: 0.08 })
  const on = !mounted || reduced || inView

  const items = Array.isArray(children) ? children : [children]

  return (
    <Tag
      ref={ref}
      className={`cascade ${on ? 'is-on' : ''} ${mounted && !reduced ? 'is-masked' : ''} ${className}`}
    >
      {items.map((child, i) => (
        <div key={i} style={{ '--i': i, '--step': `${step}ms` }}>
          {child}
        </div>
      ))}
    </Tag>
  )
}

/**
 * Parallax — shifts a decorative layer against the scroll. Transform only,
 * rAF-throttled, and it bails out entirely when there is no motion budget.
 */
export function Parallax({ children, speed = 0.12, className = '' }) {
  const { mounted, reduced } = useReducedMotion()
  const ref = useRef(null)

  useEffect(() => {
    if (!mounted || reduced) return
    let raf = 0
    const update = () => {
      raf = 0
      const node = ref.current
      if (!node) return
      const r = node.getBoundingClientRect()
      const mid = r.top + r.height / 2 - window.innerHeight / 2
      node.style.transform = `translate3d(0, ${(-mid * speed).toFixed(1)}px, 0)`
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
  }, [mounted, reduced, speed])

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  )
}

/* ==========================================================================
   Living light — layers that keep moving on their own.

   These are real elements rather than CSS pseudo-elements on purpose. A
   surface has exactly one ::before and one ::after, and .spotlight, .sheen and
   .edge-light already claim them. A second rule for the same pseudo-element
   does not merge — it silently overwrites the first one's background, so the
   cursor light would vanish from any card that also got a sweep.
   ========================================================================== */

/**
 * Shine — a light band crossing a surface on a long loop. `index` staggers
 * neighbours so a grid of cards does not flash in unison, which is what makes
 * a row of them read as a room with light moving through it rather than a
 * strobe.
 */
export function Shine({ index = 0, tempo = 9 }) {
  const { mounted, reduced } = useReducedMotion()
  if (!mounted || reduced) return null
  return (
    <span
      aria-hidden="true"
      className="shine-layer"
      style={{ animationDelay: `${-(index * 1.45).toFixed(2)}s`, animationDuration: `${tempo}s` }}
    />
  )
}

/** DriftLight — a soft glow behind a panel that wanders, so the shadow it
 *  casts looks like it comes from a source that is slowly moving. */
export function DriftLight({ className = '' }) {
  const { mounted, reduced } = useReducedMotion()
  if (!mounted || reduced) return null
  return <span aria-hidden="true" className={`drift-light-layer ${className}`} />
}
