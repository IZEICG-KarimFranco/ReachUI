import { useState } from 'react'
import { Field } from '@/components/ui/inputs/field'
import { DatePicker } from '@/components/ui/inputs/date-picker'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

export default function DatePickerMockPage() {
  const [date, setDate] = useState('2026-04-02')
  const [time, setTime] = useState('09:30')
  const [dateTime, setDateTime] = useState('2026-04-02T09:30')
  const [from, setFrom] = useState('2026-04-01')
  const [to, setTo] = useState('2026-04-30')

  return (
    <MockShell
      title="DatePicker / TimePicker (nativos)"
      description="Wrapper fino sobre input date, time y datetime-local: el formato y el selector los pone el navegador. Clic en cualquier parte del campo abre el selector nativo."
    >
      <MockSection title="Tipos">
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Fecha">
            <DatePicker value={date} onValueChange={setDate} />
          </Field>
          <Field label="Hora">
            <DatePicker type="time" value={time} onValueChange={setTime} />
          </Field>
          <Field label="Fecha y hora">
            <DatePicker
              type="datetime-local"
              value={dateTime}
              onValueChange={setDateTime}
            />
          </Field>
        </div>
        <ValueReadout>
          date: {date} · time: {time} · datetime: {dateTime}
        </ValueReadout>
      </MockSection>

      <MockSection
        title="Rango con dos instancias (min / max cruzados)"
        hint="El contrato compone el rango con dos DatePicker; el «hasta» no deja elegir antes del «desde»."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Desde">
            <DatePicker value={from} max={to} onValueChange={setFrom} />
          </Field>
          <Field label="Hasta">
            <DatePicker value={to} min={from} onValueChange={setTo} />
          </Field>
        </div>
        <ValueReadout>
          rango: {from} → {to}
        </ValueReadout>
      </MockSection>

      <MockSection title="Estados">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Programar envío" required>
            <DatePicker type="datetime-local" />
          </Field>
          <Field label="Fecha de envío" error="La fecha debe ser futura">
            <DatePicker value="2020-01-01" onValueChange={() => undefined} />
          </Field>
          <Field label="Fecha (deshabilitada)" disabled>
            <DatePicker value="2026-04-02" onValueChange={() => undefined} />
          </Field>
          <Field label="Creada (solo lectura)" readOnly>
            <DatePicker
              value="2026-03-15"
              readOnly
              onValueChange={() => undefined}
            />
          </Field>
        </div>
      </MockSection>
    </MockShell>
  )
}
