'use client'

import * as React from 'react'
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/data-display/table'
import { EmptyState } from '@/components/ui/feedback/empty'
import { Skeleton } from '@/components/ui/feedback/skeleton'
import { Surface } from '@/components/ui/layout/surface'
import { Button } from '@/components/ui/actions/button'
import { Input } from '@/components/ui/inputs/input'
import { useKeyAction } from '@/components/ui/hooks/use-key-action'
import { cn } from '@/lib/utils'

const LOADING_ROWS = 5

interface DataTableProps<TData, TValue> {
  className?: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  hasPagination?: boolean
  searchByColumn?: string
  searchPlaceholder?: string
  handleRowClick?: (row: TData) => void
  isLoading?: boolean
}

function DataTableRow<TData>({
  row,
  isClickable,
  handleRowClick,
}: {
  row: Row<TData>
  isClickable: boolean
  handleRowClick?: (data: TData) => void
}) {
  const onKeyDown = useKeyAction<HTMLTableRowElement>(() =>
    handleRowClick?.(row.original)
  )

  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && 'selected'}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={() => handleRowClick?.(row.original)}
      onKeyDown={onKeyDown}
      className={cn(
        isClickable && 'cursor-pointer hover:bg-selection focus-row'
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable<TData, TValue>({
  className,
  columns,
  data,
  hasPagination = false,
  searchByColumn,
  searchPlaceholder,
  handleRowClick,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(hasPagination
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  const searchAriaLabel = searchPlaceholder || t('common.search_placeholder')

  return (
    <div className={cn('w-full space-y-4', className)}>
      {searchByColumn && (
        <div className="flex items-center py-1">
          <Input
            aria-label={searchAriaLabel}
            placeholder={searchPlaceholder || t('common.search')}
            value={
              (table.getColumn(searchByColumn)?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn(searchByColumn)
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      <Surface variant="plate" className="overflow-hidden p-0">
        <Table aria-busy={isLoading}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: LOADING_ROWS }, (_, rowIndex) => (
                <TableRow key={`loading-${rowIndex}`}>
                  {columns.map((_, columnIndex) => (
                    <TableCell key={columnIndex}>
                      <Skeleton className="h-3 w-3/4" />
                      {rowIndex === 0 && columnIndex === 0 && (
                        <span role="status" className="sr-only">
                          {t('common.loading')}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <DataTableRow
                    key={row.id}
                    row={row}
                    isClickable={Boolean(handleRowClick)}
                    handleRowClick={handleRowClick}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <EmptyState title={t('common.no_results')} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Surface>
      {hasPagination && (
        <div className="flex items-center justify-end gap-2 py-2">
          <Button
            variant="secondary"
            size="compact"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('common.previous')}
          </Button>
          <Button
            variant="secondary"
            size="compact"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('common.next')}
          </Button>
        </div>
      )}
    </div>
  )
}
