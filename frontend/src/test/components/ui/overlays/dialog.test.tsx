import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

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

describe('Dialog component contract', () => {
  it('remains unmounted when closed and exposes accessible name and description when open', () => {
    const { rerender } = render(
      <Dialog open={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar filtro</DialogTitle>
            <DialogDescription>
              Disponible para todo tu equipo.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    expect(screen.queryByRole('dialog')).toBeNull()

    rerender(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar filtro</DialogTitle>
            <DialogDescription>
              Disponible para todo tu equipo.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    const dialog = screen.getByRole('dialog', { name: 'Guardar filtro' })
    expect(dialog).toHaveAccessibleDescription(
      'Disponible para todo tu equipo.'
    )
  })

  it('opens from DialogTrigger, moves focus inside, closes on Escape, and restores focus to trigger', async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Abrir diálogo</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar etiqueta</DialogTitle>
            <DialogDescription>Actualiza el nombre visible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="primary">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    const trigger = screen.getByRole('button', { name: 'Abrir diálogo' })
    trigger.focus()
    fireEvent.click(trigger)

    const dialog = await screen.findByRole('dialog', {
      name: 'Editar etiqueta',
    })
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true)
    })

    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
    await waitFor(() => {
      expect(trigger).toHaveFocus()
    })
  })

  it('returns focus to the control that opened a controlled dialog without a DialogTrigger', async () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setOpen(true)}>Abrir controlado</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Controlado</DialogTitle>
                <DialogDescription>Sin trigger de Radix.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancelar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )
    }

    render(<Controlled />)
    const opener = screen.getByRole('button', { name: 'Abrir controlado' })
    opener.focus()
    fireEvent.click(opener)

    const dialog = await screen.findByRole('dialog', { name: 'Controlado' })
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true)
    })

    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
    await waitFor(() => {
      expect(opener).toHaveFocus()
    })
  })

  it('still calls the onCloseAutoFocus handler passed by the consumer', async () => {
    const onCloseAutoFocus = vi.fn()
    const { rerender } = render(
      <Dialog open>
        <DialogContent onCloseAutoFocus={onCloseAutoFocus}>
          <DialogHeader>
            <DialogTitle>Con handler</DialogTitle>
            <DialogDescription>
              Compone con el del consumidor.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    rerender(
      <Dialog open={false}>
        <DialogContent onCloseAutoFocus={onCloseAutoFocus}>
          <DialogHeader>
            <DialogTitle>Con handler</DialogTitle>
            <DialogDescription>
              Compone con el del consumidor.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    await waitFor(() => {
      expect(onCloseAutoFocus).toHaveBeenCalledTimes(1)
    })
  })

  it('closes when clicking outside on the overlay', async () => {
    const onOpenChange = vi.fn()

    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle rápido</DialogTitle>
            <DialogDescription>Haz clic fuera para cerrar.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    const dialog = screen.getByRole('dialog', { name: 'Detalle rápido' })
    const overlay = dialog.previousElementSibling as HTMLElement
    expect(overlay).not.toBeNull()

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    fireEvent.pointerDown(overlay, { button: 0, ctrlKey: false })
    fireEvent.click(overlay)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  it('closes with the localized X close button and hides it when showCloseButton is false', async () => {
    const { unmount } = render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Con cierre</DialogTitle>
            <DialogDescription>Incluye botón superior.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    const closeBtn = screen.getByRole('button', { name: 'common.close' })
    expect(closeBtn.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true'
    )
    fireEvent.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
    unmount()

    render(
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Sin botón X</DialogTitle>
            <DialogDescription>Cierra desde el pie.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    expect(screen.queryByRole('button', { name: 'common.close' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  it('supports primary/danger footer actions and blocks repeated execution while pending', () => {
    const onConfirm = vi.fn()

    function PendingDialogHarness() {
      const [pending, setPending] = useState(false)
      return (
        <Dialog open>
          <DialogContent
            showCloseButton={false}
            onEscapeKeyDown={(e) => {
              if (pending) e.preventDefault()
            }}
          >
            <DialogHeader>
              <DialogTitle>¿Revocar acceso?</DialogTitle>
              <DialogDescription>Esta acción es inmediata.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" disabled={pending}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                loading={pending}
                onClick={() => {
                  onConfirm()
                  setPending(true)
                }}
              >
                {pending ? 'Revocando…' : 'Revocar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    }

    render(<PendingDialogHarness />)

    const action = screen.getByRole('button', { name: 'Revocar' })
    fireEvent.click(action)
    expect(onConfirm).toHaveBeenCalledTimes(1)

    const busyAction = screen.getByRole('button', { name: 'Revocando…' })
    expect(busyAction).toHaveAttribute('aria-busy', 'true')
    expect(busyAction).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()

    fireEvent.click(busyAction)
    expect(onConfirm).toHaveBeenCalledTimes(1)

    const dialog = screen.getByRole('dialog', { name: '¿Revocar acceso?' })
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' })
    expect(
      screen.getByRole('dialog', { name: '¿Revocar acceso?' })
    ).toBeInTheDocument()
  })
})
