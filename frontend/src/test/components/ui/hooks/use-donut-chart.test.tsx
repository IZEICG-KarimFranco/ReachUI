import { describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

import { useDonutChart } from '@/components/ui/hooks/use-donut-chart'
import type { ChartSegment } from '@/types/charts'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}))

const segments: ChartSegment[] = [
  { key: 'delivered', label: 'Delivered', value: 75, tone: 'success' },
  { key: 'failed', label: 'Failed', value: 25, tone: 'error' },
]

const empty = segments.map((s) => ({ ...s, value: 0 }))

const render = (overrides: Partial<Parameters<typeof useDonutChart>[0]> = {}) =>
  renderHook(() =>
    useDonutChart({
      segments,
      size: 'default',
      decorative: false,
      emptyLabel: 'No data',
      ...overrides,
    })
  )

describe('useDonutChart', () => {
  it('nombra cada segmento con su valor y porcentaje', () => {
    const { result } = render()
    expect(result.current.slices.map((s) => s.label)).toEqual([
      'Delivered: 75 (75%)',
      'Failed: 25 (25%)',
    ])
    expect(result.current.interactive).toBe(true)
  })

  it('no es interactivo si es compacto, decorativo o está vacío', () => {
    expect(render({ size: 'compact' }).result.current.interactive).toBe(false)
    expect(render({ decorative: true }).result.current.interactive).toBe(false)
    expect(render({ segments: empty }).result.current.interactive).toBe(false)
  })

  it('muestra el valor central por defecto y el del segmento activo', () => {
    const { result } = render({ centerValue: '100', centerLabel: 'Total' })
    expect(result.current.readout).toEqual({ value: '100', caption: 'Total' })

    act(() => result.current.selection.toggle('failed'))
    expect(result.current.readout).toEqual({
      value: '25',
      caption: 'Failed · 25%',
    })
    expect(result.current.slices.find((s) => s.key === 'failed')?.pinned).toBe(
      true
    )
    expect(
      result.current.slices.find((s) => s.key === 'delivered')?.dimmed
    ).toBe(true)
  })

  it('usa el texto de vacío cuando no hay datos', () => {
    const { result } = render({ segments: empty })
    expect(result.current.isEmpty).toBe(true)
    expect(result.current.readout).toEqual({ value: '—', caption: 'No data' })
  })

  it('expone el valor del anillo compacto como nombre accesible', () => {
    expect(
      render({ size: 'compact', centerValue: '75%' }).result.current.ringLabel
    ).toBe('75%')
    expect(
      render({ size: 'compact', segments: empty }).result.current.ringLabel
    ).toBe('No data')
    expect(render().result.current.ringLabel).toBeUndefined()
  })
})
