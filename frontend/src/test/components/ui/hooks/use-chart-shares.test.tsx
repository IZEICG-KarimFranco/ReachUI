import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import { useChartShares } from '@/components/ui/hooks/use-chart-shares'
import type { ChartSegment } from '@/types/charts'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}))

const segments: ChartSegment[] = [
  { key: 'a', label: 'A', value: 3000, tone: 'success' },
  { key: 'b', label: 'B', value: 1000, tone: 'error' },
  { key: 'c', label: 'C', value: 0, tone: 'neutral' },
]

describe('useChartShares', () => {
  it('calcula proporciones, segmentos visibles y total', () => {
    const { result } = renderHook(() => useChartShares(segments))

    expect(result.current.total).toBe(4000)
    expect(result.current.isEmpty).toBe(false)
    expect(result.current.shares.map((s) => s.share)).toEqual([0.75, 0.25, 0])
    expect(result.current.visible.map((s) => s.key)).toEqual(['a', 'b'])
  })

  it('respeta la base indicada', () => {
    const { result } = renderHook(() =>
      useChartShares(segments, { base: 8000 })
    )
    expect(result.current.shares[0].share).toBe(0.375)
  })

  it('marca vacío cuando no hay valores', () => {
    const { result } = renderHook(() =>
      useChartShares(segments.map((s) => ({ ...s, value: 0 })))
    )
    expect(result.current.isEmpty).toBe(true)
    expect(result.current.visible).toEqual([])
  })

  it('formatea según el idioma por defecto', () => {
    const { result } = renderHook(() => useChartShares(segments))
    expect(result.current.formatValue(3000)).toBe('3,000')
    expect(result.current.formatPercent(0.25)).toBe('25%')
  })

  it('usa el formateador de valores recibido', () => {
    const formatValue = (value: number) => `${value} msgs`
    const { result } = renderHook(() =>
      useChartShares(segments, { formatValue })
    )
    expect(result.current.formatValue(10)).toBe('10 msgs')
  })
})
