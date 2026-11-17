import { ChartLegend } from '@/components/ui/charts/chart-legend'
import { MockSection, MockShell } from '@/pages/dev/mock/mock-shell'
import type { LegendEntry } from '@/types/charts'

const items: LegendEntry[] = [
  { key: 'delivered', label: 'Entregados', tone: 'success', detail: '88%' },
  { key: 'failed', label: 'Fallidos', tone: 'error', detail: '3%' },
  { key: 'processing', label: 'En proceso', tone: 'live', detail: '5%' },
  { key: 'pending', label: 'Pendientes', tone: 'neutral', detail: '4%' },
  { key: 'sent', label: 'Enviados', tone: 'info' },
  { key: 'signal', label: 'Programados', tone: 'signal' },
]

export default function ChartLegendMockPage() {
  return (
    <MockShell
      title="ChartLegend"
      description="Leyenda compartida de Meter, BarChart y DonutChart: marcador por tono semántico, etiqueta y detalle opcional."
    >
      <MockSection title="marker=dot (por defecto) · todos los tonos">
        <ChartLegend items={items} />
      </MockSection>

      <MockSection title="marker=square">
        <ChartLegend items={items} marker="square" />
      </MockSection>

      <MockSection title="contenedor estrecho (wrap)">
        <div className="max-w-xs">
          <ChartLegend items={items} />
        </div>
      </MockSection>

      <MockSection
        title="hidden (sr-only)"
        hint="No se ve, pero queda en el árbol accesible como lista."
      >
        <ChartLegend items={items.slice(0, 2)} hidden />
        <p className="text-xs text-muted">(leyenda oculta visualmente)</p>
      </MockSection>
    </MockShell>
  )
}
