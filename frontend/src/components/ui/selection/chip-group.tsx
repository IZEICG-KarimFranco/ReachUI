import type { ComponentProps, ReactNode } from 'react'
import { useRovingFocus } from '@/components/ui/hooks/use-roving-focus'
import { useFieldContext } from '@/components/ui/inputs/field'
import { toggleValue } from '@/components/ui/lib/chip-group'
import { cn } from '@/lib/utils'

export interface ChipOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface ChipGroupProps extends Omit<
  ComponentProps<'div'>,
  'children' | 'defaultValue' | 'onChange'
> {
  options: ChipOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  ariaLabel?: string
  layout?: 'wrap' | 'scroll'
}

export function ChipGroup({
  options,
  value,
  onValueChange,
  ariaLabel,
  layout = 'wrap',
  className,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}: ChipGroupProps) {
  const field = useFieldContext()
  const { getItemProps } = useRovingFocus(
    options,
    options.findIndex((opt) => value.includes(opt.value))
  )

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabelledBy ?? (ariaLabel ? undefined : field?.labelId)
      }
      aria-describedby={
        ariaDescribedBy ??
        (field ? `${field.descriptionId} ${field.errorId}` : undefined)
      }
      data-slot="chip-group"
      className={cn(
        'flex w-full min-w-0 items-center gap-1.5 select-none',
        layout === 'wrap'
          ? 'flex-wrap'
          : 'overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      {...props}
    >
      {options.map((opt, idx) => {
        const pressed = value.includes(opt.value)
        const disabled = opt.disabled || field?.disabled
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={pressed}
            disabled={disabled}
            data-slot="chip"
            onClick={() => onValueChange(toggleValue(value, opt.value))}
            {...getItemProps(idx)}
            className={cn(
              'inline-flex shrink-0 items-center whitespace-nowrap rounded-pill border px-2.5 py-1.5 transition-colors duration-150 motion-reduce:transition-none focus-ring',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              pressed
                ? 'border-signal-contrast bg-selection text-signal-contrast'
                : 'border-line bg-card text-ink-secondary'
            )}
          >
            <span className="font-mono text-label">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
