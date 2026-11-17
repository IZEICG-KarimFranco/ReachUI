import { describe, it, expect } from 'vitest'
import {
  buildDonutArcs,
  buildLegend,
  createPercentFormatter,
  DONUT_GEOMETRY,
  toShares,
} from '@/components/ui/lib/charts'
import type { ChartSegment } from '@/types/charts'

const segments: ChartSegment[] = [
  { key: 'a', label: 'A', value: 30, tone: 'success' },
  { key: 'b', label: 'B', value: 10, tone: 'error' },
  { key: 'c', label: 'C', value: 0, tone: 'neutral' },
]

describe('chart-utils', () => {
  it('toShares calcula proporciones sobre el total', () => {
    const { shares, total } = toShares(segments)
    expect(total).toBe(40)
    expect(shares.map((s) => s.share)).toEqual([0.75, 0.25, 0])
  })

  it('toShares usa la base cuando cubre más que los segmentos', () => {
    const { shares, base } = toShares(segments, 100)
    expect(base).toBe(100)
    expect(shares[0].share).toBe(0.3)
  })

  it('toShares respeta la base aunque las filas se solapen', () => {
    const { shares, base } = toShares(segments, 20)
    expect(base).toBe(20)
    expect(shares.map((s) => s.share)).toEqual([1, 0.5, 0])
  })

  it('toShares ignora valores negativos o no finitos', () => {
    const { total } = toShares([
      { key: 'x', label: 'X', value: -5, tone: 'info' },
      { key: 'y', label: 'Y', value: Number.NaN, tone: 'info' },
    ])
    expect(total).toBe(0)
  })

  it('el formateador de porcentaje conserva un decimal en partes pequeñas', () => {
    const format = createPercentFormatter('en')
    expect(format(0.004)).toBe('0.4%')
    expect(format(0.5)).toBe('50%')
    expect(format(0)).toBe('0%')
  })

  it('buildLegend devuelve una fila neutral cuando no hay datos', () => {
    const { shares } = toShares([
      { key: 'z', label: 'Z', value: 0, tone: 'info' },
    ])
    expect(buildLegend(shares, 'Sin datos', () => '')).toEqual([
      { key: 'empty', label: 'Sin datos', tone: 'neutral' },
    ])
  })

  it('buildDonutArcs omite segmentos vacíos y separa los visibles', () => {
    const { shares } = toShares(segments)
    const arcs = buildDonutArcs(shares, DONUT_GEOMETRY.default)
    expect(arcs.map((a) => a.key)).toEqual(['a', 'b'])
    expect(arcs.every((a) => !a.full && a.d.startsWith('M'))).toBe(true)
  })

  it('buildDonutArcs dibuja un anillo completo cuando hay un solo segmento', () => {
    const { shares } = toShares([
      { key: 'only', label: 'O', value: 5, tone: 'info' },
    ])
    const [arc] = buildDonutArcs(shares, DONUT_GEOMETRY.default)
    expect(arc.full).toBe(true)
  })
})
