/* Mounts the REAL Tools page in jsdom and drives it like a founder would:
   change the business type, type a new price, type garbage — and asserts the
   numbers on screen are the numbers the engine produces. */
import { dom } from './jsdom-setup.mjs'

async function main() {
/* react / react-dom must load AFTER the jsdom globals, or React falls back to
   its legacy input handling and onChange never fires */
const { act } = await import('react')
const { createRoot } = await import('react-dom/client')
const { StaticRouter } = await import('react-router-dom/server')
const { default: Tools } = await import('../src/pages/Tools')
const { BUSINESS_TYPES, computeMetrics, formatINR } = await import('../src/lib/calculator')

const container = dom.window.document.getElementById('root')
const root = createRoot(container)
const failures = []
const check = (label, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ' — ' + detail : ''}`)
  if (!ok) failures.push(label)
}
const text = () => container.textContent
const byLabel = (labelText) => {
  const label = [...container.querySelectorAll('label')].find((l) =>
    l.textContent.trim().startsWith(labelText),
  )
  return label ? container.ownerDocument.getElementById(label.getAttribute('for')) : null
}
const typeInto = (el, value) => {
  const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set
  act(() => {
    setter.call(el, value)
    el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
  })
}
const click = (el) => act(() => { el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })) })
const headline = () => {
  const el = [...container.querySelectorAll('p')].find((p) =>
    p.textContent.trim().startsWith('Net profit this month') ||
    p.textContent.trim().startsWith('Net loss this month'),
  )
  return el ? el.nextElementSibling.textContent.trim() : null
}

/* ---------------------------------------------------------------- mount */
act(() => { root.render(<StaticRouter location="/tools"><Tools /></StaticRouter>) })

const hotel = computeMetrics({ typeId: 'hotel', ...BUSINESS_TYPES[0].values })
check('mounts and shows the hotel preset net profit', headline() === formatINR(hotel.profit.netProfit), headline())
check('shows the hotel break-even', text().includes(`${Math.round(hotel.breakEven.units)} room nights`) || text().includes('160 room nights'), '')
check('renders the verdict from the numbers', text().includes(hotel.verdict.label), hotel.verdict.label)
check('inputs are populated from the preset', byLabel('Average rate per room night')?.value === '2400', byLabel('Average rate per room night')?.value)

/* ------------------------------------------------- type a new ADR ------- */
typeInto(byLabel('Average rate per room night'), '3000')
const dearer = computeMetrics({ typeId: 'hotel', ...BUSINESS_TYPES[0].values, price: 3000 })
check('retyping the rate updates the profit', headline() === formatINR(dearer.profit.netProfit), `${headline()} vs ${formatINR(dearer.profit.netProfit)}`)
check('and it changed', headline() !== formatINR(hotel.profit.netProfit), '')
check('the gap-to-target block follows', text().includes(formatINR(Math.abs(dearer.target.gap))), '')

/* ------------------------------------------------- type garbage --------- */
typeInto(byLabel('Average rate per room night'), 'abc')
const zero = computeMetrics({ typeId: 'hotel', ...BUSINESS_TYPES[0].values, price: 0 })
check('garbage input does not crash or print NaN', !text().includes('NaN'), '')
check('garbage is treated as zero', headline() === formatINR(zero.profit.netProfit), headline())

/* ------------------------------------------------- switch business ------ */
typeInto(byLabel('Average rate per room night'), '2400')
const clinicChip = [...container.querySelectorAll('button')].find((b) => b.textContent.includes('Clinic / Diagnostic'))
click(clinicChip)
const clinic = computeMetrics({ typeId: 'clinic', ...BUSINESS_TYPES[1].values })
check('switching type loads the clinic preset', headline() === formatINR(clinic.profit.netProfit), `${headline()} vs ${formatINR(clinic.profit.netProfit)}`)
check('and its field wording', byLabel('Appointment slots per day')?.value === '32', byLabel('Appointment slots per day')?.value)
check('clinic verdict shown', text().includes(clinic.verdict.label), clinic.verdict.label)

/* ------------------------------------------------- what-if lever -------- */
const lever = [...container.querySelectorAll('input[type="range"]')].find((i) =>
  (i.getAttribute('aria-label') || '').startsWith('Recover platform'),
)
check('what-if lever exists', !!lever, lever?.getAttribute('aria-label'))
act(() => {
  const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set
  setter.call(lever, '50')
  lever.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
  lever.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
})
check('lever moves the scenario profit', text().includes('With these changes'), '')
check('and reports a gain', /\+₹[\d,]+ a month/.test(text()), (text().match(/\+₹[\d,]+ a month/) || [''])[0])

/* ------------------------------------------------- persistence ---------- */
const saved = JSON.parse(dom.window.localStorage.getItem('nextera.tools.v1'))
check('state persisted to localStorage only', saved?.typeId === 'clinic' && saved?.values?.capacity === '32', JSON.stringify(saved?.values?.capacity))
check('no resource was fetched off-origin', (dom.window.performance?.getEntriesByType?.('resource') || []).filter((r) => !r.name.startsWith('http://localhost')).length === 0, '')

/* ------------------------------------------------- phone summary bar ---- */
const bar = [...container.querySelectorAll('div.fixed')].find((d) => d.className.includes('bottom-0'))
check('phone summary bar renders the same profit', bar && bar.textContent.includes(formatINR(clinic.profit.netProfit)), bar ? bar.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) : 'missing')

/* ================================================ THE REPORT PAGE ======== */
const { default: Report } = await import('../src/pages/Report')
const { buildReport, defaultInput } = await import('../src/lib/report')

dom.window.localStorage.removeItem('nextera.report.v1')
act(() => { root.render(<StaticRouter location="/report"><Report /></StaticRouter>) })

const ring = () => container.querySelector('svg[aria-label^="Presence score"]')
const ringScore = () => {
  const l = ring()?.getAttribute('aria-label') || ''
  return (l.match(/score (\d+|-)/) || [])[1]
}

check('report page waits for a name and a link', text().includes('Give the business a name'), '')
check('and refuses to score an empty form', ring() === null, '')

typeInto(byLabel('Business name'), 'Guest House Taj View')
typeInto(byLabel('Website'), 'tajviewagra.in')

const expectedInput = {
  ...defaultInput('hotel'),
  name: 'Guest House Taj View',
  links: { ...defaultInput('hotel').links, website: 'tajviewagra.in' },
}
const expected = buildReport(expectedInput)
check('a name plus one link is enough to score', ring() !== null, ringScore())
check(
  'the score on screen is the score the engine returns',
  ringScore() === String(Math.round(expected.score.overall)),
  `${ringScore()} vs ${Math.round(expected.score.overall)}`,
)
check('the grade follows the score', text().includes(expected.score.grade.label), expected.score.grade.label)

/* "Every check" also appears in the unlock prompt's copy, so look for the
   section heading the unlocked breakdown actually renders. */
const hasFullBreakdown = () =>
  [...container.querySelectorAll('h3')].some((h) => h.textContent.trim() === 'Every check')
check('the full breakdown is gated', hasFullBreakdown() === false, '')
check('the unlock form is offered', text().includes('Unlock the full report'), '')

const findUnlock = () =>
  [...container.querySelectorAll('button')].find((b) => b.textContent.includes('Show me the full report'))
click(findUnlock())
check(
  'unlocking without a number is refused',
  text().includes('10-digit Indian mobile number') && hasFullBreakdown() === false,
  '',
)

typeInto(byLabel('Your name'), 'Ravi Sharma')
typeInto(byLabel('WhatsApp number'), '9876543210')
click(findUnlock())
check('a valid number unlocks the full report', hasFullBreakdown() === true, '')
check(
  'all three exports are offered',
  text().includes('Print or save as PDF') &&
    text().includes('Download the report') &&
    text().includes('Send it to us on WhatsApp'),
  '',
)
check(
  'the money section is the calculator, not a second engine',
  text().includes(formatINR(expected.money.metrics.profit.netProfit)),
  formatINR(expected.money.metrics.profit.netProfit),
)
check(
  'the pasted link is reported as recognised',
  text().includes('Your own website') && text().includes('tajviewagra.in'),
  '',
)

/* typing into the presence questions must move the score */
const before = ringScore()
typeInto(byLabel('Photos across your listings'), '60')
typeInto(byLabel('Reviews you have'), '300')
const richer = buildReport({
  ...expectedInput,
  presence: { ...expectedInput.presence, photos: '60', reviews: '300' },
})
check('answering more questions moves the score', ringScore() === String(Math.round(richer.score.overall)), `${before} -> ${ringScore()}`)
check('and it went up', Number(ringScore()) > Number(before), `${before} -> ${ringScore()}`)

const storedReport = JSON.parse(dom.window.localStorage.getItem('nextera.report.v1'))
check(
  'the report state is saved in the browser only',
  storedReport?.input?.name === 'Guest House Taj View' && storedReport?.unlocked === true,
  JSON.stringify(storedReport?.lead?.whatsapp),
)

console.log(failures.length ? `\nFAILURES: ${failures.join(' | ')}` : '\nAll interaction checks passed.')
process.exit(failures.length ? 1 : 0)
}
main()
