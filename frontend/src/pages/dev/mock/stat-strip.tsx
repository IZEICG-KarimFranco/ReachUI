import { useState } from 'react'
import { ChartNoAxesColumn } from 'lucide-react'
import { Button } from '@/components/ui/actions/button'
import {
  StatStrip,
  type StatItem,
} from '@/components/ui/data-display/stat-strip'
import { MockSection, MockShell } from '@/pages/dev/mock/mock-shell'

const campaignStats: StatItem[] = [
  {
    label: 'Enviados',
    value: '4,820',
    delta: '▲ 12%',
    deltaTone: 'up',
    deltaLabel: 'vs. mes anterior',
  },
  {
    label: 'Entregados',
    value: '4,611',
    delta: '95.7%',
    deltaTone: 'neutral',
    deltaLabel: 'del total',
  },
  {
    label: 'Fallidos',
    value: '97',
    delta: '2.0%',
    deltaTone: 'warn',
    deltaLabel: 'reintentos',
  },
  {
    label: 'Respuestas',
    value: '382',
    delta: '382',
    deltaTone: 'up',
    deltaLabel: '▲ 8% engagement',
  },
]

const liveStats: StatItem[] = [
  { label: 'Agentes en línea', value: '12', statusTone: 'success' },
  { label: 'En espera', value: '4', statusTone: 'live' },
  { label: 'Sin asignar', value: '0', statusTone: 'neutral' },
]

const unitStats: StatItem[] = [
  { label: 'Tiempo medio de respuesta', value: '3.4', unit: 'min' },
  {
    label: 'Espera más larga',
    value: '12',
    unit: 'min',
    deltaTone: 'warn',
    delta: '▲ 4 min',
    deltaLabel: 'vs. ayer',
  },
]

const longStats: StatItem[] = [
  {
    label: 'Contactos alcanzados en la campaña de reactivación de primavera',
    value: '1,234,567,890',
    delta: '▲ 120%',
    deltaTone: 'up',
    deltaLabel: 'respecto al trimestre anterior completo',
  },
]

export default function StatStripMockPage() {
  const [loading, setLoading] = useState(false)

  return (
    <MockShell
      title="StatStrip"
      description="Franja de métricas sobre Surface plate: 1 columna en móvil, 2 en sm y 4 en lg (2 y 3 ítems usan 2 y 3 columnas desde sm). Bordes internos por getStatCellBorders."
    >
      <MockSection
        title="Cuatro métricas con delta (up, neutral, warn)"
        hint="El botón alterna loading para comparar la misma franja con Skeleton."
      >
        <Button
          variant="secondary"
          size="compact"
          className="mb-3"
          aria-pressed={loading}
          onClick={() => setLoading((value) => !value)}
        >
          {loading ? 'Quitar loading' : 'Simular loading'}
        </Button>
        <StatStrip
          ariaLabel="Métricas de la campaña"
          loading={loading}
          items={campaignStats}
        />
      </MockSection>

      <MockSection title="Tres métricas con statusTone (LED en la etiqueta)">
        <StatStrip ariaLabel="Supervisión en vivo" items={liveStats} />
      </MockSection>

      <MockSection title="Dos métricas con unidad">
        <StatStrip ariaLabel="Tiempos" items={unitStats} />
      </MockSection>

      <MockSection title="Una métrica · textos y valor largos (truncado)">
        <StatStrip ariaLabel="Alcance" items={longStats} />
      </MockSection>

      <MockSection title="Loading con loadingItems=3">
        <StatStrip
          ariaLabel="Cargando métricas"
          items={[]}
          loading
          loadingItems={3}
        />
      </MockSection>

      <MockSection title="Vacío · por defecto y con emptyState">
        <div className="flex flex-col gap-4">
          <StatStrip ariaLabel="Sin métricas" items={[]} />
          <StatStrip
            ariaLabel="Sin datos del periodo"
            items={[]}
            emptyState={{
              title: 'Sin datos en este periodo',
              description: 'Cambia el rango de fechas para ver métricas.',
              icon: ChartNoAxesColumn,
            }}
          />
        </div>
      </MockSection>
    </MockShell>
  )
}
