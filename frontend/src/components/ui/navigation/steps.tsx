import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusDot } from '@/components/ui/feedback/status-dot'
import { Surface } from '@/components/ui/layout/surface'
import { cn } from '@/lib/utils'

export interface StepItem {
  number: string | number
  label: React.ReactNode
  status: 'done' | 'current' | 'upcoming'
  disabled?: boolean
}

export interface StepsProps extends React.ComponentProps<'ol'> {
  steps?: StepItem[]
  onStepClick?: (index: number) => void
  ariaLabel?: string
}

export function Steps({
  steps = [],
  onStepClick,
  ariaLabel,
  className,
  ...props
}: StepsProps) {
  const { t } = useTranslation()
  const resolvedAriaLabel = ariaLabel ?? t('common.wizard_progress')

  if (!steps.length) {
    return null
  }

  return (
    <Surface
      variant="plate"
      className={cn('p-0 overflow-hidden w-full select-none', className)}
    >
      <ol
        role="list"
        aria-label={resolvedAriaLabel}
        className="flex w-full overflow-x-auto touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        {...props}
      >
        {steps.map((step, idx) => {
          const isDone = step.status === 'done'
          const isCurrent = step.status === 'current'
          const isStepDisabled = Boolean(step.disabled)
          const formattedNum = String(step.number).padStart(2, '0')
          const isClickable = Boolean(onStepClick) && !isStepDisabled

          const content = (
            <>
              <span
                className={cn(
                  'font-mono text-[10px] tracking-wide tabular-nums leading-none mb-1 flex items-center gap-1.5',
                  isCurrent
                    ? 'text-signal-contrast font-bold'
                    : 'text-muted font-medium'
                )}
              >
                {isDone && (
                  <>
                    <StatusDot size="sm" tone="success" />
                    <span className="sr-only">({t('common.done')})</span>
                  </>
                )}
                {isCurrent && <StatusDot size="sm" tone="signal" />}
                {formattedNum}
              </span>

              <span
                className={cn(
                  'text-xs truncate w-full text-left leading-tight',
                  isCurrent
                    ? 'font-bold text-ink'
                    : isDone
                      ? 'font-semibold text-ink-secondary'
                      : 'font-medium text-ink-secondary',
                  isStepDisabled && 'opacity-50'
                )}
              >
                {step.label}
              </span>
            </>
          )

          return (
            <li
              key={idx}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex flex-col min-w-[100px] flex-1 shrink-0 border-r border-line last:border-r-0',
                isCurrent ? 'bg-selection' : 'bg-card'
              )}
            >
              {isClickable ? (
                <button
                  type="button"
                  disabled={isStepDisabled}
                  onClick={() => onStepClick?.(idx)}
                  className={cn(
                    'w-full h-full flex flex-col items-start justify-center py-2.5 px-3.5 sm:px-4 sm:py-3 text-left transition-colors cursor-pointer motion-reduce:transition-none focus-ring',
                    !isCurrent && 'hover:bg-selection/40',
                    isStepDisabled && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {content}
                </button>
              ) : (
                <div
                  className={cn(
                    'flex flex-col items-start justify-center py-2.5 px-3.5 sm:px-4 sm:py-3 text-left',
                    isStepDisabled && 'opacity-50'
                  )}
                >
                  {content}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </Surface>
  )
}
