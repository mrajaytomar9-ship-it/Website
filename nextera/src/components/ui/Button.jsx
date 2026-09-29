import { Link } from 'react-router-dom'

const base =
  'sheen group relative inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-medium tracking-[-0.01em] transition-all duration-300 will-change-transform active:scale-[0.975]'

const sizes = {
  sm: 'h-9 px-5',
  md: 'h-11 px-6',
  lg: 'h-[52px] px-7 text-sm',
}

const variants = {
  /* Solid white — the highest-contrast action on the page */
  primary:
    'bg-ink text-void hover:bg-white shadow-[0_0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_38px_-8px_rgba(255,255,255,0.45)]',

  /* Glass outline — the secondary action */
  secondary:
    'glass border border-rule-strong text-ink hover:border-white/30 hover:bg-white/[0.07]',

  /* Ghost — minimal */
  ghost: 'text-ash hover:text-ink hover:bg-white/[0.045] border border-transparent',

  /* Brand accent — used sparingly */
  accent:
    'bg-ember text-black hover:bg-ember-soft shadow-[0_0_34px_-10px_rgba(232,146,47,0.75)] hover:shadow-[0_0_40px_-8px_rgba(232,146,47,0.9)]',

  /* On light card */
  onDark: 'border border-rule-strong text-ink hover:bg-white/[0.06] hover:border-white/25',
}

function Arrow({ className = '' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={`h-[13px] w-[13px] transition-transform duration-300 group-hover:translate-x-0.5 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  arrow = true,
  className = '',
  children,
  ...rest
}) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && <Arrow />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {inner}
      </Link>
    )
  }
  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {inner}
      </a>
    )
  }

  const Tag = as || 'button'
  return (
    <Tag className={cls} {...rest}>
      {inner}
    </Tag>
  )
}
