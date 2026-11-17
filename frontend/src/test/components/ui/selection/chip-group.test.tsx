import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Field, FieldLabel } from '@/components/ui/inputs/field'
import {
  ChipGroup,
  type ChipOption,
} from '@/components/ui/selection/chip-group'

const scopes: ChipOption[] = [
  { value: 'campaigns.read', label: 'read' },
  { value: 'campaigns.update', label: 'update' },
  { value: 'campaigns.delete', label: 'delete', disabled: true },
  { value: 'campaigns.execute', label: 'execute' },
]

function Controlled({
  onChange,
  initial = [],
}: {
  onChange?: (value: string[]) => void
  initial?: string[]
}) {
  const [value, setValue] = React.useState<string[]>(initial)
  return (
    <ChipGroup
      ariaLabel="Campañas"
      options={scopes}
      value={value}
      onValueChange={(next) => {
        onChange?.(next)
        setValue(next)
      }}
    />
  )
}

describe('ChipGroup', () => {
  it('exposes a named group of toggle buttons with their pressed state', () => {
    render(<Controlled initial={['campaigns.update']} />)

    expect(screen.getByRole('group', { name: 'Campañas' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'update' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'read' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('toggles several options independently on click', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Controlled onChange={handleChange} />)

    await user.click(screen.getByRole('button', { name: 'read' }))
    await user.click(screen.getByRole('button', { name: 'execute' }))
    await user.click(screen.getByRole('button', { name: 'read' }))

    expect(handleChange).toHaveBeenNthCalledWith(1, ['campaigns.read'])
    expect(handleChange).toHaveBeenNthCalledWith(2, [
      'campaigns.read',
      'campaigns.execute',
    ])
    expect(handleChange).toHaveBeenNthCalledWith(3, ['campaigns.execute'])
  })

  it('keeps one tab stop and moves focus with the arrows without toggling', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Controlled onChange={handleChange} />)

    expect(
      screen.getAllByRole('button').filter((chip) => chip.tabIndex === 0)
    ).toHaveLength(1)

    await user.tab()
    expect(screen.getByRole('button', { name: 'read' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'update' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'execute' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'read' })).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('button', { name: 'execute' })).toHaveFocus()

    expect(handleChange).not.toHaveBeenCalled()
  })

  it('toggles the focused chip with Space and Enter and returns to it with Shift+Tab', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <>
        <Controlled onChange={handleChange} />
        <button type="button">after</button>
      </>
    )

    await user.tab()
    await user.keyboard(' ')
    await user.keyboard('{ArrowRight}')
    await user.keyboard('{Enter}')
    expect(handleChange).toHaveBeenLastCalledWith([
      'campaigns.read',
      'campaigns.update',
    ])

    await user.tab()
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'update' })).toHaveFocus()
  })

  it('does not toggle a disabled chip', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Controlled onChange={handleChange} />)

    const disabled = screen.getByRole('button', { name: 'delete' })
    expect(disabled).toBeDisabled()
    await user.click(disabled)
    expect(handleChange).not.toHaveBeenCalled()
  })

  describe('inside a Field', () => {
    it('takes its name from the Field label and its description from the error', () => {
      render(
        <Field label="Scopes" step={2} error="Elige al menos uno">
          <ChipGroup options={scopes} value={[]} onValueChange={vi.fn()} />
        </Field>
      )

      const group = screen.getByRole('group', { name: 'Scopes' })
      expect(group).toHaveAccessibleDescription('Elige al menos uno')
    })

    it('takes its name from a FieldLabel too', () => {
      render(
        <Field>
          <FieldLabel>Scopes</FieldLabel>
          <ChipGroup options={scopes} value={[]} onValueChange={vi.fn()} />
        </Field>
      )

      expect(screen.getByRole('group', { name: 'Scopes' })).toBeInTheDocument()
    })

    it('keeps an explicit ariaLabel over the Field label', () => {
      render(
        <Field label="Scopes">
          <ChipGroup
            ariaLabel="Campañas"
            options={scopes}
            value={[]}
            onValueChange={vi.fn()}
          />
        </Field>
      )

      expect(
        screen.getByRole('group', { name: 'Campañas' })
      ).toBeInTheDocument()
    })

    it('disables every chip when the Field is disabled', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(
        <Field label="Scopes" disabled>
          <ChipGroup options={scopes} value={[]} onValueChange={handleChange} />
        </Field>
      )

      const chips = screen.getAllByRole('button')
      chips.forEach((chip) => expect(chip).toBeDisabled())
      await user.click(chips[0])
      expect(handleChange).not.toHaveBeenCalled()
    })
  })
})
