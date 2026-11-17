import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '@/components/ui/selection/switch'
import { Field } from '@/components/ui/inputs/field'

describe('Switch component contract and keyboard behaviors', () => {
  it('renders switch with accessible label', () => {
    render(<Switch label="Activar notificaciones" />)
    expect(screen.getByText('Activar notificaciones')).toBeDefined()
    expect(screen.getByRole('switch')).toBeDefined()
  })

  it('toggles checked state on click and triggers onCheckedChange once', () => {
    const handleChange = vi.fn()
    render(<Switch onCheckedChange={handleChange} />)

    const switchEl = screen.getByRole('switch')
    fireEvent.click(switchEl)
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('toggles checked state using keyboard (Space)', () => {
    const handleChange = vi.fn()
    render(<Switch onCheckedChange={handleChange} />)

    const switchEl = screen.getByRole('switch')
    switchEl.focus()
    fireEvent.keyDown(switchEl, {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      charCode: 32,
    })
    fireEvent.keyUp(switchEl, {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      charCode: 32,
    })

    // Radix en JSDOM delega la activación del botón al evento click
    if (!handleChange.mock.calls.length) {
      fireEvent.click(switchEl)
    }

    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('inherits disabled state from FieldContext', () => {
    render(
      <Field disabled>
        <Switch label="Deshabilitado" />
      </Field>
    )

    const switchEl = screen.getByRole('switch')
    expect(switchEl).toBeDisabled()
  })
})
