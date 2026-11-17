import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const labelVariants = cva(
  'flex gap-2 select-none group-data-[disabled=true]/field:pointer-events-none group-data-[disabled=true]/field:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  {
    variants: {
      variant: {
        form: 'items-baseline text-xs font-semibold text-ink-secondary',
        // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
        legacy: 'items-center text-sm leading-none font-medium',
      },
    },
    defaultVariants: {
      variant: 'legacy',
    },
  }
)

type LabelRootProps = React.ComponentProps<typeof LabelPrimitive.Root>

export type FormLabelProps = LabelRootProps & {
  variant: 'form'
  step?: string | number
  required?: boolean
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
type LegacyLabelProps = LabelRootProps & {
  variant?: 'legacy'
  step?: never
  required?: never
}

export type LabelProps = FormLabelProps | LegacyLabelProps

function Label({
  className,
  variant = 'legacy',
  step,
  required,
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-variant={variant}
      className={cn(labelVariants({ variant }), className)}
      {...props}
    >
      {step !== undefined && step !== '' && (
        <span
          aria-hidden="true"
          data-slot="label-step"
          className="font-mono text-label text-signal-contrast"
        >
          {String(step).padStart(2, '0')}
        </span>
      )}
      {children}
      {required && (
        <span aria-hidden="true" className="text-error">
          *
        </span>
      )}
    </LabelPrimitive.Root>
  )
}

export { Label }
