/**
 * Marquee — infinite horizontal ticker. Duplicates its children so the
 * -50% keyframe loops seamlessly, and pauses on hover.
 */
export default function Marquee({ children, speed = 38, reverse = false, className = '' }) {
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
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
