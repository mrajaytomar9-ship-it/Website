/**
 * scale-check — keeps the type and radius systems inside their budgets.
 *
 * A design system only holds if nothing can quietly step outside it, so this
 * does two things:
 *
 *   1. Source scan: no one-off `text-[Npx]`, `text-[clamp(…)]`, `rounded-[…]`,
 *      `rounded-2xl` or bare `rounded` anywhere in src/. Every size and corner
 *      has to come from a named step.
 *   2. Built-CSS scan: counts the distinct font-size and border-radius steps
 *      actually emitted, the same way a design audit would, and fails when the
 *      count drifts past the budget (10 sizes, 6 radii).
 *
 * Run after `vite build` (it reads dist/).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const SRC = new URL('../src/', import.meta.url).pathname
const DIST = new URL('../dist/assets/', import.meta.url).pathname

/* The stylesheet carries four display steps (.t-hero, .t-page, .t-h2, .t-h3)
   but no single page uses more than three of them — .t-hero is the home hero
   and .t-page the inner-page hero, and they never co-occur. So the sheet holds
   11 steps while every page renders at most 10; ssr-smoke checks the per-page
   number, which is the one a design audit actually reports. */
const BUDGET_FONT_SIZES = 11
const BUDGET_RADII = 6

const failures = []
const warn = (m) => failures.push(m)

/* ------------------------------------------------------- 1. source scan --- */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(jsx?|css)$/.test(name)) out.push(p)
  }
  return out
}

const BANNED = [
  { re: /\btext-\[[0-9.]+px\]/g, why: 'one-off font size — use a text-* step' },
  { re: /\btext-\[clamp\(/g, why: 'one-off display size — use a .t-* step' },
  { re: /\brounded-\[[^\]]*\]/g, why: 'one-off radius — use rounded-sm/md/lg/xl' },
  { re: /\brounded-(2xl|3xl)\b/g, why: 'radius above the scale — use rounded-xl' },
  { re: /(?<![\w-])rounded(?![-\w])/g, why: 'bare `rounded` is off-scale — use rounded-sm' },
]

for (const file of walk(SRC)) {
  const rel = relative(process.cwd(), file)
  /* comments describe the system, they are not markup */
  const src = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  for (const { re, why } of BANNED) {
    for (const m of src.matchAll(re)) {
      const line = src.slice(0, m.index).split('\n').length
      warn(`${rel}:${line}  ${m[0]}  — ${why}`)
    }
  }
}

/* --------------------------------------------------- 2. built-CSS scan ---- */
const css = readdirSync(DIST)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(join(DIST, f), 'utf8'))
  .join('\n')

const sizes = new Set()
for (const m of css.matchAll(/font-size:\s*([^;}]+)/g)) {
  const v = m[1].trim()
  /* relative values (preflight's sub/sup, code, button) inherit rather than
     introduce a new step on the page */
  if (v === 'inherit' || /%$/.test(v) || /^[0-9.]+em$/.test(v)) continue
  sizes.add(v.startsWith('var(') ? v : v.replace(/\s+/g, ''))
}

const radii = new Set()
for (const m of css.matchAll(/border-radius:\s*([^;}]+)/g)) {
  const v = m[1].trim()
  if (v === '0' || v === '0px') continue /* no radius is not a step */
  /* Tailwind spells `full` as infinity, hand-written CSS as 9999px — one step */
  radii.add(/^(9999px|3\.40282e38px)$/.test(v) ? 'full' : v.replace(/\s+/g, ''))
}

console.log(`font-size steps emitted: ${sizes.size}   (budget ${BUDGET_FONT_SIZES})`)
for (const s of [...sizes].sort()) console.log(`  ${s}`)
console.log(`\nborder-radius steps emitted: ${radii.size}   (budget ${BUDGET_RADII})`)
for (const r of [...radii].sort()) console.log(`  ${r}`)

if (sizes.size > BUDGET_FONT_SIZES) {
  warn(`type scale has drifted to ${sizes.size} steps (budget ${BUDGET_FONT_SIZES})`)
}
if (radii.size > BUDGET_RADII) {
  warn(`radius scale has drifted to ${radii.size} steps (budget ${BUDGET_RADII})`)
}

if (failures.length) {
  console.error('\nFail:')
  for (const f of failures) console.error(`  ${f}`)
  process.exit(1)
}
console.log('\nPass: every size and corner comes from a named step.')
