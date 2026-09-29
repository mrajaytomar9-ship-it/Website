import { m } from 'framer-motion'
import { useReducedMotion } from './Motion'

/* --------------------------------------------------------------------------
   Reveal — lifts children into view once, on intersection.

   Same API and same call sites as the CSS-transition version it replaces; the
   difference is the physics. A spring overshoots slightly and settles, which
   is what makes an entrance read as an object arriving rather than a fade
   completing. The blur is the other half: a sharp element sliding in looks
   mechanical, a soft one resolving into focus looks filmed.

   Motion is decoration, never information — under prefers-reduced-motion this
   renders its final state with no animation at all. Before mount (and
   therefore in the server-rendered HTML) it also renders the final state, so
   the page is readable with JavaScript off.
   -------------------------------------------------------------------------- */

const SPRING = { type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }

export default function Reveal({
  children,
  delay = 0,
  y = 22,
  className = '',
  as: Tag = 'div',
  once = true,
  threshold = 0.12,
}) {
  const { mounted, reduced } = useReducedMotion()
  const off = !mounted || reduced
  const M = m[Tag] || m.div

  return (
    <M
      className={className}
      initial={off ? false : { opacity: 0, y, filter: 'blur(10px)', scale: 0.99 }}
      whileInView={
        off ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
      }
      viewport={{ once, amount: threshold }}
      transition={{ ...SPRING, delay: delay / 1000 }}
    >
      {children}
    </M>
  )
}
