import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChartSegment, ChartTone } from '@/types/charts'
import { createPercentFormatter } from '@/components/ui/lib/charts'

export function usePercentRing(
  percentage: number,
  { label, tone }: { label: string; tone: ChartTone }
) {
  const { t, i18n } = useTranslation()
  const locale = i18n?.language

  return useMemo(() => {
    const value = Math.min(Math.max(percentage, 0), 100)
    const segments: ChartSegment[] = [
      { key: 'value', label, value, tone },
      {
        key: 'remaining',
        label: t('charts.remaining'),
        value: 100 - value,
        tone: 'neutral',
      },
    ]
    return {
      segments,
      centerValue: createPercentFormatter(locale)(value / 100),
    }
  }, [percentage, label, tone, t, locale])
}
