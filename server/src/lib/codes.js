import { randomInt } from 'node:crypto'

// Crockford-style alphabet with the characters people mishear or mistype
// removed (no I, L, O, U, 0, 1) — these codes get read aloud at a busy counter.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ'

const block = (length) =>
  Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')

/**
 * Ticket code, e.g. ASH-7K3M-9QX2.
 * Eight random characters from a 30-symbol alphabet is roughly 2^39 —
 * unguessable in practice, and the lookup endpoint is rate limited besides.
 */
export const ticketCode = (prefix = 'ASH') => `${prefix}-${block(4)}-${block(4)}`
