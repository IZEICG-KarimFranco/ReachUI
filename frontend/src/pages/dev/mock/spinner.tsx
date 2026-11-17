import { Button } from '@/components/ui/actions/button'
import { Spinner } from '@/components/ui/feedback/spinner'
import { MockNav } from '@/pages/dev/mock/mock-nav'

const sizes = [
  { label: 'size-3', className: 'size-3' },
  { label: 'size-4 (por defecto)', className: undefined },
  { label: 'size-6', className: 'size-6' },
  { label: 'size-10', className: 'size-10' },
] as const

export function SpinnerShot() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {sizes.map(({ label, className }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <Spinner className={className} />
          <code className="font-mono text-xs text-muted">{label}</code>
        </div>
      ))}
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-8 rounded-surface border border-line bg-card p-6 text-ink">
      <h2 className="mb-4 text-label uppercase text-muted">{title}</h2>
      {children}
    </section>
  )
}

export default function SpinnerMockPage() {
  return (
    <div className="min-h-dvh w-full bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-6 text-lg font-semibold">Spinner · estados</h1>

        <Section title="tamaños (role=status, nombre accesible common.loading)">
          <SpinnerShot />
        </Section>

        <Section title="color por className (hereda currentColor)">
          <div className="flex items-center gap-6">
            <Spinner className="text-signal-contrast" />
            <Spinner className="text-success" />
            <Spinner className="text-error" />
            <Spinner className="text-muted" />
          </div>
        </Section>

        <Section title="con texto · aria-hidden y aria-label propio">
          <div className="flex flex-col gap-3 text-xs text-muted">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Spinner aria-hidden className="size-3" />
              Cargando contactos…
            </span>
            <span className="flex items-center gap-2">
              <Spinner aria-label="Cargando datos" />
              Con aria-label «Cargando datos»
            </span>
          </div>
        </Section>

        <Section title="dentro de Button (loading)">
          <div className="flex flex-wrap gap-3">
            <Button loading>Guardando</Button>
            <Button variant="primary" loading>
              Enviando
            </Button>
            <Button variant="secondary" size="compact" loading>
              Cargando
            </Button>
          </div>
        </Section>
      </main>
    </div>
  )
}
