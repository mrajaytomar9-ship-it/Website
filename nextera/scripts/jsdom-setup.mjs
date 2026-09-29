/* Must be imported BEFORE react-dom so that canUseDOM is true when react-dom
   evaluates — otherwise React falls back to its legacy input polyfill and
   onChange never fires. */
import { JSDOM } from 'jsdom'

export const dom = new JSDOM(
  '<!doctype html><html><head><meta name="description" content=""></head><body><div id="root"></div></body></html>',
  { url: 'http://localhost/tools', pretendToBeVisual: true },
)

for (const k of [
  'window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'Event',
  'MouseEvent', 'KeyboardEvent', 'Node', 'getComputedStyle', 'localStorage',
  'requestAnimationFrame', 'cancelAnimationFrame', 'MutationObserver',
  // Lenis does `this.wrapper instanceof Window`, so the constructor itself has
  // to be a global — copying `window` alone is not enough.
  'Window', 'DOMRect', 'Element', 'CSS',
]) {
  Object.defineProperty(globalThis, k, {
    value: dom.window[k] ?? dom.window,
    configurable: true,
    writable: true,
  })
}
/* jsdom implements neither IntersectionObserver nor ResizeObserver. Framer
   Motion's whileInView needs the first and the EmberField canvas needs both.
   The convention this repo already follows is "no observer available ⇒ treat as
   visible" (the pre-Framer Reveal did the same), so the stub reports every
   observed target as intersecting on the next tick. That keeps reveals at
   their final state under test instead of stranding them at opacity 0. */
class IntersectionObserverStub {
  constructor(cb) {
    this.cb = cb
    this.targets = []
  }
  observe(target) {
    this.targets.push(target)
    // Fires synchronously rather than on a timer: components that reveal on
    // intersection (SplitLines, Reveal) then reach their final state within the
    // same commit, which is what the assertions expect. A deferred callback
    // leaves them stranded at opacity 0 until a timer runs.
    this.cb(
      [
        {
          target,
          isIntersecting: true,
          intersectionRatio: 1,
          boundingClientRect: {},
          intersectionRect: {},
          rootBounds: null,
          time: 0,
        },
      ],
      this,
    )
  }
  unobserve(target) {
    this.targets = this.targets.filter((t) => t !== target)
  }
  disconnect() {
    this.targets = []
  }
  takeRecords() {
    return []
  }
}

class ResizeObserverStub {
  constructor(cb) {
    this.cb = cb
  }
  observe(target) {
    this.cb(
      [{ target, contentRect: { width: 800, height: 600 }, borderBoxSize: [], contentBoxSize: [] }],
      this,
    )
  }
  unobserve() {}
  disconnect() {}
}

for (const [name, Stub] of [
  ['IntersectionObserver', IntersectionObserverStub],
  ['ResizeObserver', ResizeObserverStub],
]) {
  Object.defineProperty(globalThis, name, { value: Stub, configurable: true, writable: true })
  dom.window[name] = Stub
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true
