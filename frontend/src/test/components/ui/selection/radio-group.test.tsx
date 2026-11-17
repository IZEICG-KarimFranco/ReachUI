import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  RadioGroup,
  RadioGroupItem,
  RadioCard,
} from '@/components/ui/selection/radio-group'
import { Field } from '@/components/ui/inputs/field'

describe('RadioGroup component contract and behaviors', () => {
  it('renders RadioCard with title, description and badge', () => {
    render(
      <RadioGroup defaultValue="sms">
        <RadioCard
          value="sms"
          title="SMS Masivo"
          description="Entrega directa"
          badge={<span data-testid="badge">Activo</span>}
        />
        <RadioCard
          value="whatsapp"
          title="WhatsApp"
          description="Mensajería enriquecida"
        />
      </RadioGroup>
    )

    expect(screen.getByText('SMS Masivo')).toBeDefined()
    expect(screen.getByText('Entrega directa')).toBeDefined()
    expect(screen.getByTestId('badge')).toBeDefined()
  })

  it('toggles selection on click', () => {
    render(
      <RadioGroup defaultValue="opt1">
        <RadioGroupItem value="opt1" aria-label="Opción 1" />
        <RadioGroupItem value="opt2" aria-label="Opción 2" />
      </RadioGroup>
    )

    const opt2 = screen.getByRole('radio', { name: 'Opción 2' })
    fireEvent.click(opt2)
    expect(opt2.getAttribute('data-state')).toBe('checked')
  })

  it('inherits disabled state from FieldContext', () => {
    render(
      <Field disabled>
        <RadioGroup defaultValue="opt1">
          <RadioGroupItem value="opt1" aria-label="Opción 1" />
        </RadioGroup>
      </Field>
    )

    const opt1 = screen.getByRole('radio', { name: 'Opción 1' })
    expect(opt1).toBeDisabled()
  })
})
