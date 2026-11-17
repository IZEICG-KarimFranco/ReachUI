import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/feedback/badge'

const functionalVariants = [
  'outline',
  'default',
  'info',
  'signal',
  'success',
  'warning',
  'error',
] as const
const legacyVariants = ['secondary', 'destructive'] as const

describe('Badge component contract', () => {
  it('renders children inside a span with data-slot="badge"', () => {
    render(<Badge>SMS</Badge>)
    const badge = screen.getByText('SMS')
    expect(badge.tagName).toBe('SPAN')
    expect(badge.getAttribute('data-slot')).toBe('badge')
  })

  it.each(functionalVariants)('renders functional variant %s', (variant) => {
    render(<Badge variant={variant}>Tag</Badge>)
    expect(screen.getByText('Tag')).toBeDefined()
  })

  it.each(legacyVariants)('keeps legacy variant %s working', (variant) => {
    render(<Badge variant={variant}>Legacy</Badge>)
    expect(screen.getByText('Legacy')).toBeDefined()
  })

  it('uses the default variant when none is given', () => {
    render(
      <>
        <Badge>Sin variante</Badge>
        <Badge variant="default">Default</Badge>
      </>
    )
    expect(screen.getByText('Sin variante').className).toBe(
      screen.getByText('Default').className
    )
  })

  it('renders the child element when asChild is set', () => {
    render(
      <Badge asChild>
        <a href="/lists">LISTA</a>
      </Badge>
    )
    const link = screen.getByRole('link', { name: 'LISTA' })
    expect(link.getAttribute('data-slot')).toBe('badge')
  })

  it('merges a custom className', () => {
    render(<Badge className="uppercase">Tag</Badge>)
    expect(screen.getByText('Tag').className).toContain('uppercase')
  })

  it.each([
    ['secondary', 'bg-paper-secondary'],
    ['destructive', 'bg-error/20'],
  ] as const)(
    'paints the legacy %s variant with Reach tokens only',
    (variant, expected) => {
      render(<Badge variant={variant}>Tag</Badge>)
      const className = screen.getByText('Tag').className
      expect(className).toContain(expected)
      expect(className).not.toMatch(
        /\b(bg-secondary|secondary-foreground|destructive)\b/
      )
    }
  )
})
