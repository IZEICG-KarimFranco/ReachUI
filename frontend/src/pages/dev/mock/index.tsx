import { Link } from 'wouter'

import { Alert } from '@/components/ui/feedback/alert'
import { Badge } from '@/components/ui/feedback/badge'
import { MockNav } from '@/pages/dev/mock/mock-nav'
import {
  MOCK_PAGES,
  MOCK_TICKET_GROUPS,
  useViewportWidth,
} from '@/pages/dev/mock/mock-pages'

const MOBILE_BREAKPOINT = 560

export default function DevMockIndexPage() {
  const width = useViewportWidth()

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <MockNav />

      <main className="mx-auto w-full max-w-5xl p-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h1 className="text-title text-ink">
              Pantallas mock · Rediseño Reach
            </h1>
            <p className="mt-1 text-xs text-muted">
              Dispatch Switchboard Soft · entorno exclusivo de desarrollo (
              <code className="font-mono">import.meta.env.DEV</code>)
            </p>
          </div>
          <span className="rounded-control border border-line bg-card px-3 py-1.5 font-mono text-xs text-ink-secondary">
            {width} px ·{' '}
            {width <= MOBILE_BREAKPOINT
              ? 'Móvil (≤ 560 px)'
              : 'Escritorio (> 560 px)'}
          </span>
        </div>

        <div className="mb-8">
          <Alert
            tone="info"
            title="Cómo usar este índice"
            description="Cada pantalla monta los componentes reales de components/ui con Tailwind v4 y tokens de Foundations para verificar interacciones manuales (teclado, foco, portales, temas claro/oscuro y anchos móviles). Usa la barra superior para saltar entre pantallas o volver a Inicio."
          />
        </div>

        {MOCK_TICKET_GROUPS.map((group) => {
          const items = MOCK_PAGES.filter((page) => page.ticket === group)
          return (
            <section key={group} className="mb-8 last:mb-0">
              <h2 className="mb-3 font-mono text-label uppercase text-signal-contrast">
                {group}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex flex-col justify-between rounded-surface border border-line bg-card p-4 text-ink transition-all outline-none hover:-translate-y-[1px] hover:border-signal-contrast focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-signal-contrast motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-ink">
                          {item.title}
                        </span>
                        <Badge variant="outline">{item.label}</Badge>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-ink-secondary">
                        {item.description}
                      </p>
                    </div>
                    <span className="mt-4 font-mono text-xs text-muted">
                      {item.path}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
