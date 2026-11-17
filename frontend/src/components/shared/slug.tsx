'use client'

import * as React from 'react'
import { Pencil, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFormContext, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/inputs/input'
import { generateSlug, cn } from '@/lib/utils'

interface SlugProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  value?: string
  onChange?: (value: string) => void
  sourceFieldName?: string
  isEditable?: boolean
  label?: string
}

export function Slug({
  value,
  onChange,
  onBlur,
  name,
  sourceFieldName = 'name',
  isEditable = true,
  label,
  placeholder,
  className,
  ...props
}: SlugProps) {
  const { t } = useTranslation()
  const { control } = useFormContext()
  const [isEditing, setIsEditing] = React.useState(false)
  const [isManual, setIsManual] = React.useState(false)

  const watchedSourceValue = useWatch({
    control,
    name: sourceFieldName || '',
    disabled: !sourceFieldName,
  })

  const displayLabel = label || t('common.slug_label')
  const displayPlaceholder = placeholder || t('common.slug_placeholder')

  const currentValue = value || ''

  // Detect manual changes on mount or source change
  React.useEffect(() => {
    if (watchedSourceValue && currentValue) {
      const auto = generateSlug(watchedSourceValue)
      if (auto !== currentValue && !isManual) {
        setIsManual(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-generation logic when not manual
  React.useEffect(() => {
    if (!isManual && watchedSourceValue && onChange) {
      const autoSlug = generateSlug(watchedSourceValue)
      if (autoSlug !== currentValue) {
        onChange(autoSlug)
      }
    }
  }, [watchedSourceValue, isManual, currentValue, onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsManual(true)
    const validValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    if (onChange) {
      onChange(validValue)
    }
  }

  const handleReset = () => {
    setIsManual(false)
    if (watchedSourceValue && onChange) {
      onChange(generateSlug(watchedSourceValue))
    }
  }

  const handleOk = () => {
    setIsEditing(false)
  }

  return (
    <div className={cn('relative w-full', className)}>
      {!isEditing ? (
        <div className="group relative flex items-center w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-muted/50">
          <span className="text-muted-foreground mr-2 uppercase text-[10px] font-bold tracking-wider">
            {displayLabel}
          </span>
          <span className="font-mono font-medium text-foreground flex-1 truncate">
            {currentValue || '...'}
          </span>

          {isEditable && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="ml-2 text-xs text-primary font-semibold hover:underline flex items-center gap-1 hover:text-secondary"
              title={t('common.edit')}
            >
              <Pencil className="w-3 h-3" />
            </button>
          )}
        </div>
      ) : (
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              value={currentValue}
              onChange={handleInputChange}
              onBlur={onBlur}
              name={name}
              autoFocus
              placeholder={displayPlaceholder}
              className="pr-24 font-mono text-sm"
              {...props}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isManual && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[10px] uppercase font-bold text-primary hover:text-primary/80 transition-colors px-1.5 py-1"
                  title={t('common.auto')}
                >
                  {t('common.auto')}
                </button>
              )}
              <button
                type="button"
                onClick={handleOk}
                className="flex items-center gap-1 text-[10px] font-bold uppercase text-foreground bg-background border rounded-sm px-2 py-1 hover:bg-accent transition-colors"
              >
                <Check className="w-3 h-3" />
                {t('common.ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
