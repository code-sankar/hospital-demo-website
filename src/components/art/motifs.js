import { seeded, range } from '../../lib/rng'

/**
 * Each motif returns an array of SVG path/shape descriptors drawn inside a
 * 600 x 750 viewBox. Keeping them as data (rather than JSX) lets ArtPanel
 * apply consistent stroke, opacity and layering rules to every variant.
 */

const ecg = (x0, y, w, amp) => {
  const seg = w / 6
  return [
    `M ${x0} ${y}`,
    `h ${seg * 0.9}`,
    `l ${seg * 0.18} ${-amp * 0.22}`,
    `l ${seg * 0.18} ${amp * 0.22}`,
    `h ${seg * 0.5}`,
    `l ${seg * 0.14} ${amp * 0.34}`,
    `l ${seg * 0.2} ${-amp * 1.5}`,
    `l ${seg * 0.22} ${amp * 1.9}`,
    `l ${seg * 0.18} ${-amp * 0.72}`,
    `h ${seg * 0.7}`,
    `q ${seg * 0.4} ${-amp * 0.5} ${seg * 0.8} 0`,
    `h ${seg * 1.6}`,
  ].join(' ')
}

const blob = (cx, cy, r, wobble, rnd) => {
  const pts = 10
  let d = ''
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2
    const rr = r * (1 + (rnd() - 0.5) * wobble)
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr * 0.82
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d + ' Z'
}

