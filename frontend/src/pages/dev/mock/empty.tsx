import {
  ChartNoAxesColumn,
  CircleDashed,
  FileText,
  MessageSquareDashed,
  SearchX,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/actions/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/layout/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyPanel,
  EmptyState,
  EmptyTitle,
} from '@/components/ui/feedback/empty'
import { MockNav } from '@/pages/dev/mock/mock-nav'

export function EmptyStateShot() {
  return (
    <Card divided className="w-full max-w-[520px]">
      <CardHeader className="text-xs text-muted">
        <b className="font-semibold text-ink">Segmentos</b>
      </CardHeader>
      <EmptyState
        className="min-h-35"
        title="Sin segmentos todavía"
        description="Combina filtros de contactos y guarda el resultado."
      />
      <CardFooter className="justify-end">
        <a
          href="#"
          className="focus-ring-inline text-[11px] font-bold text-signal-contrast hover:underline"
        >
          Crear segmento →
        </a>
      </CardFooter>
    </Card>
  )
}

export function AnalyticsEmptyCards() {
  return (
    <div className="grid gap-4 md:grid-cols-[1.35fr_1fr]">
      <EmptyPanel
        title="Conversaciones creadas"
        meta="Últimos 7 días"
        footer="Agregación de muestra · no métrica de producción"
      >
        <EmptyState
          className="min-h-72"
          icon={ChartNoAxesColumn}
          title="Sin conversaciones en este periodo"
          description="Cuando haya conversaciones de WhatsApp en los últimos 7 días, aparecerán aquí."
        />
      </EmptyPanel>
      <EmptyPanel title="Conversaciones por agente" meta="0 atendidas">
        <EmptyState
          className="min-h-72"
          icon={Users}
          title="Sin atención por agente"
          description="Ningún agente ha atendido conversaciones en este periodo."
        />
      </EmptyPanel>
      <EmptyPanel title="Cierre de la cohorte" meta="7 días">
        <EmptyState
          icon={CircleDashed}
          title="Sin cohorte que medir"
          description="No hay conversaciones cerradas ni abiertas al corte."
        />
      </EmptyPanel>
      <EmptyPanel title="Alcance de Fase 1" meta="Nota de datos">
        <EmptyState
          icon={FileText}
          title="Sin notas de datos"
          description="No hay observaciones sobre el alcance de este reporte."
        />
      </EmptyPanel>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-label uppercase text-muted">{title}</h2>
      {children}
    </section>
  )
}

export default function EmptyMockPage() {
  return (
    <div className="min-h-dvh w-full bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-6 text-lg font-semibold">EmptyState · estados</h1>

        <Section title="empty-state · en un plate (Card divided)">
          <EmptyStateShot />
        </Section>

        <Section title="bordered · caja suelta">
          <EmptyState
            bordered
            className="max-w-[520px]"
            title="Sin segmentos todavía"
            description="Combina filtros de contactos y guarda el resultado."
          />
        </Section>

        <Section title="icon + action · como templates-table y segments-list">
          <div className="grid gap-4 md:grid-cols-2">
            <EmptyState
              bordered
              icon={MessageSquareDashed}
              title="Aún no hay plantillas"
              description="Crea la primera plantilla para empezar a enviar mensajes."
              action={
                <Button variant="secondary" size="compact">
                  Crear plantilla
                </Button>
              }
            />
            <Card>
              <EmptyState
                icon={SearchX}
                title="Sin resultados"
                description="Prueba con otros filtros."
                action={
                  <Button variant="quiet" size="compact">
                    Limpiar filtros
                  </Button>
                }
              />
            </Card>
          </div>
        </Section>

        <Section title="texto largo y sin descripción">
          <div className="grid gap-4 md:grid-cols-2">
            <EmptyState
              bordered
              icon={SearchX}
              title="No encontramos ningún contacto que coincida con los filtros aplicados en esta lista"
              description="Cambia el rango de fechas, quita alguna etiqueta o revisa que la dirección contacto-con-un-nombre-muy-largo@ejemplo-de-dominio-extenso.com.mx esté bien escrita."
            />
            <EmptyState bordered title="Sin datos" />
          </div>
        </Section>

        <Section title="EmptyPanel · con EmptyState bordered">
          <EmptyPanel
            title="Segmentos"
            meta="Últimos 7 días"
            footer="Agregación de muestra · no métrica de producción"
            className="max-w-[520px]"
          >
            <div className="p-4">
              <EmptyState
                bordered
                icon={SearchX}
                title="Sin segmentos todavía"
                description="Combina filtros de contactos y guarda el resultado."
              />
            </div>
          </EmptyPanel>
        </Section>

        <Section title="en contexto · tarjetas de analítica sin datos">
          <AnalyticsEmptyCards />
        </Section>

        <Section title="legacy · compuesto Empty (como lo usan los consumidores)">
          <div className="grid gap-4 md:grid-cols-2">
            <Empty className="border border-line">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageSquareDashed />
                </EmptyMedia>
                <EmptyTitle>Aún no hay plantillas</EmptyTitle>
                <EmptyDescription>
                  Crea la primera plantilla para empezar a enviar mensajes.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="secondary" size="compact">
                  Crear plantilla
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        </Section>
      </main>
    </div>
  )
}
