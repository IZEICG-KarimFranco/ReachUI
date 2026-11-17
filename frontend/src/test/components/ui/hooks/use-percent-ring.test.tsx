import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePercentRing } from '@/components/ui/hooks/use-percent-ring'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}))

describe('usePercentRing', () => {
  it('separa el valor del resto y formatea el centro', () => {
    const { result } = renderHook(() =>
      usePercentRing(72, { label: 'Read', tone: 'signal' })
    )
    expect(result.current.segments).toEqual([
      { key: 'value', label: 'Read', value: 72, tone: 'signal' },
      {
        key: 'remaining',
        label: 'charts.remaining',
        value: 28,
        tone: 'neutral',
      },
    ])
    expect(result.current.centerValue).toBe('72%')
  })

  it('limita el porcentaje entre 0 y 100', () => {
    const over = renderHook(() =>
      usePercentRing(130, { label: 'X', tone: 'info' })
    )
    expect(over.result.current.segments.map((s) => s.value)).toEqual([100, 0])

    const under = renderHook(() =>
      usePercentRing(-5, { label: 'X', tone: 'info' })
    )
    expect(under.result.current.segments.map((s) => s.value)).toEqual([0, 100])
  })
})
