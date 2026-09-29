import { useEffect, useRef, useState } from 'react'
import {
  m,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useReducedMotion } from './Motion'

/* ==========================================================================
   CINEMA — the physical layer of the motion system.

   Layers 1–3 (index.css) and 4 (live systems) are CSS keyframes: cheap,
   declarative, and they run whether or not anything on the page is looking.
   This layer is for the things CSS cannot do — spring physics, pointer
   tracking, scroll-linked transforms, and canvas.

   The same rule governs all of it: motion is decoration, never information.
   Every component here reads `useReducedMotion` and renders its final, static
   state when the visitor has asked for less motion, and every one renders
   usable markup on the server before any script has run.
   ========================================================================== */

const SPRING = { type: 'spring', stiffness: 120, damping: 18, mass: 0.7 }
const SPRING_SOFT = { type: 'spring', stiffness: 70, damping: 20, mass: 0.9 }

/* ------------------------------------------------------------ smooth scroll
   Lenis replaces the browser's instant scroll with an eased one. It is the
   single largest contributor to "premium" feel, and the easiest thing to get
   wrong: it owns the wheel, so anchor links and scroll restoration have to go
   through it. `anchors: true` hands in-page links back to Lenis instead of
   letting them jump. Disabled entirely under reduced motion, where an eased
   scroll is not a nicety but an obstacle. */
export function SmoothScroll({ children }) {
  const { reduced } = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined
    let lenis
    let raf
    let cancelled = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      lenis = new Lenis({
        duration: 1.15,
        anchors: true,
        smoothWheel: true,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -9 * t)),
      })
      // Published so Layout's ScrollManager can route route-change and hash
      // scrolls through Lenis. Writing straight to window.scrollTo while Lenis
      // owns the wheel makes the page jump and then correct itself.
      window.__lenis = lenis
      const loop = (time) => {
        lenis.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    })

    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      if (lenis) lenis.destroy()
      if (window.__lenis === lenis) window.__lenis = null
    }
  }, [reduced])

  return children
}

/* ------------------------------------------------------------- scroll reveal
   A spring reveal: the element arrives with distance, a little blur and a
   slight scale, and settles. Blur is the part that reads as "cinematic" —
   pure translate looks like every other site. */
export function CineReveal({
  children,
  delay = 0,
  y = 26,
  className = '',
  once = true,
  amount = 0.3,
}) {
  const { mounted, reduced } = useReducedMotion()
  const off = !mounted || reduced

  return (
    <m.div
      className={className}
      initial={off ? false : { opacity: 0, y, filter: 'blur(10px)', scale: 0.985 }}
      whileInView={off ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once, amount }}
      transition={{ ...SPRING, delay: delay / 1000 }}
    >
      {children}
    </m.div>
  )
}

/* ---------------------------------------------------------------- word reveal
   Each word rises out of its own mask. The overflow-hidden wrapper is what
   makes it read as a curtain rather than a fade. */
