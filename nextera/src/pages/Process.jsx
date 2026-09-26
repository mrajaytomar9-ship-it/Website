import { useState } from 'react'
import { PROCESS, DIFFERENTIATORS, CONTACT_DETAILS, whatsappLink, ENQUIRY_MESSAGES } from '../lib/content'
import PageHero from '../components/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import CtaBand from '../components/CtaBand'
import { SectionHead, Dot } from '../components/ui/Primitives'
import { DeliveryMockup } from '../components/Mockups'
import ServiceIcon from '../components/ServiceIcon'
import useMeta from '../hooks/useMeta'

const DIFF_ICONS = ['doc', 'target', 'shield', 'lock']

export default function Process() {
  useMeta(
    'How we work',
    'From a free audit to a tested launch: six steps, two consolidated revision rounds, and a delivery board you can see at any time.',
  )

  return (
    <>
      <PageHero
        eyebrow="How we work"
        line1="Six steps."
        line2="No surprises in step four."
        sub="Most website projects go wrong for the same reasons: scope that was never written down, approvals that never happened, and a launch nobody actually tested. This is the order we use to prevent all three."
        meta={[
          { l: 'Free first step', v: 'Audit' },
          { l: 'Discovery call', v: '15–25 min' },
          { l: 'Revisions', v: '2 rounds' },
          { l: 'Tested before', v: 'Launch' },
        ]}
      />

      {/* ------------------------------------------------------ TIMELINE --- */}
      <section className="band border-t border-rule">
        <div className="shell">
          <div className="relative">
            {/* the spine */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[15px] top-0 w-px bg-rule md:left-[calc(50%-0.5px)]"
            />

            <div className="flex flex-col gap-14 md:gap-24">
              {PROCESS.map((s, i) => {
                const right = i % 2 === 1
                return (
                  <Reveal key={s.n} delay={i * 60}>
                    <div
                      className={`relative flex gap-8 pl-12 md:pl-0 ${
                        right ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* node */}
                      <span
                        className="absolute left-0 top-0 z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full border border-rule bg-void md:left-1/2 md:-translate-x-1/2"
                        aria-hidden="true"
                      >
                        <Dot tone={i === 0 ? 'ember' : 'ink'} className={i === 0 ? 'anim-pulse' : ''} />
                      </span>

                      <div className={`w-full md:w-[calc(50%-44px)] ${right ? '' : 'md:ml-auto'}`}>
                        <div
                          className={`rounded-2xl border border-rule bg-void p-7 transition-colors duration-500 hover:bg-coal lg:p-8 ${
                            i === 0 ? 'border-ember/30' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="micro text-ash3">{s.n}</span>
                            {i === 0 && (
                              <span className="rounded-full border border-ember/35 bg-ember/10 px-2.5 py-1 micro text-ember-soft">
                                No cost
                              </span>
                            )}
                          </div>

                          <h2 className="mt-4 font-display text-[25px] tracking-[-0.03em] text-ink">
                            {s.title}
                          </h2>
                          <p className="mt-3.5 text-[15px] leading-[1.65] text-ash2 text-pretty">
                            {s.body}
                          </p>

                          <div className="mt-6 flex items-start gap-2.5 border-t border-rule pt-5">
                            <Dot tone="mint" className="mt-[7px] shrink-0" />
                            <span className="text-[13px] leading-[1.55] text-ash">{s.meta}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- WORKING --- */}
      <section className="band relative border-y border-rule bg-black/35">
        <div aria-hidden="true" className="hairline-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="shell relative">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:items-center lg:gap-20">
            <Reveal>
              <SectionHead
                eyebrow="What it looks like"
                sub="Every project runs on the same visible board. You always know what stage we are at, what we are waiting for, and what happens next."
              >
                You can see
                <br />
                <span className="fade-line">where we are.</span>
              </SectionHead>
              <div className="mt-9 flex flex-col gap-3.5">
                {[
                  'A preview link, not screenshots',
                  'One organised feedback list, not a stream of messages',
                  'A named owner for every open item',
                ].map((x) => (
                  <div key={x} className="flex items-center gap-3">
                    <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3 shrink-0">
                      <path d="m3 8.4 3 3L13 4.6" stroke="#4fd1a5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[14px] text-ash">{x}</span>
                  </div>
                ))}
              </div>
              <Button
                href={whatsappLink(ENQUIRY_MESSAGES.general)}
                variant="secondary"
                size="md"
                className="mt-9"
              >
                Start with the free audit
              </Button>
            </Reveal>

            <Reveal delay={130}>
              <DeliveryMockup />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- DIFFERENTIATORS */}
      <section className="band">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="Why the order matters"
              sub="Four commitments that show up in how a project actually runs, not just in how this page reads."
            >
              Where we hold
              <br />
              <span className="fade-line">the line.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2">
            {DIFFERENTIATORS.map((d, i) => (
              <Reveal key={d.title} delay={i * 80}>
                <div className="cq-wrap group h-full bg-void p-8 transition-colors duration-500 hover:bg-coal lg:p-10">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-rule bg-white/[0.03] text-ink transition-colors duration-500 group-hover:border-ember/30 group-hover:text-ember-soft">
                    <ServiceIcon name={DIFF_ICONS[i]} className="h-5 w-5" />
                  </span>
                  <h3 className="t-h3 mt-6 text-ink">{d.title}</h3>
                  <p className="mt-3.5 text-[14.5px] leading-[1.62] text-ash2 text-pretty">{d.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        line1="Step one is free."
        line2="Step two is a conversation."
        sub="The audit costs nothing and carries no obligation. If the honest answer is that you do not need a new website yet, that is what you will hear."
        showHatch
      />
    </>
  )
}
