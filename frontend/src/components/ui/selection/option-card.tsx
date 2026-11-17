import * as React from 'react'
import { cn } from '@/lib/utils'

export interface OptionCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  description?: string
  selected?: boolean
  disabled?: boolean
  badge?: React.ReactNode
}

export const OptionCard = React.forwardRef<HTMLButtonElement, OptionCardProps>(
  (
    {
      className,
      title,
      description,
      selected = false,
      disabled = false,
      badge,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-pressed={selected}
        className={cn(
          'relative flex flex-col justify-between rounded-control border p-4 text-left transition-colors duration-150 select-none min-h-24 w-full outline-none',
          selected
            ? 'border-signal bg-selection shadow-1'
            : 'border-control bg-card hover:border-line-strong hover:bg-card/90',
          disabled &&
            'cursor-not-allowed opacity-40 hover:border-control hover:bg-card',
          'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-signal-contrast',
          className
        )}
        {...props}
      >
        <div className="flex w-full items-start justify-between gap-2">
          <span className="font-bold text-sm text-ink truncate leading-snug">
            {title}
          </span>
          {selected && (
            <span className="size-2 rounded-full bg-signal shrink-0 mt-1.5" />
          )}
          {!selected && badge && <span className="shrink-0">{badge}</span>}
        </div>
        {description && (
          <p className="text-xs text-muted leading-relaxed mt-2 line-clamp-2">
            {description}
          </p>
        )}
      </button>
    )
  }
)
OptionCard.displayName = 'OptionCard'
