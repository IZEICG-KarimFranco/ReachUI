import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordStrenghtInput } from '@/components/ui/inputs/password-strenght-input'

describe('PasswordStrenghtInput component', () => {
  it('renders input with default or localized placeholder', () => {
    render(<PasswordStrenghtInput placeholder="Ingresa contraseña" />)

    const input = screen.getByPlaceholderText(
      'Ingresa contraseña'
    ) as HTMLInputElement
    expect(input).toBeDefined()
    expect(input.type).toBe('password')
  })

  it('updates internal value and triggers onChange on typing', () => {
    const handleChange = vi.fn()
    render(
      <PasswordStrenghtInput onChange={handleChange} placeholder="Contraseña" />
    )

    const input = screen.getByPlaceholderText('Contraseña') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'MiPassword123!' } })

    expect(handleChange).toHaveBeenCalled()
    expect(input.value).toBe('MiPassword123!')
  })

  it('reflects controlled value properly', () => {
    render(
      <PasswordStrenghtInput
        value="Controlada1234@"
        readOnly
        placeholder="Contraseña"
      />
    )

    const input = screen.getByPlaceholderText('Contraseña') as HTMLInputElement
    expect(input.value).toBe('Controlada1234@')
  })

  it('toggles password visibility when show/hide button is clicked', () => {
    render(<PasswordStrenghtInput placeholder="Contraseña" />)

    const input = screen.getByPlaceholderText('Contraseña') as HTMLInputElement
    const toggleButton = screen.getByRole('button', {
      name: /auth.show_password/i,
    })

    fireEvent.click(toggleButton)
    expect(input.type).toBe('text')
  })
})
