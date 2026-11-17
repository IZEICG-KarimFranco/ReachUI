import { Meter } from '@/components/ui/charts/meter'
import {
  deliverySegments,
  emptySegments,
  formatThousands,
} from '@/pages/dev/mock/chart-data'
import { MockSection, MockShell } from '@/pages/dev/mock/mock-shell'

export default function MeterMockPage() {
  return (
    <MockShell
      title="Meter"
      description="Barra apilada por tonos semánticos (shots chart-meter y chart-meter-empty de t06-charts.html). Resumen en texto accesible; leyenda opcional."
    >
      <MockSection title="chart-meter · con leyenda">
        <Meter
          label="Estado de entrega — CMP-0446"
          segments={deliverySegments}
          showLegend
          formatValue={formatThousands}
        />
      </MockSection>

      <MockSection title="chart-meter-empty · sin eventos">
        <Meter
          label="Estado de entrega — CMP-0450"
          segments={emptySegments}
          showLegend
          emptyLabel="Sin eventos aún"
        />
      </MockSection>

      <MockSection
        title="base mayor que la suma"
        hint="base=6000: el hueco restante queda en el fondo de la pista."
      >
        <Meter
          label="Avance del envío"
          segments={deliverySegments.slice(0, 2)}
          base={6000}
          showLegend
          formatValue={formatThousands}
        />
      </MockSection>

      <MockSection title="compact · sin leyenda, etiqueta oculta">
        <div className="flex max-w-xs flex-col gap-3">
          <Meter
            label="Estado compacto"
            labelHidden
            size="compact"
            segments={deliverySegments}
          />
          <Meter
            label="Decorativo"
            decorative
            size="compact"
            segments={deliverySegments}
          />
        </div>
      </MockSection>

      <MockSection title="loading y error">
        <div className="flex flex-col gap-4">
          <Meter label="Cargando" segments={[]} status="loading" />
          <Meter
            label="Con error"
            segments={[]}
            status="error"
            errorLabel="No se pudo cargar el estado de entrega"
          />
        </div>
      </MockSection>
    </MockShell>
  )
}
