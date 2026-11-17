import { useMemo } from 'react'
import type {
  ChartSegment,
  ChartValueFormatter,
  DonutReadout,
  DonutSlice,
} from '@/types/charts'
import {
  buildDonutArcs,
  buildLegend,
  DONUT_GEOMETRY,
} from '@/components/ui/lib/charts'
import { useChartShares } from '@/components/ui/hooks/use-chart-shares'
import { useDonutSelection } from '@/components/ui/hooks/use-donut-selection'

export function useDonutChart({
  segments,
  size,
  decorative,
  formatValue,
  emptyLabel,
  centerValue,
  centerLabel,
}: {
  segments: ChartSegment[]
  size: 'default' | 'compact'
  decorative: boolean
  formatValue?: ChartValueFormatter
  emptyLabel: string
  centerValue?: string
  centerLabel?: string
}) {
  const {
    shares,
    isEmpty,
    formatValue: format,
    formatPercent,
  } = useChartShares(segments, { formatValue })
  const selection = useDonutSelection()
  const geometry = DONUT_GEOMETRY[size]

  const arcs = useMemo(
    () => buildDonutArcs(shares, geometry),
    [shares, geometry]
  )

  const slices: DonutSlice[] = arcs.map((arc) => {
    const share = shares.find((s) => s.key === arc.key)
    const pinned = selection.selected === arc.key
    return {
      ...arc,
      label: share
        ? `${share.label}: ${format(share.value)} (${formatPercent(share.share)})`
        : '',
      pinned,
      dimmed: selection.active !== null && selection.active !== arc.key,
      transform: pinned
        ? `translate(${arc.dx}px, ${arc.dy}px) scale(1.06)`
        : undefined,
    }
  })

  const legend = useMemo(
    () =>
      buildLegend(
        shares,
        emptyLabel,
        (s) => `${format(s.value)} · ${formatPercent(s.share)}`
      ),
    [shares, emptyLabel, format, formatPercent]
  )

  const activeShare = shares.find((s) => s.key === selection.active)
  const readout: DonutReadout | null = activeShare
    ? {
        value: format(activeShare.value),
        caption: `${activeShare.label} · ${formatPercent(activeShare.share)}`,
      }
    : isEmpty
      ? { value: '—', caption: emptyLabel }
      : centerValue
        ? { value: centerValue, caption: centerLabel }
        : null

  return {
    slices,
    isEmpty,
    legend,
    readout,
    selection,
    interactive: size === 'default' && !decorative && !isEmpty,
    ringLabel:
      size === 'compact' && !decorative
        ? isEmpty
          ? emptyLabel
          : readout?.value
        : undefined,
    ring: {
      radius: (geometry.outer + geometry.inner) / 2,
      width: geometry.outer - geometry.inner,
    },
  }
}
