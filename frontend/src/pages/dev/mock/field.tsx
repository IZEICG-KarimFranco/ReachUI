import { Button, IconButton } from '@/components/ui/actions/button'
import { Field, FieldLabel } from '@/components/ui/inputs/field'
import { Label } from '@/components/ui/inputs/label'
import { Input } from '@/components/ui/inputs/input'
import { Select } from '@/components/ui/selection/select'
import { Textarea } from '@/components/ui/inputs/textarea'
import { MockNav } from '@/pages/dev/mock/mock-nav'
import { Plus, X } from 'lucide-react'

const options = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português', disabled: true },
]

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-8 rounded-surface border border-line bg-card p-6 text-ink">
      <h2 className="text-label uppercase text-muted">{title}</h2>
      {hint && <p className="mt-1 mb-4 text-xs text-muted">{hint}</p>}
      {!hint && <div className="mb-4" />}
      {children}
    </section>
  )
}

export function FieldMockCases() {
  return (
    <div className="flex flex-col gap-6" data-shot="field-mock-cases">
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Nombre de la campaña"
          description="Tal como la verá tu equipo, no el contacto."
        >
          <Input defaultValue="Promo primavera — reactivación" />
        </Field>
        <Field label="Email" error="Formato inválido">
          <Input type="email" defaultValue="correo-malo" />
        </Field>
        <Field
          label="Mensaje"
          description="128 caracteres · 1 segmento · los chips de abajo insertan variables"
        >
          <Textarea defaultValue="Hola {{nombre}}, tu pedido está listo." />
        </Field>
        <Field label="Campo bloqueado" disabled>
          <Input defaultValue="Solo lectura" />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Remitente"
          step={1}
          description="Los números provienen de tu instancia Twilio."
        >
          <Select options={options} placeholder="+52 55 1234 5678" />
        </Field>
        <Field
          label="Plantilla"
          step={2}
          description="Solo aparecen plantillas compatibles con el canal."
        >
          <Select options={options} placeholder="Elige una plantilla" />
        </Field>
        <Field label="Nombre completo" step={1}>
          <Input defaultValue="Adrián Meza" />
        </Field>
        <Field
          label="Correo"
          step={2}
          disabled
          description="Gestionado por el proveedor de identidad"
        >
          <Input defaultValue="adrian@izei.mx" />
        </Field>
        <Field
          label="Teléfono"
          step={3}
          description="E164 · se usa para alertas de sistema"
        >
          <Input defaultValue="+52 81 2034 5588" inputMode="tel" />
        </Field>
        <Field
          label="Nombre"
          step={1}
          required
          error="Ya existe una lista con este nombre"
        >
          <Input defaultValue="Leads feria septiembre" />
        </Field>
      </div>
    </div>
  )
}

export function LabelShots() {
  return (
    <div className="flex flex-col gap-6" data-shot="label">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Label htmlFor="lb-legacy">Legacy (por defecto)</Label>
          <Input id="lb-legacy" placeholder="Sin variant" />
        </div>
        <div className="flex flex-col gap-3">
          <Label variant="form" htmlFor="lb-form" data-probe="label-form">
            Vista previa
          </Label>
          <Input id="lb-form" placeholder="variant=form, sin step" />
        </div>
        <div className="flex flex-col gap-3">
          <Label
            variant="form"
            htmlFor="lb-step"
            step={1}
            data-probe="label-step"
          >
            Remitente
          </Label>
          <Input id="lb-step" placeholder="step={1}" />
        </div>
        <div className="flex flex-col gap-3">
          <Label variant="form" htmlFor="lb-req" step="02" required>
            Destinatario
          </Label>
          <Input id="lb-req" placeholder='step="02" required' />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Grupos guardados" step={1}>
          <Input placeholder="Field con step" />
        </Field>
        <Field label="Estado" step={2} required>
          <Input placeholder="Field con step y required" />
        </Field>
        <Field label="Canal" step={3} disabled>
          <Input defaultValue="WhatsApp" />
        </Field>
        <Field label="Correo" step={2} error="Formato inválido">
          <Input defaultValue="correo-malo" />
        </Field>
        <Field required>
          <FieldLabel step={3}>FieldLabel dentro de Field required</FieldLabel>
          <Input placeholder="FieldLabel" />
        </Field>
        <Field
          step={4}
          label="Una etiqueta muy larga que debería envolver sin montarse sobre el índice ni sobre el control de abajo"
        >
          <Input />
        </Field>
      </div>
    </div>
  )
}

