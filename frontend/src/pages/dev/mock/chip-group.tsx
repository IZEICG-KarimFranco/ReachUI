import { useState } from 'react'
import { Field } from '@/components/ui/inputs/field'
import { Input } from '@/components/ui/inputs/input'
import { Label } from '@/components/ui/inputs/label'
import { ChipGroup } from '@/components/ui/selection/chip-group'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

const scopeGroups = [
  {
    title: 'Campañas',
    items: [
      'campaigns.read',
      'campaigns.create',
      'campaigns.update',
      'campaigns.execute',
      'campaigns.delete',
      'campaigns.reports.view',
    ],
  },
  {
    title: 'Conversaciones',
    items: [
      'conversations.read',
      'conversations.create',
      'conversations.update',
      'conversations.delete',
      'conversations.reports.view',
    ],
  },
  {
    title: 'Contactos',
    items: [
      'contacts.read',
      'contacts.create',
      'contacts.update',
      'contacts.delete',
    ],
  },
  {
    title: 'Organización',
    items: ['org.read', 'org.update', 'org.members.manage'],
  },
  { title: 'Twilio', items: ['twilio.read', 'twilio.manage'] },
  { title: 'Reportes', items: ['reporting.all'] },
]

const toChip = (scope: string) => ({
  value: scope,
  label: scope.split('.').slice(1).join('·'),
})

export default function ChipGroupMockPage() {
  const [scopes, setScopes] = useState<string[]>([
    'campaigns.update',
    'campaigns.execute',
    'conversations.update',
  ])
  const [single, setSingle] = useState<string[]>([])
  const [scroll, setScroll] = useState<string[]>(['campaigns.read'])

  return (
    <MockShell
      title="ChipGroup"
      description="Selección múltiple con chips (.scchip de config-switchboard.html:149-158). Grupo con nombre, chips con aria-pressed, una parada de Tab por grupo, flechas ← → mueven el foco y Espacio/Enter alterna."
    >
      <MockSection
        title="En contexto · hoja «Crear llave»"
        hint="Un ChipGroup por categoría, todos sobre el mismo value. La etiqueta 02 Scopes nombra al conjunto con aria-labelledby."
      >
        <div className="flex max-w-md flex-col gap-5">
          <Field
            label="Nombre"
            step={1}
            description="Identifica la integración que la usa"
          >
            <Input placeholder="Ej. ERP — sync nocturno" />
          </Field>
          <div
            role="group"
            aria-labelledby="chip-scopes-title"
            className="flex flex-col gap-3"
          >
            <Label variant="form" id="chip-scopes-title" step={2}>
              Scopes
            </Label>
            {scopeGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-1.5">
                <p className="text-xs font-bold text-muted">{group.title}</p>
                <ChipGroup
                  ariaLabel={group.title}
                  options={group.items.map(toChip)}
                  value={scopes}
                  onValueChange={setScopes}
                />
              </div>
            ))}
          </div>
        </div>
        <ValueReadout>value: [{scopes.join(', ')}]</ValueReadout>
      </MockSection>

      <MockSection title="Ninguno seleccionado · opción deshabilitada">
        <ChipGroup
          ariaLabel="Twilio"
          options={[
            ...['twilio.read', 'twilio.manage'].map(toChip),
            { value: 'twilio.billing', label: 'billing', disabled: true },
          ]}
          value={single}
          onValueChange={setSingle}
        />
        <ValueReadout>value: [{single.join(', ')}]</ValueReadout>
      </MockSection>

      <MockSection
        title="layout=scroll en contenedor estrecho"
        hint="Sin envolver: se desplaza en horizontal."
      >
        <div className="max-w-xs">
          <ChipGroup
            ariaLabel="Campañas (scroll)"
            layout="scroll"
            options={scopeGroups[0].items.map(toChip)}
            value={scroll}
            onValueChange={setScroll}
          />
        </div>
        <ValueReadout>value: [{scroll.join(', ')}]</ValueReadout>
      </MockSection>
    </MockShell>
  )
}
