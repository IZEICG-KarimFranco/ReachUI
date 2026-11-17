import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardItem,
  CardMeta,
  CardTitle,
} from '@/components/ui/layout/card'

describe('Card component contract', () => {
  it('keeps the card data-slot that the e2e suites rely on while riding on the plate', () => {
    render(<Card data-testid="card" />)
    const card = screen.getByTestId('card')
    expect(card.getAttribute('data-slot')).toBe('card')
    expect(card.getAttribute('data-variant')).toBe('plate')
  })

  it('passes the pane variant through to the surface it rides on', () => {
    render(
      <Card data-testid="card" variant="pane">
        <CardItem>Latencia</CardItem>
      </Card>
    )
    expect(screen.getByTestId('card').getAttribute('data-variant')).toBe('pane')
    expect(screen.getByText('Latencia').closest('.dark')).not.toBeNull()
  })

  it('draws no dividing lines by default and lets the consumer turn them on', () => {
    const { rerender } = render(<Card data-testid="card" />)
    expect(screen.getByTestId('card').getAttribute('data-divided')).toBe(
      'false'
    )

    rerender(<Card data-testid="card" divided />)
    expect(screen.getByTestId('card').getAttribute('data-divided')).toBe('true')
  })

  it('forwards className, id, role and aria attributes', () => {
    render(
      <Card
        role="region"
        aria-label="Resumen"
        id="summary"
        className="h-full"
        style={{ minHeight: 120 }}
      />
    )
    const card = screen.getByRole('region', { name: 'Resumen' })
    expect(card.id).toBe('summary')
    expect(card.classList.contains('h-full')).toBe(true)
    expect(card.style.minHeight).toBe('120px')
  })
})

describe('CardContent centered', () => {
  it('adds no centering styles by default', () => {
    render(<CardContent>Contenido</CardContent>)
    const content = screen.getByText('Contenido')
    expect(content.className).toBe('min-w-0 p-4')
  })

  it('centers a plain text when centered and leaves min height to the consumer', () => {
    render(
      <CardContent centered className="min-h-[140px]">
        Aún no hay segmentos.
      </CardContent>
    )
    const { classList } = screen.getByText('Aún no hay segmentos.')
    expect(classList.contains('grid')).toBe(true)
    expect(classList.contains('place-items-center')).toBe(true)
    expect(classList.contains('text-center')).toBe(true)
    expect(classList.contains('min-h-[140px]')).toBe(true)
  })
})

describe('Card slots', () => {
  it('renders header, items, content and footer as direct children in order', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Segmentos</CardTitle>
        </CardHeader>
        <CardItem>Clientes VIP</CardItem>
        <CardItem>Inactivos</CardItem>
        <CardContent>Sin más segmentos</CardContent>
        <CardFooter>2 de 2</CardFooter>
      </Card>
    )
    const card = screen.getByTestId('card')
    expect(
      [...card.children].map((child) => child.getAttribute('data-slot'))
    ).toEqual([
      'card-header',
      'card-item',
      'card-item',
      'card-content',
      'card-footer',
    ])
    expect(card.children[1]).toHaveTextContent('Clientes VIP')
  })

  it('groups title, meta and description in the heading and keeps the action beside it', () => {
    render(
      <Card>
        <CardHeader data-testid="header">
          <CardHeading data-testid="heading">
            <CardTitle>Miembros</CardTitle>
            <CardMeta>5 miembros</CardMeta>
            <CardDescription>Gestiona a tu equipo.</CardDescription>
          </CardHeading>
          <button type="button">Invitar</button>
        </CardHeader>
      </Card>
    )
    expect(
      [...screen.getByTestId('header').children].map((child) =>
        child.getAttribute('data-slot')
      )
    ).toEqual(['card-heading', null])
    expect(
      [...screen.getByTestId('heading').children].map((child) =>
        child.getAttribute('data-slot')
      )
    ).toEqual(['card-title', 'card-meta', 'card-description'])
    expect(screen.getByRole('button', { name: 'Invitar' })).toBeInTheDocument()
  })

  it('renders the title as a level 3 heading unless another level is given', () => {
    const { rerender } = render(<CardTitle>Equipo</CardTitle>)
    expect(
      screen.getByRole('heading', { level: 3, name: 'Equipo' })
    ).toHaveAttribute('data-slot', 'card-title')

    rerender(<CardTitle level={2}>Equipo</CardTitle>)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Equipo' })
    ).toBeInTheDocument()
  })

  it('renders the description as a paragraph', () => {
    render(<CardDescription>Gestiona a tu equipo.</CardDescription>)
    expect(screen.getByText('Gestiona a tu equipo.').tagName).toBe('P')
  })

  it('marks a meta as mono only when asked', () => {
    const { rerender } = render(<CardMeta>7 campos</CardMeta>)
    expect(screen.getByText('7 campos')).toHaveAttribute('data-mono', 'false')

    rerender(<CardMeta mono>ORG-IZEI-CG</CardMeta>)
    expect(screen.getByText('ORG-IZEI-CG')).toHaveAttribute('data-mono', 'true')
  })

  it('keeps the legacy action slot as a plain wrapper', () => {
    render(
      <CardAction>
        <button type="button">Invitar</button>
      </CardAction>
    )
    expect(
      screen.getByRole('button', { name: 'Invitar' }).parentElement
    ).toHaveAttribute('data-slot', 'card-action')
  })

  it('forwards className, id and aria attributes on every slot', () => {
    render(
      <Card>
        <CardHeader id="header" className="font-bold">
          <CardTitle id="title">Cabecera</CardTitle>
        </CardHeader>
        <CardItem role="listitem" aria-label="Fila 1">
          Fila
        </CardItem>
        <CardContent id="content">Contenido</CardContent>
        <CardFooter id="footer">Pie</CardFooter>
      </Card>
    )
    expect(screen.getByText('Cabecera').id).toBe('title')
    expect(screen.getByText('Cabecera').parentElement?.id).toBe('header')
    expect(
      screen
        .getByText('Cabecera')
        .parentElement?.classList.contains('font-bold')
    ).toBe(true)
    expect(screen.getByRole('listitem', { name: 'Fila 1' })).toHaveTextContent(
      'Fila'
    )
    expect(screen.getByText('Contenido').id).toBe('content')
    expect(screen.getByText('Pie').id).toBe('footer')
  })

  it('lets an item hold any layout without a width limit of its own', () => {
    render(
      <Card>
        <CardItem data-testid="row" className="grid grid-cols-3">
          <span>a</span>
          <span>b</span>
          <span>c</span>
        </CardItem>
      </Card>
    )
    expect(screen.getByTestId('row').children).toHaveLength(3)
  })
})
