import type { ReactNode } from 'react'

import { Surface } from '@/components/ui/layout/surface'
import { MockNav } from '@/pages/dev/mock/mock-nav'

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-2 text-label uppercase text-muted">{children}</h2>
}

export default function SurfaceMockPage() {
  return (
    <div className="min-h-dvh w-full bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-6 text-lg font-semibold">Surface · plate</h1>

        <section className="mb-8">
          <SectionTitle>
            plate (por defecto) frente a variant=&quot;pane&quot; (panel oscuro
            en ambos temas)
          </SectionTitle>
          <div className="grid gap-4 tablet:grid-cols-2">
            <Surface className="p-4 text-sm">
              <p className="font-semibold">plate</p>
              <p className="mt-1 text-xs text-muted">
                Sigue el tema: claro u oscuro.
              </p>
            </Surface>
            <Surface variant="pane" className="p-4 text-sm">
              <p className="font-semibold">pane</p>
              <p className="mt-1 text-xs text-muted">
                Siempre oscuro;{' '}
                <span className="text-signal-contrast">acento</span> y texto
                secundario salen del panel.
              </p>
            </Surface>
          </div>
        </section>

        <section className="mb-8">
          <SectionTitle>plate vacío con padding del consumidor</SectionTitle>
          <Surface className="p-4 text-sm">
            Contenido libre dentro del plate.
          </Surface>
        </section>

        <section className="mb-8">
          <SectionTitle>
            plate con ancho limitado por el consumidor
          </SectionTitle>
          <Surface className="w-full max-w-[440px] p-4 text-sm">
            El plate solo pone fondo, borde y radio; las divisiones, la cabecera
            y las filas viven en Card.
          </Surface>
        </section>

        <section>
          <SectionTitle>plate a todo el ancho del contenedor</SectionTitle>
          <Surface className="w-full p-4 text-sm">
            Ocupa todo el ancho disponible; no impone ancho máximo.
          </Surface>
        </section>
      </main>
    </div>
  )
}
