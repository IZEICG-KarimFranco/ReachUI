import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { DatePicker } from '@/components/ui/inputs/date-picker'

describe('DatePicker component', () => {
  it('renders native date input with correct attributes and value', () => {
    const { container } = render(
      <DatePicker type="date" value="2026-05-20" min="2026-01-01" />
    )
    const input = container.querySelector(
      'input[type="date"]'
    ) as HTMLInputElement
    expect(input).toBeDefined()
    expect(input.value).toBe('2026-05-20')
    expect(input.min).toBe('2026-01-01')
  })

  it('handles value change via onValueChange', () => {
    const handleValueChange = vi.fn()
    const { container } = render(
      <DatePicker type="time" onValueChange={handleValueChange} />
    )
    const input = container.querySelector(
      'input[type="time"]'
    ) as HTMLInputElement
    fireEvent.change(input, { target: { value: '14:30' } })
    expect(handleValueChange).toHaveBeenCalledWith('14:30')
  })
})
