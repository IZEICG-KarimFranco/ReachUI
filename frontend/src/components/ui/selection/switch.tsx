import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useFieldContext } from '@/components/ui/inputs/field'

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-150 ease-out outline-none select-none disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-signal-contrast border-transparent',
  {
    variants: {
      variant: {
        default: [
          'h-5.25 w-9.25',
          'bg-control/60 hover:bg-control/80',
          'data-[state=checked]:bg-success',
        ],
        signal: [
          'h-5.25 w-9.25',
          'bg-control/60 hover:bg-control/80',
          'data-[state=checked]:bg-signal',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface SwitchProps
  extends
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {
  label?: string
}

export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
  (
    {
      className,
      variant = 'default',
      label,
      checked,
      defaultChecked,
      disabled: propDisabled,
      id: propId,
      ...props
    },
    ref
  ) => {
    const field = useFieldContext()
    const disabled = propDisabled ?? field?.disabled
    const id = propId || field?.id

    const switchElement = (
      <SwitchPrimitive.Root
        ref={ref}
        id={id}
        disabled={disabled}
        checked={checked}
        defaultChecked={defaultChecked}
        aria-invalid={field?.hasError || undefined}
        aria-describedby={
          field ? `${field.descriptionId} ${field.errorId}` : undefined
        }
        data-slot="switch"
        className={cn(switchVariants({ variant, className }))}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            'pointer-events-none block rounded-full transition-all duration-150 ease-out',
            'bg-card dark:bg-inset shadow-1',
            'size-4.5 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
          )}
        />
      </SwitchPrimitive.Root>
    )

    if (!label) {
      return switchElement
    }

    return (
      <label
        htmlFor={id}
        className="inline-flex items-center gap-2.5 cursor-pointer select-none"
      >
        {switchElement}
        <span className="text-sm font-medium text-ink leading-none">
          {label}
        </span>
      </label>
    )
  }
)
Switch.displayName = 'Switch'
