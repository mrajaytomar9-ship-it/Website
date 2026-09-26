/* =============================================================================
   CSS CLASS COVERAGE CHECK
   -----------------------------------------------------------------------------
   A responsive layout usually breaks in one of two ways: a component throws
   before it paints (caught by `npm run smoke`), or a class name never made it
   into the stylesheet — a typo, or a class Tailwind could not see because it
   was assembled at runtime. Nothing errors in that case; the layout is simply
   wrong on one breakpoint.

   This walks every className in src/, builds the site, and asserts that each
   utility that looks like a Tailwind class exists in the emitted CSS.

   Run:  npm run check:css      (builds first, then checks)
         node scripts/class-check.mjs   (against an existing dist/)
   ============================================================================= */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'src'

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(jsx|js)$/.test(p) && !p.endsWith('.test.mjs')) out.push(p)
  }
  return out
}

/* Only tokens shaped like a utility are checked: hyphenated names, or a
   variant prefix. That is where responsive bugs live, and it keeps JS
   identifiers from a template-literal ternary out of the report. */
const UTILITY = /^[a-z][a-z0-9-]*(?::[a-z0-9[\]().%#,_/-]+)*$/

const classRe = /className=(?:"([^"]*)"|\{`([^`]*)`\})/g
const used = new Map()

for (const file of walk(SRC)) {
  const text = readFileSync(file, 'utf8')
  let match
  while ((match = classRe.exec(text))) {
    const raw = (match[1] || match[2] || '').replace(/\$\{[\s\S]*?\}/g, ' ')
    for (const token of raw.split(/\s+/)) {
      const cls = token.replace(/^['"`]+|['"`]+$/g, '')
      if (!cls || !UTILITY.test(cls)) continue
      if (!cls.includes('-') && !cls.includes(':')) continue
      if (!used.has(cls)) used.set(cls, file)
    }
  }
}

const assets = 'dist/assets'
if (!existsSync(assets)) {
  console.error('No dist/ — run `npm run build` first (or `npm run check:css`).')
  process.exit(2)
}
const cssFile = readdirSync(assets).find((f) => f.endsWith('.css'))
/* Tailwind escapes : [ ] ( ) # in selectors; drop the backslashes to compare. */
const css = readFileSync(join(assets, cssFile), 'utf8').replace(/\\/g, '')

const missing = []
for (const [cls, file] of used) {
  const escaped = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (!new RegExp(`\\.${escaped}(?![\\w-])`).test(css)) missing.push([cls, file])
}

console.log(`stylesheet: ${cssFile}`)
console.log(`utility classes used: ${used.size}   missing from CSS: ${missing.length}`)
for (const [cls, file] of missing.sort()) console.log(`  MISSING  ${cls}   (${file})`)

if (missing.length) {
  console.error('\nFail: those classes will render as no-ops.')
  process.exit(1)
}
console.log('Pass: every utility class in src/ exists in the built CSS.')
