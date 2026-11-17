import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChevronDown, Inbox, Plug, User } from 'lucide-react'

import { Badge } from '@/components/ui/feedback/badge'
import { IconLabel } from '@/components/ui/data-display/icon-label'
import { StatusDot } from '@/components/ui/feedback/status-dot'

const slot = (root: Element, name: string) =>
  root.querySelector(`[data-slot="${name}"]`)

describe('IconLabel', () => {
  it('exposes the text and hides the icon from assistive tech', () => {
    const { container } = render(<IconLabel icon={User}>Perfil</IconLabel>)
    const root = container.firstElementChild as HTMLElement
    expect(screen.getByText('Perfil')).toBeInTheDocument()
    expect(slot(root, 'icon-label-icon')).toHaveAttribute('aria-hidden', 'true')
    expect(slot(root, 'icon-label-icon')?.querySelector('svg')).not.toBeNull()
    expect(root).toHaveTextContent('Perfil')
  })

  it('hides a node icon such as a status dot', () => {
    const { container } = render(
      <IconLabel icon={<StatusDot tone="success" />}>Disponible</IconLabel>
    )
    const icon = slot(container, 'icon-label-icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon?.querySelector('[data-slot="status-dot"]')).not.toBeNull()
  })

  it('is decorative without text and without aria-label', () => {
    render(<IconLabel icon={Plug} />)
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('has an accessible name without text when aria-label is given', () => {
    render(<IconLabel icon={Plug} aria-label="Integraciones" />)
    expect(
      screen.getByRole('img', { name: 'Integraciones' })
    ).toBeInTheDocument()
  })

  it('renders the child element as root with asChild, without duplicating it', () => {
    const { container } = render(
      <IconLabel icon={Inbox} asChild className="custom">
        <a href="/inbox">Bandeja</a>
      </IconLabel>
    )
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    const link = links[0]
    expect(link).toHaveAccessibleName('Bandeja')
    expect(link).toHaveAttribute('href', '/inbox')
    expect(link).toHaveAttribute('data-slot', 'icon-label')
    expect(container.firstElementChild).toBe(link)
    expect(slot(link, 'icon-label-icon')).not.toBeNull()
    expect(screen.getAllByText('Bandeja')).toHaveLength(1)
  })

  it('keeps the child focusable and named by aria-label with asChild', () => {
    render(
      <IconLabel icon={Inbox} asChild aria-label="Bandeja">
        <button type="button" />
      </IconLabel>
    )
    const button = screen.getByRole('button', { name: 'Bandeja' })
    button.focus()
    expect(button).toHaveFocus()
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('wraps long text in a truncating text slot when asked', () => {
    const long = 'campaña-reactivacion-clientes-inactivos-octubre.pdf'
    const { container } = render(
      <IconLabel icon={Plug} truncate>
        {long}
      </IconLabel>
    )
    const text = slot(container, 'icon-label-text')
    expect(text).toHaveTextContent(long)
    expect(text).toHaveClass('truncate')
  })

  it('places the icon after the text with iconPosition end', () => {
    const { container } = render(
      <IconLabel
        icon={<StatusDot tone="current" size="sm" />}
        iconPosition="end"
      >
        Entregado
      </IconLabel>
    )
    const [first, second] = Array.from(
      container.firstElementChild?.children ?? []
    )
    expect(first).toHaveAttribute('data-slot', 'icon-label-text')
    expect(second).toHaveAttribute('data-slot', 'icon-label-icon')
  })

  it('renders trailing content after the text', () => {
    const { container } = render(
      <IconLabel icon={Inbox} trailing={<Badge>12</Badge>}>
        Bandeja
      </IconLabel>
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.lastElementChild).toHaveAttribute(
      'data-slot',
      'icon-label-trailing'
    )
    expect(root.lastElementChild).toHaveTextContent('12')
  })

  it('renders trailing content inside the child with asChild', () => {
    render(
      <IconLabel icon={<StatusDot />} asChild trailing={<ChevronDown />}>
        <button type="button">Disponible</button>
      </IconLabel>
    )
    const button = screen.getByRole('button', { name: 'Disponible' })
    expect(slot(button, 'icon-label-trailing')).not.toBeNull()
  })

  it('reports size and layout through data attributes', () => {
    const { container } = render(
      <IconLabel icon={Inbox} size="lg" layout="stacked">
        Bandeja
      </IconLabel>
    )
    const root = container.firstElementChild
    expect(root).toHaveAttribute('data-size', 'lg')
    expect(root).toHaveAttribute('data-layout', 'stacked')
  })

  it('defaults to md and inline', () => {
    const { container } = render(<IconLabel icon={Inbox}>Bandeja</IconLabel>)
    const root = container.firstElementChild
    expect(root).toHaveAttribute('data-size', 'md')
    expect(root).toHaveAttribute('data-layout', 'inline')
  })

  it('omits the trailing slot when trailing is false', () => {
    const { container } = render(
      <IconLabel icon={Inbox} trailing={false}>
        Bandeja
      </IconLabel>
    )
    expect(slot(container, 'icon-label-trailing')).toBeNull()
  })
})
