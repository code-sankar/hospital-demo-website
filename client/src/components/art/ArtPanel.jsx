import { motifs } from './motifs'

/**
 * ArtPanel replaces stock photography with generated, on-brand artwork.
 * Every panel is deterministic (same variant + seed = same image), weighs
 * nothing, scales infinitely and can never fail to load during a live demo.
 */

const TONES = {
  deep: { from: '#0e3b38', to: '#071615', ink: '#93b7b1', accent: '#c6a068', arch: '#ffffff' },
  pine: { from: '#14625e', to: '#0b2e2c', ink: '#bcd3cf', accent: '#d8bd90', arch: '#ffffff' },
  sage: { from: '#dde9e7', to: '#bcd3cf', ink: '#0e3b38', accent: '#90703e', arch: '#ffffff' },
  parchment: { from: '#f4efe6', to: '#ded6c7', ink: '#0e3b38', accent: '#b08a4f', arch: '#ffffff' },
  brass: { from: '#b08a4f', to: '#7a5c30', ink: '#f4efe6', accent: '#fbf8f3', arch: '#ffffff' },
}

export default function ArtPanel({
  variant = 'colonnade',
  tone = 'deep',
  seed = 1,
  arch = true,
  grid = true,
  className = '',
  label = '',
}) {
  const t = TONES[tone] ?? TONES.deep
  const build = motifs[variant] ?? motifs.colonnade
  const { paths = [], lines = [], circles = [], rects = [], dots = [] } = build(seed)
  const uid = `${variant}-${tone}-${seed}`

  return (
    <svg
      viewBox="0 0 600 750"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={label || `${variant} illustration`}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={t.from} />
          <stop offset="100%" stopColor={t.to} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="34%" r="72%">
          <stop offset="0%" stopColor={t.accent} stopOpacity="0.26" />
          <stop offset="100%" stopColor={t.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`arch-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.arch} stopOpacity="0.14" />
          <stop offset="100%" stopColor={t.arch} stopOpacity="0.015" />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <rect width="600" height="750" />
        </clipPath>
        <filter id={`grain-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <g clipPath={`url(#clip-${uid})`}>
        <rect width="600" height="750" fill={`url(#bg-${uid})`} />
        <rect width="600" height="750" fill={`url(#glow-${uid})`} />

        {grid && (
          <g stroke={t.ink} strokeOpacity="0.075" strokeWidth="1">
            {[1, 2, 3, 4, 5].map((i) => (
              <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="750" />
            ))}
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <line key={`h${i}`} x1="0" y1={i * 94} x2="600" y2={i * 94} />
            ))}
          </g>
        )}

        {/* The recurring arch — a European architectural signature */}
        {arch && (
          <path
            d="M 88 750 L 88 288 A 212 212 0 0 1 512 288 L 512 750 Z"
            fill={`url(#arch-${uid})`}
            stroke={t.arch}
            strokeOpacity="0.16"
            strokeWidth="1"
          />
        )}

        <g stroke={t.ink} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {rects.map((r, i) => (
            <rect
              key={`r${i}`}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              strokeOpacity={r.o ?? 0.3}
              strokeWidth={r.sw ?? 1}
            />
          ))}
          {lines.map((l, i) => (
            <line
              key={`l${i}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              strokeOpacity={l.o ?? 0.3}
              strokeWidth={l.w ?? 1}
              strokeDasharray={l.dash}
            />
          ))}
          {circles.map((c, i) => (
            <circle
              key={`c${i}`}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              strokeOpacity={c.o ?? 0.3}
              strokeWidth={c.w ?? 1}
              strokeDasharray={c.dash}
            />
          ))}
          {paths.map((p, i) => (
            <path
              key={`p${i}`}
              d={p.d}
              strokeOpacity={p.o ?? 0.5}
              strokeWidth={p.w ?? 1}
              strokeDasharray={p.dash}
            />
          ))}
        </g>

        <g fill={t.accent}>
          {dots.map((d, i) => (
            <circle key={`d${i}`} cx={d.cx} cy={d.cy} r={d.r} fillOpacity={d.o ?? 0.9} />
          ))}
        </g>

        {/* Paper grain keeps the flat fills from looking synthetic */}
        <rect width="600" height="750" filter={`url(#grain-${uid})`} opacity="0.11" />
      </g>
    </svg>
  )
}
