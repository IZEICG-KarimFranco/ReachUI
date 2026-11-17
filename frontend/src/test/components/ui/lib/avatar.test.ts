import { describe, it, expect } from 'vitest'

import { getInitials } from '@/components/ui/lib/avatar'

describe('getInitials', () => {
  it('uses the first letter of a one-word name', () => {
    expect(getInitials('Ana')).toBe('A')
  })

  it('uses the first letter of each word of a two-word name', () => {
    expect(getInitials('Ana Martínez')).toBe('AM')
  })

  it('keeps only the first two words of a longer name', () => {
    expect(getInitials('Luis Fernando Torres')).toBe('LF')
  })

  it('uppercases the letters', () => {
    expect(getInitials('ana martínez')).toBe('AM')
  })

  it('ignores leading, trailing and repeated whitespace', () => {
    expect(getInitials('  Ana    Martínez  ')).toBe('AM')
  })

  it('keeps accented and non-latin letters whole', () => {
    expect(getInitials('Álvaro Ñúñez')).toBe('ÁÑ')
    expect(getInitials('😀 Ana')).toBe('😀A')
  })

  it('returns a question mark for an empty or blank name', () => {
    expect(getInitials('')).toBe('?')
    expect(getInitials('   ')).toBe('?')
  })
})
