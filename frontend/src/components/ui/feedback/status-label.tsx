import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { StatusDot } from '@/components/ui/feedback/status-dot'

const statusLabelVariants = cva('inline-flex items-center whitespace-nowrap', {
  variants: {
    tone: {
      live: 'text-live',
      success: 'text-success',
      error: 'text-error',
      info: 'text-info',
      signal: 'text-signal-contrast',
      neutral: 'text-ink-secondary',
    },
    size: {
      default: 'gap-1.5 text-xs font-semibold',
      inline: 'gap-[5px] text-[11px] font-bold',
    },
  },
  defaultVariants: {
    tone: 'neutral',
    size: 'default',
  },
})

export type StatusTone = NonNullable<
  VariantProps<typeof statusLabelVariants>['tone']
>

type StatusLabelProps = React.ComponentProps<'span'> &
  VariantProps<typeof statusLabelVariants> & {
    dotPosition?: 'left' | 'right'
    pulse?: boolean
  }

function StatusLabel({
  className,
  tone,
  size,
  dotPosition = 'right',
  pulse = false,
  children,
  ...props
}: StatusLabelProps) {
  const dot = (
    <StatusDot
      size="sm"
      tone="current"
      data-pulse={pulse}
      className={
        pulse ? 'animate-status-blink motion-reduce:animate-none' : undefined
      }
    />
  )

  return (
    <span
      data-slot="status-label"
      data-tone={tone ?? 'neutral'}
      data-size={size ?? 'default'}
      className={cn(statusLabelVariants({ tone, size }), className)}
      {...props}
    >
      {dotPosition === 'left' && dot}
      {children}
      {dotPosition === 'right' && dot}
    </span>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { StatusLabel, statusLabelVariants }
