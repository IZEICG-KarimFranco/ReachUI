import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Separator } from '@/components/ui/layout/separator'

describe('Separator component contract', () => {
  it('is decorative by default and does not appear as a separator role', () => {
    render(<Separator data-testid="line" />)
    expect(screen.queryByRole('separator')).toBeNull()
    expect(screen.getByTestId('line').getAttribute('role')).toBe('none')
  })

  it('exposes a separator role when it is not decorative', () => {
    render(<Separator decorative={false} />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('announces vertical orientation to assistive tech', () => {
    render(<Separator decorative={false} orientation="vertical" />)
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical'
    )
  })

  it('is the full variant by default', () => {
    render(<Separator data-testid="line" />)
    const line = screen.getByTestId('line')
    expect(line.getAttribute('data-slot')).toBe('separator')
    expect(line.getAttribute('data-variant')).toBe('full')
    expect(line.getAttribute('data-orientation')).toBe('horizontal')
  })

  it('switches to the inset variant for horizontal and vertical lines', () => {
    render(
      <>
        <Separator data-testid="horizontal" variant="inset" />
        <Separator
          data-testid="vertical"
          variant="inset"
          orientation="vertical"
        />
      </>
    )
    expect(screen.getByTestId('horizontal').getAttribute('data-variant')).toBe(
      'inset'
    )
    expect(screen.getByTestId('vertical').getAttribute('data-variant')).toBe(
      'inset'
    )
    expect(
      screen.getByTestId('vertical').getAttribute('data-orientation')
    ).toBe('vertical')
  })

  it('forwards className, id and style', () => {
    render(
      <Separator
        data-testid="line"
        id="plate-divider"
        className="my-2"
        style={{ opacity: 0.5 }}
      />
    )
    const line = screen.getByTestId('line')
    expect(line.id).toBe('plate-divider')
    expect(line.style.opacity).toBe('0.5')
    expect(line.classList.contains('my-2')).toBe(true)
  })
})
