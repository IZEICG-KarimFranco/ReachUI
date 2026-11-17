import { useState } from 'react'
import { Pagination } from '@/components/ui/navigation/pagination'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

function PaginationCase({
  label,
  totalPages,
  initialPage,
  visiblePagesCount,
}: {
  label: string
  totalPages: number
  initialPage: number
  visiblePagesCount?: number
}) {
  const [page, setPage] = useState(initialPage)

  return (
    <div className="flex flex-col gap-2 border-b border-line py-4 last:border-b-0">
      <span className="text-xs text-muted">{label}</span>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        visiblePagesCount={visiblePagesCount}
      />
      <ValueReadout>
        currentPage: {page} / {totalPages}
      </ValueReadout>
    </div>
  )
}

export default function PaginationMockPage() {
  const [page, setPage] = useState(3)

  return (
    <MockShell
      title="Pagination (numérica)"
      description="Ventana deslizante de botones (h-10 w-10) con aria-current=page; glifos ‹ › y texto xs semibold."
    >
      <MockSection title="En contexto · pie de tabla">
        <div className="flex items-center justify-between gap-3 rounded-surface border border-line bg-card px-4 py-3">
          <span className="text-xs text-muted tabular-nums">
            {(page - 1) * 20 + 1}–{page * 20} de 4,820
          </span>
          <Pagination
            currentPage={page}
            totalPages={241}
            onPageChange={setPage}
          />
        </div>
      </MockSection>

      <MockSection title="Casos">
        <PaginationCase
          label="Primera página (‹ deshabilitado)"
          totalPages={241}
          initialPage={1}
        />
        <PaginationCase
          label="Página intermedia"
          totalPages={241}
          initialPage={120}
        />
        <PaginationCase
          label="Última página (› deshabilitado)"
          totalPages={241}
          initialPage={241}
        />
        <PaginationCase
          label="Pocas páginas (5)"
          totalPages={5}
          initialPage={2}
        />
        <PaginationCase
          label="Una sola página"
          totalPages={1}
          initialPage={1}
        />
        <PaginationCase
          label="visiblePagesCount=3"
          totalPages={50}
          initialPage={25}
          visiblePagesCount={3}
        />
      </MockSection>
    </MockShell>
  )
}
