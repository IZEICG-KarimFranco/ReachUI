import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ConfirmDialog } from '@/components/ui/overlays/confirm-dialog'

function setup(
  props: Partial<React.ComponentProps<typeof ConfirmDialog>> = {}
) {
  const onOpenChange = vi.fn()
  const onConfirm = vi.fn()
  const view = render(
    <ConfirmDialog
      open
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title="¿Eliminar esta lista?"
      description="Dejará de estar disponible en campañas futuras."
      {...props}
    />
  )
  return { ...view, onOpenChange, onConfirm }
}

describe('ConfirmDialog', () => {
  it('stays unmounted when closed and exposes name and description when open', () => {
    const { rerender } = render(
      <ConfirmDialog
        open={false}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        title="¿Eliminar esta lista?"
        description="Dejará de estar disponible."
      />
    )
    expect(screen.queryByRole('dialog')).toBeNull()

    rerender(
      <ConfirmDialog
        open
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        title="¿Eliminar esta lista?"
        description="Dejará de estar disponible."
      />
    )
    expect(
      screen.getByRole('dialog', { name: '¿Eliminar esta lista?' })
    ).toHaveAccessibleDescription('Dejará de estar disponible.')
  })

  it('uses the localized default labels, has no close button, and accepts custom labels and a helper', () => {
    const { unmount } = setup()
    expect(
      screen.getByRole('button', { name: 'common.cancel' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'common.confirm' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'common.close' })).toBeNull()
    unmount()

    setup({
      cancelLabel: 'Conservar',
      confirmLabel: 'Eliminar lista',
      helper: 'Los contactos no se eliminan.',
    })
    expect(
      screen.getByRole('button', { name: 'Conservar' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Eliminar lista' })
    ).toBeInTheDocument()
    expect(screen.getByText('Los contactos no se eliminan.')).toBeVisible()
  })

  it('moves focus inside on open, so the safe action is reachable first', async () => {
    setup()
    const dialog = screen.getByRole('dialog')
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true)
    })
  })

  it('returns focus to the control that opened it, even without a DialogTrigger', async () => {
    function Harness() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Abrir
          </button>
          <ConfirmDialog
            open={open}
            onOpenChange={setOpen}
            onConfirm={vi.fn()}
            title="¿Eliminar?"
            description="Sin deshacer."
          />
        </>
      )
    }
    render(<Harness />)

    const opener = screen.getByRole('button', { name: 'Abrir' })
    opener.focus()
    fireEvent.click(opener)
    const dialog = await screen.findByRole('dialog')
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true)
    })

    fireEvent.click(screen.getByRole('button', { name: 'common.cancel' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
    await waitFor(() => {
      expect(opener).toHaveFocus()
    })
  })

  it('asks to close on Cancel and on Escape without confirming', async () => {
    const { onOpenChange, onConfirm } = setup()

    fireEvent.click(screen.getByRole('button', { name: 'common.cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)

    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      code: 'Escape',
    })
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledTimes(2)
    })
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('runs onConfirm once and closes after an async onConfirm resolves', async () => {
    let finish!: () => void
    const onConfirm = vi.fn(
      () => new Promise<void>((resolve) => (finish = resolve))
    )
    const { onOpenChange } = setup({ onConfirm, pendingLabel: 'Eliminando…' })

    fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }))

    const busy = await screen.findByRole('button', { name: 'Eliminando…' })
    expect(busy).toHaveAttribute('aria-busy', 'true')
    expect(busy).toBeDisabled()
    expect(screen.getByRole('button', { name: 'common.cancel' })).toBeDisabled()

    fireEvent.click(busy)
    expect(onConfirm).toHaveBeenCalledTimes(1)

    await act(async () => {
      finish()
    })
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('blocks Escape while pending', async () => {
    const onConfirm = vi.fn(() => new Promise<void>(() => {}))
    const { onOpenChange } = setup({ onConfirm })

    fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }))
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'common.confirm' })
      ).toBeDisabled()
    })

    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      code: 'Escape',
    })
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('lets the consumer control pending without closing on its own', async () => {
    const onConfirm = vi.fn()
    const { onOpenChange, rerender } = setup({ onConfirm, pending: false })

    fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }))
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1)
    })
    expect(onOpenChange).not.toHaveBeenCalled()

    rerender(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        title="¿Eliminar esta lista?"
        description="Dejará de estar disponible en campañas futuras."
        pending
      />
    )
    expect(
      screen.getByRole('button', { name: 'common.confirm' })
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: 'common.cancel' })).toBeDisabled()
  })

  it('maps tone to the primary action variant', () => {
    const { unmount } = setup()
    expect(
      screen.getByRole('button', { name: 'common.confirm' })
    ).toHaveAttribute('data-variant', 'primary')
    unmount()

    setup({ tone: 'danger' })
    expect(
      screen.getByRole('button', { name: 'common.confirm' })
    ).toHaveAttribute('data-variant', 'danger')
  })

  it('keeps the dialog open and re-enables the actions when onConfirm fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onConfirm = vi.fn().mockRejectedValue(new Error('fallo'))
    const { onOpenChange } = setup({ onConfirm, tone: 'danger' })

    fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }))

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled()
    })
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'common.confirm' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'common.cancel' })).toBeEnabled()
    consoleError.mockRestore()
  })
})
