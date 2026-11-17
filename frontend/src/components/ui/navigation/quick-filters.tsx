import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusDot } from '@/components/ui/feedback/status-dot'
import { type StatusTone } from '@/components/ui/feedback/status-label'
import {
  findEnabledIndex,
  resolveTabStop,
} from '@/components/ui/lib/roving-focus'
import { cn } from '@/lib/utils'

export type QuickFilterTone =
  | 'proc'
  | 'deliv'
  | 'fail'
  | 'pend'
  | 'sent'
  | 'live'
  | 'neutral'
  | StatusTone

export interface QuickFilterOption {
  value: string
  label: React.ReactNode
  dotTone?: QuickFilterTone
  disabled?: boolean
}

export interface QuickFiltersProps {
  options: QuickFilterOption[]
  value: string
  onValueChange: (value: string) => void
  layout?: 'scroll' | 'wrap'
  ariaLabel?: string
  className?: string
}

function resolveDotTone(tone?: QuickFilterTone): 'signal' | StatusTone {
  switch (tone) {
    case 'proc':
      return 'signal'
    case 'deliv':
      return 'success'
    case 'fail':
      return 'error'
    case 'pend':
      return 'live'
    case 'sent':
      return 'info'
    case 'live':
      return 'live'
    case 'neutral':
      return 'neutral'
    default:
      return tone || 'neutral'
  }
}

export function QuickFilters({
  options,
  value,
  onValueChange,
  layout = 'scroll',
  ariaLabel,
  className,
}: QuickFiltersProps) {
  const { t } = useTranslation()
  const resolvedAriaLabel = ariaLabel ?? t('common.quick_filters')

  const tabsRef = React.useRef<(HTMLButtonElement | null)[]>([])
  const tabStop = resolveTabStop(
    options,
    null,
    options.findIndex((opt) => opt.value === value)
  )

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    let nextIndex = -1

    if (e.key === 'ArrowRight')
      nextIndex = findEnabledIndex(options, currentIndex + 1, 1)
    else if (e.key === 'ArrowLeft')
      nextIndex = findEnabledIndex(options, currentIndex - 1, -1)
    else return

    e.preventDefault()
    if (nextIndex < 0 || nextIndex === currentIndex) return
    onValueChange(options[nextIndex].value)
    tabsRef.current[nextIndex]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={resolvedAriaLabel}
      className={cn(
        'w-full max-w-full min-w-0 select-none gap-1.5 py-1.5',
        layout === 'wrap'
          ? 'flex flex-wrap items-center'
          : 'flex items-center overflow-x-auto px-2 touch-pan-x overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      {options.map((opt, idx) => {
        const isSelected = opt.value === value
        const isDisabled = Boolean(opt.disabled)
        return (
          <button
            key={opt.value}
            ref={(el) => {
              tabsRef.current[idx] = el
            }}
            role="radio"
            aria-checked={isSelected}
            disabled={isDisabled}
            tabIndex={idx === tabStop ? 0 : -1}
            type="button"
            onClick={() => onValueChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              'inline-flex items-center gap-1.5 whitespace-nowrap rounded-control border px-3 py-1.5 text-xs font-semibold shrink-0 transition-colors duration-150 motion-reduce:transition-none',
              isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              isSelected
                ? 'border-signal bg-selection text-signal-contrast shadow-1 font-bold'
                : 'border-line bg-card text-muted hover:border-line-strong hover:bg-card/90 hover:text-ink',
              'focus-ring'
            )}
          >
            {opt.dotTone && (
              <StatusDot size="sm" tone={resolveDotTone(opt.dotTone)} />
            )}
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
