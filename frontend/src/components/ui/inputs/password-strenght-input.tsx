'use client'

import * as React from 'react'
import {
  PasswordInput,
  type PasswordInputProps,
} from '@/components/ui/inputs/password-input'
import { PasswordStrengthMeter } from '@/components/ui/inputs/password-strength-meter'

export type PasswordStrenghtInputProps = PasswordInputProps

export const PasswordStrenghtInput = React.forwardRef<
  HTMLInputElement,
  PasswordStrenghtInputProps
>(({ value, defaultValue, onChange, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue !== undefined ? String(defaultValue) : ''
  )

  const currentValue = value !== undefined ? String(value) : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)
  }

  return (
    <div className="w-full space-y-1.5 max-w-[360px]">
      <PasswordInput
        ref={ref}
        value={currentValue}
        onChange={handleChange}
        {...props}
      />
      <PasswordStrengthMeter value={currentValue} />
    </div>
  )
})

PasswordStrenghtInput.displayName = 'PasswordStrenghtInput'
