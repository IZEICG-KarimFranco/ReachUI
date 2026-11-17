import { describe, it, expect } from 'vitest'
import {
  getStatCellBorders,
  getStatStripColumns,
} from '@/components/ui/lib/stat-strip'

const has = (index: number, count: number, className: string) =>
  getStatCellBorders(index, count).includes(className)

describe('getStatStripColumns', () => {
  it.each([
    [1, { sm: 1, lg: 1 }],
    [2, { sm: 2, lg: 2 }],
    [3, { sm: 3, lg: 3 }],
    [4, { sm: 2, lg: 4 }],
    [5, { sm: 2, lg: 4 }],
  ])('returns the columns for %i items', (count, expected) => {
    expect(getStatStripColumns(count)).toEqual(expected)
  })
})

describe('getStatCellBorders', () => {
  it('draws a horizontal divider on mobile for every item except the last', () => {
    expect(has(0, 3, 'border-b')).toBe(true)
    expect(has(1, 3, 'border-b')).toBe(true)
    expect(has(2, 3, 'border-b-0')).toBe(true)
  })

  it('3 items: vertical dividers between the three columns and no horizontal divider', () => {
    expect(has(0, 3, 'sm:border-r')).toBe(true)
    expect(has(1, 3, 'sm:border-r')).toBe(true)
    expect(has(2, 3, 'sm:border-r-0')).toBe(true)
    for (const index of [0, 1, 2])
      expect(has(index, 3, 'sm:border-b-0')).toBe(true)
  })

  it('4 items: 2x2 on tablet and a single row on desktop', () => {
    expect(has(0, 4, 'sm:border-r')).toBe(true)
    expect(has(1, 4, 'sm:border-r-0')).toBe(true)
    expect(has(0, 4, 'sm:border-b')).toBe(true)
    expect(has(1, 4, 'sm:border-b')).toBe(true)
    expect(has(2, 4, 'sm:border-b-0')).toBe(true)
    expect(has(3, 4, 'sm:border-b-0')).toBe(true)

    for (const index of [0, 1, 2])
      expect(has(index, 4, 'lg:border-r')).toBe(true)
    expect(has(3, 4, 'lg:border-r-0')).toBe(true)
    for (const index of [0, 1, 2, 3])
      expect(has(index, 4, 'lg:border-b-0')).toBe(true)
  })

  it('5 items: divider between every row on tablet and between the two desktop rows', () => {
    for (const index of [0, 1, 2, 3])
      expect(has(index, 5, 'sm:border-b')).toBe(true)
    expect(has(4, 5, 'sm:border-b-0')).toBe(true)
    expect(has(4, 5, 'sm:border-r-0')).toBe(true)
    expect(has(4, 5, 'lg:border-r-0')).toBe(true)

    for (const index of [0, 1, 2, 3])
      expect(has(index, 5, 'lg:border-b')).toBe(true)
    expect(has(4, 5, 'lg:border-b-0')).toBe(true)
    expect(has(3, 5, 'lg:border-r-0')).toBe(true)
  })

  it('single item has no dividers at any breakpoint', () => {
    expect(getStatCellBorders(0, 1)).toEqual([
      'border-b-0',
      'sm:border-r-0',
      'sm:border-b-0',
      'lg:border-r-0',
      'lg:border-b-0',
    ])
  })
})
