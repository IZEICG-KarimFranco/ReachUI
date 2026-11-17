import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export interface ModeOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export interface ModeSwitchProps {
  options: ModeOption[]
  value: string
  onValueChange: (value: string) => void
  layout?: 'scroll' | 'wrap'
  ariaLabel?: string
  disabled?: boolean
  className?: string
}

export function ModeSwitch({
  options,
  value,
  onValueChange,
  layout = 'scroll',
  ariaLabel,
  disabled = false,
  className,
}: ModeSwitchProps) {
  const { t } = useTranslation()
  const resolvedAriaLabel = ariaLabel ?? t('common.mode_switch')
  const buttonsRef = React.useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    if (disabled) return

    let nextIndex = currentIndex

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      for (let i = 1; i <= options.length; i++) {
        const candidate = (currentIndex + i) % options.length
        if (!options[candidate]?.disabled) {
          nextIndex = candidate
          break
        }
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      for (let i = 1; i <= options.length; i++) {
        const candidate = (currentIndex - i + options.length) % options.length
        if (!options[candidate]?.disabled) {
          nextIndex = candidate
          break
        }
      }
    }

    if (nextIndex !== currentIndex) {
      onValueChange(options[nextIndex].value)
      buttonsRef.current[nextIndex]?.focus()
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={resolvedAriaLabel}
      aria-disabled={disabled ? 'true' : undefined}
      className={cn(
        'inline-flex w-fit max-w-full rounded-full border border-line bg-card/60 p-1 gap-1 select-none shadow-1',
        layout === 'wrap'
          ? 'flex-wrap items-center'
          : 'items-center overflow-x-auto touch-pan-x overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {options.map((opt, idx) => {
        const isSelected = opt.value === value
        const isOptDisabled = disabled || Boolean(opt.disabled)

        return (
          <button
            key={opt.value}
            ref={(el) => {
              buttonsRef.current[idx] = el
            }}
            role="radio"
            aria-checked={isSelected}
            disabled={isOptDisabled}
            tabIndex={isSelected && !isOptDisabled ? 0 : -1}
            type="button"
            onClick={() => {
              if (!isOptDisabled) onValueChange(opt.value)
            }}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              'h-8 px-3.5 rounded-full text-xs font-semibold shrink-0 leading-none transition-all duration-150 motion-reduce:transition-none',
              isSelected
                ? 'bg-selection text-signal-contrast shadow-1 font-bold'
                : 'text-muted hover:text-ink hover:bg-selection/40',
              isOptDisabled
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer',
              'focus-ring'
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
