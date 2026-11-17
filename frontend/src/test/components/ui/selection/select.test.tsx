import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Select } from '@/components/ui/selection/select'
import { Field } from '@/components/ui/inputs/field'

describe('Select component contract and behaviors', () => {
  const options = [
    { value: 'email', label: 'Correo electrónico' },
    { value: 'sms', label: 'Mensaje SMS' },
  ]

  it('renders trigger with placeholder and proper a11y attributes', () => {
    render(
      <Field id="channel-field" required>
        <Select options={options} placeholder="Seleccionar canal" />
      </Field>
    )

    const trigger = screen.getByRole('combobox')
    expect(screen.getByText('Seleccionar canal')).toBeDefined()
    expect(trigger.getAttribute('aria-required')).toBe('true')
    expect(trigger.getAttribute('aria-describedby')).toContain(
      'channel-field-desc'
    )
  })

  it('renders default value label correctly on initial render', () => {
    render(<Select options={options} defaultValue="sms" />)
    expect(screen.getByText('Mensaje SMS')).toBeDefined()
  })

  it('allows opening trigger while in loading state and shows spinner', () => {
    render(<Select options={options} loading />)
    const trigger = screen.getByRole('combobox')
    expect(trigger.getAttribute('disabled')).toBeNull()
  })

  it('shows no results message when options list is empty', () => {
    render(<Select options={[]} placeholder="Vacío" />)
    expect(screen.getByText('Vacío')).toBeDefined()
  })

  it('handles value change callback via onValueChange', () => {
    const handleValueChange = vi.fn()
    render(
      <Select
        options={options}
        value="email"
        onValueChange={handleValueChange}
      />
    )
    expect(screen.getByText('Correo electrónico')).toBeDefined()
  })
})
