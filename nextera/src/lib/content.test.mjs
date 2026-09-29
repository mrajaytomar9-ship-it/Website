import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CONTACT_DETAILS, whatsappLink, ENQUIRY_MESSAGES, NAV } from './content.js'

/* Every WhatsApp button and every tel: link on the site is built from these
   two fields, so a typo here silently breaks all of them at once. */
/* The leading + is deliberate: the tel: links use phoneRaw with only the
   spaces stripped, and tel:+91… is the correct international form. WhatsApp
   links strip every non-digit, so the same value works for both. */
test('phoneRaw is a valid Indian mobile, country code first', () => {
  assert.match(CONTACT_DETAILS.phoneRaw, /^\+?91[6-9]\d{9}$/)
  assert.equal(CONTACT_DETAILS.phoneRaw.replace(/\D/g, ''), '919234377413')
})

test('phoneDisplay shows the same digits as phoneRaw', () => {
  assert.equal(CONTACT_DETAILS.phoneDisplay.replace(/\D/g, ''), '919234377413')
})

test('the tel: link the site builds is a valid international number', () => {
  const href = `tel:${CONTACT_DETAILS.phoneRaw.replace(/\s/g, '')}`
  assert.equal(href, 'tel:+919234377413')
})

test('the number is the one the founder supplied', () => {
  assert.equal(CONTACT_DETAILS.phoneRaw, '+919234377413')
})

test('every WhatsApp deep link points at that number', () => {
  for (const key of Object.keys(ENQUIRY_MESSAGES)) {
    const link = whatsappLink(ENQUIRY_MESSAGES[key])
    assert.ok(link.startsWith('https://wa.me/919234377413?text='), `${key} -> ${link}`)
  }
})

test('WhatsApp links encode the message so it survives the URL', () => {
  const link = whatsappLink(ENQUIRY_MESSAGES.report)
  assert.ok(!link.includes(' '))
  assert.ok(link.includes(encodeURIComponent('Nextera')))
})

test('every nav destination is an internal path', () => {
  for (const item of NAV) assert.match(item.to, /^\//)
})
