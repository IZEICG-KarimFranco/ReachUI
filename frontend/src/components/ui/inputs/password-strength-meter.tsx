import { useTranslation } from 'react-i18next'
import { usePasswordStrength } from '@/hooks/use-password-strength'
import { cn } from '@/lib/utils'

export interface PasswordStrengthMeterProps {
  value: string
}

export function PasswordStrengthMeter({ value }: PasswordStrengthMeterProps) {
  const { t } = useTranslation()
  const { score, level, hasNoSpaces, missingCriteria } =
    usePasswordStrength(value)

  const levelLabels: Record<string, string> = {
    empty: t('auth.password_unrated'),
    weak: t('auth.password_weak'),
    medium: t('auth.password_medium'),
    strong: t('auth.password_strong'),
    veryStrong: t('auth.password_very_strong'),
  }

  const criteriaLabels: Record<string, string> = {
    '12_chars': t('auth.criteria_12_chars'),
    uppercase: t('auth.criteria_uppercase'),
    lowercase: t('auth.criteria_lowercase'),
    number: t('auth.criteria_number'),
    symbol: t('auth.criteria_symbol'),
  }

  return (
    <div className="mt-2.5 flex flex-col gap-1 w-full max-w-[360px]">
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex h-0.5 flex-1 items-center overflow-hidden rounded-full bg-line dark:bg-line/40">
          <div className="flex size-full gap-[1.5px]">
            {[1, 2, 3, 4, 5].map((segmentIndex) => {
              const isFilled = segmentIndex <= score
              return (
                <span
                  key={segmentIndex}
                  className={cn(
                    'h-full flex-1 transition-colors duration-150',
                    isFilled ? 'bg-signal' : 'bg-transparent'
                  )}
                />
              )
            })}
          </div>
        </div>

        <span
          role="status"
          className="text-[12px] font-bold text-ink shrink-0 select-none text-right min-w-[72px]"
        >
          {levelLabels[level] || ''}
        </span>
      </div>

      {!hasNoSpaces && (
        <p className="text-xs text-error font-medium mt-0.5">
          {t('auth.password_no_spaces')}
        </p>
      )}

      {hasNoSpaces && missingCriteria.length > 0 && value.length > 0 && (
        <p
          className={cn(
            'text-xs mt-0.5',
            level === 'weak' ? 'text-error font-medium' : 'text-muted'
          )}
        >
          {missingCriteria.length === 1
            ? t('auth.password_missing_singular')
            : t('auth.password_missing_plural')}
          {missingCriteria.map((c) => criteriaLabels[c] || c).join(' · ')}
        </p>
      )}

      {hasNoSpaces && missingCriteria.length === 0 && value.length > 0 && (
        <p className="text-xs text-success font-medium mt-0.5">
          {t('auth.password_all_rules_met')}
        </p>
      )}
    </div>
  )
}
