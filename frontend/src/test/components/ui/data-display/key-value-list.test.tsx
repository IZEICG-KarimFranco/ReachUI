import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  KeyValueList,
  type KeyValueItem,
} from '@/components/ui/data-display/key-value-list'

describe('KeyValueList component contract and behaviors (R6)', () => {
  const items: KeyValueItem[] = [
    { label: 'Audiencia', value: 'Clientes activos' },
    { label: 'ID de campaña', value: 'CMP-0446', mono: true },
  ]

  it('renders pairs of key-value with definition list semantics and data attributes', () => {
    const { container } = render(<KeyValueList items={items} />)

    const dl = container.querySelector('dl')
    expect(dl).toBeInTheDocument()

    expect(screen.getByText('Audiencia')).toBeInTheDocument()
    expect(screen.getByText('ID de campaña')).toBeInTheDocument()

    const activeClients = screen.getByText('Clientes activos')
    expect(activeClients).toBeInTheDocument()
    expect(activeClients).not.toHaveAttribute('data-mono')

    const monoVal = screen.getByText('CMP-0446')
    expect(monoVal).toBeInTheDocument()
    expect(monoVal).toHaveAttribute('data-mono', 'true')
  })

  it('empty: shows the localized message by default and the whole emptyState object when given', () => {
    const { container, rerender } = render(<KeyValueList items={[]} />)
    expect(screen.getByText('common.no_results')).toBeInTheDocument()
    expect(container.querySelector('dl')).not.toBeInTheDocument()

    rerender(
      <KeyValueList
        items={[]}
        emptyState={{ title: 'Sin datos', description: 'Aún no hay detalles.' }}
      />
    )
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
    expect(screen.getByText('Aún no hay detalles.')).toBeInTheDocument()
  })

  it('keeps long labels and values accessible through the dt and dd text', () => {
    const longLabel = 'Audiencia segmentada por comportamiento de compra'
    const longValue = 'Clientes activos del tercer trimestre en todo el país'
    render(<KeyValueList items={[{ label: longLabel, value: longValue }]} />)

    expect(screen.getByText(longLabel).tagName).toBe('DT')
    expect(screen.getByText(longValue).tagName).toBe('DD')
  })
})
