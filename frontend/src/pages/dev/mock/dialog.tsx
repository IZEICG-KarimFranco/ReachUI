import { useEffect, useRef, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/actions/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/overlays/dialog'
import { MockNav } from '@/pages/dev/mock/mock-nav'
import { useViewportWidth } from '@/pages/dev/mock/mock-pages'

const DIALOG_MOBILE_MAX = 560

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

export default function DialogMockPage() {
  const width = useViewportWidth()
  const [lastEvent, setLastEvent] = useState('Ninguno (abre un diálogo)')

  const [pendingOpen, setPendingOpen] = useState(false)
  const [pendingLocked, setPendingLocked] = useState(false)
  const [holdPending, setHoldPending] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const clearPendingTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handlePendingOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && pendingLocked) {
      setLastEvent('Cierre bloqueado mientras pending está activo')
      return
    }
    if (!nextOpen) {
      clearPendingTimer()
      setPendingLocked(false)
      setLastEvent('dialog-pending cerrado')
    } else {
      setLastEvent('dialog-pending abierto')
    }
    setPendingOpen(nextOpen)
  }

  const handleTriggerPending = () => {
    if (pendingLocked) return
    setPendingLocked(true)
    if (holdPending) {
      setLastEvent('Pending fijo activo (prueba Escape, scrim o Cancelar)')
      return
    }
    setLastEvent('Reenviando invitación (2 s)…')
    clearPendingTimer()
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      setPendingLocked(false)
      setPendingOpen(false)
      setLastEvent('Invitación reenviada y diálogo cerrado tras 2 s')
    }, 2000)
  }

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <MockNav />

      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-2 text-lg font-semibold text-ink">
          Dialog · interacciones manuales
        </h1>
        <p className="mb-4 text-xs text-ink-secondary">
          Prueba trampa de foco (Tab / Shift+Tab), cierre con Escape, clic fuera
          en el scrim (<code className="font-mono">bg-panel/50</code>), botón X
          localizado y restauración de foco al botón disparador.
        </p>

        <div className="mb-6 flex flex-col gap-1 rounded-surface border border-line bg-card p-3 font-mono text-xs text-ink-secondary">
          <span>
            Viewport: {width} px ·{' '}
            {width <= DIALOG_MOBILE_MAX
              ? 'Móvil (≤ 560 px)'
              : 'Escritorio (> 560 px)'}
          </span>
          <span>
            Último evento: <strong className="text-ink">{lastEvent}</strong>
          </span>
        </div>

        <Shot
          name="dialog-default (con botón X y restauración de foco)"
          note="Al abrir, el foco entra al diálogo; Tab cicla entre Cancelar, Descartar y el botón X (44×44 px). Al cerrar con Escape, scrim o X, el foco vuelve al botón disparador."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Dialog
              onOpenChange={(open) =>
                setLastEvent(
                  open ? 'dialog-default abierto' : 'dialog-default cerrado'
                )
              }
            >
              <DialogTrigger asChild>
                <Button variant="primary">Abrir Dialog estándar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Descartar los cambios del filtro?</DialogTitle>
                  <DialogDescription>
                    Se perderán los ajustes de «Clientes VIP Q4» que no hayas
                    guardado.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="primary"
                      onClick={() => setLastEvent('Cambios descartados')}
                    >
                      Descartar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Shot>

        <Shot
          name="dialog-sin-close-button (showCloseButton={false} · tono destructivo)"
          note="Oculta el botón X superior derecho; conserva cierre por Cancelar, Escape o clic fuera en el scrim."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Dialog
              onOpenChange={(open) =>
                setLastEvent(
                  open
                    ? 'dialog-sin-close-button abierto'
                    : 'dialog-sin-close-button cerrado'
                )
              }
            >
              <DialogTrigger asChild>
                <Button variant="danger">
                  Abrir sin botón X (destructivo)
                </Button>
              </DialogTrigger>
              <DialogContent showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>¿Revocar llave de API?</DialogTitle>
                  <DialogDescription>
                    Las integraciones que usen{' '}
                    <code className="font-mono text-xs text-ink">
                      rk_live_…9f2a
                    </code>{' '}
                    dejarán de funcionar de inmediato. Esta acción no se puede
                    deshacer.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="danger"
                      onClick={() =>
                        setLastEvent('Llave rk_live_…9f2a revocada')
                      }
                    >
                      Revocar llave
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Shot>

        <Shot
          name="dialog-pending (estado controlado y bloqueo asíncrono)"
          note="Mientras está en pending se bloquean Escape, el clic fuera en el scrim, Cancelar y los clics repetidos en la acción primaria."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setPendingLocked(false)
                setPendingOpen(true)
                setLastEvent('dialog-pending abierto')
              }}
            >
              Abrir Dialog con pending
            </Button>

            <Button
              variant={holdPending ? 'primary' : 'secondary'}
              size="compact"
              aria-pressed={holdPending}
              onClick={() => setHoldPending((prev) => !prev)}
            >
              {holdPending ? 'Modo: Pending fijo' : 'Modo: Simular 2 s'}
            </Button>

            <Dialog open={pendingOpen} onOpenChange={handlePendingOpenChange}>
              <DialogContent
                showCloseButton={false}
                onEscapeKeyDown={(event) => {
                  if (pendingLocked) {
                    event.preventDefault()
                    setLastEvent('Escape bloqueado (pending activo)')
                  }
                }}
                onPointerDownOutside={(event) => {
                  if (pendingLocked) {
                    event.preventDefault()
                    setLastEvent('Clic en scrim bloqueado (pending activo)')
                  }
                }}
                onInteractOutside={(event) => {
                  if (pendingLocked) {
                    event.preventDefault()
                  }
                }}
              >
                <DialogHeader>
                  <DialogTitle>¿Reenviar invitación?</DialogTitle>
                  <DialogDescription>
                    Se enviará un nuevo correo a{' '}
                    <strong className="font-semibold text-ink">
                      marco@izei.mx
                    </strong>{' '}
                    con el rol de Agente.
                  </DialogDescription>
                </DialogHeader>

                {pendingLocked && holdPending && (
                  <div className="rounded-control border border-line bg-inset p-2.5 text-xs text-ink-secondary">
                    Modo fijo activo: intenta cerrar con Escape o clic fuera.{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setPendingLocked(false)
                        setLastEvent('Pending fijo liberado manualmente')
                      }}
                      className="cursor-pointer font-semibold text-signal-contrast underline outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-signal-contrast"
                    >
                      Desbloquear pending
                    </button>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    variant="secondary"
                    disabled={pendingLocked}
                    onClick={() => handlePendingOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    loading={pendingLocked}
                    onClick={handleTriggerPending}
                  >
                    {pendingLocked ? 'Reenviando…' : 'Reenviar invitación'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Shot>

        <Shot
          name="dialog-una-accion (pie con 1 solo botón)"
          note="Verifica la alineación derecha en escritorio y apilado completo en móvil cuando solo existe una acción."
        >
          <Dialog
            onOpenChange={(open) =>
              setLastEvent(
                open ? 'dialog-una-accion abierto' : 'dialog-una-accion cerrado'
              )
            }
          >
            <DialogTrigger asChild>
              <Button variant="secondary">Abrir Dialog de 1 acción</Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Sincronización en curso</DialogTitle>
                <DialogDescription>
                  Las plantillas aprobadas aparecerán automáticamente en el
                  selector en cuanto Meta confirme el cambio.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="primary">Entendido</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Shot>
      </main>
    </div>
  )
}
