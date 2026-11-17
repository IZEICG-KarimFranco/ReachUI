import { FileX } from 'lucide-react'
import { KeyValueList } from '@/components/ui/data-display/key-value-list'
import { MockSection, MockShell } from '@/pages/dev/mock/mock-shell'

const campaignItems = [
  { label: 'Audiencia', value: 'Clientes activos Q3 · 4,820' },
  { label: 'ID de campaña', value: 'CMP-0446', mono: true },
  { label: 'Creada por', value: 'adrian@izei.mx' },
  { label: 'Programada', value: '2026-04-02 09:30 GMT-6', mono: true },
]

const longItems = [
  {
    label: 'Descripción',
    value:
      'Recordatorio de cita para clientes con visita agendada en los próximos siete días, con enlace para reprogramar.',
  },
  {
    label: 'Webhook',
    value: 'https://hooks.example.com/reach/campaigns/CMP-0446/delivery-status',
    mono: true,
  },
  { label: 'Etiqueta con un nombre bastante largo', value: 'Sí' },
]

export default function KeyValueListMockPage() {
  return (
    <MockShell
      title="KeyValueList"
      description="<dl> sin padding exterior: los divisores divide-y divide-line tocan los bordes del marco."
    >
      <MockSection title="Detalle de campaña (con valores mono)">
        <KeyValueList items={campaignItems} />
      </MockSection>

      <MockSection title="Textos largos y URL">
        <KeyValueList items={longItems} />
      </MockSection>

      <MockSection title="Vacío · por defecto y con emptyState">
        <div className="flex flex-col gap-4">
          <KeyValueList items={[]} />
          <KeyValueList
            items={[]}
            emptyState={{
              title: 'Sin metadatos',
              description: 'Esta plantilla no tiene campos adicionales.',
              icon: FileX,
            }}
          />
        </div>
      </MockSection>
    </MockShell>
  )
}
