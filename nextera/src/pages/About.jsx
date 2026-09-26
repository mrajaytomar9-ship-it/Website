import { TRUST_FOOTNOTES, CONTACT_DETAILS, whatsappLink, ENQUIRY_MESSAGES, NICHES } from '../lib/content'
import PageHero from '../components/PageHero'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import CtaBand from '../components/CtaBand'
import Marquee from '../components/ui/Marquee'
import { SectionHead, Rule, Dot } from '../components/ui/Primitives'
import useMeta from '../hooks/useMeta'

const PRINCIPLES = [
  {
    n: '01',
    t: 'Diagnose before prescribing',
    d: 'We ask how customers find you today and what happens when they call, before recommending anything. A package that does not match the real problem is just an expensive way to feel busy.',
  },
  {
    n: '02',
    t: 'Only what we can evidence',
    d: 'If we observed it, we say we observed it. If you told us, we say you told us. If we are guessing, we mark it as a guess. That distinction is the whole basis of a free audit being worth anything.',
  },
  {
    n: '03',
    t: 'Narrow, and staying narrow',
    d: 'Hotels and clinics in Agra. Not fifty cities, not twelve industries. The reason is simple: we would rather be genuinely useful in a small lane than vaguely capable in a large one.',
  },
  {
    n: '04',
    t: 'The founder approves the money',
    d: 'Quotes, discounts and delivery commitments are decided by a person, not by an assistant or an automated tool. If you are talking to us about a number, you are talking to the person who can change it.',
  },
  {
    n: '05',
    t: 'Capacity before commitment',
    d: 'We check what is already in flight before we promise a date. Saying "next month" costs less than saying yes and missing it.',
  },
  {
    n: '06',
    t: 'You can take it and go',
    d: 'Your domain, listing, content and access stay yours. Everything is documented so your team — or the next agency — can pick it up without us.',
  },
]

const FIT = {
  good: [
    'An owner-operated hotel, homestay, clinic or practice in Agra',
    'You already get some customers, but not from your website',
    'You can name one person who approves content quickly',
    'You want a real quote for real work, not a discovery call that goes nowhere',
    'You are comfortable being told what does not need doing',
  ],
  bad: [
    'You need guaranteed #1 rankings or a guaranteed lead count',
    'You want fake reviews, disguised claims or hidden credentials',
    'You need a full booking engine, patient-record system or clinical chatbot in a fixed low price',
    'You are looking for someone to run your whole marketing department this month',
    'The budget is not real yet, and the timeline is fixed anyway',
  ],
}

