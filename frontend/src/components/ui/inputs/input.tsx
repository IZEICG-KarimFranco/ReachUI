import { forwardRef, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { useFieldContext } from '@/components/ui/inputs/field'

export type InputProps = ComponentProps<'input'>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      id: propId,
      disabled: propDisabled,
      required: propRequired,
      readOnly: propReadOnly,
      ...props
    },
    ref
  ) => {
    const field = useFieldContext()
    const id = propId || field?.id
    const disabled = propDisabled ?? field?.disabled
    const required = propRequired ?? field?.required
    const readOnly = propReadOnly ?? field?.readOnly

    return (
      <input
        ref={ref}
        id={id}
        type={type}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        aria-required={required || undefined}
        aria-invalid={field?.hasError || undefined}
        aria-describedby={
          field ? `${field.descriptionId} ${field.errorId}` : undefined
        }
        data-slot="input"
        className={cn(
          'h-[42px] w-full min-w-0 rounded-control border border-control bg-inset px-3.5 text-sm text-ink placeholder:text-muted/60 outline-none',
          'transition-[border-color,box-shadow,background-color] duration-150 ease-out',
          'hover:border-line-strong',
          'focus-ring-field',
          'aria-invalid:border-error hover:aria-invalid:border-error',
          'focus:aria-invalid:border-error focus:aria-invalid:ring-3 focus:aria-invalid:ring-error/25',
          'read-only:bg-card read-only:cursor-default read-only:hover:border-control read-only:focus:ring-0 read-only:focus:border-control',
          'disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-inset/40 disabled:hover:border-control',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
