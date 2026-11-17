import { describe, expect, it } from 'vitest'
import {
  getCountryLabels,
  getCountrySearchValue,
} from '@/components/ui/lib/phone-input'

describe('getCountryLabels', () => {
  it('returns Spanish names for es and its regional variants', () => {
    expect(getCountryLabels('es').ES).toBe('España')
    expect(getCountryLabels('es-MX').MX).toBe('México')
  })

  it('falls back to English for other or missing languages', () => {
    expect(getCountryLabels('en').MX).toBe('Mexico')
    expect(getCountryLabels('fr').MX).toBe('Mexico')
    expect(getCountryLabels(undefined).MX).toBe('Mexico')
  })
})

describe('getCountrySearchValue', () => {
  it('combines name, calling code and ISO code', () => {
    expect(getCountrySearchValue('MX', 'México')).toBe('México +52 MX')
  })
})
