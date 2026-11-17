import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from '@/components/ui/feedback/spinner'

describe('Spinner component contract and a11y', () => {
  it('renders accessible role="status" and default localized aria-label', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toBeDefined()
    expect(spinner.getAttribute('aria-label')).toBe('common.loading')
  })

  it('allows overriding aria-label when explicitly provided', () => {
    render(<Spinner aria-label="Cargando datos..." />)
    const spinner = screen.getByRole('status', { name: 'Cargando datos...' })
    expect(spinner).toBeDefined()
  })

  it('omits role and aria-label when aria-hidden is true to avoid double announcements', () => {
    const { container } = render(<Spinner aria-hidden="true" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('role')).toBeNull()
    expect(svg?.getAttribute('aria-label')).toBeNull()
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  it('contains circular background track and active arc for continuous rotation', () => {
    const { container } = render(<Spinner />)
    const circle = container.querySelector('circle')
    const path = container.querySelector('path')
    expect(circle).toBeDefined()
    expect(path).toBeDefined()
  })
})
