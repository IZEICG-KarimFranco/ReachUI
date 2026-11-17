import { cva } from 'class-variance-authority'
import type {
  ChartSegment,
  ChartShare,
  DonutArc,
  LegendEntry,
} from '@/types/charts'

export const chartFillVariants = cva('', {
  variants: {
    tone: {
      neutral: 'bg-line-strong',
      live: 'bg-live',
      info: 'bg-info',
      success: 'bg-success',
      error: 'bg-error',
      signal: 'bg-signal-contrast',
    },
  },
})

export const chartSvgFillVariants = cva('', {
  variants: {
    tone: {
      neutral: 'fill-line-strong',
      live: 'fill-live',
      info: 'fill-info',
      success: 'fill-success',
      error: 'fill-error',
      signal: 'fill-signal-contrast',
    },
  },
})

export const chartSvgStrokeVariants = cva('', {
  variants: {
    tone: {
      neutral: 'stroke-line-strong',
      live: 'stroke-live',
      info: 'stroke-info',
      success: 'stroke-success',
      error: 'stroke-error',
      signal: 'stroke-signal-contrast',
    },
  },
})

const safeValue = (value: number) =>
  Number.isFinite(value) && value > 0 ? value : 0

export function toShares(
  segments: ChartSegment[],
  base?: number
): { shares: ChartShare[]; total: number; base: number } {
  const total = segments.reduce((acc, s) => acc + safeValue(s.value), 0)
  const denominator = base && base > 0 ? base : total
  const shares = segments.map((s) => ({
    ...s,
    value: safeValue(s.value),
    share: denominator > 0 ? Math.min(safeValue(s.value) / denominator, 1) : 0,
  }))
  return { shares, total, base: denominator }
}

export function buildLegend(
  shares: ChartShare[],
  emptyLabel: string,
  describe: (share: ChartShare) => string
): LegendEntry[] {
  const visible = shares.filter((s) => s.share > 0)
  if (visible.length === 0) {
    return [{ key: 'empty', label: emptyLabel, tone: 'neutral' }]
  }
  return visible.map((s) => ({
    key: s.key,
    label: s.label,
    tone: s.tone,
    detail: describe(s),
  }))
}

export function createNumberFormatter(locale?: string) {
  const format = new Intl.NumberFormat(locale)
  return (value: number) => format.format(value)
}

export function createPercentFormatter(locale?: string) {
  const whole = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0,
  })
  const precise = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 1,
  })
  return (share: number) =>
    share > 0 && share < 0.1 ? precise.format(share) : whole.format(share)
}

export const DONUT_GEOMETRY = {
  default: { outer: 64, inner: 32, gapDeg: 4 },
  compact: { outer: 64, inner: 50, gapDeg: 0 },
} as const
export const DONUT_VIEWBOX = 140
const CENTER = DONUT_VIEWBOX / 2
const EXPLODE = 6

const polar = (radius: number, deg: number): [number, number] => {
  const rad = (deg * Math.PI) / 180
  return [CENTER + radius * Math.sin(rad), CENTER - radius * Math.cos(rad)]
}

const fixed = (n: number) => n.toFixed(2)

function arcPath(start: number, end: number, outer: number, inner: number) {
  const [x1, y1] = polar(outer, start)
  const [x2, y2] = polar(outer, end)
  const [x3, y3] = polar(inner, end)
  const [x4, y4] = polar(inner, start)
  const large = end - start > 180 ? 1 : 0
  return [
    `M${fixed(x1)} ${fixed(y1)}`,
    `A${outer} ${outer} 0 ${large} 1 ${fixed(x2)} ${fixed(y2)}`,
    `L${fixed(x3)} ${fixed(y3)}`,
    `A${inner} ${inner} 0 ${large} 0 ${fixed(x4)} ${fixed(y4)}Z`,
  ].join('')
}

const MIN_SWEEP_DEG = 3

function sweeps(shares: ChartShare[]): number[] {
  const total = shares.reduce((acc, s) => acc + s.share, 0)
  const raw = shares.map((s) => (s.share / total) * 360)
  const small = raw.filter((deg) => deg < MIN_SWEEP_DEG).length
  const largeSum = raw
    .filter((deg) => deg >= MIN_SWEEP_DEG)
    .reduce((acc, deg) => acc + deg, 0)
  const scale = largeSum > 0 ? (360 - small * MIN_SWEEP_DEG) / largeSum : 1
  return raw.map((deg) => (deg < MIN_SWEEP_DEG ? MIN_SWEEP_DEG : deg * scale))
}

export function buildDonutArcs(
  shares: ChartShare[],
  geometry: { outer: number; inner: number; gapDeg: number }
): DonutArc[] {
  const visible = shares.filter((s) => s.share > 0)
  if (visible.length === 0) return []

  const sweep = sweeps(visible)
  let cursor = 0
  return visible.map((s, index) => {
    const deg = sweep[index]
    const gap = Math.min(geometry.gapDeg, deg / 2)
    const start = cursor + gap / 2
    const end = cursor + deg - gap / 2
    cursor += deg
    const mid = (((start + end) / 2) * Math.PI) / 180
    return {
      key: s.key,
      tone: s.tone,
      full: visible.length === 1,
      d: arcPath(start, end, geometry.outer, geometry.inner),
      dx: Number(fixed(Math.sin(mid) * EXPLODE)),
      dy: Number(fixed(-Math.cos(mid) * EXPLODE)),
    }
  })
}

export const DONUT_CENTER = CENTER
