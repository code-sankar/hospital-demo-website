/** Tiny deterministic PRNG (mulberry32) so generated artwork never flickers between renders. */
export function seeded(seed = 1) {
  let a = seed * 1831565813 + 0x6d2b79f5
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Range helper built on a seeded generator. */
export const range = (rnd, min, max) => min + rnd() * (max - min)
