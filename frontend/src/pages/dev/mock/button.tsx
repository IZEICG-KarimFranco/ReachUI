import { useState, type ReactNode } from 'react'
import { EllipsisVertical, Plus, Trash2, X } from 'lucide-react'

import { Button, IconButton, type ButtonProps } from '@/components/ui/actions/button'
import { MockNav } from '@/pages/dev/mock/mock-nav'
import { useViewportWidth } from '@/pages/dev/mock/mock-pages'

type Variant = NonNullable<ButtonProps['variant']>
type Size = NonNullable<ButtonProps['size']>

const contractVariants = [
  { variant: 'primary', label: 'Despachar campaña →' },
  { variant: 'secondary', label: 'Siguiente →' },
  { variant: 'quiet', label: 'Descartar' },
  { variant: 'danger', label: 'Destructivo' },
] as const satisfies readonly { variant: Variant; label: string }[]

const toneVariants = [
  { variant: 'success', label: 'Aceptar' },
  { variant: 'warning', label: 'En espera' },
] as const satisfies readonly { variant: Variant; label: string }[]

const legacyVariants: { legacy: Variant; now: Variant | null }[] = [
  { legacy: 'default', now: 'primary' },
  { legacy: 'outline', now: 'secondary' },
  { legacy: 'ghost', now: 'quiet' },
  { legacy: 'destructive', now: 'danger' },
  { legacy: 'link', now: null },
  { legacy: 'info', now: null },
]

const legacySizes: { legacy: Size; now: Size | null }[] = [
  { legacy: 'sm', now: 'compact' },
  { legacy: 'lg', now: null },
]

const legacyIconSizes: { legacy: Size; now: Size | null }[] = [
  { legacy: 'icon-sm', now: 'icon' },
  { legacy: 'icon-lg', now: null },
]

const INTERACTION_NOTE =
  'Hover y foco: pasa el ratón y navega con Tab para verlos; no se pueden forzar en una captura.'

function Section({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: ReactNode
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-1 font-mono text-label uppercase text-muted">
        {title}
      </h2>
      {note && <p className="mb-3 text-xs text-ink-secondary">{note}</p>}
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div>
      {label && (
        <p className="mb-1.5 font-mono text-xs text-ink-secondary">{label}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

function LoadingDemo() {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      variant="primary"
      loading={loading}
      onClick={() => {
        setLoading(true)
        setTimeout(() => setLoading(false), 2000)
      }}
    >
      {loading ? 'Guardando…' : 'Haz clic para cargar 2 s'}
    </Button>
  )
}

export default function ButtonMockPage() {
  const width = useViewportWidth()

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-4 sm:p-6">
        <h1 className="mb-4 text-lg font-semibold">Button · pruebas</h1>

      <p className="mb-6 rounded-surface border border-line bg-card p-3 font-mono text-xs text-ink-secondary">
        {width} px · {INTERACTION_NOTE}
      </p>

      <Section
        title="button-variants · contrato"
        note="primary, secondary, quiet y danger; la segunda fila usa size compact (alias del `.btn.sm` del mock)."
      >
        <Row label="size default">
          {contractVariants.map(({ variant, label }) => (
            <Button key={variant} variant={variant}>
              {label}
            </Button>
          ))}
        </Row>
        <Row label="size compact">
          {contractVariants.map(({ variant, label }) => (
            <Button key={variant} variant={variant} size="compact">
              {label}
            </Button>
          ))}
        </Row>
      </Section>

      <Section
        title="button-states · mock"
        note="success y warning aparecen en el mock como estados, no como CTA."
      >
        <Row>
          {toneVariants.map(({ variant, label }) => (
            <Button key={variant} variant={variant}>
              {label}
            </Button>
          ))}
          <Button variant="primary" loading>
            Guardando…
          </Button>
          <Button variant="secondary" disabled>
            Deshabilitado
          </Button>
        </Row>
      </Section>

      <Section
        title="Estados por variante"
        note="Normal, disabled y loading de cada variante del contrato."
      >
        {contractVariants.map(({ variant, label }) => (
          <Row key={variant} label={variant}>
            <Button variant={variant}>{label}</Button>
            <Button variant={variant} disabled>
              {label}
            </Button>
            <Button variant={variant} loading>
              {label}
            </Button>
          </Row>
        ))}
      </Section>

      <Section
        title="IconButton · objetivo ≥ 44 px"
        note="Siempre con aria-label."
      >
        <Row label="icon">
          <IconButton aria-label="Más acciones">
            <EllipsisVertical />
          </IconButton>
          <IconButton variant="primary" aria-label="Añadir">
            <Plus />
          </IconButton>
          <IconButton variant="quiet" aria-label="Cerrar">
            <X />
          </IconButton>
          <IconButton variant="danger" aria-label="Eliminar">
            <Trash2 />
          </IconButton>
          <IconButton aria-label="Deshabilitado" disabled>
            <Plus />
          </IconButton>
        </Row>
      </Section>

      <Section title="asChild e interacción">
        <Row label="asChild (enlace con estilo de botón)">
          <Button asChild variant="secondary">
            <a href="#button-aschild">Enlace como botón</a>
          </Button>
        </Row>
        <Row label="loading interactivo">
          <LoadingDemo />
        </Row>
      </Section>

      <Section
        title="LEGACY · variantes"
        note="Borrar al terminar la migración (T02–T06). Cada fila muestra el nombre legacy y, al lado, su equivalente del contrato."
      >
        {legacyVariants.map(({ legacy, now }) => (
          <Row
            key={legacy}
            label={now ? `${legacy} → ${now}` : `${legacy} → sin equivalente`}
          >
            <Button variant={legacy}>{legacy}</Button>
            {now && <Button variant={now}>{now}</Button>}
          </Row>
        ))}
      </Section>

      <Section title="LEGACY · tamaños">
        {legacySizes.map(({ legacy, now }) => (
          <Row
            key={legacy}
            label={now ? `${legacy} → ${now}` : `${legacy} → sin equivalente`}
          >
            <Button size={legacy}>{legacy}</Button>
            {now && <Button size={now}>{now}</Button>}
          </Row>
        ))}
        {legacyIconSizes.map(({ legacy, now }) => (
          <Row
            key={legacy}
            label={now ? `${legacy} → ${now}` : `${legacy} → sin equivalente`}
          >
            <IconButton size={legacy} aria-label={legacy}>
              <Plus />
            </IconButton>
            {now && (
              <IconButton size={now} aria-label={now}>
                <Plus />
              </IconButton>
            )}
          </Row>
        ))}
      </Section>
      </main>
    </div>
  )
}
