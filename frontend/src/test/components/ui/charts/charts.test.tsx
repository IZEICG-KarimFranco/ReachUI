import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { BarChart } from '@/components/ui/charts/bar-chart'
import { DonutChart } from '@/components/ui/charts/donut-chart'
import { Meter } from '@/components/ui/charts/meter'
import type { ChartSegment } from '@/types/charts'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}))

const delivery: ChartSegment[] = [
  { key: 'delivered', label: 'Delivered', value: 88, tone: 'success' },
  { key: 'failed', label: 'Failed', value: 3, tone: 'error' },
  { key: 'processing', label: 'Processing', value: 5, tone: 'live' },
  { key: 'pending', label: 'Pending', value: 4, tone: 'neutral' },
]

const empty: ChartSegment[] = delivery.map((s) => ({ ...s, value: 0 }))

describe('Meter', () => {
  it('muestra el título y la leyenda con porcentajes', () => {
    render(<Meter label="Delivery — CMP-0446" segments={delivery} />)

    expect(
      screen.getByRole('figure', { name: 'Delivery — CMP-0446' })
    ).toBeDefined()
    const legend = screen.getByRole('list')
    expect(within(legend).getByText('Delivered')).toBeDefined()
    expect(within(legend).getByText('88%')).toBeDefined()
    expect(within(legend).getByText('3%')).toBeDefined()
  })

  it('muestra el estado vacío sin inventar segmentos', () => {
    render(
      <Meter label="CMP-0450" segments={empty} emptyLabel="No events yet" />
    )
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('No events yet')).toBeDefined()
  })

  it('anuncia la carga y el error', () => {
    const { rerender } = render(
      <Meter label="Delivery" segments={delivery} status="loading" />
    )
    expect(screen.getByRole('status').textContent).toContain('common.loading')

    rerender(<Meter label="Delivery" segments={delivery} status="error" />)
    expect(screen.getByText('charts.error')).toBeDefined()
  })

  it('oculta la leyenda visual pero conserva el resumen accesible', () => {
    render(<Meter label="Delivery" segments={delivery} showLegend={false} />)
    expect(screen.getByRole('list').className).toContain('sr-only')
  })

  it('en modo decorativo queda fuera del árbol accesible', () => {
    const { container } = render(
      <Meter label="Errors" segments={delivery} decorative />
    )
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe(
      'true'
    )
    expect(screen.queryByRole('list')).toBeNull()
  })
})

describe('BarChart', () => {
  it('muestra cada fila con su valor y porcentaje como texto', () => {
    render(
      <BarChart
        label="Delivery breakdown"
        rows={[
          {
            key: 'delivered',
            label: 'Delivered',
            value: 4611,
            tone: 'success',
          },
          { key: 'failed', label: 'Failed', value: 97, tone: 'error' },
        ]}
        base={4818}
      />
    )

    const rows = screen.getAllByRole('listitem')
    expect(rows).toHaveLength(2)
    expect(within(rows[0]).getByText('4,611')).toBeDefined()
    expect(within(rows[0]).getByText('96%')).toBeDefined()
    expect(within(rows[1]).getByText('2%')).toBeDefined()
  })

  it('muestra el estado vacío', () => {
    render(<BarChart label="Breakdown" rows={empty} emptyLabel="Nothing yet" />)
    expect(screen.getByText('Nothing yet')).toBeDefined()
    expect(screen.queryByRole('list')).toBeNull()
  })
})

describe('DonutChart', () => {
  it('expone un segmento accesible por estado con datos', () => {
    render(<DonutChart label="Summary" segments={delivery} />)

    expect(screen.getByRole('group', { name: 'Summary' })).toBeDefined()
    expect(screen.getAllByRole('button')).toHaveLength(4)
    expect(
      screen.getByRole('button', { name: 'Delivered: 88 (88%)' })
    ).toBeDefined()
  })

  it('fija un segmento con clic y muestra su valor al centro', () => {
    render(<DonutChart label="Summary" segments={delivery} />)

    const failed = screen.getByRole('button', { name: /Failed/ })
    fireEvent.click(failed)
    expect(failed.getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByText('Failed · 3%')).toBeDefined()

    fireEvent.click(failed)
    expect(failed.getAttribute('aria-pressed')).toBe('false')
  })

  it('previsualiza al pasar el puntero o enfocar sin fijar', () => {
    render(<DonutChart label="Summary" segments={delivery} />)

    const pending = screen.getByRole('button', { name: /Pending/ })
    fireEvent.focus(pending)
    expect(screen.getByText('Pending · 4%')).toBeDefined()
    expect(pending.getAttribute('aria-pressed')).toBe('false')
  })

  it('el tamaño compacto es estático y muestra el valor central', () => {
    render(
      <DonutChart
        label="Read rate"
        size="compact"
        centerValue="72%"
        segments={[
          { key: 'read', label: 'Read', value: 72, tone: 'signal' },
          { key: 'rest', label: 'Remaining', value: 28, tone: 'neutral' },
        ]}
      />
    )
    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(screen.getByRole('figure', { name: 'Read rate' })).toBeDefined()
    expect(screen.getByRole('img', { name: '72%' })).toBeDefined()
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('dibuja los segmentos minoritarios aunque sean muy pequeños', () => {
    const { container } = render(
      <DonutChart
        label="Summary"
        segments={[
          { key: 'major', label: 'Major', value: 999, tone: 'success' },
          { key: 'minor', label: 'Minor', value: 1, tone: 'error' },
        ]}
      />
    )
    expect(container.querySelectorAll('svg path')).toHaveLength(2)
    expect(container.querySelector('svg circle')).toBeNull()
    expect(screen.getByRole('button', { name: /Minor/ })).toBeDefined()
  })

  it('muestra el estado vacío sin segmentos interactivos', () => {
    render(<DonutChart label="Summary" segments={empty} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(
      screen.getAllByText('contacts.panel.no_data').length
    ).toBeGreaterThan(0)
  })

  it('en modo decorativo no expone figura ni leyenda', () => {
    const { container } = render(
      <DonutChart label="Ring" segments={delivery} size="compact" decorative />
    )
    expect(container.firstElementChild?.tagName).toBe('SPAN')
    expect(screen.queryByRole('figure')).toBeNull()
    expect(screen.queryByRole('list')).toBeNull()
  })
})
