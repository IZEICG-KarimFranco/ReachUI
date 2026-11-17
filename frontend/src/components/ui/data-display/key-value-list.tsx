import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/layout/card'
import { EmptyState } from '@/components/ui/feedback/empty'
import { cn } from '@/lib/utils'

export interface KeyValueItem {
  id?: string | number
  label: React.ReactNode
  value: React.ReactNode
  mono?: boolean
}

export type KeyValueListEmptyState = React.ComponentProps<typeof EmptyState>

export interface KeyValueListProps extends React.ComponentProps<'dl'> {
  items: KeyValueItem[]
  emptyState?: Partial<KeyValueListEmptyState>
}

export function KeyValueList({
  items,
  emptyState,
  className,
  ...props
}: KeyValueListProps) {
  const { t } = useTranslation()

  return (
    <Card className={cn('p-0 overflow-hidden w-full shadow-1', className)}>
      {items.length === 0 ? (
        <EmptyState
          {...emptyState}
          title={emptyState?.title ?? t('common.no_results')}
        />
      ) : (
        <dl className="w-full divide-y divide-line" {...props}>
          {items.map((item, idx) => (
            <div
              key={item.id ?? idx}
              className="flex items-center justify-between px-4 py-3 text-xs text-ink transition-colors duration-150 motion-reduce:transition-none hover:bg-selection/30"
            >
              <dt className="max-w-[45%] shrink-0 truncate pr-3 font-medium text-muted">
                {item.label}
              </dt>
              <dd
                data-mono={item.mono ? 'true' : undefined}
                className={cn(
                  'min-w-0 truncate text-right font-semibold',
                  item.mono && 'font-mono text-[11px] text-ink-secondary'
                )}
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Card>
  )
}
