import { forwardRef, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { useFieldContext } from '@/components/ui/inputs/field'

export type TextareaProps = ComponentProps<'textarea'>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      id: propId,
      disabled: propDisabled,
      required: propRequired,
      readOnly,
      ...props
    },
    ref
  ) => {
    const field = useFieldContext()
    const id = propId || field?.id
    const disabled = propDisabled ?? field?.disabled
    const required = propRequired ?? field?.required

    return (
      <textarea
        ref={ref}
        id={id}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        aria-required={required || undefined}
        aria-invalid={field?.hasError || undefined}
        aria-describedby={
          field?.hasError ? field.errorId : field?.descriptionId
        }
        data-slot="textarea"
        className={cn(
          'flex min-h-24 w-full rounded-control border border-control bg-inset p-3.5 text-sm text-ink placeholder:text-muted/60 outline-none resize-y',
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
Textarea.displayName = 'Textarea'
