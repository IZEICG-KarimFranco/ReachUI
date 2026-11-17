import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Input, type InputProps } from '@/components/ui/inputs/input'
import { cn } from '@/lib/utils'

export type PasswordInputProps = Omit<InputProps, 'type'>

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, disabled, ...props }, ref) => {
  const { t } = useTranslation()
  const [revealed, setRevealed] = React.useState(false)

  return (
    <div className="relative w-full">
      <Input
        ref={ref}
        type={revealed ? 'text' : 'password'}
        disabled={disabled}
        autoComplete={props.autoComplete ?? 'current-password'}
        className={cn('pr-16', className)}
        {...props}
      />
      <button
        type="button"
        tabIndex={0}
        disabled={disabled}
        aria-label={
          revealed ? t('auth.hide_password') : t('auth.show_password')
        }
        onClick={() => setRevealed((v) => !v)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted hover:text-signal-contrast dark:hover:text-signal-bright transition-colors duration-150 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed outline-none focus-visible:outline-3 focus-visible:outline-signal-contrast rounded-sm px-1 py-0.5"
      >
        {revealed ? t('auth.hide') : t('auth.show')}
      </button>
    </div>
  )
})
PasswordInput.displayName = 'PasswordInput'
