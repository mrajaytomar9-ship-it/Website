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
]) {
  Object.defineProperty(globalThis, k, {
    value: dom.window[k] ?? dom.window,
    configurable: true,
    writable: true,
  })
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true
