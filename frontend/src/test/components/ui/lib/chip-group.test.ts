import { describe, it, expect } from 'vitest'
import { toggleValue } from '@/components/ui/lib/chip-group'

describe('toggleValue', () => {
  it('adds a missing value at the end and removes a present one', () => {
    expect(toggleValue(['a'], 'b')).toEqual(['a', 'b'])
    expect(toggleValue(['a', 'b'], 'a')).toEqual(['b'])
  })

  it('does not mutate the input', () => {
    const values = ['a']
    toggleValue(values, 'b')
    expect(values).toEqual(['a'])
  })
})
