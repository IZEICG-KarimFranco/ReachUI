import { useId } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTranslation } from 'react-i18next'

import { ChartError, ChartLoading } from '@/components/ui/charts/chart-feedback'
import { ChartLegend } from '@/components/ui/charts/chart-legend'
import { useChartShares } from '@/components/ui/hooks/use-chart-shares'
import { buildLegend, chartFillVariants } from '@/components/ui/lib/charts'
import { cn } from '@/lib/utils'
import type {
  ChartSegment,
  ChartStatus,
  ChartValueFormatter,
} from '@/types/charts'

const meterTrackVariants = cva(
  'flex w-full overflow-hidden rounded-pill border border-line bg-inset',
  {
    variants: {
      size: {
        default: 'h-3.5',
        compact: 'h-2.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

type MeterProps = VariantProps<typeof meterTrackVariants> & {
  label: string
  labelHidden?: boolean
  segments: ChartSegment[]
  base?: number
  status?: ChartStatus
  showLegend?: boolean
  decorative?: boolean
  emptyLabel?: string
  errorLabel?: string
  formatValue?: ChartValueFormatter
  className?: string
}

function Meter({
  label,
  labelHidden = false,
  segments,
  base,
  status = 'ready',
  size,
  showLegend = true,
  decorative = false,
  emptyLabel,
  errorLabel,
  formatValue,
  className,
}: MeterProps) {
  const { t } = useTranslation()
  const captionId = useId()
  const { shares, visible, isEmpty, formatPercent } = useChartShares(segments, {
    base,
    formatValue,
  })
  const legend = buildLegend(
    shares,
    emptyLabel ?? t('contacts.panel.no_data'),
    (s) => formatPercent(s.share)
  )

  return (
    <figure
      data-slot="meter"
      data-size={size ?? 'default'}
      aria-hidden={decorative || undefined}
      aria-labelledby={decorative ? undefined : captionId}
      className={cn('flex w-full flex-col gap-3', className)}
    >
      {!decorative && (
        <figcaption
          id={captionId}
          className={cn(labelHidden ? 'sr-only' : 'text-sm font-bold text-ink')}
        >
          {label}
        </figcaption>
      )}
      {status === 'loading' ? (
        <ChartLoading shape="meter" />
      ) : status === 'error' ? (
        <ChartError label={errorLabel} />
      ) : (
        <>
          <div aria-hidden="true" className={meterTrackVariants({ size })}>
            {isEmpty ? (
              <span className="h-full w-full bg-line-strong" />
            ) : (
              visible.map((s) => (
                <span
                  key={s.key}
                  className={cn(
                    'h-full motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out',
                    chartFillVariants({ tone: s.tone })
                  )}
                  style={{ width: `${s.share * 100}%` }}
                />
              ))
            )}
          </div>
          {!decorative && <ChartLegend items={legend} hidden={!showLegend} />}
        </>
      )}
    </figure>
  )
}

export { Meter }
