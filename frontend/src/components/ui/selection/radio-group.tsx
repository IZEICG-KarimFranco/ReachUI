'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'
import { useFieldContext } from '@/components/ui/inputs/field'

export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, disabled: propDisabled, ...props }, ref) => {
  const field = useFieldContext()
  const disabled = propDisabled ?? field?.disabled

  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      disabled={disabled}
      aria-invalid={field?.hasError || undefined}
      aria-describedby={
        field ? `${field.descriptionId} ${field.errorId}` : undefined
      }
      data-slot="radio-group"
      className={cn('grid gap-2.5', className)}
      {...props}
    />
  )
})
RadioGroup.displayName = 'RadioGroup'

export const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    data-slot="radio-group-item"
    className={cn(
      'peer relative flex size-4 shrink-0 items-center justify-center rounded-full border border-control bg-transparent outline-none transition-all duration-150',
      'hover:border-line-strong',
      'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-signal-contrast',
      'data-[state=checked]:border-signal data-[state=checked]:bg-transparent',
      'disabled:cursor-not-allowed disabled:opacity-40',
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span
        className={cn(
          'size-2.5 rounded-full transition-all duration-150',
          'bg-signal'
        )}
      />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = 'RadioGroupItem'

export interface RadioCardProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> {
  title: string
  description?: string
  badge?: React.ReactNode
}

export const RadioCard = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioCardProps
>(
  (
    { className, value, id, title, description, badge, disabled, ...props },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'group relative flex w-full cursor-pointer items-center justify-between rounded-control border border-control bg-card px-4 py-3 transition-colors duration-150 select-none',
          'hover:border-line-strong hover:bg-card/90',
          'has-data-[state=checked]:border-signal has-data-[state=checked]:bg-selection',
          disabled &&
            'cursor-not-allowed opacity-40 hover:border-control hover:bg-card',
          className
        )}
      >
        <div className="flex items-center gap-3 min-w-0 pr-3">
          <RadioGroupItem
            ref={ref}
            value={value}
            id={inputId}
            disabled={disabled}
            {...props}
          />
          <div className="flex flex-col text-left truncate">
            <span className="font-semibold text-sm text-ink truncate leading-snug">
              {title}
            </span>
            {description && (
              <span className="text-xs text-muted truncate leading-normal mt-0.5">
                {description}
              </span>
            )}
          </div>
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </label>
    )
  }
)
RadioCard.displayName = 'RadioCard'
