import { useEffect, useState } from 'react'
import Reveal from './ui/Reveal'

/**
 * PageHero — the interior-page masthead. Same grammar as the home hero so the
 * site reads as one system, at a smaller scale.
 */
export default function PageHero({ eyebrow, line1, line2, sub, children, meta }) {
  return (
    <section className="relative overflow-hidden pt-[124px] md:pt-[152px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px]"
        style={{
          background:
            'radial-gradient(50% 44% at 46% 18%, rgba(255,255,255,0.065) 0%, transparent 68%)',
        }}
      />
      <div aria-hidden="true" className="hairline-grid pointer-events-none absolute inset-0 opacity-25" />

      <div className="shell relative pb-20 md:pb-24">
        <div className="cq-wrap max-w-4xl">
          {eyebrow && (
            <Reveal delay={50}>
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-7 bg-rule-strong" />
                <span className="micro text-ash2">{eyebrow}</span>
              </div>
            </Reveal>
          )}

          <Reveal delay={120}>
            <h1 className="t-page text-balance font-medium text-ink">
              {line1}
              {line2 && (
                <>
                  <br />
                  <span className="fade-line">{line2}</span>
                </>
              )}
            </h1>
          </Reveal>

          {sub && (
            <Reveal delay={220}>
              <p className="mt-7 max-w-2xl text-base leading-[1.65] text-ash text-pretty md:text-lg">
                {sub}
              </p>
            </Reveal>
          )}

          {children && (
            <Reveal delay={320}>
              <div className="mt-9">{children}</div>
            </Reveal>
          )}

          {meta && (
            <Reveal delay={400}>
              <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-4">
                {meta.map((m) => (
                  <div key={m.l} className="bg-void px-5 py-6">
                    <dt className="micro mb-2.5 text-ash3">{m.l}</dt>
                    <dd className="font-display text-lg tracking-[-0.03em] text-ink">
                      {m.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
