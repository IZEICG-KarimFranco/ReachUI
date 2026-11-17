import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Button } from '@/components/ui/actions/button'
import { PageHeader, SectionHeading } from '@/components/ui/layout/page-header'

describe('PageHeader', () => {
  it('renders the title as the level 1 heading', () => {
    render(<PageHeader title="Plantillas" />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Plantillas' })
    ).toBeInTheDocument()
  })

  it('describes the heading with the description', () => {
    render(
      <PageHeader
        title="Plantillas"
        description="Administra las plantillas aprobadas por Meta."
      />
    )
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAccessibleDescription(
      'Administra las plantillas aprobadas por Meta.'
    )
  })

  it('renders no description element when none is given', () => {
    const { container } = render(<PageHeader title="Plantillas" />)
    expect(container.querySelector('p')).toBeNull()
    expect(screen.getByRole('heading', { level: 1 })).not.toHaveAttribute(
      'aria-describedby'
    )
  })

  it('exposes the actions by role', () => {
    render(
      <PageHeader
        title="Plantillas"
        actions={
          <>
            <Button variant="secondary" asChild>
              <a href="/import">Importar</a>
            </Button>
            <Button>Nueva plantilla</Button>
          </>
        }
      />
    )
    expect(screen.getByRole('link', { name: 'Importar' })).toHaveAttribute(
      'href',
      '/import'
    )
    expect(
      screen.getByRole('button', { name: 'Nueva plantilla' })
    ).toBeInTheDocument()
  })

  it('renders every action when there are three', () => {
    render(
      <PageHeader
        title="Calendario"
        actions={
          <>
            <Button>Hoy</Button>
            <Button>Actualizar</Button>
            <Button>Filtros</Button>
          </>
        }
      />
    )
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
      'Hoy',
      'Actualizar',
      'Filtros',
    ])
  })

  it('renders no actions container without actions', () => {
    const { container } = render(<PageHeader title="Plantillas" />)
    expect(
      container.querySelector('[data-slot="page-header-actions"]')
    ).toBeNull()
  })

  it('announces the status as text with its tone', () => {
    render(
      <PageHeader
        title="Izei"
        description="slug: izei"
        status={{ label: 'Activa', tone: 'success' }}
      />
    )
    const status = screen.getByText('Activa')
    expect(status.closest('[data-slot="status-label"]')).toHaveAttribute(
      'data-tone',
      'success'
    )
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toHaveAccessibleDescription('slug: izei')
  })

  it('shows the status when there is no description', () => {
    render(<PageHeader title="Supervisión" status={{ label: 'En vivo' }} />)
    expect(screen.getByText('En vivo')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).not.toHaveAttribute(
      'aria-describedby'
    )
  })

  it('keeps very long titles and descriptions whole', () => {
    const title = 'Plantillas '.repeat(30).trim()
    const description = 'Descripción larga. '.repeat(20).trim()
    render(<PageHeader title={title} description={description} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title)
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('forwards extra props to the root', () => {
    render(
      <PageHeader title="Plantillas" data-testid="header" className="mb-8" />
    )
    expect(screen.getByTestId('header')).toHaveClass('mb-8')
  })
})

describe('SectionHeading', () => {
  it('renders a level 2 heading by default', () => {
    render(<SectionHeading title="Atajos del equipo" />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Atajos del equipo' })
    ).toBeInTheDocument()
  })

  it('renders the requested heading level', () => {
    render(<SectionHeading title="Detalle" level={3} />)
    expect(
      screen.getByRole('heading', { level: 3, name: 'Detalle' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull()
  })

  it('describes the heading with the description', () => {
    render(
      <SectionHeading
        title="Organizaciones"
        description="Busca y abre una organización."
      />
    )
    expect(
      screen.getByRole('heading', { level: 2 })
    ).toHaveAccessibleDescription('Busca y abre una organización.')
  })

  it('renders the meta text and the actions by role', () => {
    render(
      <SectionHeading
        title="Campañas"
        meta="9 campañas"
        actions={<Button>Seleccionar</Button>}
      />
    )
    expect(screen.getByText('9 campañas')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Seleccionar' })
    ).toBeInTheDocument()
  })

  it('renders no aside container without meta or actions', () => {
    const { container } = render(<SectionHeading title="Campañas" />)
    expect(
      container.querySelector('[data-slot="section-heading-aside"]')
    ).toBeNull()
  })

  it('marks whether the bottom line is drawn', () => {
    const { container, rerender } = render(<SectionHeading title="Campañas" />)
    const root = () => container.querySelector('[data-slot="section-heading"]')
    expect(root()).toHaveAttribute('data-bordered', 'false')
    rerender(<SectionHeading title="Campañas" bordered />)
    expect(root()).toHaveAttribute('data-bordered', 'true')
  })
})
