import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Inbox } from 'lucide-react'

import { Button } from '@/components/ui/actions/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyPanel,
  EmptyState,
  EmptyTitle,
} from '@/components/ui/feedback/empty'

describe('EmptyState component contract', () => {
  it('exposes the title and the description as text', () => {
    render(
      <EmptyState
        title="Sin segmentos todavía"
        description="Combina filtros de contactos y guarda el resultado."
      />
    )
    expect(screen.getByText('Sin segmentos todavía')).toBeDefined()
    expect(
      screen.getByText('Combina filtros de contactos y guarda el resultado.')
    ).toBeDefined()
  })

  it('renders only the title when description, icon and action are omitted', () => {
    const { container } = render(<EmptyState title="Sin datos" />)
    const root = container.firstElementChild
    expect(root?.getAttribute('data-slot')).toBe('empty-state')
    expect(
      root?.querySelector('[data-slot="empty-state-title"]')
    ).not.toBeNull()
    expect(
      root?.querySelector('[data-slot="empty-state-description"]')
    ).toBeNull()
    expect(root?.querySelector('[data-slot="empty-state-icon"]')).toBeNull()
    expect(root?.querySelector('[data-slot="empty-state-action"]')).toBeNull()
  })

  it('does not leak the title prop as a native tooltip on the root', () => {
    const { container } = render(<EmptyState title="Sin datos" />)
    expect(container.firstElementChild?.getAttribute('title')).toBeNull()
  })

  it('hides the icon from assistive tech', () => {
    const { container } = render(<EmptyState title="Sin datos" icon={Inbox} />)
    const svg = container.querySelector('[data-slot="empty-state-icon"] svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('renders the action after the description and lets it respond to a click', () => {
    const onCreate = vi.fn()
    render(
      <EmptyState
        title="Sin segmentos todavía"
        description="Combina filtros."
        action={<Button onClick={onCreate}>Crear segmento</Button>}
      />
    )
    const action = screen.getByRole('button', { name: 'Crear segmento' })
    const description = screen.getByText('Combina filtros.')
    expect(
      description.compareDocumentPosition(action) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    fireEvent.click(action)
    expect(onCreate).toHaveBeenCalledTimes(1)
  })

  it('is plain by default and marks the dashed frame with bordered', () => {
    const { rerender, container } = render(<EmptyState title="Sin datos" />)
    expect(container.firstElementChild?.getAttribute('data-bordered')).toBe(
      'false'
    )
    rerender(<EmptyState title="Sin datos" bordered />)
    expect(container.firstElementChild?.getAttribute('data-bordered')).toBe(
      'true'
    )
  })

  it('forwards className, attributes and data-slot to the root', () => {
    render(
      <EmptyState
        title="Sin datos"
        id="segments-empty"
        data-testid="empty"
        className="min-h-35"
      />
    )
    const root = screen.getByTestId('empty')
    expect(root.id).toBe('segments-empty')
    expect(root.getAttribute('data-slot')).toBe('empty-state')
    expect(root.classList.contains('min-h-35')).toBe(true)
  })

  it('lets className override the default minimum height', () => {
    render(
      <EmptyState title="Sin datos" data-testid="empty" className="min-h-35" />
    )
    const root = screen.getByTestId('empty')
    expect(root.classList.contains('min-h-35')).toBe(true)
    expect(root.classList.contains('min-h-30')).toBe(false)
  })

  it('requires the title prop at compile time', () => {
    const withoutTitle = () => (
      // @ts-expect-error title is required
      <EmptyState />
    )
    expect(withoutTitle).toBeTypeOf('function')
  })

  it('does not accept children: extra content goes in action', () => {
    render(
      // @ts-expect-error EmptyState no admite children
      <EmptyState title="Sin datos">
        <a href="/help">Ayuda</a>
      </EmptyState>
    )
    expect(screen.queryByText('Ayuda')).toBeNull()
  })
})

describe('EmptyPanel', () => {
  it('wraps an EmptyState with the title, meta and footer', () => {
    render(
      <EmptyPanel title="Segmentos" meta="7 días" footer="Muestra">
        <EmptyState title="Sin segmentos" />
      </EmptyPanel>
    )
    expect(screen.getByText('Segmentos')).toBeDefined()
    expect(screen.getByText('7 días')).toBeDefined()
    expect(screen.getByText('Sin segmentos')).toBeDefined()
    expect(screen.getByText('Muestra')).toBeDefined()
  })

  it('omits meta and footer when they are not given', () => {
    const { container } = render(
      <EmptyPanel title="Segmentos">
        <EmptyState title="Sin segmentos" />
      </EmptyPanel>
    )
    expect(container.querySelector('[data-slot="card-footer"]')).toBeNull()
    expect(
      container.querySelector('[data-slot="card-header"]')?.children
    ).toHaveLength(1)
  })
})

describe('Empty compound slots (legacy)', () => {
  it('still renders title and description for the existing consumers', () => {
    render(
      <Empty data-testid="legacy-empty">
        <EmptyHeader>
          <EmptyTitle>Sin plantillas</EmptyTitle>
          <EmptyDescription>Crea la primera plantilla.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
    expect(screen.getByTestId('legacy-empty').getAttribute('data-slot')).toBe(
      'empty'
    )
    expect(screen.getByText('Sin plantillas')).toBeDefined()
    expect(screen.getByText('Crea la primera plantilla.')).toBeDefined()
  })
})
