#!/usr/bin/env node
/**
 * pseudo-check — a surface has exactly one ::before and one ::after.
 *
 * Two CSS rules targeting `.a::after` and `.b::after` do not merge when an
 * element carries both classes: the later one in source order wins outright
 * for every property they share, so one effect silently disappears. That is
 * invisible in review and only shows up as "the hover light stopped working".
 *
 * So: collect every class that styles a pseudo-element, then scan src/ for any
 * element whose className carries two of them on the same pseudo-element.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const SRC = 'src'
const CSS = 'src/index.css'

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f)
    return statSync(full).isDirectory() ? walk(full) : full
  })

const css = readFileSync(CSS, 'utf8')

/* class -> Set of pseudo-elements it styles */
const owners = new Map()
for (const m of css.matchAll(/\.([a-z][\w-]*)::(before|after)\b/g)) {
  const [, cls, pseudo] = m
  if (!owners.has(cls)) owners.set(cls, new Set())
  owners.get(cls).add(pseudo)
}

console.log(
  `classes styling a pseudo-element: ${owners.size}\n` +
    [...owners.entries()]
      .map(([c, p]) => `  .${c} -> ${[...p].join(', ')}`)
      .join('\n'),
)

/* Deliberate pairings. .spotlight-ember exists only to retint the overlay that
   .spotlight draws, so sharing ::after is the design, not a collision. */
const ALLOWED = new Set(['spotlight+spotlight-ember'])

const failures = []

for (const file of walk(SRC)) {
  if (!/\.(jsx|js)$/.test(file)) continue
  const src = readFileSync(file, 'utf8')
  const rel = relative(process.cwd(), file)

  /* every className attribute, including template literals; we only need the
     bare class tokens, not the interpolated parts */
  for (const m of src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
    /* Pull class-looking tokens out of the interpolations too. Stripping them
       is the tempting move and it is wrong: the conditional classes are exactly
       the ones that appear only on some variants, which is where collisions
       hide. This over-reports rather than under-reports. */
    const raw = m[1] ?? m[2] ?? ''
    const inner = [...raw.matchAll(/\$\{([^}]*)\}/g)].map((x) => x[1]).join(' ')
    const tokens = [...new Set(
      `${raw} ${inner}`
        .replace(/\$\{|\}/g, ' ')
        .split(/[\s'"`?:]+/)
        .filter((t) => /^[a-z][\w-]*$/.test(t)),
    )]
    const present = tokens.filter((t) => owners.has(t))
    if (present.length < 2) continue

    for (const pseudo of ['before', 'after']) {
      const clash = present.filter((t) => owners.get(t).has(pseudo))
      const key = [...clash].sort().join('+')
      if (clash.length > 1 && !ALLOWED.has(key)) {
        const line = src.slice(0, m.index).split('\n').length
        failures.push(
          `${rel}:${line}  .${clash.join(' and .')} both style ::${pseudo} — one will overwrite the other`,
        )
      }
    }
  }
}

if (failures.length) {
  console.error('\nFAIL — pseudo-element collisions:')
  for (const f of failures) console.error('  ' + f)
  process.exit(1)
}
console.log(
  `\nPass: no element carries two classes that style the same pseudo-element` +
    ` (${ALLOWED.size} intentional pairing(s) allowlisted).`,
)
