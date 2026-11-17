import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatStrip } from '@/components/ui/data-display/stat-strip'

describe('StatStrip component contract and behaviors (R6)', () => {
  it('renders items with values, neutral delta, and statusTone', () => {
    const { container } = render(
      <StatStrip
        items={[
          {
            label: 'Entregados',
            value: '4,611',
            delta: '95.7%',
            deltaTone: 'neutral',
            deltaLabel: 'del total',
            statusTone: 'success',
          },
          {
            label: 'Fallidos',
            value: '97',
            delta: '2.0%',
            deltaTone: 'warn',
            deltaLabel: 'reintentos',
            statusTone: 'error',
          },
        ]}
      />
    )

    expect(
      screen.getByRole('region', {
        name: /estadísticas y métricas|stats_metrics/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Entregados')).toBeInTheDocument()
    expect(screen.getByText('4,611')).toBeInTheDocument()
    expect(screen.getByText('95.7%')).toBeInTheDocument()
    expect(screen.getByText('del total')).toBeInTheDocument()

    const labels = container.querySelectorAll('[data-slot="status-label"]')
    expect(labels.length).toBe(2)
    expect(labels[0]).toHaveAttribute('data-tone', 'success')
    expect(labels[1]).toHaveAttribute('data-tone', 'error')
  })

  it('renders the unit next to the value', () => {
    render(
      <StatStrip
        items={[{ label: 'Tasa de entrega', value: '95.7', unit: '%' }]}
      />
    )

    expect(screen.getByText('95.7')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('loading: marks the region as busy, shows an accessible status and hides the data', () => {
    render(
      <StatStrip
        loading
        loadingItems={3}
        items={[{ label: 'Enviados', value: '4,820' }]}
      />
    )

    expect(screen.getByRole('region')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('common.loading')
    expect(screen.queryByText('Enviados')).not.toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(9)
  })

  it('empty: shows the localized message by default and the whole emptyState object when given', () => {
    const { rerender } = render(<StatStrip items={[]} />)
    expect(screen.getByText('common.no_results')).toBeInTheDocument()

    rerender(
      <StatStrip
        items={[]}
        emptyState={{
          title: 'Sin métricas',
          description: 'Aún no hay envíos.',
        }}
      />
    )
    expect(screen.getByText('Sin métricas')).toBeInTheDocument()
    expect(screen.getByText('Aún no hay envíos.')).toBeInTheDocument()
  })
})
