import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-display/data-table'

interface MockUser {
  id: string
  name: string
  role: string
}

const mockColumns: ColumnDef<MockUser>[] = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'role', header: 'Rol' },
]

const mockData: MockUser[] = [
  { id: '1', name: 'Adrián Martínez', role: 'Administrador' },
  { id: '2', name: 'Lucía Fernández', role: 'Operador' },
]

describe('DataTable component contract and behaviors (R6)', () => {
  it('renders table headers and rows accurately', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)

    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Rol')).toBeInTheDocument()
    expect(screen.getByText('Adrián Martínez')).toBeInTheDocument()
    expect(screen.getByText('Lucía Fernández')).toBeInTheDocument()
  })

  it('renders all rows without pagination limit when hasPagination is false (regression test for >10 rows)', () => {
    const twentyFiveRows: MockUser[] = Array.from({ length: 25 }, (_, i) => ({
      id: String(i + 1),
      name: `Usuario ${i + 1}`,
      role: 'Miembro',
    }))

    render(
      <DataTable
        columns={mockColumns}
        data={twentyFiveRows}
        hasPagination={false}
      />
    )

    expect(screen.getByText('Usuario 1')).toBeInTheDocument()
    expect(screen.getByText('Usuario 11')).toBeInTheDocument()
    expect(screen.getByText('Usuario 25')).toBeInTheDocument()
  })

  it('displays loading state with aria-busy, an accessible status and skeleton rows instead of data', () => {
    render(<DataTable columns={mockColumns} data={mockData} isLoading={true} />)

    const table = screen.getByRole('table')
    expect(table).toHaveAttribute('aria-busy', 'true')

    const status = screen.getByRole('status')
    expect(status).toBeInTheDocument()
    expect(status.textContent).toContain('common.loading')

    expect(screen.queryByText('Adrián Martínez')).not.toBeInTheDocument()
  })

  it('displays no results message when search finds no matches', async () => {
    const user = userEvent.setup()

    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        searchByColumn="name"
        searchPlaceholder="Buscar por nombre..."
      />
    )

    const searchInput = screen.getByRole('textbox', {
      name: 'Buscar por nombre...',
    })
    await user.type(searchInput, 'NoExiste')

    expect(screen.getByText('common.no_results')).toBeInTheDocument()
    expect(screen.queryByText('Adrián Martínez')).not.toBeInTheDocument()
  })

  it('triggers handleRowClick exactly once per keyboard activation (Enter and Space)', async () => {
    const user = userEvent.setup()
    const handleRowClick = vi.fn()

    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        handleRowClick={handleRowClick}
      />
    )

    const rows = screen.getAllByRole('button')
    const firstRow = rows[0]

    firstRow.focus()
    await user.keyboard('{Enter}')
    expect(handleRowClick).toHaveBeenCalledTimes(1)
    expect(handleRowClick).toHaveBeenCalledWith(mockData[0])

    await user.keyboard(' ')
    expect(handleRowClick).toHaveBeenCalledTimes(2)
  })

  it('handles pagination controls accurately: prev disabled on first page, next advances and disables at end', async () => {
    const user = userEvent.setup()
    const fifteenRows: MockUser[] = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      name: `Persona ${i + 1}`,
      role: 'Rol',
    }))

    render(
      <DataTable
        columns={mockColumns}
        data={fifteenRows}
        hasPagination={true}
      />
    )

    const prevButton = screen.getByRole('button', { name: 'common.previous' })
    const nextButton = screen.getByRole('button', { name: 'common.next' })

    expect(prevButton).toBeDisabled()
    expect(nextButton).not.toBeDisabled()
    expect(screen.getByText('Persona 1')).toBeInTheDocument()
    expect(screen.queryByText('Persona 11')).not.toBeInTheDocument()

    await user.click(nextButton)
    expect(screen.queryByText('Persona 1')).not.toBeInTheDocument()
    expect(screen.getByText('Persona 11')).toBeInTheDocument()

    expect(nextButton).toBeDisabled()
    expect(prevButton).not.toBeDisabled()
  })
})
