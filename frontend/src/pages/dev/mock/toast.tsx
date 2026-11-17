import { useState, type ReactNode } from 'react'
import { toast, type ExternalToast } from 'sonner'

import { Button } from '@/components/ui/actions/button'
import { MockNav } from '@/pages/dev/mock/mock-nav'
import { useViewportWidth } from '@/pages/dev/mock/mock-pages'
import { toastCases, type ToastCase } from '@/pages/dev/mock/toast-cases'

type Position = NonNullable<ExternalToast['position']> | 'default'

const positions: { value: Position; label: string }[] = [
  {
    value: 'default',
    label:
      'Por defecto (abajo centro en escritorio, arriba centro por debajo de 981 px)',
  },
  { value: 'top-right', label: 'Arriba derecha' },
  { value: 'bottom-right', label: 'Abajo derecha' },
]

const groups: { id: ToastCase['group']; title: string }[] = [
  { id: 'tipos', title: 'Tipos' },
  { id: 'contenido', title: 'Contenido' },
  { id: 'reales', title: 'Casos reales de la app' },
]

const SONNER_MOBILE_MAX = 600

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 font-mono text-label uppercase text-muted">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </section>
  )
}

export default function ToastMockPage() {
  const width = useViewportWidth()
  const [fixed, setFixed] = useState(false)
  const [position, setPosition] = useState<Position>('default')

  const options: ExternalToast = {
    duration: fixed ? Infinity : undefined,
    position: position === 'default' ? undefined : position,
  }

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-4 sm:p-6">
        <h1 className="mb-4 text-lg font-semibold">Toast · pruebas</h1>

        <p className="mb-6 rounded-surface border border-line bg-card p-3 font-mono text-xs text-ink-secondary">
          {width} px ·{' '}
          {width <= SONNER_MOBILE_MAX
            ? 'Sonner en modo móvil (≤ 600 px): ancho completo con 16 px de margen'
            : 'Sonner en modo escritorio: 356 px de ancho'}
        </p>

        <Section title="Duración">
          <Button
            size="sm"
            variant={fixed ? 'outline' : 'default'}
            aria-pressed={!fixed}
            onClick={() => setFixed(false)}
          >
            Automática (4 s)
          </Button>
          <Button
            size="sm"
            variant={fixed ? 'default' : 'outline'}
            aria-pressed={fixed}
            onClick={() => setFixed(true)}
          >
            Fija hasta cerrar
          </Button>
        </Section>

        <Section title="Posición de los próximos toasts">
          {positions.map(({ value, label }) => (
            <Button
              key={value}
              size="sm"
              variant={position === value ? 'default' : 'outline'}
              aria-pressed={position === value}
              onClick={() => setPosition(value)}
            >
              {label}
            </Button>
          ))}
        </Section>

        {groups.map(({ id, title }) => (
          <Section key={id} title={title}>
            {toastCases
              .filter(({ group }) => group === id)
              .map(({ label, run }) => (
                <Button
                  key={label}
                  size="sm"
                  variant="outline"
                  onClick={() => run(options)}
                >
                  {label}
                </Button>
              ))}
          </Section>
        ))}

        <Section title="Acciones">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toastCases
                .filter(
                  ({ group, label }) => group === 'tipos' && label !== 'Promise'
                )
                .forEach(({ run }) => run(options))
            }
          >
            Apilar 5
          </Button>
          <Button size="sm" onClick={() => toast.dismiss()}>
            Cerrar todos
          </Button>
        </Section>
      </main>
    </div>
  )
}
