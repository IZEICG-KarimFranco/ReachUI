'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Spinner } from '@/components/ui/feedback/spinner'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useFieldContext } from '@/components/ui/inputs/field'

interface SearchContextValue {
  query: string
}

const SearchContext = React.createContext<SearchContextValue>({ query: '' })

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
export const SelectRoot = SelectPrimitive.Root
// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
export const SelectGroup = SelectPrimitive.Group
// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
export const SelectValue = SelectPrimitive.Value

// LEGACY (solo el export): al terminar la migración del rediseño (T02–T06) deja de exportarse; lo sigue usando el modo `options`
export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    size?: 'sm' | 'default'
  }
>(({ className, size = 'default', children, ...props }, ref) => {
  const field = useFieldContext()

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      id={field?.id}
      aria-required={field?.required || undefined}
      aria-invalid={field?.hasError || undefined}
      aria-describedby={
        field ? `${field.descriptionId} ${field.errorId}` : undefined
      }
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        'group/trigger flex w-full items-center justify-between rounded-control border border-control bg-card px-3.5 py-2 text-sm text-ink outline-none transition-colors duration-150 select-none',
        'hover:border-line-strong hover:bg-card/90',
        'focus-ring-field',
        'aria-invalid:border-error focus:aria-invalid:border-error',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-card/40',
        size === 'sm' ? 'min-h-9 py-1 text-xs' : 'min-h-[42px]',
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <span className="ml-2 text-xs text-muted transition-transform duration-150 group-data-[state=open]/trigger:rotate-180 select-none">
          ▾
        </span>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

export interface SelectContentProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
> {
  searchable?: boolean
  searchPlaceholder?: string
}

// LEGACY (solo el export): al terminar la migración del rediseño (T02–T06) deja de exportarse; lo sigue usando el modo `options`
export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    {
      className,
      children,
      position = 'popper',
      searchable = false,
      searchPlaceholder,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [query, setQuery] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    return (
      <SearchContext.Provider value={{ query }}>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            ref={ref}
            position={position}
            sideOffset={6}
            data-slot="select-content"
            className={cn(
              'relative z-pop min-w-56 w-(--radix-select-trigger-width) max-h-72 overflow-hidden rounded-control border border-line-strong bg-card text-ink shadow-pop',
              position === 'popper' &&
                'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
              className
            )}
            {...props}
          >
            {searchable && (
              <div
                className="sticky top-0 z-20 border-b border-line bg-card p-2"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder || t('common.search')}
                  className="h-8 w-full rounded-control border border-control bg-inset px-2.5 text-xs text-ink placeholder:text-muted outline-none focus:border-signal-contrast transition-colors"
                  onPointerDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyDownCapture={(e) => e.stopPropagation()}
                  onKeyUpCapture={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <SelectPrimitive.Viewport className="flex flex-col gap-1.5 p-1.5 max-h-48 overflow-y-auto overflow-x-hidden">
              {children}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SearchContext.Provider>
    )
  }
)
SelectContent.displayName = SelectPrimitive.Content.displayName

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
export const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn(
      'px-3.5 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider',
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

// LEGACY (solo el export): al terminar la migración del rediseño (T02–T06) deja de exportarse; lo sigue usando el modo `options`
export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  const { query } = React.useContext(SearchContext)

  const itemText = React.useMemo(() => {
    if (typeof children === 'string') return children
    if (props.value) return String(props.value)
    return ''
  }, [children, props.value])

  const matches = React.useMemo(() => {
    if (!query.trim()) return true
    return itemText.toLowerCase().includes(query.toLowerCase().trim())
  }, [itemText, query])

  if (!matches) {
    return null
  }

  return (
    <SelectPrimitive.Item
      ref={ref}
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center justify-between rounded-control px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-150 border border-transparent',
        'hover:bg-control/50 hover:text-ink focus:bg-control/50 focus:text-ink',
        'data-[state=checked]:bg-selection data-[state=checked]:text-signal dark:data-[state=checked]:text-signal-contrast data-[state=checked]:border-signal/30 data-[state=checked]:font-semibold',
        'data-[state=checked]:hover:bg-selection/90 data-[state=checked]:focus:bg-selection/90',
        'data-disabled:pointer-events-none data-disabled:opacity-40',
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
export const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn('pointer-events-none -mx-1 my-1 h-px bg-line', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export interface SelectOption {
  value: string
  label: string
  description?: string
  tag?: string
  disabled?: boolean
}

export interface UnifiedSelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options?: SelectOption[]
  placeholder?: string
  searchable?: boolean
  searchPlaceholder?: string
  disabled?: boolean
  loading?: boolean
  className?: string
  // LEGACY: borrar al terminar la migración del rediseño (T02–T06); modo compuesto, se sustituye por `options`
  children?: React.ReactNode
}

export function Select({
  options,
  children,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  searchable = false,
  searchPlaceholder,
  disabled: propDisabled,
  loading = false,
  className,
  ...props
}: UnifiedSelectProps & React.ComponentProps<typeof SelectPrimitive.Root>) {
  const { t } = useTranslation()
  const field = useFieldContext()
  // No deshabilitamos el trigger cuando loading=true para permitir abrir y ver el spinner
  const disabled = propDisabled ?? field?.disabled

  // LEGACY: borrar al terminar la migración del rediseño (T02–T06); modo compuesto con `children`
  if (!options) {
    return (
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        {...props}
      >
        {children}
      </SelectPrimitive.Root>
    )
  }

  const effectiveValue = value !== undefined ? value : defaultValue
  const selectedOption = options.find((opt) => opt.value === effectiveValue)

  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      {...props}
    >
      <SelectTrigger className={className}>
        <div className="flex flex-col text-left truncate pr-2">
          <span className="font-semibold text-sm text-ink truncate leading-snug">
            {selectedOption ? (
              selectedOption.label
            ) : (
              <span className="text-muted font-normal">
                {placeholder || t('common.select_placeholder')}
              </span>
            )}
          </span>
          {selectedOption?.description && (
            <span className="text-xs text-muted truncate leading-normal">
              {selectedOption.description}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {selectedOption?.tag && (
            <span className="rounded-control border border-line-strong bg-line/20 px-2 py-0.5 text-[10px] font-bold text-ink uppercase tracking-wider">
              {selectedOption.tag}
            </span>
          )}
        </div>
      </SelectTrigger>

      <SelectContent
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2.5 p-4 text-xs text-muted">
            <Spinner
              className="size-4 text-signal shrink-0"
              aria-hidden="true"
            />
            <span>{t('common.loading')}</span>
          </div>
        ) : options.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted">
            {t('common.no_results')}
          </div>
        ) : (
          options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              <div className="flex flex-col text-left truncate pr-2">
                <span className="font-semibold text-sm truncate leading-tight">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-xs text-muted truncate leading-normal mt-0.5">
                    {opt.description}
                  </span>
                )}
              </div>
              {opt.tag && (
                <span className="rounded-control border border-line-strong bg-line/20 px-1.5 py-0.5 text-[10px] font-bold text-ink uppercase tracking-wider shrink-0 ml-2">
                  {opt.tag}
                </span>
              )}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </SelectPrimitive.Root>
  )
}
