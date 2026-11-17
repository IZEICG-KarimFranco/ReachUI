import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Surface } from '@/components/ui/layout/surface'
import { EmptyState } from '@/components/ui/feedback/empty'
import { Skeleton } from '@/components/ui/feedback/skeleton'
import {
  StatusLabel,
  type StatusTone,
} from '@/components/ui/feedback/status-label'
import { useKeyAction } from '@/components/ui/hooks/use-key-action'
import { cn } from '@/lib/utils'

export type RecordStatusTone = StatusTone | 'ok' | 'idle'

export interface RecordRowProps extends Omit<
  React.ComponentProps<'div'>,
  'title'
> {
  leading?: React.ReactNode
  title: React.ReactNode
  status?: React.ReactNode
  statusTone?: RecordStatusTone
  meta?: React.ReactNode
  selected?: boolean
  disabled?: boolean
  loading?: boolean
  error?: React.ReactNode
  onClick?: () => void
}

export const RecordRow = React.forwardRef<HTMLDivElement, RecordRowProps>(
  (
    {
      leading,
      title,
      status,
      statusTone = 'neutral',
      meta,
      selected = false,
      disabled = false,
      loading = false,
      error,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation()
    const isInteractive = Boolean(onClick) && !disabled && !loading
    const resolvedTone: StatusTone =
      statusTone === 'ok'
        ? 'success'
        : statusTone === 'idle'
          ? 'neutral'
          : (statusTone as StatusTone)
    const onKeyDown = useKeyAction<HTMLDivElement>(
      isInteractive ? onClick : undefined
    )

    return (
      <div
        ref={ref}
        onClick={isInteractive ? onClick : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-current={selected ? 'true' : undefined}
        aria-disabled={disabled ? true : undefined}
        aria-busy={loading ? true : undefined}
        data-state={loading ? 'loading' : error ? 'error' : undefined}
        onKeyDown={onKeyDown}
        className={cn(
          'flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 transition-colors duration-150 motion-reduce:transition-none',
          selected
            ? 'bg-selection'
            : isInteractive
              ? 'hover:bg-selection/60 bg-card'
              : 'bg-card',
          isInteractive && 'cursor-pointer select-none focus-row',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Skeleton className="h-3 w-40 max-w-full" />
            <Skeleton className="h-3 w-16" />
            <span className="sr-only">{t('common.loading')}</span>
          </>
        ) : (
          <>
            <div className="flex min-w-0 flex-1 items-center gap-3 pr-2">
              {leading && (
                <div className="flex shrink-0 items-center">{leading}</div>
              )}
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-xs text-ink truncate block leading-snug">
                  {title}
                </span>
                {error && (
                  <span className="mt-0.5 block truncate text-xs text-error">
                    {error}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
              {status && (
                <StatusLabel
                  tone={resolvedTone}
                  className="text-xs font-semibold whitespace-nowrap select-none"
                >
                  {status}
                </StatusLabel>
              )}

              {meta && (
                <div className="text-xs text-muted whitespace-nowrap text-right">
                  {meta}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )
  }
)
RecordRow.displayName = 'RecordRow'

export type RecordListEmptyState = React.ComponentProps<typeof EmptyState>

export interface RecordListProps extends Omit<
  React.ComponentProps<'div'>,
  'title'
> {
  title?: React.ReactNode
  action?: React.ReactNode
  footerCount?: React.ReactNode
  footerAction?: React.ReactNode
  emptyState?: Partial<RecordListEmptyState>
  loading?: boolean
  loadingRows?: number
  error?: RecordListEmptyState
  children?: React.ReactNode
}

export function RecordList({
  title,
  action,
  footerCount,
  footerAction,
  emptyState,
  loading = false,
  loadingRows = 3,
  error,
  children,
  className,
  ...props
}: RecordListProps) {
  const { t } = useTranslation()
  const validChildren = React.Children.toArray(children).filter(Boolean)
  const hasContent = validChildren.length > 0

  return (
    <Surface
      variant="plate"
      className={cn('w-full overflow-hidden p-0', className)}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-line px-4 py-3 bg-card">
          {title && <span className="font-bold text-xs text-ink">{title}</span>}
          {action && (
            <div className="text-xs font-medium text-signal-contrast [&_a]:focus-ring-inline [&_button]:focus-ring-inline">
              {action}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <ul role="list" aria-busy="true" className="divide-y divide-line">
          {Array.from({ length: loadingRows }, (_, index) => (
            <li key={index}>
              <RecordRow title="" loading />
            </li>
          ))}
        </ul>
      ) : error ? (
        <EmptyState
          role="alert"
          {...error}
          className={cn('text-error', error.className)}
        />
      ) : hasContent ? (
        <ul role="list" className="divide-y divide-line">
          {validChildren.map((child, index) => (
            <li
              key={
                React.isValidElement(child) && child.key !== null
                  ? child.key
                  : index
              }
            >
              {child}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          {...emptyState}
          title={emptyState?.title ?? t('common.no_results')}
        />
      )}

      {(footerCount || footerAction) && (
        <div className="flex items-center justify-end gap-3.5 border-t border-line px-4 py-2.5 bg-card/60 text-xs font-medium">
          {footerCount && (
            <span className="text-muted tabular-nums">{footerCount}</span>
          )}
          {footerAction && (
            <div className="text-signal-contrast hover:underline [&_a]:focus-ring-inline [&_button]:focus-ring-inline">
              {footerAction}
            </div>
          )}
        </div>
      )}
    </Surface>
  )
}
