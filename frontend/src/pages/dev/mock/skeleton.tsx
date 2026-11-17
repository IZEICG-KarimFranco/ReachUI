import { Skeleton } from '@/components/ui/feedback/skeleton'
import { Spinner } from '@/components/ui/feedback/spinner'
import { MockNav } from '@/pages/dev/mock/mock-nav'

const shotRows = ['w-[180px]', 'w-[140px]', 'w-[200px]'] as const

const consumerShapes = [
  { label: 'h-4 w-full', className: 'h-4 w-full' },
  { label: 'h-6 w-3/4', className: 'h-6 w-3/4' },
  { label: 'size-15 rounded-full', className: 'size-15 rounded-full' },
] as const

export function SkeletonLoadingShot() {
  return (
    <div className="w-full max-w-[520px] overflow-hidden rounded-surface border border-line bg-card text-ink">
      {shotRows.map((width) => (
        <div
          key={width}
          className="flex items-center gap-4 border-b border-line px-4 py-3"
        >
          <Skeleton className={width} />
          <Skeleton className="ml-auto w-[70px]" />
        </div>
      ))}
      <div className="flex items-center justify-end gap-2 border-t border-line px-4 py-3">
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          <Spinner aria-hidden className="size-3" />
          Cargando contactos…
        </span>
      </div>
    </div>
  )
}

export default function SkeletonMockPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-6 text-lg font-semibold">Skeleton · estados</h1>

        <section className="mb-8">
          <h2 className="mb-2 text-label uppercase text-muted">
            loading-skeleton
          </h2>
          <SkeletonLoadingShot />
        </section>

        <section className="rounded-surface border border-line bg-card p-6 text-ink">
          <h2 className="mb-4 text-label uppercase text-muted">
            Formas de los consumidores (className)
          </h2>
          <div className="flex flex-col gap-5">
            {consumerShapes.map(({ label, className }) => (
              <div key={label} className="flex flex-col gap-2">
                <code className="font-mono text-xs text-muted">{label}</code>
                <Skeleton className={className} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
