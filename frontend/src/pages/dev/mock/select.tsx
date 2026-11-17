import { useState } from 'react'
import { Field } from '@/components/ui/inputs/field'
import { Select, type SelectOption } from '@/components/ui/selection/select'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

const senders: SelectOption[] = [
  {
    value: 'main',
    label: '+52 55 1234 5678',
    description: 'Número principal · México',
    tag: 'SMS',
  },
  {
    value: 'wa',
    label: '+52 55 8765 4321',
    description: 'WhatsApp Business',
    tag: 'WA',
  },
  {
    value: 'us',
    label: '+1 415 555 0132',
    description: 'Estados Unidos · sin verificar',
    disabled: true,
  },
]

const countries: SelectOption[] = [
  'Argentina',
  'Bolivia',
  'Brasil',
  'Canadá',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Ecuador',
  'El Salvador',
  'España',
  'Estados Unidos',
  'Guatemala',
  'Honduras',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'Puerto Rico',
  'República Dominicana',
  'Uruguay',
  'Venezuela',
].map((name) => ({ value: name.toLowerCase(), label: name }))

export default function SelectMockPage() {
  const [sender, setSender] = useState('main')
  const [country, setCountry] = useState('méxico')

  return (
    <MockShell
      title="Select"
      description="API única por options; searchable para listas largas (más de 20 opciones). Dentro de Field toma id, disabled y estado de error."
    >
      <MockSection title="Simple · con descripción, tag y opción deshabilitada">
        <div className="max-w-sm">
          <Field
            label="Remitente"
            step={1}
            description="Los números provienen de tu instancia Twilio."
          >
            <Select
              options={senders}
              value={sender}
              onValueChange={setSender}
            />
          </Field>
        </div>
        <ValueReadout>value: {sender}</ValueReadout>
      </MockSection>

      <MockSection
        title="searchable · 23 países"
        hint="Escribe para filtrar; prueba un texto sin coincidencias para ver el vacío."
      >
        <div className="max-w-sm">
          <Field label="País">
            <Select
              options={countries}
              value={country}
              onValueChange={setCountry}
              searchable
              searchPlaceholder="Buscar país…"
            />
          </Field>
        </div>
        <ValueReadout>value: {country}</ValueReadout>
      </MockSection>

      <MockSection title="Placeholder, error, deshabilitado y loading">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Idioma">
            <Select options={countries.slice(0, 3)} placeholder="Elige uno" />
          </Field>
          <Field label="Plantilla" error="Selecciona una plantilla">
            <Select options={senders} placeholder="Elige una plantilla" />
          </Field>
          <Field label="Remitente (deshabilitado)" disabled>
            <Select options={senders} defaultValue="main" />
          </Field>
          <Field label="Cargando opciones">
            <Select options={[]} placeholder="Cargando…" loading />
          </Field>
        </div>
      </MockSection>
    </MockShell>
  )
}
