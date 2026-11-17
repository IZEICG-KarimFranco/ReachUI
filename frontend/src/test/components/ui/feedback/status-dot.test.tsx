import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusDot } from '@/components/ui/feedback/status-dot'

const tones = [
  'success',
  'live',
  'error',
  'info',
  'signal',
  'neutral',
  'current',
] as const
const sizes = ['sm', 'md'] as const

describe('StatusDot component contract', () => {
  it('renders a single decorative dot when there are no children', () => {
    const { container } = render(<StatusDot />)
    const dot = container.firstElementChild
    expect(dot?.getAttribute('data-slot')).toBe('status-dot')
    expect(dot?.getAttribute('aria-hidden')).toBe('true')
    expect(dot?.childElementCount).toBe(0)
  })

  it('exposes an accessible name when aria-label is provided', () => {
    render(<StatusDot aria-label="Activo" tone="success" />)
    const dot = screen.getByRole('img', { name: 'Activo' })
    expect(dot.getAttribute('aria-hidden')).toBeNull()
  })

  it('renders the text with a hidden dot when children are given', () => {
    const { container } = render(
      <StatusDot tone="signal">Organización</StatusDot>
    )
    expect(screen.getByText('Organización')).toBeDefined()
    const indicator = container.querySelector(
      '[data-slot="status-dot-indicator"]'
    )
    expect(indicator?.getAttribute('aria-hidden')).toBe('true')
    expect(indicator?.getAttribute('data-tone')).toBe('signal')
  })

  it('always places the dot before the text', () => {
    const { container } = render(<StatusDot>Audiencia válida</StatusDot>)
    const root = container.firstElementChild
    expect(root?.firstElementChild?.getAttribute('data-slot')).toBe(
      'status-dot-indicator'
    )
    expect(root?.lastChild?.textContent).toBe('Audiencia válida')
  })

  it.each(tones)('renders tone %s', (tone) => {
    const { container } = render(<StatusDot tone={tone} />)
    expect(container.firstElementChild?.getAttribute('data-tone')).toBe(tone)
  })

  it.each(sizes)('renders size %s', (size) => {
    const { container } = render(<StatusDot size={size} />)
    expect(container.firstElementChild?.getAttribute('data-size')).toBe(size)
  })

  it('defaults to neutral tone and md size', () => {
    const { container } = render(<StatusDot />)
    const dot = container.firstElementChild
    expect(dot?.getAttribute('data-tone')).toBe('neutral')
    expect(dot?.getAttribute('data-size')).toBe('md')
  })

  it('merges a custom className on the root element', () => {
    const { container } = render(<StatusDot className="ml-2">Texto</StatusDot>)
    expect(container.firstElementChild?.className).toContain('ml-2')
  })
})
