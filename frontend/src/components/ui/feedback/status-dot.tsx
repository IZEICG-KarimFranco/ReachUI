import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const statusDotVariants = cva('inline-block shrink-0 rounded-full', {
  variants: {
    tone: {
      success: 'bg-success',
      live: 'bg-live',
      error: 'bg-error',
      info: 'bg-info',
      signal: 'bg-signal',
      neutral: 'bg-ink-secondary',
      current: 'bg-current',
    },
    size: {
      sm: 'size-1.5',
      md: 'size-2',
    },
  },
  defaultVariants: {
    tone: 'neutral',
    size: 'md',
  },
})

type StatusDotProps = React.ComponentProps<'span'> &
  VariantProps<typeof statusDotVariants>

function StatusDot({
  className,
  tone,
  size,
  children,
  ...props
}: StatusDotProps) {
  const dotProps = {
    'data-tone': tone ?? 'neutral',
    'data-size': size ?? 'md',
    className: statusDotVariants({ tone, size }),
  }

  if (React.Children.toArray(children).length === 0) {
    const isNamed = Boolean(props['aria-label'])

    return (
      <span
        data-slot="status-dot"
        role={isNamed ? 'img' : undefined}
        aria-hidden={isNamed ? undefined : true}
        {...dotProps}
        {...props}
        className={cn(dotProps.className, className)}
      />
    )
  }

  return (
    <span
      data-slot="status-dot"
      className={cn('inline-flex items-center gap-2', className)}
      {...props}
    >
      <span data-slot="status-dot-indicator" aria-hidden="true" {...dotProps} />
      {children}
    </span>
  )
}

export { StatusDot }
