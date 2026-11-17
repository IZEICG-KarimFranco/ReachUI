import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Spinner } from '@/components/ui/feedback/spinner'
import { cn } from '@/lib/utils'

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-sm font-semibold outline-none select-none cursor-pointer shrink-0 transition-all duration-150 ease-out will-change-transform disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 focus-ring hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.985]',
  {
    variants: {
      variant: {
        primary:
          'bg-signal text-on-signal hover:bg-signal-deep active:bg-signal-deep shadow-1',
        secondary:
          'bg-card text-ink border border-control shadow-1 hover:border-line-strong hover:bg-control/60 dark:hover:bg-control/40 hover:text-ink active:bg-control/80',
        quiet:
          'bg-transparent text-ink hover:bg-control/50 hover:text-ink active:bg-control/70 hover:translate-y-0 shadow-none',
        danger:
          '[--focus-tone:var(--error)] bg-card text-error border border-error/50 shadow-1 hover:border-error hover:bg-error/15 dark:hover:bg-error/20 active:bg-error/25',
        success:
          '[--focus-tone:var(--success)] bg-card text-success border border-success/50 shadow-1 hover:border-success hover:bg-success/15 dark:hover:bg-success/20 active:bg-success/25',
        warning:
          '[--focus-tone:var(--live)] bg-card text-live border border-live/50 shadow-1 hover:border-live hover:bg-live/15 dark:hover:bg-live/20 active:bg-live/25',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        default:
          'bg-signal text-on-signal hover:bg-signal-deep active:bg-signal-deep shadow-1',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        outline:
          'bg-card text-ink border border-control shadow-1 hover:border-line-strong hover:bg-control/60 dark:hover:bg-control/40 active:bg-control/80',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        ghost:
          'bg-transparent text-ink hover:bg-control/50 active:bg-control/70 hover:translate-y-0 shadow-none',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        destructive:
          '[--focus-tone:var(--error)] bg-card text-error border border-error/50 shadow-1 hover:border-error hover:bg-error/15 dark:hover:bg-error/20 active:bg-error/25',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        link: 'text-signal-contrast underline-offset-4 hover:underline p-0 h-auto bg-transparent hover:translate-y-0 active:scale-100 shadow-none border-none',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        info: 'bg-info text-on-signal hover:bg-info/90 shadow-1',
      },
      size: {
        default: 'h-[42px] px-4 py-2',
        compact: 'h-8 px-3 text-xs',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        sm: 'h-8 px-3 text-xs',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        lg: 'h-11 px-5 text-base',
        // Target mínimo de accesibilidad ≥ 44px
        icon: 'size-11 min-h-[44px] min-w-[44px] p-2.5 rounded-control',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        'icon-sm': 'size-11 min-h-[44px] min-w-[44px] p-2.5 rounded-control',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        'icon-lg': 'size-12 min-h-[48px] min-w-[48px] p-3 rounded-control',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    if (asChild) {
      return (
        <Slot
          ref={ref}
          data-slot="button"
          data-variant={variant}
          data-size={size}
          aria-disabled={isDisabled || undefined}
          aria-busy={loading || undefined}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading && (
          <Spinner
            className="size-3.5 text-current shrink-0"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export interface IconButtonProps extends ButtonProps {
  'aria-label': string
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = 'icon', variant = 'secondary', ...props }, ref) => {
    return <Button ref={ref} size={size} variant={variant} {...props} />
  }
)
IconButton.displayName = 'IconButton'
