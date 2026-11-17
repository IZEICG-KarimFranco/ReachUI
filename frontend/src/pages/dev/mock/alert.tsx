import { CircleCheck } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/feedback/alert'
import { MockNav } from '@/pages/dev/mock/mock-nav'

const legacyVariants = [
  'default',
  'destructive',
  'warning',
  'info',
  'success',
  'primary',
] as const

function Shot({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="mb-6" data-shot={name}>
      <h2 className="mb-2 font-mono text-label uppercase text-muted">{name}</h2>
      <div className="w-full">{children}</div>
    </div>
  )
}

export default function AlertMockPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-6 text-lg font-semibold">Alert · estados</h1>

        <Shot name="alert-warning">
          <Alert
            tone="warning"
            title="2 plantillas en revisión."
            action={{ label: 'Ver plantillas', href: '#' }}
            description="Meta suele responder en menos de 24 h."
          />
        </Shot>

        <Shot name="alert-info">
          <Alert
            tone="info"
            title="Twilio conectado."
            action={{ label: 'Detalles', href: '#' }}
            description="La verificación tardó 184 ms."
          />
        </Shot>

        <Shot name="alert-success">
          <Alert
            tone="success"
            title="Plantilla aprobada."
            description="Ya puedes usarla en tus campañas."
          />
        </Shot>

        <Shot name="alert-error">
          <Alert
            tone="error"
            title="Sync falló"
            description="No pudimos actualizar el estado de la plantilla. Reintenta en unos minutos."
          />
        </Shot>

        <Shot name="alert-signal">
          <Alert
            tone="signal"
            title="Sesión"
            description="Tu sesión usa el correo del SSO. El nombre y teléfono son los datos visibles para tu equipo en el inbox y la supervisión."
          />
        </Shot>

        <Shot name="alert-con-children (debajo de la descripción)">
          <Alert
            tone="success"
            title="Plantilla aprobada."
            description="Ya puedes usarla en tus campañas."
          >
            <span className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-muted">
              <CircleCheck aria-hidden="true" className="size-3.5" />
              HX7a91c2
            </span>
          </Alert>
        </Shot>

        <Shot name="alert-sin-titulo">
          <Alert tone="info" description="Sin título ni acción." />
        </Shot>

        <Shot name="alert-largo (envuelve en 2+ líneas)">
          <Alert
            tone="warning"
            title="Plantillas en revisión con un título bastante largo."
            action={{ label: 'Ver plantillas', href: '#' }}
            description="Meta suele responder en menos de 24 h, aunque en periodos de alta demanda puede tardar más de lo habitual."
          />
        </Shot>

        <h2 className="mb-2 mt-10 font-mono text-label uppercase text-muted">
          LEGACY · variant (borrar al terminar la migración)
        </h2>
        <div className="flex w-full flex-col gap-3">
          {legacyVariants.map((variant) => (
            <Alert key={variant} variant={variant}>
              <AlertTitle>variant="{variant}"</AlertTitle>
              <AlertDescription>Alert legacy sin cambios.</AlertDescription>
            </Alert>
          ))}
        </div>
      </main>
    </div>
  )
}
