import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchX } from 'lucide-react'
import { RecordList, RecordRow } from '@/components/ui/data-display/record-list'

describe('RecordList list semantics and states (R6)', () => {
  it('exposes the rows as a list with one list item per row', () => {
    render(
      <RecordList title="Contactos">
        <RecordRow title="Adrián Martínez" />
        <RecordRow title="Lucía Fernández" />
      </RecordList>
    )

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders the empty state when conditional children evaluate to false', () => {
    const showRow = false
    render(
      <RecordList emptyState={{ title: 'No hay registros disponibles' }}>
        {showRow && <RecordRow title="Oculto" />}
      </RecordList>
    )

    expect(screen.getByText('No hay registros disponibles')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('falls back to the localized empty message when none is given', () => {
    render(<RecordList />)

    expect(screen.getByText('common.no_results')).toBeInTheDocument()
  })

  it('forwards the whole emptyState object to the EmptyState (description, icon, action, className, bordered)', () => {
    render(
      <RecordList
        emptyState={{
          title: 'Sin resultados',
          description: 'Ajusta los filtros.',
          icon: SearchX,
          action: <button type="button">Limpiar filtros</button>,
          className: 'min-h-40',
          bordered: true,
        }}
      />
    )

    expect(screen.getByText('Sin resultados')).toBeInTheDocument()
    expect(screen.getByText('Ajusta los filtros.')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Limpiar filtros' })
    ).toBeInTheDocument()

    const emptyState = document.querySelector('[data-slot="empty-state"]')
    expect(emptyState).toHaveAttribute('data-bordered', 'true')
    expect(
      document.querySelector('[data-slot="empty-state-icon"]')
    ).toBeInTheDocument()
  })

  it('shows loading placeholders as a busy list with an accessible status', () => {
    render(
      <RecordList loading loadingRows={2} emptyState={{ title: 'Vacío' }} />
    )

    expect(screen.getByRole('list')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getAllByText('common.loading')).toHaveLength(2)
    expect(screen.queryByText('Vacío')).not.toBeInTheDocument()
  })

  it('shows the list-level error as an alert instead of the rows', () => {
    render(
      <RecordList
        error={{
          title: 'No se pudo cargar la lista',
          description: 'Reintenta en unos segundos.',
        }}
      >
        <RecordRow title="Adrián Martínez" />
      </RecordList>
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('No se pudo cargar la lista')
    expect(alert).toHaveTextContent('Reintenta en unos segundos.')
    expect(screen.queryByText('Adrián Martínez')).not.toBeInTheDocument()
  })
})

describe('RecordRow states (R6)', () => {
  it('activates once with click, Enter and Space', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <RecordRow
        title="Adrián Martínez"
        status="Activo"
        onClick={handleClick}
      />
    )

    const row = screen.getByRole('button')
    await user.click(row)
    expect(handleClick).toHaveBeenCalledTimes(1)

    row.focus()
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(2)

    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledTimes(3)
  })

  it('renders the leading content before the title', () => {
    render(
      <RecordRow
        leading={<span data-testid="avatar">AM</span>}
        title="Adrián Martínez"
      />
    )

    expect(screen.getByTestId('avatar')).toBeInTheDocument()
    expect(screen.getByText('Adrián Martínez')).toBeInTheDocument()
  })

  it('marks the selected row as current', () => {
    render(<RecordRow title="Adrián Martínez" selected onClick={vi.fn()} />)

    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'true')
  })

  it('is not a button and not focusable without onClick', async () => {
    const user = userEvent.setup()
    render(<RecordRow title="Solo lectura" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    await user.tab()
    expect(document.body).toHaveFocus()
  })

  it('disabled: exposes aria-disabled, skips Tab and ignores click and keyboard', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<RecordRow title="Marco Tulio" disabled onClick={handleClick} />)

    const row = screen.getByRole('button')
    expect(row).toHaveAttribute('aria-disabled', 'true')

    await user.tab()
    expect(row).not.toHaveFocus()

    await user.click(row)
    row.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('loading: replaces the content with a busy placeholder and ignores interaction', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <RecordRow
        title="No debe verse"
        status="Activo"
        loading
        onClick={handleClick}
      />
    )

    const row = screen.getByRole('button')
    expect(row).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('common.loading')).toBeInTheDocument()
    expect(screen.queryByText('No debe verse')).not.toBeInTheDocument()
    expect(screen.queryByText('Activo')).not.toBeInTheDocument()

    await user.click(row)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('error: shows the message under the title and keeps the row interactive', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <RecordRow
        title="winback_90d"
        error="Plantilla rechazada por Meta"
        onClick={handleClick}
      />
    )

    expect(screen.getByText('winback_90d')).toBeInTheDocument()
    expect(screen.getByText('Plantilla rechazada por Meta')).toBeInTheDocument()

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
