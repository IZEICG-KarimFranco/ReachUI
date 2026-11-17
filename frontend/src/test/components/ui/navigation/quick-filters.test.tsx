import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  QuickFilters,
  type QuickFilterOption,
} from '@/components/ui/navigation/quick-filters'

const options: QuickFilterOption[] = [
  { value: 'all', label: 'Todas' },
  { value: 'proc', label: 'En proceso', dotTone: 'proc' },
  { value: 'sent', label: 'Enviadas', disabled: true },
  { value: 'deliv', label: 'Entregadas', dotTone: 'deliv' },
]

function Controlled({
  onChange,
  initial = 'all',
}: {
  onChange?: (value: string) => void
  initial?: string
}) {
  const [value, setValue] = React.useState(initial)
  return (
    <QuickFilters
      options={options}
      value={value}
      onValueChange={(next) => {
        onChange?.(next)
        setValue(next)
      }}
    />
  )
}

describe('QuickFilters selection, keyboard and disabled contracts (R6)', () => {
  it('marks only the selected tab and keeps a single tab stop', () => {
    render(
      <QuickFilters options={options} value="all" onValueChange={vi.fn()} />
    )

    const tabs = screen.getAllByRole('radio')
    expect(tabs[0]).toHaveAttribute('aria-checked', 'true')
    expect(tabs[1]).toHaveAttribute('aria-checked', 'false')
    expect(tabs.filter((tab) => tab.tabIndex === 0)).toHaveLength(1)
  })

  it('selects a tab on click and calls onValueChange once', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Controlled onChange={handleChange} />)

    await user.click(screen.getByRole('radio', { name: 'En proceso' }))

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('proc')
  })

  it('moves selection and focus together on consecutive arrow presses, skipping disabled tabs', async () => {
    const user = userEvent.setup()
    render(<Controlled />)

    await user.tab()
    expect(screen.getByRole('radio', { name: 'Todas' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'En proceso' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'En proceso' })).toHaveAttribute(
      'aria-checked',
      'true'
    )

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Entregadas' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Entregadas' })).toHaveAttribute(
      'aria-checked',
      'true'
    )

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Todas' })).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: 'Entregadas' })).toHaveFocus()
  })

  it.each([
    ['matches no option', 'missing'],
    ['is disabled', 'sent'],
  ])('stays reachable with Tab when the value %s', async (_, initial) => {
    const user = userEvent.setup()
    render(<Controlled initial={initial} />)

    await user.tab()
    expect(screen.getByRole('radio', { name: 'Todas' })).toHaveFocus()
  })

  it('does not select a disabled tab', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Controlled onChange={handleChange} />)

    const disabledTab = screen.getByRole('radio', { name: 'Enviadas' })
    expect(disabledTab).toBeDisabled()

    await user.click(disabledTab)
    expect(handleChange).not.toHaveBeenCalled()
  })
})
