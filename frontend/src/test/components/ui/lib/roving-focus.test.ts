import { describe, it, expect } from 'vitest'
import {
  findEnabledIndex,
  resolveTabStop,
} from '@/components/ui/lib/roving-focus'

const items = [{}, { disabled: true }, {}, { disabled: true }]

describe('findEnabledIndex', () => {
  it('skips disabled items in both directions and wraps around', () => {
    expect(findEnabledIndex(items, 1, 1)).toBe(2)
    expect(findEnabledIndex(items, 3, 1)).toBe(0)
    expect(findEnabledIndex(items, -1, -1)).toBe(2)
    expect(findEnabledIndex(items, 1, -1)).toBe(0)
  })

  it('returns -1 when every item is disabled', () => {
    expect(findEnabledIndex([{ disabled: true }], 0, 1)).toBe(-1)
  })
})

describe('resolveTabStop', () => {
  it('prefers the last focused enabled item, then the active one, then the first enabled', () => {
    expect(resolveTabStop(items, 2, 0)).toBe(2)
    expect(resolveTabStop(items, 1, 2)).toBe(2)
    expect(resolveTabStop(items, null, -1)).toBe(0)
    expect(resolveTabStop(items, 9, 3)).toBe(0)
    expect(resolveTabStop(items, null, 9)).toBe(0)
  })

  it('falls back to the active item when the focused one is gone (-1)', () => {
    expect(resolveTabStop(items, -1, 2)).toBe(2)
  })
})
