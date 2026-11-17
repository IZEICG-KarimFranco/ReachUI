import { useEffect, useRef, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/actions/button'
import { ConfirmDialog } from '@/components/ui/overlays/confirm-dialog'
import { MockNav } from '@/pages/dev/mock/mock-nav'
import { useViewportWidth } from '@/pages/dev/mock/mock-pages'

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms))

function Shot({
  name,
  note,
  children,
}: {
  name: string
  note?: string
  children: ReactNode
}) {
  return (
    <section className="mb-6" data-shot={name}>
      <h2 className="mb-1 font-mono text-label uppercase text-muted">{name}</h2>
      {note && <p className="mb-2.5 text-xs text-ink-secondary">{note}</p>}
      <div className="rounded-surface border border-line bg-card p-4 text-ink">
        {children}
      </div>
    </section>
  )
}

/** Confirmación simple y destructiva; compartido con la sección de `/dev/mock/all`. */
export function ConfirmDialogShots({
  onEvent,
}: {
  onEvent?: (event: string) => void
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [dangerOpen, setDangerOpen] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" onClick={() => setConfirmOpen(true)}>
        Eliminar lista
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="¿Eliminar esta lista?"
        description="«Clientes 2024» dejará de estar disponible en campañas futuras. Los 6,110 contactos no se eliminan."
        confirmLabel="Eliminar lista"
        onConfirm={() => onEvent?.('Lista eliminada')}
      />

      <Button variant="danger" onClick={() => setDangerOpen(true)}>
        Revocar llave
      </Button>
      <ConfirmDialog
        open={dangerOpen}
        onOpenChange={setDangerOpen}
        tone="danger"
        title="¿Revocar llave de API?"
        description={
          <>
            Las integraciones que usen{' '}
            <code className="font-mono text-xs text-ink">rk_live_…9f2a</code>{' '}
            dejarán de funcionar de inmediato. Esta acción no se puede deshacer.
          </>
        }
        helper="Podrás crear una llave nueva cuando quieras."
        confirmLabel="Revocar llave"
        onConfirm={() => onEvent?.('Llave rk_live_…9f2a revocada')}
      />
    </div>
  )
}

export default function ConfirmDialogMockPage() {
  const width = useViewportWidth()
  const [lastEvent, setLastEvent] = useState('Ninguno (abre una confirmación)')

  const [pendingOpen, setPendingOpen] = useState(false)
  const [failOpen, setFailOpen] = useState(false)

  const [controlledOpen, setControlledOpen] = useState(false)
  const [controlledPending, setControlledPending] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  const handleControlledConfirm = () => {
    setControlledPending(true)
    setLastEvent('Pending controlado por la página (2 s)…')
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      setControlledPending(false)
      setControlledOpen(false)
      setLastEvent('Pending controlado liberado y diálogo cerrado')
    }, 2000)
  }

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <MockNav />

      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-2 text-lg font-semibold text-ink">
          ConfirmDialog · interacciones manuales
        </h1>
        <p className="mb-4 text-xs text-ink-secondary">
          Sobre <code className="font-mono">Dialog</code>, controlado con{' '}
          <code className="font-mono">open</code> y{' '}
          <code className="font-mono">onOpenChange</code>. Sin botón X; a 560 px
          o menos baja como bottom sheet. El foco entra en Cancelar.
        </p>

        <div className="mb-6 flex flex-col gap-1 rounded-surface border border-line bg-card p-3 font-mono text-xs text-ink-secondary">
          <span>
            Viewport: {width} px ·{' '}
            {width <= 560 ? 'Móvil (≤ 560 px)' : 'Escritorio (> 560 px)'}
          </span>
          <span>
            Último evento: <strong className="text-ink">{lastEvent}</strong>
          </span>
        </div>

        <Shot
          name="dialog-confirm · dialog-destructive"
          note="Confirmación con tone por defecto y con tone=danger, helper y un fragmento de código dentro de la descripción."
        >
          <ConfirmDialogShots onEvent={setLastEvent} />
        </Shot>

        <Shot
          name="dialog-pending (automático: espera la promesa de onConfirm)"
          note="Sin prop pending: onConfirm tarda 2 s; mientras tanto se bloquean Escape, clic fuera, Cancelar y la repetición, y el texto cambia a pendingLabel. Al resolver, cierra."
        >
          <Button variant="primary" onClick={() => setPendingOpen(true)}>
            Reenviar invitación
          </Button>
          <ConfirmDialog
            open={pendingOpen}
            onOpenChange={setPendingOpen}
            title="¿Reenviar invitación?"
            description={
              <>
                Se enviará un nuevo correo a{' '}
                <strong className="font-semibold text-ink">
                  marco@izei.mx
                </strong>{' '}
                con el rol de Agente.
              </>
            }
            confirmLabel="Reenviar invitación"
            pendingLabel="Reenviando…"
            onConfirm={async () => {
              setLastEvent('Reenviando invitación (2 s)…')
              await wait(2000)
              setLastEvent('Invitación reenviada y diálogo cerrado')
            }}
          />
        </Shot>

        <Shot
          name="dialog-pending-controlado (prop pending)"
          note="Con pending, el componente no cierra solo: la página lo libera y cierra a los 2 s (caso de un store con loading, como close-conversation)."
        >
          <Button variant="primary" onClick={() => setControlledOpen(true)}>
            Cerrar conversación
          </Button>
          <ConfirmDialog
            open={controlledOpen}
            onOpenChange={setControlledOpen}
            pending={controlledPending}
            title="¿Cerrar la conversación?"
            description="El cliente recibirá un aviso de cierre y la conversación saldrá de tu bandeja."
            confirmLabel="Cerrar conversación"
            pendingLabel="Cerrando…"
            onConfirm={handleControlledConfirm}
          />
        </Shot>

        <Shot
          name="dialog-error (onConfirm rechaza)"
          note="onConfirm falla a los 0,8 s: el diálogo sigue abierto y las acciones se habilitan de nuevo (el error se registra en consola)."
        >
          <Button variant="danger" onClick={() => setFailOpen(true)}>
            Eliminar y fallar
          </Button>
          <ConfirmDialog
            open={failOpen}
            onOpenChange={setFailOpen}
            tone="danger"
            title="¿Eliminar el segmento?"
            description="Esta acción no se puede deshacer."
            confirmLabel="Eliminar segmento"
            pendingLabel="Eliminando…"
            onConfirm={async () => {
              await wait(800)
              setLastEvent('onConfirm rechazó: el diálogo sigue abierto')
              throw new Error('Fallo simulado')
            }}
          />
        </Shot>
      </main>
    </div>
  )
}