export default function FieldMockPage() {
  return (
    <div className="min-h-dvh w-full bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-2 text-lg font-semibold">
          Field · Input · Textarea · Select
        </h1>
        <p className="mb-6 text-xs text-muted">
          Usa Tab para recorrer los controles y comprobar el foco (utilidades{' '}
          <code className="font-mono">focus-ring</code> y{' '}
          <code className="font-mono">focus-ring-field</code>).
        </p>

        <Section
          title="Casos del mock · Field con label, step, description y error"
          hint="t02-controls (field-input, field-error, field-textarea, field-disabled), campaign-wizard (Remitente, Plantilla), config (perfil) y lists (nombre duplicado)."
        >
          <FieldMockCases />
        </Section>

        <Section
          title="Descripción y error · mismo campo en sus tres estados"
          hint="Con error, el mensaje reemplaza a la descripción (role=alert, text-error). El control pinta el borde de error."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Correo de contacto" step={1}>
              <Input type="email" placeholder="equipo@empresa.com" />
            </Field>
            <Field
              label="Correo de contacto"
              step={1}
              description="Te avisaremos aquí cuando termine el envío."
            >
              <Input type="email" placeholder="equipo@empresa.com" />
            </Field>
            <Field
              label="Correo de contacto"
              step={1}
              description="Te avisaremos aquí cuando termine el envío."
              error="Formato inválido: falta el dominio."
            >
              <Input type="email" defaultValue="equipo@" />
            </Field>
            <Field label="Idioma" step={2}>
              <Select options={options} placeholder="Elige un idioma" />
            </Field>
            <Field
              label="Idioma"
              step={2}
              description="Se usa en plantillas y notificaciones."
            >
              <Select options={options} placeholder="Elige un idioma" />
            </Field>
            <Field
              label="Idioma"
              step={2}
              description="Se usa en plantillas y notificaciones."
              error="Elige un idioma para continuar."
            >
              <Select options={options} placeholder="Elige un idioma" />
            </Field>
          </div>
        </Section>

        <Section title="Label · .flab / .nnum">
          <LabelShots />
        </Section>

        <Section title="Input · estados dentro de Field">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nombre" description="Como aparece en tu perfil.">
              <Input placeholder="Adrián Martínez" />
            </Field>
            <Field label="Correo" required>
              <Input type="email" placeholder="adrian@ejemplo.com" />
            </Field>
            <Field label="Teléfono" error="Revisa el número: faltan dígitos.">
              <Input defaultValue="+52 55 12" />
            </Field>
            <Field label="Organización" disabled>
              <Input defaultValue="IZEI Consulting" />
            </Field>
            <Field label="Identificador" readOnly description="Solo lectura.">
              <Input defaultValue="CT-88213" />
            </Field>
            <Field label="Texto largo">
              <Input defaultValue="Un valor muy largo que no debería romper el diseño del campo ni desbordar su contenedor" />
            </Field>
          </div>
        </Section>

        <Section title="Textarea">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Mensaje" description="Hasta 160 caracteres.">
              <Textarea placeholder="Escribe el mensaje…" />
            </Field>
            <Field label="Notas" error="Este campo es obligatorio.">
              <Textarea />
            </Field>
          </div>
        </Section>

        <Section title="Select">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Idioma">
              <Select options={options} placeholder="Elige un idioma" />
            </Field>
            <Field label="Idioma (deshabilitado)" disabled>
              <Select options={options} defaultValue="es" />
            </Field>
          </div>
        </Section>

        <Section
          title="Foco · botones y campos juntos"
          hint="Los campos usan borde y halo al hacer clic o Tab; los botones solo con teclado."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Input className="w-56" placeholder="Campo suelto" />
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="quiet">Quiet</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="secondary" size="compact">
              Compact
            </Button>
            <IconButton aria-label="Añadir" variant="secondary">
              <Plus />
            </IconButton>
            <IconButton aria-label="Cerrar" variant="quiet">
              <X />
            </IconButton>
          </div>
        </Section>
      </main>
    </div>
  )
}
