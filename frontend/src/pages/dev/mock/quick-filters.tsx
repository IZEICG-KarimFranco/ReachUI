import { useState } from 'react'
import {
  QuickFilters,
  type QuickFilterOption,
} from '@/components/ui/navigation/quick-filters'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

const statusOptions: QuickFilterOption[] = [
  { value: 'all', label: 'Todas' },
  { value: 'proc', label: 'En proceso', dotTone: 'proc' },
  { value: 'deliv', label: 'Entregadas', dotTone: 'deliv' },
  { value: 'fail', label: 'Fallidas', dotTone: 'fail' },
  { value: 'pend', label: 'Pendientes', dotTone: 'pend' },
  { value: 'sent', label: 'Enviadas', dotTone: 'sent' },
  { value: 'sched', label: 'Programadas' },
]

const withDisabled: QuickFilterOption[] = [
  { value: 'all', label: 'Todas' },
  { value: 'wa', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'rcs', label: 'RCS (sin licencia)', disabled: true },
]

export default function QuickFiltersMockPage() {
  const [status, setStatus] = useState('all')
  const [statusWrap, setStatusWrap] = useState('proc')
  const [channel, setChannel] = useState('all')

  return (
    <MockShell
      title="QuickFilters"
      description="Filtro de selección única (radiogroup): Tab entra en el seleccionado y las flechas mueven y seleccionan. La selección múltiple con chips está en ChipGroup (/dev/mock/chip-group)."
    >
      <MockSection
        title="Simple · scroll (por defecto) con puntos de estado"
        hint="Mock .stfilter / .cf (switchboard-soft.css:327-337). A 390 px se desplaza en horizontal."
      >
        <QuickFilters
          ariaLabel="Estado de la campaña"
          options={statusOptions}
          value={status}
          onValueChange={setStatus}
        />
        <ValueReadout>value: {status}</ValueReadout>
      </MockSection>

      <MockSection title="Simple · wrap">
        <QuickFilters
          ariaLabel="Estado de la campaña (wrap)"
          layout="wrap"
          options={statusOptions}
          value={statusWrap}
          onValueChange={setStatusWrap}
        />
        <ValueReadout>value: {statusWrap}</ValueReadout>
      </MockSection>

      <MockSection
        title="Simple · opción deshabilitada"
        hint="Las flechas la saltan; el clic no la selecciona."
      >
        <QuickFilters
          ariaLabel="Canal"
          options={withDisabled}
          value={channel}
          onValueChange={setChannel}
        />
        <ValueReadout>value: {channel}</ValueReadout>
      </MockSection>
    </MockShell>
  )
}