export default function About() {
  useMeta(
    'About',
    'A founder-led studio building websites and enquiry paths for hotels and clinics in Agra. Narrow focus, honest scope, and no guarantees we cannot keep.',
  )

  return (
    <>
      <PageHero
        eyebrow="About"
        line1="A small studio"
        line2="with a clear lane."
        sub="Nextera Solution builds the website and enquiry path for hotels and clinics across Agra. We are deliberately narrow, deliberately priced in rupees, and deliberately honest about the things we cannot promise you."
        meta={[
          { l: 'Based in', v: CONTACT_DETAILS.city },
          { l: 'Focus', v: 'Hotels & clinics' },
          { l: 'Delivery', v: 'Founder-led' },
          { l: 'Free first step', v: 'Audit' },
        ]}
      />

      {/* ------------------------------------------------------------ STORY */}
      <section className="band border-t border-rule">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:gap-20">
            <Reveal>
              <SectionHead eyebrow="What this is">
                The short,
                <br />
                <span className="fade-line">unembellished version.</span>
              </SectionHead>
            </Reveal>

            <Reveal delay={120}>
              <div className="flex flex-col gap-6 text-[16.5px] leading-[1.7] text-ash text-pretty">
                <p>
                  Most small businesses in Agra are not invisible. They are findable and
                  then unusable — a listing with old hours, a website that takes nine seconds
                  to load on a phone, a contact route that asks someone to fill in a form
                  nobody reads.
                </p>
                <p>
                  The gap between &ldquo;findable&rdquo; and &ldquo;usable&rdquo; is what we work in.
                  It is not glamorous, and it is not a large invoice, but it is the difference
                  between a search that turns into a message and a search that disappears.
                </p>
                <p>
                  We started with a narrow focus on purpose. Hotels and clinics have similar
                  problems, the same regulatory instincts apply, and the language of trust
                  matters more than clever design. Doing one thing properly beats doing five
                  things adequately — especially when the person delivering it is one person.
                </p>
                <p>
                  We are priced for owner-operated businesses, not enterprises. Every package
                  states what is included, what is not, and what we need from you. If the
                  honest recommendation is a smaller first step, that is what you will get.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- PRINCIPLES */}
      <section className="band relative border-y border-rule bg-black/35">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow="How we operate"
              sub="Not values on a wall — these are the rules that actually decide what happens on a project."
            >
              Six rules we
              <br />
              <span className="fade-line">do not bend.</span>
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-2 xl:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={i * 70}>
                <div className="cq-wrap group h-full bg-void p-7 transition-colors duration-500 hover:bg-coal lg:p-8">
                  <span className="micro text-ash3">{p.n}</span>
                  <h3 className="mt-5 text-[18px] leading-[1.35] text-ink">{p.t}</h3>
                  <p className="mt-3.5 text-[14px] leading-[1.62] text-ash2 text-pretty">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- FIT */}
      <section className="band">
        <div className="shell">
          <Reveal>
            <SectionHead eyebrow="Is this you?" align="center">
              A candid fit check,
              <br />
              <span className="fade-line">before you spend anything.</span>
            </SectionHead>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-[20px] border border-rule bg-void p-8">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint/15">
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                      <path d="m2.5 6.2 2.2 2.2L9.5 3.6" stroke="#4fd1a5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="text-[16px] text-ink">This tends to work well</p>
                </div>
                <ul className="mt-7 flex flex-col gap-4">
                  {FIT.good.map((x) => (
                    <li key={x} className="flex gap-3 text-[14px] leading-[1.6] text-ash2">
                      <Dot tone="mint" className="mt-[8px] shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <div className="h-full rounded-[20px] border border-rule bg-void p-8">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f0705a]/15">
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="#f0705a" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p className="text-[16px] text-ink">We will politely decline</p>
                </div>
                <ul className="mt-7 flex flex-col gap-4">
                  {FIT.bad.map((x) => (
                    <li key={x} className="flex gap-3 text-[14px] leading-[1.6] text-ash2">
                      <Dot tone="ember" className="mt-[8px] shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- NICHE BAR */}
      <div className="border-y border-rule bg-black/40">
        <Marquee speed={50} reverse className="py-7">
          {NICHES.map((n) => (
            <span key={n} className="flex items-center">
              <span className="whitespace-nowrap px-7 text-[15px] text-ash3">{n}</span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-ash3/40" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* ------------------------------------------------- INTEGRITY / PRIVACY */}
      <section id="integrity" className="band scroll-mt-24">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:gap-20">
            <Reveal>
              <SectionHead
                eyebrow="Integrity"
                sub="A marketing site is the one place a business is most tempted to overstate things. So these are written down, and they are the same rules we work to."
              >
                What we will
                <br />
                <span className="fade-line">never claim.</span>
              </SectionHead>

              <div id="privacy" className="mt-10 scroll-mt-28 rounded-2xl border border-rule bg-coal p-7">
                <p className="micro mb-4 text-ash3">On privacy, specifically</p>
                <p className="text-[14px] leading-[1.65] text-ash2 text-pretty">
                  Enquiry forms collect only what your enquiry genuinely needs. For clinics
                  that means no patient records, no reports, no symptom histories and no
                  insurance details. We do not install tracking we cannot explain, and we do
                  not copy a generic privacy notice describing systems we do not use.
                </p>
              </div>

              <Button
                href={whatsappLink(ENQUIRY_MESSAGES.general)}
                variant="secondary"
                size="md"
                className="mt-8"
              >
                Ask us anything directly
              </Button>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2">
                {TRUST_FOOTNOTES.map((t) => (
                  <div key={t.t} className="bg-void p-7">
                    <p className="text-[15.5px] text-ink">{t.t}</p>
                    <p className="mt-2.5 text-[13.5px] leading-[1.6] text-ash2 text-pretty">
                      {t.d}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand
        line1="Talk to a person."
        line2="Not a funnel."
        sub="One conversation, a straight recommendation, and a written scope you can take away and think about. No pressure, no countdown timer."
        showHatch
      />
    </>
  )
}
