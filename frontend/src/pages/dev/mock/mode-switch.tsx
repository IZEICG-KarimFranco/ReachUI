import { useState } from 'react'
import { ModeSwitch } from '@/components/ui/navigation/mode-switch'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

const modes = [
  { value: 'summary', label: 'Resumen' },
  { value: 'deliveries', label: 'Entregas' },
  { value: 'replies', label: 'Respuestas' },
  { value: 'errors', label: 'Errores' },
]

const periods = [
  { value: '7', label: '7 días' },
  { value: '30', label: '30 días' },
  { value: '90', label: '90 días' },
  { value: 'year', label: 'Año (Pro)', disabled: true },
]

export default function ModeSwitchMockPage() {
  const [mode, setMode] = useState('summary')
  const [period, setPeriod] = useState('30')
  const [wrapMode, setWrapMode] = useState('replies')

  return (
    <MockShell
      title="ModeSwitch"
      description="Cápsulas tipo píldora (h-10, rounded-full); seleccionado con bg-selection y texto signal-contrast. Mock .segctl."
    >
      <MockSection title="Por defecto (scroll)">
        <ModeSwitch
          ariaLabel="Vista de la campaña"
          options={modes}
          value={mode}
          onValueChange={setMode}
        />
        <ValueReadout>value: {mode}</ValueReadout>
      </MockSection>

      <MockSection title="Opción deshabilitada">
        <ModeSwitch
          ariaLabel="Periodo"
          options={periods}
          value={period}
          onValueChange={setPeriod}
        />
        <ValueReadout>value: {period}</ValueReadout>
      </MockSection>

      <MockSection title="Todo el control deshabilitado">
        <ModeSwitch
          ariaLabel="Vista (deshabilitada)"
          options={modes}
          value="deliveries"
          onValueChange={() => undefined}
          disabled
        />
      </MockSection>

      <MockSection title="layout=wrap en contenedor estrecho">
        <div className="max-w-xs">
          <ModeSwitch
            ariaLabel="Vista (wrap)"
            layout="wrap"
            options={modes}
            value={wrapMode}
            onValueChange={setWrapMode}
          />
        </div>
        <ValueReadout>value: {wrapMode}</ValueReadout>
      </MockSection>
    </MockShell>
  )
}
