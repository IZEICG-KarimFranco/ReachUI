import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/ui/feedback/empty'
import { Skeleton } from '@/components/ui/feedback/skeleton'
import { Surface } from '@/components/ui/layout/surface'
import { getStatCellBorders } from '@/components/ui/lib/stat-strip'
import {
  StatusLabel,
  type StatusTone,
} from '@/components/ui/feedback/status-label'
import { cn } from '@/lib/utils'

export interface StatItem {
  id?: string | number
  label: string
  value: React.ReactNode
  unit?: string
  delta?: React.ReactNode
  deltaTone?: 'up' | 'warn' | 'neutral'
  deltaLabel?: string
  statusTone?: StatusTone
}

export type StatStripEmptyState = React.ComponentProps<typeof EmptyState>

export interface StatStripProps extends React.ComponentProps<'div'> {
  items: StatItem[]
  ariaLabel?: string
  loading?: boolean
  loadingItems?: number
  emptyState?: Partial<StatStripEmptyState>
}

function getGridColsClass(count: number) {
  if (count === 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-1 sm:grid-cols-2'
  if (count === 3) return 'grid-cols-1 sm:grid-cols-3'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
}

export function StatStrip({
  items,
  ariaLabel,
  loading = false,
  loadingItems = 4,
  emptyState,
  className,
  ...props
}: StatStripProps) {
  const { t } = useTranslation()
  const resolvedAriaLabel = ariaLabel ?? t('common.stats_metrics')

  const count = loading ? loadingItems : items.length

  return (
    <Surface
      role="region"
      variant="plate"
      aria-label={resolvedAriaLabel}
      aria-busy={loading ? true : undefined}
      className={cn('w-full p-0 overflow-hidden', className)}
      {...props}
    >
      {loading ? (
        <div className={cn('grid w-full', getGridColsClass(count))}>
          {Array.from({ length: count }, (_, idx) => (
            <div
              key={idx}
              className={cn(
                'flex min-w-0 flex-col gap-2 border-line p-4',
                getStatCellBorders(idx, count)
              )}
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-3 w-28" />
              {idx === 0 && (
                <span role="status" className="sr-only">
                  {t('common.loading')}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : count === 0 ? (
        <EmptyState
          {...emptyState}
          title={emptyState?.title ?? t('common.no_results')}
        />
      ) : (
        <div className={cn('grid w-full', getGridColsClass(count))}>
          {items.map((item, idx) => {
            const toneClass =
              item.deltaTone === 'up'
                ? 'text-success font-bold'
                : item.deltaTone === 'warn'
                  ? 'text-live font-bold'
                  : 'text-muted font-medium'

            return (
              <div
                key={item.id ?? idx}
                className={cn(
                  'flex flex-col min-w-0 p-4 transition-colors motion-reduce:transition-none border-line',
                  getStatCellBorders(idx, count)
                )}
              >
                <div className="flex items-center min-w-0">
                  {item.statusTone ? (
                    <StatusLabel
                      tone={item.statusTone}
                      dotPosition="left"
                      className="text-xs font-semibold text-muted tracking-wide truncate"
                    >
                      {item.label}
                    </StatusLabel>
                  ) : (
                    <span className="text-xs font-semibold text-muted tracking-wide truncate">
                      {item.label}
                    </span>
                  )}
                </div>

                <div className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-ink tabular-nums truncate">
                  {item.value}
                  {item.unit && (
                    <span className="ml-1 text-xs font-medium tracking-normal text-muted">
                      {item.unit}
                    </span>
                  )}
                </div>

                {(item.delta || item.deltaLabel) && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted leading-tight truncate">
                    {item.delta && (
                      <span className={toneClass}>{item.delta}</span>
                    )}
                    {item.deltaLabel && (
                      <span className="truncate">{item.deltaLabel}</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Surface>
  )
}
