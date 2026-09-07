import { describe, it, expect } from 'vitest'
import { parseAvailability } from '../src/db/seed.js'

/**
 * The seed reads the human clinic times already written in the content file.
 * Getting this wrong would book patients into rooms nobody is sitting in, so
 * the parser is pinned here — including the lines it must refuse to guess at.
 */
describe('parsing published clinic times into a rota', () => {
  it('reads a single day', () => {
    expect(parseAvailability(['Mon 10:00 am – 1:00 pm'])).toEqual([
      { weekday: 1, startsAt: '10:00', endsAt: '13:00' },
    ])
  })

  it('reads an afternoon clinic', () => {
    expect(parseAvailability(['Wed 3:00 pm – 6:00 pm'])).toEqual([
      { weekday: 3, startsAt: '15:00', endsAt: '18:00' },
    ])
  })

  it('expands a range of days', () => {
    const rules = parseAvailability(['Mon – Sat 8:00 am – 5:00 pm (reporting)'])
    expect(rules).toHaveLength(6)
    expect(rules.map((r) => r.weekday)).toEqual([1, 2, 3, 4, 5, 6])
    expect(rules[0]).toMatchObject({ startsAt: '08:00', endsAt: '17:00' })
  })

  it('wraps a range that crosses the end of the week', () => {
    const rules = parseAvailability(['Fri – Mon 9:00 am – 11:00 am'])
    expect(rules.map((r) => r.weekday)).toEqual([5, 6, 0, 1])
  })

  it('handles noon and midnight without shifting them twelve hours', () => {
    expect(parseAvailability(['Tue 12:00 pm – 12:30 pm'])[0]).toMatchObject({
      startsAt: '12:00',
      endsAt: '12:30',
    })
    expect(parseAvailability(['Tue 12:15 am – 1:00 am'])[0]).toMatchObject({
      startsAt: '00:15',
      endsAt: '01:00',
    })
  })

  it('skips a line it cannot read rather than inventing a clinic', () => {
    expect(parseAvailability(['Rotational — a consultant is present 24×7'])).toEqual([])
    expect(parseAvailability(['By appointment only'])).toEqual([])
  })

  it('reads several lines at once, keeping only the ones it understands', () => {
    const rules = parseAvailability([
      'Mon 10:00 am – 1:00 pm',
      'Rotational — on call',
      'Fri 2:00 pm – 6:00 pm',
    ])
    expect(rules).toEqual([
      { weekday: 1, startsAt: '10:00', endsAt: '13:00' },
      { weekday: 5, startsAt: '14:00', endsAt: '18:00' },
    ])
  })
})
