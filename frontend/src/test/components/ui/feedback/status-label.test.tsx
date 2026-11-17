import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusLabel } from '@/components/ui/feedback/status-label'

const tones = ['live', 'success', 'error', 'info', 'signal', 'neutral'] as const
const sizes = ['default', 'inline'] as const

describe('StatusLabel component contract', () => {
  it('renders the text inside a span with data-slot="status-label"', () => {
    render(<StatusLabel>Aprobada</StatusLabel>)
    const label = screen.getByText('Aprobada')
    expect(label.tagName).toBe('SPAN')
    expect(label.getAttribute('data-slot')).toBe('status-label')
  })

  it('keeps the text as the accessible content and hides the dot', () => {
    const { container } = render(
      <StatusLabel tone="error">Rechazada</StatusLabel>
    )
    const dot = container.querySelector('[data-slot="status-dot"]')
    expect(dot?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByText('Rechazada')).toBeDefined()
  })

  it.each(tones)('renders tone %s', (tone) => {
    render(<StatusLabel tone={tone}>Estado</StatusLabel>)
    expect(screen.getByText('Estado').getAttribute('data-tone')).toBe(tone)
  })

  it.each(sizes)('renders size %s', (size) => {
    render(<StatusLabel size={size}>Estado</StatusLabel>)
    expect(screen.getByText('Estado').getAttribute('data-size')).toBe(size)
  })

  it('defaults to neutral tone, default size and dot on the right', () => {
    const { container } = render(<StatusLabel>Borrador</StatusLabel>)
    const label = screen.getByText('Borrador')
    expect(label.getAttribute('data-tone')).toBe('neutral')
    expect(label.getAttribute('data-size')).toBe('default')
    expect(label.lastElementChild).toBe(
      container.querySelector('[data-slot="status-dot"]')
    )
  })

  it('places the dot before the text when dotPosition is left', () => {
    render(<StatusLabel dotPosition="left">Activo</StatusLabel>)
    const label = screen.getByText('Activo')
    expect(label.firstElementChild?.getAttribute('data-slot')).toBe(
      'status-dot'
    )
  })

  it('places the dot after the text when dotPosition is right', () => {
    render(<StatusLabel dotPosition="right">Activo</StatusLabel>)
    const label = screen.getByText('Activo')
    expect(label.lastElementChild?.getAttribute('data-slot')).toBe('status-dot')
    expect(label.firstElementChild).toBe(label.lastElementChild)
  })

  it('animates the dot only when pulse is set', () => {
    const { container, rerender } = render(
      <StatusLabel>Procesando</StatusLabel>
    )
    const dot = () => container.querySelector('[data-slot="status-dot"]')
    expect(dot()?.getAttribute('data-pulse')).toBe('false')
    expect(container.querySelector('style')).toBeNull()

    rerender(<StatusLabel pulse>Procesando</StatusLabel>)
    expect(dot()?.getAttribute('data-pulse')).toBe('true')
    expect(dot()?.className).toContain('animate-status-blink')
    expect(dot()?.className).toContain('motion-reduce:animate-none')
    expect(container.querySelector('style')).toBeNull()
  })

  it('merges a custom className', () => {
    render(<StatusLabel className="uppercase">Estado</StatusLabel>)
    expect(screen.getByText('Estado').className).toContain('uppercase')
  })
})
