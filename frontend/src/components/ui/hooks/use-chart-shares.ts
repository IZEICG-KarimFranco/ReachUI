import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChartSegment, ChartValueFormatter } from '@/types/charts'
import {
  createNumberFormatter,
  createPercentFormatter,
  toShares,
} from '@/components/ui/lib/charts'

export function useChartShares(
  segments: ChartSegment[],
  options: { base?: number; formatValue?: ChartValueFormatter } = {}
) {
  const { i18n } = useTranslation()
  const locale = i18n?.language
  const { base, formatValue } = options

  return useMemo(() => {
    const result = toShares(segments, base)
    return {
      ...result,
      visible: result.shares.filter((s) => s.share > 0),
      isEmpty: result.total === 0,
      formatValue: formatValue ?? createNumberFormatter(locale),
      formatPercent: createPercentFormatter(locale),
    }
  }, [segments, base, formatValue, locale])
}
