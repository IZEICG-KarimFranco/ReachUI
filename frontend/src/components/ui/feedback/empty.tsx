import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'

import { Card, CardFooter, CardHeader } from '@/components/ui/layout/card'
import { cn } from '@/lib/utils'

type EmptyStateProps = Omit<
  React.ComponentProps<'div'>,
  'title' | 'children'
> & {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  bordered?: boolean
}

function EmptyState({
  className,
  title,
  description,
  icon: Icon,
  action,
  bordered = false,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      data-bordered={bordered}
      className={cn(
        'grid min-h-30 min-w-0 place-items-center p-4 text-center text-xs leading-normal text-muted',
        bordered && 'rounded-control border border-dashed border-line-strong',
        className
      )}
      {...props}
    >
      <div className="flex max-w-sm min-w-0 flex-col items-center">
        {Icon && (
          <div
            data-slot="empty-state-icon"
            className="mb-3 flex size-10 shrink-0 items-center justify-center rounded-control bg-inset"
          >
            <Icon aria-hidden="true" className="size-6" />
          </div>
        )}
        <p data-slot="empty-state-title" className="font-bold">
          {title}
        </p>
        {description && (
          <p data-slot="empty-state-description">{description}</p>
        )}
        {action && (
          <div data-slot="empty-state-action" className="mt-3">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

type EmptyPanelProps = Omit<React.ComponentProps<typeof Card>, 'title'> & {
  title: string
  meta?: string
  footer?: string
}

/** Plate con cabecera (título y meta) y pie opcionales para alojar un `EmptyState`. */
function EmptyPanel({
  title,
  meta,
  footer,
  children,
  ...props
}: EmptyPanelProps) {
  return (
    <Card divided data-slot="empty-panel" {...props}>
      <CardHeader className="text-xs">
        <b className="font-semibold text-ink">{title}</b>
        {meta && <span className="text-muted">{meta}</span>}
      </CardHeader>
      {children}
      {footer && (
        <CardFooter className="justify-end text-xs text-muted">
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06); se sustituye por `EmptyState`
function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-surface border-dashed p-6 text-center text-balance md:p-12',
        className
      )}
      {...props}
    />
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        'flex max-w-sm flex-col items-center gap-2 text-center',
        className
      )}
      {...props}
    />
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
const emptyMediaVariants = cva(
  'flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "bg-inset text-ink flex size-10 shrink-0 items-center justify-center rounded-control [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-title"
      className={cn('text-lg font-medium tracking-tight', className)}
      {...props}
    />
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        'text-muted [&>a:hover]:text-signal-contrast text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4',
        className
      )}
      {...props}
    />
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        'flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance',
        className
      )}
      {...props}
    />
  )
}

export {
  EmptyState,
  EmptyPanel,
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
