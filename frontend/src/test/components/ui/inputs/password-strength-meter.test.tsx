import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PasswordStrengthMeter } from '@/components/ui/inputs/password-strength-meter'

describe('PasswordStrengthMeter component', () => {
  it('renders unrated status when password is empty', () => {
    render(<PasswordStrengthMeter value="" />)
    const status = screen.getByRole('status')
    expect(status.textContent).toBe('auth.password_unrated')
  })

  it('renders weak status and missing plural text when multiple criteria are missing', () => {
    render(<PasswordStrengthMeter value="12345" />)
    const status = screen.getByRole('status')
    expect(status.textContent).toBe('auth.password_weak')
    expect(screen.getByText(/auth.password_missing_plural/i)).toBeDefined()
  })

  it('renders medium status when 3 criteria are met', () => {
    render(<PasswordStrengthMeter value="Abc12345" />)
    const status = screen.getByRole('status')
    expect(status.textContent).toBe('auth.password_medium')
  })

  it('renders strong status and missing singular text when only one criterion is missing', () => {
    // Cumple longitud (13), mayúscula, minúscula y número. Solo falta símbolo.
    render(<PasswordStrengthMeter value="Abcdefgh12345" />)
    const status = screen.getByRole('status')
    expect(status.textContent).toBe('auth.password_strong')
    expect(screen.getByText(/auth.password_missing_singular/i)).toBeDefined()
  })

  it('renders very strong status and all rules met message', () => {
    render(<PasswordStrengthMeter value="Abcdefgh12345!" />)
    const status = screen.getByRole('status')
    expect(status.textContent).toBe('auth.password_very_strong')
    expect(screen.getByText('auth.password_all_rules_met')).toBeDefined()
  })

  it('displays warning when password contains spaces', () => {
    render(<PasswordStrengthMeter value="Abc 123456789!" />)
    expect(screen.getByText('auth.password_no_spaces')).toBeDefined()
  })
})
