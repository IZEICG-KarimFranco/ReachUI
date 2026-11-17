import { Badge } from '@/components/ui/feedback/badge'
import { MockNav } from '@/pages/dev/mock/mock-nav'

const functionalVariants = [
  { variant: 'outline', label: 'SMS' },
  { variant: 'default', label: 'SEGMENTO' },
  { variant: 'info', label: 'LISTA' },
  { variant: 'signal', label: 'SEGMENTO' },
  { variant: 'success', label: 'AGENTE' },
  { variant: 'warning', label: 'BETA' },
  { variant: 'error', label: 'ERROR' },
] as const

const legacyVariants = ['secondary', 'destructive'] as const

export default function BadgeMockPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-6 text-lg font-semibold">Badge · estados</h1>

        <section className="rounded-surface border border-line bg-card p-6 text-ink">
          <h2 className="mb-2 text-label uppercase text-muted">
            badge-functional
          </h2>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {functionalVariants.map(({ variant, label }) => (
              <Badge key={variant} variant={variant}>
                {label}
              </Badge>
            ))}
          </div>

          <h2 className="mb-2 text-label uppercase text-muted">
            Legacy (borrar tras el rediseño)
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {legacyVariants.map((variant) => (
              <Badge key={variant} variant={variant}>
                {variant}
              </Badge>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
