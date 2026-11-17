import { StatusDot } from '@/components/ui/feedback/status-dot'
import { StatusLabel } from '@/components/ui/feedback/status-label'
import { MockNav } from '@/pages/dev/mock/mock-nav'

const statusLabels = [
  { tone: 'success', label: 'Aprobada' },
  { tone: 'live', label: 'En revisión' },
  { tone: 'error', label: 'Rechazada' },
  { tone: 'neutral', label: 'Borrador' },
  { tone: 'info', label: 'Enviada' },
] as const

const statusInline = [
  { tone: 'success', label: 'Activo', pulse: false },
  { tone: 'live', label: 'Procesando', pulse: true },
  { tone: 'error', label: 'Error', pulse: false },
  { tone: 'neutral', label: 'Pausado', pulse: false },
] as const

const dotTones = [
  'success',
  'live',
  'error',
  'info',
  'signal',
  'neutral',
] as const

const checklist = [
  {
    tone: 'success',
    title: 'Audiencia válida',
    detail: 'Clientes activos Q1',
  },
  {
    tone: 'success',
    title: 'Remitente operativo',
    detail: '+52 55 1234 5678 con verificación vigente',
  },
  {
    tone: 'success',
    title: 'Mensaje',
    detail: '128 caracteres, variables mapeadas',
  },
  { tone: 'live', title: 'Prueba de envío', detail: 'opcional, recomendado' },
] as const

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <>
      <h2 className="mb-2 text-label uppercase text-muted">{title}</h2>
      <div className="mb-6 flex flex-wrap items-center gap-4 last:mb-0">
        {children}
      </div>
    </>
  )
}

export default function StatusLabelMockPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-6 text-lg font-semibold">StatusLabel · variantes</h1>

      <section className="rounded-surface border border-line bg-card p-6 text-ink">
        <Section title="status-labels · size default (12px/600)">
          {statusLabels.map(({ tone, label }) => (
            <StatusLabel key={label} tone={tone}>
              {label}
            </StatusLabel>
          ))}
        </Section>

        <Section title="status-inline · size inline (11px/700)">
          {statusInline.map(({ tone, label, pulse }) => (
            <StatusLabel key={label} tone={tone} size="inline" pulse={pulse}>
              {label}
            </StatusLabel>
          ))}
        </Section>

        <Section title="dotPosition · right (por defecto)">
          {statusLabels.map(({ tone, label }) => (
            <StatusLabel key={label} tone={tone}>
              {label}
            </StatusLabel>
          ))}
        </Section>

        <Section title="dotPosition · left">
          {statusLabels.map(({ tone, label }) => (
            <StatusLabel key={label} tone={tone} dotPosition="left">
              {label}
            </StatusLabel>
          ))}
        </Section>

        <Section title="pulse · sin animación vs con animación">
          <StatusLabel tone="live">En revisión</StatusLabel>
          <StatusLabel tone="live" pulse>
            En revisión
          </StatusLabel>
          <StatusLabel tone="success" size="inline" dotPosition="left">
            Activo
          </StatusLabel>
          <StatusLabel tone="success" size="inline" dotPosition="left" pulse>
            Activo
          </StatusLabel>
        </Section>

        <Section title="StatusDot · una fila por tono (md, con texto)">
          {dotTones.map((tone) => (
            <StatusDot key={tone} tone={tone}>
              {tone}
            </StatusDot>
          ))}
        </Section>

        <Section title="StatusDot · size sm (6px) vs md (8px)">
          <StatusDot tone="success" size="sm">
            sm
          </StatusDot>
          <StatusDot tone="success" size="md">
            md
          </StatusDot>
        </Section>

        <Section title="StatusDot · punto solo (decorativo vs con aria-label)">
          <StatusDot tone="success" />
          <StatusDot tone="success" aria-label="Conectado" />
          <span className="flex w-64 items-center justify-between font-mono text-xs">
            Papeleta · CMP-0441
            <StatusDot tone="success" aria-label="Activa" />
          </span>
        </Section>

        <h2 className="mb-2 text-label uppercase text-muted">
          StatusDot · lista con textos largos (alineación a 2 líneas)
        </h2>
        <ul className="max-w-xs divide-y divide-line">
          {checklist.map(({ tone, title, detail }) => (
            <li key={title} className="py-3 text-sm">
              <StatusDot tone={tone}>
                <span>
                  <strong>{title}</strong> — {detail}
                </span>
              </StatusDot>
            </li>
          ))}
          <li className="py-3 text-sm">
            <StatusDot tone="signal">
              <strong>Organización</strong>
            </StatusDot>
          </li>
        </ul>
      </section>
      </main>
    </div>
  )
}
