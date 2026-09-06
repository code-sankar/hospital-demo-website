import { seeded } from '../../lib/rng'

/**
 * An arch-framed illustrated portrait, drawn deterministically from a seed.
 * Engraved rather than photographic on purpose: a directory of stylised plates
 * reads as a design decision where a grid of grey avatars reads as broken
 * images. The stethoscope is what makes the silhouette a clinician.
 *
 * Everything in the figure shares one user-space gradient, so the head, neck
 * and coat merge into a single form rather than showing seams.
 */
const PALETTES = [
  // `stetho` always contrasts against `fig`, so the instrument reads on both
  // light-coat and dark-coat plates.
  { bg: '#0b2e2c', bg2: '#14625e', fig: '#cfe0dc', figTo: '#8fb0aa', dark: '#071615', stetho: '#0b2e2c', line: '#93b7b1', mono: '#d8bd90' },
  { bg: '#dde9e7', bg2: '#a9c5bf', fig: '#14625e', figTo: '#0b2e2c', dark: '#071615', stetho: '#dde9e7', line: '#0e3b38', mono: '#90703e' },
  { bg: '#14625e', bg2: '#0b2e2c', fig: '#f4efe6', figTo: '#c9d8d3', dark: '#0b2e2c', stetho: '#0b2e2c', line: '#bcd3cf', mono: '#f4efe6' },
  { bg: '#f4efe6', bg2: '#ded6c7', fig: '#2a706a', figTo: '#0e3b38', dark: '#071615', stetho: '#f4efe6', line: '#497a74', mono: '#b08a4f' },
  { bg: '#0e3b38', bg2: '#497a74', fig: '#ece6da', figTo: '#b9c9c3', dark: '#0b2e2c', stetho: '#0b2e2c', line: '#c6a068', mono: '#d8bd90' },
]

/** Hairlines, all clipped to the head so they can never float free of it. */
const HAIR = [
  'M 88 188 C 88 122, 212 122, 212 188 L 212 104 L 88 104 Z',
  'M 88 178 C 98 132, 152 154, 212 128 L 212 104 L 88 104 Z',
  'M 88 192 C 88 126, 212 126, 212 192 L 212 104 L 88 104 Z M 88 150 L 108 150 L 108 252 L 88 252 Z M 192 150 L 212 150 L 212 252 L 192 252 Z',
]

export default function Portrait({ seed = 1, initials = '', className = '', showMonogram = true, name = '' }) {
  const rnd = seeded(seed * 131)
  const p = PALETTES[seed % PALETTES.length]
  const hair = HAIR[seed % HAIR.length]
  const shoulder = 126 + Math.round(rnd() * 26)
  const uid = `pt${seed}`

  return (
    <svg
      viewBox="0 0 300 380"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={name ? `Illustrated portrait of ${name}` : 'Illustrated portrait'}
    >
      <defs>
        <linearGradient id={`bg${uid}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={p.bg2} />
          <stop offset="100%" stopColor={p.bg} />
        </linearGradient>
        <linearGradient id={`fg${uid}`} gradientUnits="userSpaceOnUse" x1="100" y1="118" x2="215" y2="380">
          <stop offset="0%" stopColor={p.fig} />
          <stop offset="100%" stopColor={p.figTo} />
        </linearGradient>
        <clipPath id={`head${uid}`}>
          <ellipse cx="150" cy="180" rx="52" ry="60" />
        </clipPath>
        <clipPath id={`arch${uid}`}>
          <path d="M 0 380 L 0 132 A 150 150 0 0 1 300 132 L 300 380 Z" />
        </clipPath>
      </defs>

      <g clipPath={`url(#arch${uid})`}>
        <rect width="300" height="380" fill={`url(#bg${uid})`} />

        {/* engraved rings and rules behind the figure */}
        <g stroke={p.line} fill="none" strokeOpacity="0.15">
          <circle cx="150" cy="186" r="106" />
          <circle cx="150" cy="186" r="142" />
          <circle cx="150" cy="186" r="182" />
        </g>
        <g stroke={p.line} strokeOpacity="0.09">
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="0" y1={72 + i * 64} x2="300" y2={72 + i * 64} />
          ))}
        </g>

        {/* ---- one continuous figure ---- */}
        <g fill={`url(#fg${uid})`}>
          <path
            d={`M ${150 - shoulder} 380 C ${150 - shoulder} 308, ${150 - 70} 272, 150 272 C ${150 + 70} 272, ${
              150 + shoulder
            } 308, ${150 + shoulder} 380 Z`}
          />
          <path d="M 130 214 L 170 214 L 170 276 L 130 276 Z" />
          <ellipse cx="150" cy="180" rx="52" ry="60" />
        </g>

        {/* shadow beneath the jaw, so the neck reads as behind the head */}
        <ellipse cx="150" cy="244" rx="21" ry="9" fill={p.dark} fillOpacity="0.16" />

        {/* hair, clipped to the head */}
        <g clipPath={`url(#head${uid})`}>
          <path d={hair} fill={p.dark} fillOpacity="0.52" />
        </g>

        {/* the coat opening */}
        <path d="M 150 274 L 127 380 L 150 334 L 173 380 Z" fill={p.dark} fillOpacity="0.3" />

        {/* stethoscope */}
        <g stroke={p.stetho} strokeOpacity="0.5" strokeWidth="4.5" fill="none" strokeLinecap="round">
          <path d="M 119 280 C 108 314, 116 338, 133 347" />
          <path d="M 181 280 C 192 312, 184 332, 171 342" />
        </g>
        <circle cx="165" cy="350" r="9" fill={p.stetho} fillOpacity="0.5" />

        <line x1="0" y1="358" x2="300" y2="358" stroke={p.mono} strokeOpacity="0.42" />
      </g>

      <path
        d="M 0.5 380 L 0.5 132 A 149.5 149.5 0 0 1 299.5 132 L 299.5 380"
        fill="none"
        stroke={p.mono}
        strokeOpacity="0.42"
      />

      {showMonogram && initials && (
        <text
          x="150"
          y="374"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="19"
          letterSpacing="3"
          fill={p.mono}
          fillOpacity="0.95"
        >
          {initials}
        </text>
      )}
    </svg>
  )
}
