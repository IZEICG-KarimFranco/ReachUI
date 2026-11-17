import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export type SpinnerProps = ComponentProps<'svg'>

export function Spinner({
  className,
  'aria-label': ariaLabelProp,
  ...props
}: SpinnerProps) {
  const { t } = useTranslation()
  const isHidden =
    props['aria-hidden'] === true || props['aria-hidden'] === 'true'
  const label = isHidden ? undefined : ariaLabelProp || t('common.loading')

  return (
    <svg
      role={isHidden ? undefined : 'status'}
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        'size-4 text-current shrink-0 inline-block origin-center animate-spinner motion-reduce:animate-none',
        className
      )}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.75"
        className="opacity-25"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        className="opacity-95"
      />
    </svg>
  )
}
