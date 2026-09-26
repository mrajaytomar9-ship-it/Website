import { useEffect, useRef, useState } from 'react'

/**
 * Reveal — fades + lifts children into view once, on intersection.
 * Respects prefers-reduced-motion via CSS.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 22,
  className = '',
  as: Tag = 'div',
  once = true,
  threshold = 0.12,
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            if (once) io.unobserve(e.target)
          } else if (!once) {
            setShown(false)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(node)
    return () => io.disconnect()
  }, [once, threshold])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.9s var(--ease-out-expo) ${delay}ms, transform 0.9s var(--ease-out-expo) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}
