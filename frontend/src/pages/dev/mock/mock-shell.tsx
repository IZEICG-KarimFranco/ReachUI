import type { ReactNode } from 'react'
import { MockNav } from '@/pages/dev/mock/mock-nav'

export function MockSection({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section className="mb-8 rounded-surface border border-line bg-card p-6 text-ink">
      <h2 className="font-mono text-xs uppercase text-muted">{title}</h2>
      {hint ? (
        <p className="mt-1 mb-4 text-xs text-muted">{hint}</p>
      ) : (
        <div className="mb-4" />
      )}
      {children}
    </section>
  )
}

export function MockShell({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-2 text-lg font-semibold">{title}</h1>
        {description && (
          <p className="mb-6 text-xs text-muted">{description}</p>
        )}
        {children}
      </main>
    </div>
  )
}

export function ValueReadout({ children }: { children: ReactNode }) {
  return <p className="mt-3 font-mono text-xs text-muted">{children}</p>
}
