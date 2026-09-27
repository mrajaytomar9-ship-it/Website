/** Wordmark + abstract "N" monogram mark, drawn inline so it never 404s. */

export function Monogram({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect x="1.1" y="1.1" width="29.8" height="29.8" rx="8.4" stroke="currentColor" strokeOpacity="0.24" strokeWidth="1.2" />
      {/* stylised "N" formed by a rising path — the "next" in Nextera */}
      <path
        d="M9 23V9.6c0-.4.5-.6.8-.3l9.4 10.6c.3.3.8.1.8-.3V9"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23" cy="9" r="2.5" fill="currentColor" />
    </svg>
  )
}

export function Logo({ className = '', withWord = true }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Monogram className="h-[26px] w-[26px] text-ink" />
      {withWord && (
        <span className="font-display text-base font-semibold uppercase tracking-[0.15em] text-ink">
          Nextera
        </span>
      )}
    </span>
  )
}
