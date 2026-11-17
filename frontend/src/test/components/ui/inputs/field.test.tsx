import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/inputs/field'
import { Input } from '@/components/ui/inputs/input'

describe('Field component contract and accessibility', () => {
  it('associates label htmlFor with input id automatically', () => {
    render(
      <Field label="Correo electrónico">
        <Input />
      </Field>
    )

    const input = screen.getByRole('textbox', { name: /correo electrónico/i })
    expect(input).toBeDefined()
  })

  it('renders step indicator, required asterisk, and connects error role alert', () => {
    render(
      <Field
        id="phone"
        label="Teléfono"
        step={2}
        error="Número inválido"
        required
      >
        <Input />
      </Field>
    )

    expect(screen.getByText('02')).toBeDefined()
    expect(screen.getByText('*')).toBeDefined()
    expect(screen.getByRole('textbox', { name: 'Teléfono' })).toBeDefined()
    const errorMsg = screen.getByRole('alert')
    expect(errorMsg.textContent).toBe('Número inválido')
    expect(errorMsg.getAttribute('id')).toBe('phone-error')
  })

  it('associates description and error deterministically even when used as composite children', () => {
    render(
      <Field id="custom-id">
        <Input />
        <FieldDescription>Texto de ayuda</FieldDescription>
        <FieldError>Fallo de validación</FieldError>
      </Field>
    )

    const desc = screen.getByText('Texto de ayuda')
    const err = screen.getByRole('alert')
    expect(desc.getAttribute('id')).toBe('custom-id-desc')
    expect(err.getAttribute('id')).toBe('custom-id-error')
  })

  it('FieldLabel takes its target and required asterisk from Field', () => {
    render(
      <Field id="email" required>
        <FieldLabel>Correo</FieldLabel>
        <Input />
      </Field>
    )

    expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true')
    const input = screen.getByRole('textbox', { name: 'Correo' })
    expect(input.getAttribute('id')).toBe('email')
  })

  it('describes the control with the description prop and swaps it for the error', () => {
    const { rerender } = render(
      <Field id="name" label="Nombre" description="Como aparece en tu perfil.">
        <Input />
      </Field>
    )

    const input = screen.getByRole('textbox', { name: 'Nombre' })
    expect(input.getAttribute('aria-describedby')).toContain('name-desc')
    expect(screen.getByText('Como aparece en tu perfil.').id).toBe('name-desc')

    rerender(
      <Field
        id="name"
        label="Nombre"
        description="Como aparece en tu perfil."
        error="Campo obligatorio"
      >
        <Input />
      </Field>
    )

    expect(screen.queryByText('Como aparece en tu perfil.')).toBeNull()
    expect(screen.getByRole('alert').textContent).toBe('Campo obligatorio')
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })
})
