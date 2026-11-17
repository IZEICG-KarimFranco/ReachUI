import { BarChart } from '@/components/ui/charts/bar-chart'
import {
  emptySegments,
  formatThousands,
  funnelRows,
} from '@/pages/dev/mock/chart-data'
import { MockSection, MockShell } from '@/pages/dev/mock/mock-shell'

export default function BarChartMockPage() {
  return (
    <MockShell
      title="BarChart"
      description="Barras horizontales por fila con valor y porcentaje (shot chart-bars de t06-charts.html)."
    >
      <MockSection title="chart-bars · base = enviados (4,820)">
        <BarChart
          label="Embudo de la campaña"
          rows={funnelRows}
          base={4820}
          formatValue={formatThousands}
        />
      </MockSection>

      <MockSection title="sin base (relativo al total) y sin porcentaje">
        <BarChart
          label="Mensajes por estado"
          rows={funnelRows}
          showPercent={false}
          formatValue={formatThousands}
        />
      </MockSection>

      <MockSection title="etiqueta oculta (labelHidden)">
        <BarChart
          label="Embudo sin título visible"
          labelHidden
          rows={funnelRows.slice(0, 3)}
          base={4820}
          formatValue={formatThousands}
        />
      </MockSection>

      <MockSection title="vacío, loading y error">
        <div className="flex flex-col gap-6">
          <BarChart
            label="Sin datos"
            rows={emptySegments}
            emptyLabel="Sin eventos aún"
          />
          <BarChart label="Cargando" rows={[]} status="loading" />
          <BarChart
            label="Con error"
            rows={[]}
            status="error"
            errorLabel="No se pudo cargar el embudo"
          />
        </div>
      </MockSection>
    </MockShell>
  )
}