const spiral = (cx, cy, turns, spacing) => {
  let d = ''
  const steps = turns * 48
  for (let i = 0; i <= steps; i++) {
    const t = (i / 48) * Math.PI * 2
    const r = spacing * (i / 48)
    const x = cx + Math.cos(t) * r
    const y = cy + Math.sin(t) * r
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

export const motifs = {
  cardio: () => {
    const paths = [
      { d: ecg(-40, 430, 680, 130), w: 2 },
      { d: ecg(-40, 300, 680, 52), w: 1, o: 0.4 },
      { d: ecg(-40, 560, 680, 78), w: 1, o: 0.35 },
    ]
    const circles = [0, 1, 2].map((i) => ({ cx: 300, cy: 430, r: 90 + i * 74, o: 0.28 - i * 0.07 }))
    return { paths, circles, dots: [{ cx: 300, cy: 430, r: 6, fill: true }] }
  },

  neuro: (seed) => {
    const rnd = seeded(seed)
    const paths = []
    for (let i = 0; i < 9; i++) {
      paths.push({ d: blob(300, 380, 60 + i * 32, 0.22, seeded(seed + i)), w: 1, o: 0.5 - i * 0.04 })
    }
    const lines = []
    for (let i = 0; i < 5; i++) {
      const y = range(rnd, 120, 660)
      lines.push({ x1: 60, y1: y, x2: 540, y2: y + range(rnd, -60, 60), o: 0.24 })
    }
    return { paths, lines, dots: [{ cx: 300, cy: 380, r: 5, fill: true }] }
  },

  onco: () => {
    const circles = [0, 1, 2, 3, 4].map((i) => ({
      cx: 300,
      cy: 400,
      r: 52 + i * 58,
      o: 0.4 - i * 0.06,
      dash: i % 2 ? '3 9' : undefined,
    }))
    const lines = []
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      lines.push({
        x1: 300 + Math.cos(a) * 70,
        y1: 400 + Math.sin(a) * 70,
        x2: 300 + Math.cos(a) * 330,
        y2: 400 + Math.sin(a) * 330,
        o: 0.24,
      })
    }
    return { circles, lines, dots: [{ cx: 300, cy: 400, r: 7, fill: true }] }
  },

  ortho: () => {
    const lines = []
    const nodes = [
      [140, 160], [440, 210], [180, 380], [420, 420], [150, 600], [450, 610], [300, 290], [300, 510],
    ]
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i][0] - nodes[j][0]
        const dy = nodes[i][1] - nodes[j][1]
        if (Math.hypot(dx, dy) < 260) {
          lines.push({ x1: nodes[i][0], y1: nodes[i][1], x2: nodes[j][0], y2: nodes[j][1], o: 0.3 })
        }
      }
    }
    const dots = nodes.map(([cx, cy]) => ({ cx, cy, r: 7, fill: true }))
    return { lines, dots }
  },

  maternity: () => {
    const paths = []
    for (let i = 0; i < 7; i++) {
      const r = 70 + i * 42
      paths.push({ d: `M ${300 - r} 470 A ${r} ${r} 0 0 1 ${300 + r} 470`, w: 1, o: 0.44 - i * 0.05 })
    }
    return { paths, circles: [{ cx: 300, cy: 470, r: 34, o: 0.5 }], dots: [{ cx: 300, cy: 470, r: 6, fill: true }] }
  },

  emergency: () => {
    const circles = [0, 1, 2].map((i) => ({ cx: 300, cy: 390, r: 96 + i * 86, o: 0.3 - i * 0.08 }))
    const lines = [
      { x1: 300, y1: 300, x2: 300, y2: 480, o: 0.75, w: 14 },
      { x1: 210, y1: 390, x2: 390, y2: 390, o: 0.75, w: 14 },
    ]
    return { circles, lines }
  },

  internal: (seed) => {
    const rnd = seeded(seed)
    const lines = []
    for (let i = 0; i < 14; i++) {
      const y = 110 + i * 42
      lines.push({ x1: range(rnd, 40, 140), y1: y, x2: range(rnd, 430, 560), y2: y, o: 0.2 + (i % 3) * 0.08 })
    }
    const dots = []
    for (let i = 0; i < 9; i++) {
      dots.push({ cx: range(rnd, 90, 510), cy: 110 + Math.floor(range(rnd, 0, 14)) * 42, r: 5, fill: true })
    }
    return { lines, dots }
  },

  imaging: (seed) => {
    const rnd = seeded(seed)
    const rects = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        rects.push({ x: 78 + j * 152, y: 150 + i * 122, w: 128, h: 98, o: 0.18 + rnd() * 0.22 })
      }
    }
    const lines = [{ x1: 40, y1: 400, x2: 560, y2: 400, o: 0.5, dash: '2 8' }]
    return { rects, lines }
  },

  gastro: () => {
    let d = 'M 90 120'
    let y = 120
    for (let i = 0; i < 7; i++) {
      const dir = i % 2 === 0 ? 1 : -1
      d += ` C ${300 + dir * 260} ${y + 30}, ${300 + dir * 260} ${y + 60}, ${300 - dir * 190} ${y + 88}`
      y += 88
    }
    return { paths: [{ d, w: 2, o: 0.55 }], dots: [{ cx: 90, cy: 120, r: 6, fill: true }] }
  },

  renal: (seed) => {
    const paths = [
      { d: blob(215, 380, 105, 0.14, seeded(seed)), w: 1.5, o: 0.5 },
      { d: blob(390, 470, 88, 0.14, seeded(seed + 4)), w: 1.5, o: 0.4 },
    ]
    const circles = [
      { cx: 215, cy: 380, r: 150, o: 0.26 },
      { cx: 390, cy: 470, r: 128, o: 0.22 },
    ]
    return { paths, circles }
  },

  ent: () => ({
    paths: [{ d: spiral(300, 400, 4.2, 34), w: 1.6, o: 0.55 }],
    circles: [{ cx: 300, cy: 400, r: 210, o: 0.18 }],
    dots: [{ cx: 300, cy: 400, r: 6, fill: true }],
  }),

  paeds: (seed) => {
    const rnd = seeded(seed)
    const circles = []
    for (let i = 0; i < 15; i++) {
      circles.push({ cx: range(rnd, 90, 510), cy: range(rnd, 120, 680), r: range(rnd, 14, 62), o: 0.16 + rnd() * 0.3 })
    }
    return { circles }
  },

  rehab: () => {
    const lines = []
    for (let i = 0; i < 7; i++) {
      const x = 90 + i * 70
      const y = 600 - i * 62
      lines.push({ x1: x, y1: 640, x2: x, y2: y, o: 0.32 })
      lines.push({ x1: x - 24, y1: y, x2: x + 24, y2: y, o: 0.5, w: 4 })
    }
    return { paths: [{ d: 'M 66 600 Q 300 250 546 178', w: 2, o: 0.6, dash: '5 9' }], lines }
  },

  /* Architectural variants — the European fabric of the brand */
  colonnade: () => {
    const paths = []
    for (let i = 0; i < 5; i++) {
      const x = 40 + i * 122
      const w = 92
      paths.push({
        d: `M ${x} 690 L ${x} 330 A ${w / 2} ${w / 2} 0 0 1 ${x + w} 330 L ${x + w} 690`,
        w: 1.4,
        o: 0.42 - i * 0.03,
      })
    }
    const lines = [
      { x1: 0, y1: 690, x2: 600, y2: 690, o: 0.5 },
      { x1: 0, y1: 262, x2: 600, y2: 262, o: 0.4 },
      { x1: 0, y1: 246, x2: 600, y2: 246, o: 0.22 },
    ]
    return { paths, lines }
  },

  atrium: () => {
    const paths = [
      { d: 'M 120 720 L 120 300 A 180 180 0 0 1 480 300 L 480 720', w: 1.6, o: 0.5 },
      { d: 'M 186 720 L 186 336 A 114 114 0 0 1 414 336 L 414 720', w: 1.2, o: 0.32 },
      { d: 'M 250 720 L 250 372 A 50 50 0 0 1 350 372 L 350 720', w: 1, o: 0.24 },
    ]
    const lines = []
    for (let i = 0; i < 6; i++) lines.push({ x1: 60, y1: 200 + i * 96, x2: 540, y2: 200 + i * 96, o: 0.16 })
    return { paths, lines }
  },

  courtyard: () => {
    const circles = [
      { cx: 300, cy: 400, r: 220, o: 0.3 },
      { cx: 300, cy: 400, r: 158, o: 0.22 },
    ]
    const lines = []
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2
      lines.push({
        x1: 300 + Math.cos(a) * 158,
        y1: 400 + Math.sin(a) * 158,
        x2: 300 + Math.cos(a) * 220,
        y2: 400 + Math.sin(a) * 220,
        o: 0.3,
      })
    }
    return { circles, lines, dots: [{ cx: 300, cy: 400, r: 40, o: 0.18, fill: true }] }
  },

  lattice: () => {
    const lines = []
    for (let i = -6; i < 14; i++) {
      lines.push({ x1: i * 66, y1: 0, x2: i * 66 + 400, y2: 750, o: 0.18 })
      lines.push({ x1: i * 66 + 400, y1: 0, x2: i * 66, y2: 750, o: 0.18 })
    }
    return { lines }
  },
}

export const motifNames = Object.keys(motifs)
