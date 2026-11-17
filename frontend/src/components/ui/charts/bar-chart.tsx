import { useId } from 'react'
import { useTranslation } from 'react-i18next'

import { ChartError, ChartLoading } from '@/components/ui/charts/chart-feedback'
import { EmptyState } from '@/components/ui/feedback/empty'
import { useChartShares } from '@/components/ui/hooks/use-chart-shares'
import { chartFillVariants } from '@/components/ui/lib/charts'
import { cn } from '@/lib/utils'
import type {
  ChartSegment,
  ChartStatus,
  ChartValueFormatter,
} from '@/types/charts'

type BarChartProps = {
  label: string
  labelHidden?: boolean
  rows: ChartSegment[]
  base?: number
  status?: ChartStatus
  showPercent?: boolean
  emptyLabel?: string
  errorLabel?: string
  formatValue?: ChartValueFormatter
  className?: string
}

function BarChart({
  label,
  labelHidden = false,
  rows,
  base,
  status = 'ready',
  showPercent = true,
  emptyLabel,
  errorLabel,
  formatValue,
  className,
}: BarChartProps) {
  const { t } = useTranslation()
  const captionId = useId()
  const {
    shares,
    isEmpty,
    formatValue: format,
    formatPercent,
  } = useChartShares(rows, { base, formatValue })

  return (
    <figure
      data-slot="bar-chart"
      aria-labelledby={captionId}
      className={cn('flex w-full flex-col gap-2', className)}
    >
      <figcaption
        id={captionId}
        className={cn(labelHidden ? 'sr-only' : 'text-sm font-bold text-ink')}
      >
        {label}
      </figcaption>
      {status === 'loading' ? (
        <ChartLoading shape="bars" />
      ) : status === 'error' ? (
        <ChartError label={errorLabel} />
      ) : isEmpty ? (
        <EmptyState title={emptyLabel ?? t('contacts.panel.no_data')} />
      ) : (
        <ul className="flex flex-col">
          {shares.map((row) => (
            <li
              key={row.key}
              data-slot="bar-chart-row"
              className="flex items-center gap-2.5 py-1.5"
            >
              <span className="flex min-w-28 items-center gap-2 text-xs font-semibold text-ink">
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-2 flex-none rounded-full',
                    chartFillVariants({ tone: row.tone })
                  )}
                />
                {row.label}
              </span>
              <span
                aria-hidden="true"
                className="h-2.5 flex-1 overflow-hidden rounded-pill border border-line bg-inset"
              >
                <span
                  className={cn(
                    'block h-full rounded-pill motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out',
                    chartFillVariants({ tone: row.tone })
                  )}
                  style={{ width: `${row.share * 100}%` }}
                />
              </span>
              <span className="min-w-16 flex-none text-right font-mono text-xs font-bold text-ink">
                {format(row.value)}
              </span>
              {showPercent && (
                <span className="w-12 flex-none text-right font-mono text-xs text-muted">
                  {formatPercent(row.share)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </figure>
  )
}

export { BarChart }
