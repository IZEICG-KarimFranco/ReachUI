import { useState } from 'react'
import { Field } from '@/components/ui/inputs/field'
import { Label } from '@/components/ui/inputs/label'
import { Checkbox } from '@/components/ui/selection/checkbox'
import {
  RadioCard,
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/selection/radio-group'
import { Switch } from '@/components/ui/selection/switch'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

export default function SelectionControlsMockPage() {
  const [channel, setChannel] = useState('sms')
  const [mode, setMode] = useState('now')
  const [active, setActive] = useState(true)
  const [vip, setVip] = useState(false)
  const [terms, setTerms] = useState<boolean | 'indeterminate'>(false)

  return (
    <MockShell
      title="RadioGroup, Switch y Checkbox"
      description="Contrato «Checkbox / RadioGroup / Switch»: radio = opción excluyente, switch = preferencia booleana, checkbox = selección independiente. El mock tiene radio-cards y switch-toggle (t02-controls.html); no tiene checkbox."
    >
      <MockSection
        title="RadioGroup · radio-cards (canal)"
        hint="Mock radio-cards. Flechas cambian la selección; Tab entra en la seleccionada."
      >
        <RadioGroup
          aria-label="Canal"
          value={channel}
          onValueChange={setChannel}
          className="flex max-w-md flex-col gap-2"
        >
          <RadioCard
            value="sms"
            title="SMS"
            description="Disponible en tu número"
          />
          <RadioCard
            value="wa"
            title="WhatsApp"
            description="Requiere plantilla aprobada"
          />
          <RadioCard
            value="rcs"
            title="RCS"
            description="Solo Android compatible"
            disabled
          />
        </RadioGroup>
        <ValueReadout>value: {channel}</ValueReadout>
      </MockSection>

      <MockSection title="RadioGroup · items simples con Label">
        <RadioGroup
          aria-label="Momento del envío"
          value={mode}
          onValueChange={setMode}
          className="flex flex-col gap-3"
        >
          {[
            { value: 'now', label: 'Enviar ahora' },
            { value: 'later', label: 'Programar' },
            {
              value: 'draft',
              label: 'Guardar borrador (deshabilitado)',
              disabled: true,
            },
          ].map((item) => (
            <div key={item.value} className="flex items-center gap-2">
              <RadioGroupItem
                id={`mode-${item.value}`}
                value={item.value}
                disabled={item.disabled}
              />
              <Label variant="form" htmlFor={`mode-${item.value}`}>
                {item.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <ValueReadout>value: {mode}</ValueReadout>
      </MockSection>

      <MockSection
        title="Switch · switch-toggle"
        hint="Mock .tgl con .tlab (etiqueta en línea por la prop label)."
      >
        <div className="flex flex-col gap-4">
          <Switch label="Activo" checked={active} onCheckedChange={setActive} />
          <Switch
            label="Cliente VIP (variant signal)"
            variant="signal"
            checked={vip}
            onCheckedChange={setVip}
          />
          <Switch label="Inactivo (deshabilitado)" disabled />
          <Switch label="Activo (deshabilitado)" disabled defaultChecked />
          <div className="flex max-w-sm flex-col gap-4">
            <Field
              label="Field vertical (por defecto): el Switch se estira"
              description="[&>*]:w-full de Field alcanza al Switch; la perilla no llega al final."
            >
              <Switch defaultChecked />
            </Field>
            <Field
              orientation="horizontal"
              label="Obligatorio al crear contacto"
            >
              <Switch defaultChecked />
            </Field>
          </div>
        </div>
        <ValueReadout>
          activo: {String(active)} · vip: {String(vip)}
        </ValueReadout>
      </MockSection>

      <MockSection
        title="Checkbox · estado actual (sin refactorizar, sin referencia en el mock)"
        hint="Sigue con clases de shadcn (12 hallazgos broken en legacy-scan): sirve para ver qué hay hoy, no como referencia."
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="cb-terms"
              checked={terms}
              onCheckedChange={setTerms}
            />
            <Label variant="form" htmlFor="cb-terms">
              Acepto los términos
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-indeterminate" checked="indeterminate" />
            <Label variant="form" htmlFor="cb-indeterminate">
              Indeterminado
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-disabled" disabled defaultChecked />
            <Label variant="form" htmlFor="cb-disabled">
              Deshabilitado y marcado
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-invalid" aria-invalid />
            <Label variant="form" htmlFor="cb-invalid">
              Inválido
            </Label>
          </div>
        </div>
        <ValueReadout>términos: {String(terms)}</ValueReadout>
      </MockSection>
    </MockShell>
  )
}
