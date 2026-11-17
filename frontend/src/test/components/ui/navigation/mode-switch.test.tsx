import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  ModeSwitch,
  type ModeOption,
} from '@/components/ui/navigation/mode-switch'

describe('ModeSwitch keyboard, accessibility and disabled contracts (R6)', () => {
  const options: ModeOption[] = [
    { value: 'summary', label: 'Resumen' },
    { value: 'deliveries', label: 'Entregas' },
    { value: 'errors', label: 'Errores', disabled: true },
    { value: 'responses', label: 'Respuestas' },
  ]

  it('sets aria-checked only on the selected option and manages roving tabindex', () => {
    render(
      <ModeSwitch options={options} value="summary" onValueChange={vi.fn()} />
    )

    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toHaveAttribute('aria-checked', 'true')
    expect(radios[0]).toHaveAttribute('tabIndex', '0')

    expect(radios[1]).toHaveAttribute('aria-checked', 'false')
    expect(radios[1]).toHaveAttribute('tabIndex', '-1')

    expect(radios[2]).toBeDisabled()
    expect(radios[2]).toHaveAttribute('tabIndex', '-1')
  })

  it('navigates with arrow keys skipping disabled options and focusing the new selection', async () => {
    const user = userEvent.setup()
    const handleValueChange = vi.fn()

    const { rerender } = render(
      <ModeSwitch
        options={options}
        value="deliveries"
        onValueChange={handleValueChange}
      />
    )

    const deliveriesRadio = screen.getByRole('radio', { name: 'Entregas' })
    deliveriesRadio.focus()
    expect(deliveriesRadio).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(handleValueChange).toHaveBeenCalledWith('responses')

    rerender(
      <ModeSwitch
        options={options}
        value="responses"
        onValueChange={handleValueChange}
      />
    )
    const responsesRadio = screen.getByRole('radio', { name: 'Respuestas' })
    expect(responsesRadio).toHaveAttribute('aria-checked', 'true')
  })

  it('respects entire component disabled state', () => {
    render(
      <ModeSwitch
        options={options}
        value="summary"
        disabled={true}
        onValueChange={vi.fn()}
      />
    )

    const group = screen.getByRole('radiogroup')
    expect(group).toHaveAttribute('aria-disabled', 'true')

    const radios = screen.getAllByRole('radio')
    radios.forEach((r) => expect(r).toBeDisabled())
  })
})
