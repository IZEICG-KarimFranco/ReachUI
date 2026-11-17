import * as React from 'react'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFieldContext } from '@/components/ui/inputs/field'

export interface DatePickerProps extends Omit<
  React.ComponentProps<'input'>,
  'type' | 'onChange' | 'value'
> {
  type?: 'date' | 'time' | 'datetime-local'
  value?: string
  onValueChange?: (value: string) => void
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  error?: string
  helperText?: string
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      type = 'date',
      value,
      onValueChange,
      onChange,
      min,
      max,
      disabled: propDisabled,
      required: propRequired,
      readOnly,
      className,
      error,
      helperText,
      ...props
    },
    ref
  ) => {
    const field = useFieldContext()
    const disabled = propDisabled ?? field?.disabled
    const required = propRequired ?? field?.required
    const isInvalid = Boolean(error || field?.hasError)
    const isTime = type === 'time'
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onValueChange?.(e.target.value)
    }

    const openNativePicker = () => {
      if (
        !disabled &&
        !readOnly &&
        inputRef.current &&
        'showPicker' in inputRef.current
      ) {
        try {
          inputRef.current.showPicker()
        } catch {
          inputRef.current.focus()
        }
      }
    }

    return (
      <div className="flex flex-col gap-1 w-full">
        <div
          onClick={openNativePicker}
          className={cn(
            'relative flex items-center w-full',
            disabled || readOnly ? 'cursor-default' : 'cursor-pointer'
          )}
        >
          <input
            ref={inputRef}
            id={field?.id}
            type={type}
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            aria-required={required || undefined}
            aria-invalid={isInvalid || undefined}
            aria-describedby={
              field?.hasError ? field.errorId : field?.descriptionId
            }
            data-slot="datepicker-native"
            className={cn(
              'h-[42px] w-full min-w-0 rounded-control border border-control bg-card px-3.5 py-2 pr-10 text-sm text-ink outline-none transition-colors duration-150',
              'hover:border-line-strong hover:bg-card/90',
              'focus:border-signal-contrast focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-signal-contrast',
              isInvalid &&
                'border-error focus:border-error focus-visible:outline-error/40',
              'read-only:bg-card read-only:cursor-default read-only:hover:border-control',
              'disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-card/40',
              '[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer',
              className
            )}
            {...props}
          />
          {isTime ? (
            <Clock className="pointer-events-none absolute right-3.5 size-4 text-muted shrink-0" />
          ) : (
            <CalendarIcon className="pointer-events-none absolute right-3.5 size-4 text-muted shrink-0" />
          )}
        </div>
        {error ? (
          <span className="text-xs text-error font-medium leading-none mt-0.5">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-xs text-muted leading-none mt-0.5">
            {helperText}
          </span>
        ) : null}
      </div>
    )
  }
)
DatePicker.displayName = 'DatePicker'
