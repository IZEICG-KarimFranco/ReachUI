import { KeyRound, Plug, User } from 'lucide-react'

import { IconLabel } from '@/components/ui/data-display/icon-label'
import { Separator } from '@/components/ui/layout/separator'
import { Surface } from '@/components/ui/layout/surface'
import { MockNav } from '@/pages/dev/mock/mock-nav'

const navItems = [
  { icon: User, label: 'Perfil' },
  { icon: Plug, label: 'Integraciones' },
  { icon: KeyRound, label: 'API keys' },
] as const

export function SeparatorVariantsShot() {
  return (
    <div className="grid w-full max-w-3xl gap-6 tablet:grid-cols-2">
      <Surface>
        <div className="px-4 py-3 text-xs font-semibold">
          variant=&quot;full&quot;
        </div>
        <Separator />
        <div className="px-4 py-3 text-xs text-muted">
          Llega de borde a borde del plate.
        </div>
        <Separator />
        <div className="px-4 py-3 text-xs text-muted">Segunda sección.</div>
      </Surface>

      <Surface>
        <div className="px-4 py-3 text-xs font-semibold">
          variant=&quot;inset&quot;
        </div>
        <Separator variant="inset" />
        <div className="px-4 py-3 text-xs text-muted">
          Deja 16 px a cada lado, alineado con el padding del contenido.
        </div>
        <Separator variant="inset" />
        <div className="px-4 py-3 text-xs text-muted">Segunda sección.</div>
      </Surface>
    </div>
  )
}

export function SeparatorNavFootShot() {
  return (
    <Surface className="w-full max-w-[260px] p-2">
      {navItems.map(({ icon, label }) => (
        <div key={label} className="px-3 py-2.5 text-sm text-ink-secondary">
          <IconLabel icon={icon} size="lg">
            {label}
          </IconLabel>
        </div>
      ))}
      <Separator variant="inset" className="my-1" />
      <div className="px-3 pt-2 pb-1 text-[10px] leading-relaxed text-muted">
        Secciones según rol
        <br />
        RBAC · 5/5 visibles
      </div>
    </Surface>
  )
}

export default function SeparatorMockPage() {
  return (
    <div className="min-h-dvh w-full bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-6 text-lg font-semibold">Separator · variantes</h1>

        <section className="mb-8">
          <h2 className="mb-2 text-label uppercase text-muted">
            full frente a inset (horizontal)
          </h2>
          <SeparatorVariantsShot />
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-label uppercase text-muted">
            inset en un pie de navegación (cnfoot)
          </h2>
          <SeparatorNavFootShot />
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-label uppercase text-muted">
            vertical · full e inset
          </h2>
          <Surface className="flex h-12 w-full max-w-[420px] items-center gap-3 px-4 text-xs">
            <span>Cuenta</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Activa</span>
            <Separator orientation="vertical" variant="inset" />
            <span>Desde 12 ene 2024</span>
          </Surface>
        </section>

        <section>
          <h2 className="mb-2 text-label uppercase text-muted">
            accesibilidad · decorative={'{false}'}
          </h2>
          <Surface className="w-full max-w-[420px] text-xs">
            <div className="px-4 py-3">Contenido superior</div>
            <Separator decorative={false} aria-label="Fin de la sección" />
            <div className="px-4 py-3">Contenido inferior</div>
          </Surface>
        </section>
      </main>
    </div>
  )
}
