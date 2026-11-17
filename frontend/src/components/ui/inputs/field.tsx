import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Label, type FormLabelProps } from '@/components/ui/inputs/label'

interface FieldContextValue {
  id: string
  labelId: string
  errorId: string
  descriptionId: string
  hasError: boolean
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
}

const FieldContext = createContext<FieldContextValue | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useFieldContext() {
  return useContext(FieldContext)
}

export function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        'group/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3',
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  'group/field flex w-full gap-1.5 data-[invalid=true]:text-error',
  {
    variants: {
      orientation: {
        vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
        horizontal: [
          'flex-row items-center',
          '[&>[data-slot=field-label]]:flex-auto',
        ],
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
)

export function FieldLabel({
  className,
  id,
  required,
  ...props
}: Omit<FormLabelProps, 'variant'>) {
  const field = useFieldContext()

  return (
    <Label
      variant="form"
      id={id ?? field?.labelId}
      htmlFor={field?.id}
      required={required ?? field?.required}
      data-slot="field-label"
      className={cn('group/field-label w-fit mb-0.5', className)}
      {...props}
    />
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
export function FieldDescription({
  className,
  id: explicitId,
  ...props
}: ComponentProps<'p'>) {
  const field = useFieldContext()

  return (
    <p
      id={explicitId || field?.descriptionId}
      data-slot="field-description"
      className={cn(
        'text-xs text-muted leading-relaxed font-normal mt-0.5',
        className
      )}
      {...props}
    />
  )
}

export function FieldSeparator({
  children,
  className,
  ...props
}: ComponentProps<'div'> & {
  children?: ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      className={cn(
        'relative my-2 flex items-center justify-center text-xs',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-line" />
      </div>
      {children && (
        <span
          className="relative bg-card px-2 text-muted"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

export function FieldError({
  className,
  children,
  errors,
  id: explicitId,
  ...props
}: ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const field = useFieldContext()

  const content = useMemo(() => {
    if (children) return children

    if (!errors?.length) return null

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) return null

  return (
    <div
      id={explicitId || field?.errorId}
      role="alert"
      data-slot="field-error"
      className={cn('text-xs font-medium text-error mt-0.5', className)}
      {...props}
    >
      {content}
    </div>
  )
}

export interface FieldProps
  extends ComponentProps<'div'>, VariantProps<typeof fieldVariants> {
  id?: string
  label?: string
  step?: string | number
  description?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
}

export function Field({
  id: explicitId,
  label,
  step,
  description,
  error,
  required,
  disabled,
  readOnly,
  orientation = 'vertical',
  className,
  children,
  ...props
}: FieldProps) {
  const generatedId = useId()
  const id = explicitId || generatedId
  const labelId = `${id}-label`
  const errorId = `${id}-error`
  const descriptionId = `${id}-desc`
  const hasError = Boolean(error)

  return (
    <FieldContext.Provider
      value={{
        id,
        labelId,
        errorId,
        descriptionId,
        hasError,
        disabled,
        required,
        readOnly,
      }}
    >
      <div
        role="group"
        data-slot="field"
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={hasError || undefined}
        data-orientation={orientation}
        className={cn(
          fieldVariants({ orientation }),
          'w-full max-w-sm',
          className
        )}
        {...props}
      >
        {label && (
          <Label
            variant="form"
            id={labelId}
            htmlFor={id}
            step={step}
            required={required}
            data-slot="field-label"
            className="mb-0.5"
          >
            {label}
          </Label>
        )}

        {children}

        {description && !error && (
          <p
            id={descriptionId}
            data-slot="field-description"
            className="text-xs text-muted leading-relaxed font-normal mt-0.5"
          >
            {description}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            data-slot="field-error"
            className="text-xs font-medium text-error mt-0.5"
          >
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}
