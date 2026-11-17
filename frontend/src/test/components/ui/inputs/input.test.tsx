import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/inputs/input'
import {
  Field,
  FieldError,
  FieldDescription,
} from '@/components/ui/inputs/field'

describe('Input component contract and behaviors', () => {
  it('updates value on change and accepts focus', () => {
    render(<Input placeholder="Usuario" />)
    const input = screen.getByPlaceholderText('Usuario') as HTMLInputElement

    input.focus()
    expect(document.activeElement).toBe(input)

    fireEvent.change(input, { target: { value: 'Admin' } })
    expect(input.value).toBe('Admin')
  })

  it('enforces required and aria-required both directly and inherited from Field', () => {
    const { rerender } = render(<Input placeholder="Directo" required />)
    const directInput = screen.getByPlaceholderText(
      'Directo'
    ) as HTMLInputElement
    expect(directInput.required).toBe(true)
    expect(directInput.getAttribute('aria-required')).toBe('true')

    rerender(
      <Field required>
        <Input placeholder="Heredado" />
      </Field>
    )
    const inheritedInput = screen.getByPlaceholderText(
      'Heredado'
    ) as HTMLInputElement
    expect(inheritedInput.required).toBe(true)
    expect(inheritedInput.getAttribute('aria-required')).toBe('true')
  })

  it('honors readOnly state and dedicated styling', () => {
    render(<Input placeholder="Solo lectura" readOnly />)
    const input = screen.getByPlaceholderText(
      'Solo lectura'
    ) as HTMLInputElement
    expect(input.readOnly).toBe(true)
    expect(input.classList.contains('read-only:bg-card')).toBe(true)
  })

  it('honors disabled state and prevents interactions', () => {
    render(<Input placeholder="Deshabilitado" disabled />)
    const input = screen.getByPlaceholderText(
      'Deshabilitado'
    ) as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('links aria-describedby with both FieldDescription and FieldError', () => {
    render(
      <Field id="account">
        <Input placeholder="Cuenta" />
        <FieldDescription>Ingresa tu número de cuenta</FieldDescription>
        <FieldError>Cuenta inválida</FieldError>
      </Field>
    )

    const input = screen.getByPlaceholderText('Cuenta')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toContain('account-desc')
    expect(describedBy).toContain('account-error')
  })
})
