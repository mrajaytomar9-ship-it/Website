/** Service line icons — 1.5px stroke, 24px grid, consistent optical weight. */
export default function ServiceIcon({ name, className = 'h-5 w-5' }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  const paths = {
    /* Websites — browser window */
    window: (
      <>
        <rect x="2.5" y="4" width="19" height="16" rx="2.5" {...common} />
        <path d="M2.5 9h19" {...common} />
        <path d="M5.5 6.5h.01M8 6.5h.01" {...common} />
        <path d="M7 13h6M7 16.5h4" {...common} />
      </>
    ),
    /* WhatsApp / chat — speech bubble with a phone glyph */
    chat: (
      <>
        <path
          d="M20.5 11.6c0 4.1-3.8 7.4-8.5 7.4-.9 0-1.8-.1-2.6-.4L4 20.5l1.4-4.2a7 7 0 0 1-1.9-4.7C3.5 7.5 7.3 4.2 12 4.2s8.5 3.3 8.5 7.4Z"
          {...common}
        />
        <path d="M9.2 8.6c.3 2.3 1.9 3.9 4.2 4.2" {...common} />
      </>
    ),
    /* Google Business Profile — map pin */
    pin: (
      <>
        <path d="M12 21.5s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" {...common} />
        <circle cx="12" cy="10.3" r="2.6" {...common} />
      </>
    ),
    /* Care & Presence — shield with a check */
    shield: (
      <>
        <path d="M12 2.8 4.5 6v6c0 4.4 3.2 8.2 7.5 9.3 4.3-1.1 7.5-4.9 7.5-9.3V6L12 2.8Z" {...common} />
        <path d="m9.2 12 2 2 3.6-3.8" {...common} />
      </>
    ),
    /* Clock / turnaround */
    clock: (
      <>
        <circle cx="12" cy="12" r="9" {...common} />
        <path d="M12 7v5.3l3.3 2" {...common} />
      </>
    ),
    /* Lock / ownership */
    lock: (
      <>
        <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" {...common} />
        <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" {...common} />
        <path d="M12 14.4v2.4" {...common} />
      </>
    ),
    /* Layers / reusable components */
    layers: (
      <>
        <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" {...common} />
        <path d="m3.5 12 8.5 4.5 8.5-4.5" {...common} />
        <path d="m3.5 16.5 8.5 4.5 8.5-4.5" {...common} />
      </>
    ),
    /* Target / fit */
    target: (
      <>
        <circle cx="12" cy="12" r="8.6" {...common} />
        <circle cx="12" cy="12" r="4.6" {...common} />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </>
    ),
    /* Document / scope */
    doc: (
      <>
        <path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8l-5-5Z" {...common} />
        <path d="M14 3v5h5" {...common} />
        <path d="M9 13h6M9 16.5h4" {...common} />
      </>
    ),
    /* Handshake / collaboration */
    handshake: (
      <>
        <path d="m11 6.5-2.2 2.2a1.7 1.7 0 0 0 2.4 2.4l.6-.6 3.2 3.2a1.5 1.5 0 0 0 2.1-2.1l.3-.3" {...common} />
        <path d="M3 9.5 6.5 6 10 8l2-1.2L14.5 9l1.2.7a1.6 1.6 0 0 1 .5 2.4l-.2.2" {...common} />
        <path d="M21 9.5 17.5 6 14 8" {...common} />
        <path d="M6.5 13.2 5 14.6a1.5 1.5 0 0 0 2.1 2.1l1-1" {...common} />
      </>
    ),
    /* Megaphone / outreach */
    megaphone: (
      <>
        <path d="M4 10.2v3.6a1.8 1.8 0 0 0 1.8 1.8h1.4l1.3 4.2a1 1 0 0 0 1.3.6l1-.3-1.8-6.3" {...common} />
        <path d="M8.5 15.6 20 9.3a.6.6 0 0 0 .1-1L18.4 6 6.5 10.4" {...common} />
      </>
    ),
    /* Spark / quality */
    spark: (
      <>
        <path d="M12 3.2 13.9 9l5.8 1.9-5.8 1.9L12 18.6l-1.9-5.8L4.3 10.9 10.1 9 12 3.2Z" {...common} />
      </>
    ),
  }

  const el = paths[name] || paths.target
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {el}
    </svg>
  )
}
