import { MessageSquare } from 'lucide-react'
import { DonutChart } from '@/components/ui/charts/donut-chart'
import {
  channelSegments,
  deliverySegments,
  emptySegments,
  formatThousands,
} from '@/pages/dev/mock/chart-data'
import { MockSection, MockShell } from '@/pages/dev/mock/mock-shell'

export default function DonutChartMockPage() {
  return (
    <MockShell
      title="DonutChart"
      description="Donut de analítica (analytics-switchboard.html). Navegable con teclado: Tab entra en los segmentos, Enter/Espacio fija uno y Escape lo suelta."
    >
      <MockSection
        title="Con icono, valor central y leyenda"
        hint="Pasa el cursor o usa Tab para ver el detalle de cada segmento en el centro."
      >
        <div className="max-w-sm">
          <DonutChart
            label="Mensajes por canal"
            icon={<MessageSquare className="size-3.5" />}
            segments={channelSegments}
            centerValue="4,820"
            centerLabel="mensajes"
            showLegend
            formatValue={formatThousands}
          />
        </div>
      </MockSection>

      <MockSection title="Estado de entrega · sin valor central">
        <div className="max-w-sm">
          <DonutChart
            label="Estado de entrega"
            segments={deliverySegments}
            showLegend
            formatValue={formatThousands}
          />
        </div>
      </MockSection>

      <MockSection title="Un solo segmento (anillo completo)">
        <div className="max-w-sm">
          <DonutChart
            label="Tasa de entrega"
            segments={[
              { key: 'ok', label: 'Entregados', value: 100, tone: 'success' },
            ]}
            centerValue="100%"
            centerLabel="entregados"
          />
        </div>
      </MockSection>

      <MockSection title="compact y decorativo (junto a un KPI)">
        <div className="flex items-center gap-6">
          <DonutChart
            label="Tasa de lectura"
            size="compact"
            segments={[
              { key: 'read', label: 'Leídos', value: 71, tone: 'info' },
              { key: 'unread', label: 'Sin leer', value: 29, tone: 'neutral' },
            ]}
            centerValue="71%"
          />
          <div className="flex items-center gap-3">
            <DonutChart
              label="Decorativo"
              decorative
              size="compact"
              segments={channelSegments}
            />
            <span className="text-xs text-muted">
              decorative: aria-hidden, sin interacción
            </span>
          </div>
        </div>
      </MockSection>

      <MockSection title="vacío, loading y error">
        <div className="grid gap-6 sm:grid-cols-3">
          <DonutChart
            label="Sin datos"
            segments={emptySegments}
            emptyLabel="Sin eventos aún"
            showLegend
          />
          <DonutChart label="Cargando" segments={[]} status="loading" />
          <DonutChart
            label="Con error"
            segments={[]}
            status="error"
            errorLabel="No se pudo cargar"
          />
        </div>
      </MockSection>
    </MockShell>
  )
}
