import { m } from 'framer-motion'
import { useScrollSkew } from './Cinema'

/**
 * Marquee — infinite horizontal ticker. Duplicates its children so the
 * -50% keyframe loops seamlessly, and pauses on hover.
 *
 * The band also leans a few degrees with scroll velocity, so a fast flick
 * throws it forward and it settles back on a spring. Purely ornamental: the
 * hook returns nothing under prefers-reduced-motion, in which case the wrapper
 * is a plain div and the ticker is exactly what it always was.
 */
export default function Marquee({ children, speed = 38, reverse = false, className = '' }) {
  const skew = useScrollSkew()

  /* Both halves carry the same wrapper so they stay the same width and the
     -50% loop stays seamless. */
  const copy = (key, hidden) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      <m.div className="flex shrink-0 items-center" style={skew}>
        {children}
      </m.div>
    </div>
  )

  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      {/* edge fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent"
      />
      <div
        className="anim-marquee flex shrink-0 items-center group-hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {copy('a', false)}
        {copy('b', true)}
      </div>
    </div>
  )
}
