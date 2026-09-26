import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Guarantees a fresh scroll position on route change (Layout handles hashes). */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [pathname])
  return null
}
