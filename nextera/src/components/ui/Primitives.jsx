import { useEffect, useState } from 'react'

/**
 * Grain — animated film-grain overlay. Sits above everything, ignores pointer
 * events. Rendered as an inline SVG feTurbulence so there is no image request.
 */
export default function Grain({ opacity = 0.16 }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay"
      style={{ opacity }}
    >
      <svg className="h-full w-full">
        <filter id="nextera-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#nextera-grain)" />
      </svg>
    </div>
  )
}

/**
 * PageFrame — the hairline border running around the whole page, plus the
 * crosshair "tick" marks that punctuate its corners and mid-points.
 */
export function PageFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55]">
      <div className="absolute inset-[10px] sm:inset-[14px] rounded-[14px] border border-rule-faint" />
      <Tick className="left-[10px] top-[10px] sm:left-[14px] sm:top-[14px]" />
      <Tick className="right-[10px] top-[10px] sm:right-[14px] sm:top-[14px]" />
      <Tick className="left-[10px] bottom-[10px] sm:left-[14px] sm:bottom-[14px]" />
      <Tick className="right-[10px] bottom-[10px] sm:right-[14px] sm:bottom-[14px]" />
    </div>
  )
}

function Tick({ className = '' }) {
  return (
    <span className={`absolute h-2 w-2 ${className}`}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-rule-strong" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-rule-strong" />
    </span>
  )
}

/** Rule — a full-width 1px divider that can carry a diagonal hatch band. */
export function Rule({ hatch = false, className = '' }) {
  if (hatch) {
    return (
      <div className={`relative h-px w-full bg-rule ${className}`}>
        <div className="hatch absolute inset-0 opacity-[0.55]" />
      </div>
    )
  }
  return <div className={`h-px w-full bg-rule ${className}`} />
}

/** SectionHead — the eyebrow + display headline block used across sections. */
export function SectionHead({ eyebrow, children, sub, align = 'left', className = '' }) {
  const centered = align === 'center'
  return (
    <div
      className={`cq-wrap ${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}
    >
      {eyebrow && (
        <div
          className={`mb-6 flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
        >
          <span className="h-px w-7 bg-rule-strong" />
          <span className="micro text-ash2">{eyebrow}</span>
        </div>
      )}
      <h2 className="t-h2 text-balance text-ink">{children}</h2>
      {sub && (
        <p className="mt-6 max-w-2xl text-[17px] leading-[1.62] text-ash text-pretty md:text-[18px]">
          {sub}
        </p>
      )}
    </div>
  )
}

/** Dot — the small status pip used in mockups and badges. */
export function Dot({ tone = 'mint', className = '' }) {
  const tones = {
    mint: 'bg-mint',
    ember: 'bg-ember',
    sky: 'bg-sky',
    ink: 'bg-ash2',
  }
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${tones[tone]} ${className}`} />
}

/** useScrolled — true once the page has moved past `offset`. */
export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])
  return scrolled
}

/** useMedia — matches a media query reactively. */
export function useMedia(query) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = () => setMatches(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}
