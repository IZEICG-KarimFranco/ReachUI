import { Input } from '@/components/ui/inputs/input'
import { Label } from '@/components/ui/inputs/label'
import { Checkbox } from '@/components/ui/selection/checkbox'
import { MockSection, MockShell } from '@/pages/dev/mock/mock-shell'

const stepCases = [
  { id: 'lb-step-number', step: 1, hint: 'step={1} → 01' },
  { id: 'lb-step-string', step: '02', hint: 'step="02"' },
  { id: 'lb-step-long', step: 12, hint: 'step={12} → 12' },
  { id: 'lb-step-zero', step: 0, hint: 'step={0} → 00' },
  { id: 'lb-step-empty', step: '', hint: 'step="" → sin índice' },
] as const

export default function LabelMockPage() {
  return (
    <MockShell
      title="Label"
      description="Mock switchboard-soft.css:268-269 (.flab, .nnum). Variante form: texto 12 px / 600 en ink-secondary, índice mono en signal-contrast y asterisco de requerido. Los casos dentro de Field están en /dev/mock/field."
    >
      <MockSection
        title="variant · form frente a legacy"
        hint="legacy sigue siendo el valor por defecto hasta terminar la migración (T02–T06)."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="lb-legacy">Legacy (por defecto)</Label>
            <Input id="lb-legacy" placeholder="Sin variant" />
          </div>
          <div className="flex flex-col gap-2">
            <Label variant="form" htmlFor="lb-form">
              Nombre de la campaña
            </Label>
            <Input id="lb-form" placeholder='variant="form"' />
          </div>
        </div>
      </MockSection>

      <MockSection
        title="step · índice .nnum"
        hint="Se rellena a dos dígitos; solo se omite con undefined o cadena vacía."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {stepCases.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <Label variant="form" htmlFor={item.id} step={item.step}>
                Remitente
              </Label>
              <Input id={item.id} placeholder={item.hint} />
            </div>
          ))}
        </div>
      </MockSection>

      <MockSection
        title="required · asterisco"
        hint="El asterisco es aria-hidden: la semántica de obligatorio va en el control (required en el input)."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label variant="form" htmlFor="lb-req" required>
              Correo
            </Label>
            <Input id="lb-req" type="email" required placeholder="required" />
          </div>
          <div className="flex flex-col gap-2">
            <Label variant="form" htmlFor="lb-req-step" step={3} required>
              Destinatario
            </Label>
            <Input id="lb-req-step" required placeholder="step={3} required" />
          </div>
        </div>
      </MockSection>

      <MockSection
        title="deshabilitado · peer y group"
        hint="peer-disabled: la etiqueta va justo después de un control deshabilitado con clase peer. group-data-[disabled=true]: un ancestro .group con data-disabled."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Checkbox id="lb-peer-on" />
              <Label variant="form" htmlFor="lb-peer-on">
                Checkbox habilitado
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="lb-peer-off" disabled />
              <Label variant="form" htmlFor="lb-peer-off">
                Checkbox deshabilitado (peer-disabled)
              </Label>
            </div>
          </div>
          <div className="group flex flex-col gap-2" data-disabled="true">
            <Label variant="form" htmlFor="lb-group" step={4}>
              Canal (group data-disabled)
            </Label>
            <Input id="lb-group" disabled defaultValue="WhatsApp" />
          </div>
        </div>
      </MockSection>

      <MockSection
        title="texto largo · envoltura"
        hint="Contenedor de 220 px: el texto envuelve en su columna y el índice queda alineado a la base de la primera línea (LB-3)."
      >
        <div className="flex flex-col gap-2" style={{ maxWidth: 220 }}>
          <Label variant="form" htmlFor="lb-long" step={5} required>
            Una etiqueta muy larga que debería envolver sin montarse sobre el
            índice
          </Label>
          <Input id="lb-long" />
        </div>
      </MockSection>

      <MockSection
        title="asociación · htmlFor"
        hint="Clic en la etiqueta enfoca el input; doble clic no selecciona el texto (select-none de Radix)."
      >
        <div className="flex flex-col gap-2" style={{ maxWidth: 320 }}>
          <Label variant="form" htmlFor="lb-click" step={6}>
            Haz clic aquí
          </Label>
          <Input id="lb-click" placeholder="Recibe el foco" />
        </div>
      </MockSection>
    </MockShell>
  )
}
