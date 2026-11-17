import { useState } from 'react'
import { CursorPagination } from '@/components/ui/navigation/pagination-cursor'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

const TOTAL_PAGES = 4

export default function CursorPaginationMockPage() {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const go = (delta: 1 | -1) => {
    setLoading(true)
    window.setTimeout(() => {
      setPage((value) => value + delta)
      setLoading(false)
    }, 800)
  }

  return (
    <MockShell
      title="CursorPagination"
      description="Mismas dimensiones que Pagination (h-10 w-10); solo iconos, nombres accesibles por aria-label. El label se oculta por debajo de sm."
    >
      <MockSection
        title="Interactiva · con carga simulada"
        hint="Cada clic tarda 800 ms: los botones se deshabilitan y aparece el Spinner."
      >
        <div className="flex items-center justify-between gap-3 rounded-surface border border-line bg-card px-4 py-3">
          <span className="text-xs text-muted tabular-nums">
            Lote {page} de {TOTAL_PAGES}
          </span>
          <CursorPagination
            label="Más recientes"
            canGoPrev={page > 1}
            canGoNext={page < TOTAL_PAGES}
            loading={loading}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
          />
        </div>
        <ValueReadout>
          page: {page} · loading: {String(loading)}
        </ValueReadout>
      </MockSection>

      <MockSection title="Estados fijos">
        <div className="flex flex-col gap-4">
          {[
            {
              label: 'Inicio (‹ deshabilitado)',
              prev: false,
              next: true,
              loading: false,
            },
            { label: 'Intermedio', prev: true, next: true, loading: false },
            {
              label: 'Final (› deshabilitado)',
              prev: true,
              next: false,
              loading: false,
            },
            { label: 'Cargando', prev: true, next: true, loading: true },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-xs text-muted">{item.label}</span>
              <CursorPagination
                canGoPrev={item.prev}
                canGoNext={item.next}
                loading={item.loading}
                onPrev={() => undefined}
                onNext={() => undefined}
              />
            </div>
          ))}
        </div>
      </MockSection>
    </MockShell>
  )
}