export function WordReveal({ text, className = '', as: Tag = 'p', delay = 0, stagger = 42 }) {
  const { mounted, reduced } = useReducedMotion()
  const off = !mounted || reduced
  const words = String(text).split(' ')

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <m.span
            className="inline-block"
            initial={off ? false : { y: '105%', opacity: 0 }}
            animate={off ? undefined : { y: '0%', opacity: 1 }}
            transition={{
              ...SPRING_SOFT,
              delay: delay / 1000 + (i * stagger) / 1000,
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </m.span>
        </span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------- scramble
   Text that decodes from noise. Used for one headline, not several — the
   effect earns attention and spends it quickly. */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>#*+'

export function Scramble({ text, className = '', duration = 1100, startDelay = 120 }) {
  const { mounted, reduced } = useReducedMotion()
  const [out, setOut] = useState(text)

  useEffect(() => {
    if (reduced || !mounted) {
      setOut(text)
      return undefined
    }
    let frame = 0
    let raf
    const total = Math.max(1, Math.round(duration / 32))
    const chars = String(text).split('')

    const tick = () => {
      frame += 1
      const progress = frame / total
      setOut(
        chars
          .map((c, i) => {
            if (c === ' ') return ' '
            // characters settle left to right, so the decode has a direction
            if (i / chars.length < progress) return c
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join(''),
      )
      if (frame < total) raf = requestAnimationFrame(tick)
      else setOut(text)
    }

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick)
    }, startDelay)

    return () => {
      clearTimeout(timer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [text, duration, startDelay, reduced, mounted])

  return <span className={className}>{out}</span>
}

/* ----------------------------------------------------------------------- tilt
   Pointer-driven 3D tilt with a spring return, plus a light that tracks the
   cursor across the face. The perspective sits on the parent so neighbouring
   cards do not share a vanishing point. */
export function Tilt({
  children,
  className = '',
  max = 9,
  scale = 1.015,
  glare = true,
  radius = 'rounded-xl',
}) {
  const { mounted, reduced } = useReducedMotion()
  const off = !mounted || reduced

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING)
  const mx = useSpring(useTransform(px, [0, 1], ['0%', '100%']), SPRING_SOFT)
  const my = useSpring(useTransform(py, [0, 1], ['0%', '100%']), SPRING_SOFT)
  // Hooks must not be conditional, so the gradient is built here rather than
  // inside the JSX that only renders when glare is on.
  const glareBg = useTransform(
    [mx, my],
    ([x, y]) => `radial-gradient(340px circle at ${x} ${y}, rgba(255,255,255,0.16), transparent 62%)`,
  )

  const onMove = (e) => {
    if (off) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div style={{ perspective: '1200px' }} className={className}>
      <m.div
        className="relative h-full w-full"
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={off ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={off ? undefined : { scale }}
        transition={SPRING}
      >
        {children}
        {glare && !off && (
          <m.div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${radius}`}
            style={{ background: glareBg }}
          />
        )}
      </m.div>
    </div>
  )
}

/* ---------------------------------------------------------------- ember field
   A canvas of slow embers drifting up behind a section. Canvas rather than DOM
   nodes because 40 animated divs is 40 composited layers; one canvas is one.
   Pauses when the section scrolls out of view so it costs nothing offscreen. */
export function EmberField({ className = '', count = 34, tint = '232,146,47' }) {
  const canvasRef = useRef(null)
  const { mounted, reduced } = useReducedMotion()

  useEffect(() => {
    if (reduced || !mounted) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let raf
    let w = 0
    let h = 0
    let dpr = 1
    let visible = true
    let parts = []

    const seed = () => {
      parts = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.6 + Math.random() * 1.7,
        vy: 0.00016 + Math.random() * 0.00042,
        vx: (Math.random() - 0.5) * 0.00016,
        a: 0.12 + Math.random() * 0.42,
        p: Math.random() * Math.PI * 2,
      }))
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (!visible || w === 0 || h === 0) return
      ctx.clearRect(0, 0, w, h)
      for (const q of parts) {
        q.y -= q.vy
        q.x += q.vx
        q.p += 0.012
        if (q.y < -0.05) {
          q.y = 1.05
          q.x = Math.random()
        }
        if (q.x < -0.05) q.x = 1.05
        if (q.x > 1.05) q.x = -0.05
        const flicker = 0.72 + Math.sin(q.p) * 0.28
        ctx.beginPath()
        ctx.fillStyle = `rgba(${tint},${(q.a * flicker).toFixed(3)})`
        ctx.arc(q.x * w, q.y * h, q.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    seed()
    resize()
    raf = requestAnimationFrame(draw)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [reduced, mounted, count, tint])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}

/* ------------------------------------------------------------------ parallax
   Scroll-linked translate. Distance is a fraction of the section's own travel,
   so it stays proportional on every viewport instead of drifting off. */
export function ScrollParallax({ children, distance = -60, className = '' }) {
  const { mounted, reduced } = useReducedMotion()
  const ref = useRef(null)
  const off = !mounted || reduced

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  const smooth = useSpring(y, { stiffness: 90, damping: 24, mass: 0.6 })

  return (
    <div ref={ref} className={className}>
      <m.div style={off ? undefined : { y: smooth }}>{children}</m.div>
    </div>
  )
}

/* ----------------------------------------------------------------- hero glow
   Two counter-rotating colour fields. CSS can animate one; making them fight
   each other is what reads as depth. */
export function HeroAurora({ className = '' }) {
  const { mounted, reduced } = useReducedMotion()
  const off = !mounted || reduced

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <m.div
        className="absolute left-1/2 top-[-24%] h-[820px] w-[820px] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(232,146,47,0.20) 0%, rgba(232,146,47,0.07) 38%, transparent 68%)',
          filter: 'blur(60px)',
        }}
        animate={off ? undefined : { scale: [1, 1.14, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <m.div
        className="absolute left-[18%] top-[12%] h-[620px] w-[620px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(95,179,240,0.16) 0%, rgba(95,179,240,0.05) 40%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        animate={off ? undefined : { x: [0, 90, -40, 0], y: [0, -50, 30, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />
      <m.div
        className="absolute right-[10%] top-[26%] h-[560px] w-[560px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(79,209,165,0.15) 0%, rgba(79,209,165,0.05) 40%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        animate={off ? undefined : { x: [0, -70, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

/* ------------------------------------------------------------ scroll velocity
   Skews a marquee with scroll speed so it reacts to how fast you flick. Purely
   ornamental, and the first thing to cut if it ever feels sickening. */
export function useScrollSkew(max = 5) {
  const { mounted, reduced } = useReducedMotion()
  const { scrollY } = useScroll()
  const skewX = useSpring(0, { stiffness: 220, damping: 28, mass: 0.4 })

  useEffect(() => {
    if (!mounted || reduced) return undefined
    let prev = scrollY.get()
    // Velocity is the delta between scroll events. Skewing by the absolute
    // scroll position would lean the band by how far down the page you are,
    // which is not something anyone wants to look at.
    return scrollY.on('change', (latest) => {
      const delta = latest - prev
      prev = latest
      skewX.set(Math.max(-max, Math.min(max, delta * 0.055)))
    })
  }, [mounted, reduced, scrollY, skewX, max])

  return !mounted || reduced ? undefined : { skewX }
}

/* ------------------------------------------------------------- demo loop
   The mockups are meant to read like a screen recording: statuses advance,
   chips pop in, messages type out — then it resets and plays again. This hook
   drives that single timeline. `beats` is the number of steps; the loop holds
   one tick at the finished state before rewinding.

   Server render and reduced motion both return the finished state, so the full
   picture is what a crawler, a printout or a reduced-motion visitor sees — the
   loop is purely for people watching with motion on. */
export function useDemoLoop(beats, stepMs = 850) {
  const { mounted, reduced } = useReducedMotion()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!mounted) return undefined
    if (reduced) {
      setStep(beats)
      return undefined
    }
    let s = 0
    const id = setInterval(() => {
      s = (s + 1) % (beats + 2)
      setStep(Math.min(s, beats))
    }, stepMs)
    return () => clearInterval(id)
  }, [mounted, reduced, beats, stepMs])

  return !mounted || reduced ? beats : Math.min(step, beats)
}

export { m }
