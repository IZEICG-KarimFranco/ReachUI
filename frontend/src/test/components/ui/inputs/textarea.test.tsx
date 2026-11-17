import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from '@/components/ui/inputs/textarea'
import { Field, FieldError } from '@/components/ui/inputs/field'

describe('Textarea component contract and behaviors', () => {
  it('updates text on user change', () => {
    render(<Textarea placeholder="Mensaje" />)
    const textarea = screen.getByPlaceholderText(
      'Mensaje'
    ) as HTMLTextAreaElement

    fireEvent.change(textarea, { target: { value: 'Contenido del mensaje' } })
    expect(textarea.value).toBe('Contenido del mensaje')
  })

  it('inherits required and aria-required from FieldContext', () => {
    render(
      <Field required>
        <Textarea placeholder="Mensaje" />
      </Field>
    )

    const textarea = screen.getByPlaceholderText(
      'Mensaje'
    ) as HTMLTextAreaElement
    expect(textarea.required).toBe(true)
    expect(textarea.getAttribute('aria-required')).toBe('true')
  })

  it('applies readOnly state and dedicated styling', () => {
    render(<Textarea placeholder="Mensaje" readOnly />)
    const textarea = screen.getByPlaceholderText(
      'Mensaje'
    ) as HTMLTextAreaElement
    expect(textarea.readOnly).toBe(true)
    expect(textarea.classList.contains('read-only:bg-card')).toBe(true)
  })

  it('links error and aria-describedby correctly when within Field', () => {
    render(
      <Field id="bio" error="Campo mandatorio">
        <Textarea placeholder="Biografía" />
        <FieldError>Campo mandatorio</FieldError>
      </Field>
    )

    const textarea = screen.getByPlaceholderText('Biografía')
    expect(textarea.getAttribute('aria-invalid')).toBe('true')
    expect(textarea.getAttribute('aria-describedby')).toContain('bio-error')
  })

  it('disables textarea when disabled prop is provided', () => {
    render(<Textarea placeholder="Mensaje" disabled />)
    const textarea = screen.getByPlaceholderText(
      'Mensaje'
    ) as HTMLTextAreaElement
    expect(textarea.disabled).toBe(true)
  })
})
