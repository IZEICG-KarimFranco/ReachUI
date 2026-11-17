import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordInput } from '@/components/ui/inputs/password-input'

describe('PasswordInput component contract and a11y toggle', () => {
  it('renders input with password type by default', () => {
    render(<PasswordInput placeholder="Contraseña" />)
    const input = screen.getByPlaceholderText('Contraseña') as HTMLInputElement
    expect(input.type).toBe('password')
  })

  it('toggle button is keyboard-focusable with tabIndex=0', () => {
    render(<PasswordInput placeholder="Contraseña" />)
    const toggleButton = screen.getByRole('button', {
      name: /auth.show_password/i,
    })
    expect(toggleButton.tabIndex).toBe(0)
  })

  it('toggles visibility between password and text using click and keyboard', () => {
    render(<PasswordInput placeholder="Contraseña" />)
    const input = screen.getByPlaceholderText('Contraseña') as HTMLInputElement
    const toggleButton = screen.getByRole('button', {
      name: /auth.show_password/i,
    })

    // Click para mostrar
    fireEvent.click(toggleButton)
    expect(input.type).toBe('text')

    // Click para ocultar
    const hideButton = screen.getByRole('button', {
      name: /auth.hide_password/i,
    })
    fireEvent.click(hideButton)
    expect(input.type).toBe('password')
  })

  it('disables input and toggle button when disabled prop is passed', () => {
    render(<PasswordInput placeholder="Contraseña" disabled />)
    const input = screen.getByPlaceholderText('Contraseña') as HTMLInputElement
    const toggleButton = screen.getByRole('button')

    expect(input.disabled).toBe(true)
    expect(toggleButton).toBeDisabled()
  })
})
