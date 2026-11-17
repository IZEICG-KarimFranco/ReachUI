import { useState } from 'react'
import { Button } from '@/components/ui/actions/button'
import { Steps, type StepItem } from '@/components/ui/navigation/steps'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

const labels = ['Audiencia', 'Canal', 'Mensaje', 'Programación', 'Revisión']

function buildSteps(current: number): StepItem[] {
  return labels.map((label, idx) => ({
    number: idx + 1,
    label,
    status: idx < current ? 'done' : idx === current ? 'current' : 'upcoming',
  }))
}

export default function StepsMockPage() {
  const [current, setCurrent] = useState(2)

  return (
    <MockShell
      title="Steps"
      description="Un solo contenedor rounded-surface con divisores internos; paso activo con bg-selection e indicador signal."
    >
      <MockSection
        title="Interactivo · asistente de campaña"
        hint="Clic en un paso o usa Anterior/Siguiente."
      >
        <div className="mb-3 flex gap-2">
          <Button
            variant="secondary"
            size="compact"
            disabled={current === 0}
            onClick={() => setCurrent((value) => Math.max(0, value - 1))}
          >
            Anterior
          </Button>
          <Button
            variant="secondary"
            size="compact"
            disabled={current === labels.length - 1}
            onClick={() =>
              setCurrent((value) => Math.min(labels.length - 1, value + 1))
            }
          >
            Siguiente
          </Button>
        </div>
        <Steps
          ariaLabel="Pasos de la campaña"
          steps={buildSteps(current)}
          onStepClick={setCurrent}
        />
        <ValueReadout>current: {current}</ValueReadout>
      </MockSection>

      <MockSection title="Primer paso">
        <Steps ariaLabel="Primer paso" steps={buildSteps(0)} />
      </MockSection>

      <MockSection title="Todos hechos salvo el último">
        <Steps ariaLabel="Último paso" steps={buildSteps(labels.length - 1)} />
      </MockSection>

      <MockSection title="Paso deshabilitado">
        <Steps
          ariaLabel="Con paso deshabilitado"
          steps={buildSteps(1).map((step, idx) =>
            idx === 3 ? { ...step, disabled: true } : step
          )}
          onStepClick={() => undefined}
        />
      </MockSection>

      <MockSection title="Tres pasos">
        <Steps
          ariaLabel="Importar contactos"
          steps={[
            { number: '01', label: 'Archivo', status: 'done' },
            { number: '02', label: 'Mapeo de columnas', status: 'current' },
            { number: '03', label: 'Confirmar', status: 'upcoming' },
          ]}
        />
      </MockSection>
    </MockShell>
  )
}
