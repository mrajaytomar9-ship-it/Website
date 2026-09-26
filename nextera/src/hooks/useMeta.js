import { useEffect } from 'react'

const SITE = 'Nextera Solution'

/**
 * useMeta — sets <title> and the meta description for the current route.
 * Called once at the top of each page component.
 */
export default function useMeta(title, description) {
  useEffect(() => {
    const full = title ? `${title} — ${SITE}` : `${SITE} — Websites & enquiry journeys for Agra hotels and clinics`
    document.title = full

    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)

      let og = document.querySelector('meta[property="og:description"]')
      if (og) og.setAttribute('content', description)

      let ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', full)
    }
  }, [title, description])
}
