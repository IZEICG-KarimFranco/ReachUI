import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-[3px] text-[length:var(--text-label)] font-bold tracking-[0.02em] w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        outline: 'border-line-strong text-muted',
        default: 'border-transparent text-signal-contrast',
        info: 'border-[color-mix(in_srgb,var(--info)_45%,var(--line))] bg-[color-mix(in_srgb,var(--info)_10%,var(--card))] text-info',
        signal:
          'border-[color-mix(in_srgb,var(--signal)_45%,var(--line))] bg-selection text-signal-contrast',
        success:
          'border-[color-mix(in_srgb,var(--success)_45%,var(--line))] text-success',
        warning:
          'border-[color-mix(in_srgb,var(--live)_45%,var(--line))] text-live',
        error:
          'border-[color-mix(in_srgb,var(--error)_45%,var(--line))] text-error',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        secondary:
          'border-line-strong bg-paper-secondary text-ink [a&]:hover:bg-selection',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        destructive:
          'border-error/30 bg-error/20 text-error [a&]:hover:bg-error/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
