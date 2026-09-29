import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Grain, { PageFrame } from './ui/Primitives'
import { CursorGlow, ScrollProgress } from './ui/Motion'
import { SmoothScroll } from './ui/Cinema'
import { LazyMotion, domAnimation } from 'framer-motion'

/** Scroll to top on route change, or to the hash target if one is present. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section is mounted before scrolling.
      const id = hash.replace('#', '')
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 88
          if (window.__lenis) window.__lenis.scrollTo(top)
          else window.scrollTo({ top, behavior: 'smooth' })
        } else if (window.__lenis) {
          window.__lenis.scrollTo(0, { immediate: true })
        } else {
          window.scrollTo({ top: 0 })
        }
      })
      return () => cancelAnimationFrame(raf)
    }
    // Route changes must land instantly, not glide: nobody wants to watch the
    // previous page scroll away.
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    else window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname, hash])

  return null
}

/** Per-route <head> management lives in hooks/useMeta.js — each page calls
 *  it directly. Layout only carries the chrome. */

export default function Layout() {
  return (
    /* LazyMotion + the `m` components instead of `motion.*`: it loads only the
       animation features this site uses, which is roughly half the bundle.
       `strict` makes any stray `motion.*` throw rather than silently pull the
       full engine back in. */
    <LazyMotion features={domAnimation} strict>
      <SmoothScroll>
    <div className="relative min-h-screen bg-void">
      <ScrollManager />
      <ScrollProgress />
      <CursorGlow />
      <Grain />
      <PageFrame />

      {/* Global ambient wash — keeps the pure black from reading flat */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(70% 48% at 50% -8%, rgba(255,255,255,0.06) 0%, transparent 62%), radial-gradient(46% 34% at 88% 8%, rgba(232,146,47,0.06) 0%, transparent 70%), radial-gradient(38% 30% at 6% 62%, rgba(95,179,240,0.035) 0%, transparent 72%)',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
      </SmoothScroll>
    </LazyMotion>
  )
}
