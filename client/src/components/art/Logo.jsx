import { site } from '../../data/site'

/** The arch-and-cross mark: a doorway motif with a clinical cross cut into it. */
export function Mark({ className = 'h-9 w-9', tone = 'currentColor', accent = '#b08a4f' }) {
  return (
    <svg viewBox="0 0 40 44" className={className} aria-hidden="true" fill="none">
      <path
        d="M2 42V17a18 18 0 0 1 36 0v25"
        stroke={tone}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M9 42V18a11 11 0 0 1 22 0v24" stroke={tone} strokeOpacity="0.42" strokeWidth="1.2" />
      <path d="M20 13v16M12.5 21h15" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="20" cy="21" r="1.8" fill={tone} fillOpacity="0.28" />
      <path d="M0 42h40" stroke={tone} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/** Full lock-up: mark + wordmark + descriptor line. */
export default function Logo({ compact = false, inverted = false, className = '' }) {
  const tone = inverted ? '#fbf8f3' : '#0e3b38'
  const sub = inverted ? 'text-pine-200/70' : 'text-pine-600/70'
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Mark className={compact ? 'h-8 w-8' : 'h-10 w-10'} tone={tone} accent={inverted ? '#d8bd90' : '#b08a4f'} />
      <span className="flex flex-col leading-none">
        <span
          className="font-display font-semibold tracking-[0.18em] uppercase"
          style={{ color: tone, fontSize: compact ? '1.05rem' : '1.25rem' }}
        >
          {site.name}
        </span>
        {!compact && (
          <span className={`mt-1 text-[0.5625rem] font-medium tracking-[0.26em] uppercase ${sub}`}>
            Medical Centre
          </span>
        )}
      </span>
    </span>
  )
}
