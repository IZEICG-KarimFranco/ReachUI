import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { Button } from '@/components/ui/actions/button'
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/overlays/sheet'

type Side = 'responsive' | 'center' | 'right' | 'left'

function DetailSheet({
  side = 'responsive',
  showCloseButton,
}: {
  side?: Side
  showCloseButton?: boolean
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Ver contacto</Button>
      </SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>Adrián Martínez</SheetTitle>
          <SheetDescription>CT-88213</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <p>Teléfono +52 55 1234 5678</p>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="quiet">Cerrar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

async function openFromTrigger() {
  const trigger = screen.getByRole('button', { name: 'Ver contacto' })
  trigger.focus()
  fireEvent.click(trigger)
  const sheet = await screen.findByRole('dialog', { name: 'Adrián Martínez' })
  return { trigger, sheet }
}

describe('Sheet component contract', () => {
  it('stays unmounted while closed and exposes accessible name and description when open', async () => {
    render(<DetailSheet />)

    expect(screen.queryByRole('dialog')).toBeNull()

    const { sheet } = await openFromTrigger()
    expect(sheet).toHaveAccessibleDescription('CT-88213')
  })

  it('moves focus inside on open, closes on Escape and restores focus to the trigger', async () => {
    render(<DetailSheet />)

    const { trigger, sheet } = await openFromTrigger()
    await waitFor(() => {
      expect(sheet.contains(document.activeElement)).toBe(true)
    })

    fireEvent.keyDown(sheet, { key: 'Escape', code: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
    await waitFor(() => {
      expect(trigger).toHaveFocus()
    })
  })

  it('closes when clicking the scrim', async () => {
    const onOpenChange = vi.fn()

    render(
      <Sheet defaultOpen onOpenChange={onOpenChange}>
        <SheetContent side="responsive">
          <SheetHeader>
            <SheetTitle>Detalle</SheetTitle>
            <SheetDescription>Haz clic fuera para cerrar.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )

    const scrim = document.querySelector<HTMLElement>(
      '[data-slot="sheet-overlay"]'
    )
    expect(scrim).not.toBeNull()

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    fireEvent.pointerDown(scrim as HTMLElement, { button: 0, ctrlKey: false })
    fireEvent.click(scrim as HTMLElement)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  it.each<Side>(['responsive', 'center', 'right', 'left'])(
    'closes with the localized close button on side %s',
    async (side) => {
      render(<DetailSheet side={side} />)
      await openFromTrigger()

      const closeButton = screen.getByRole('button', { name: 'common.close' })
      expect(
        closeButton.querySelector('svg')?.getAttribute('aria-hidden')
      ).toBe('true')

      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull()
      })
    }
  )

  it.each<Side>(['responsive', 'center'])(
    'places the close button inside the header on side %s',
    async (side) => {
      render(<DetailSheet side={side} />)
      const { sheet } = await openFromTrigger()

      expect(sheet).toHaveAttribute('data-side', side)
      const headerClose = screen.getByRole('button', { name: 'common.close' })
      expect(headerClose.closest('[data-slot="sheet-header"]')).not.toBeNull()
      expect(
        screen
          .getByRole('button', { name: 'Cerrar' })
          .closest('[data-slot="sheet-footer"]')
      ).not.toBeNull()
    }
  )

  it('places the close button as a direct child of the panel on legacy sides', async () => {
    render(<DetailSheet side="left" />)
    const { sheet } = await openFromTrigger()

    const panelClose = screen.getByRole('button', { name: 'common.close' })
    expect(panelClose.parentElement).toBe(sheet)
    expect(panelClose).not.toHaveAttribute('data-slot', 'sheet-close')
  })

  it('hides the close button when showCloseButton is false and still closes from the footer', async () => {
    render(<DetailSheet showCloseButton={false} />)
    await openFromTrigger()

    expect(screen.queryByRole('button', { name: 'common.close' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
  })

  it('works in controlled mode through open and onOpenChange', async () => {
    function ControlledSheet() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Abrir
          </Button>
          <span data-testid="state">{open ? 'open' : 'closed'}</span>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="responsive">
              <SheetHeader>
                <SheetTitle>Controlado</SheetTitle>
                <SheetDescription>Estado externo.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </>
      )
    }

    render(<ControlledSheet />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    const sheet = await screen.findByRole('dialog', { name: 'Controlado' })
    expect(screen.getByTestId('state')).toHaveTextContent('open')

    fireEvent.keyDown(sheet, { key: 'Escape', code: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
    expect(screen.getByTestId('state')).toHaveTextContent('closed')
  })

  it('does not repeat the footer action while pending', async () => {
    const onSave = vi.fn()

    function PendingSheet() {
      const [pending, setPending] = useState(false)
      return (
        <Sheet defaultOpen>
          <SheetContent side="responsive">
            <SheetHeader>
              <SheetTitle>Editar contacto</SheetTitle>
              <SheetDescription>Cambios sin guardar</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <Button
                variant="primary"
                loading={pending}
                onClick={() => {
                  onSave()
                  setPending(true)
                }}
              >
                Guardar
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )
    }

    render(<PendingSheet />)

    const save = screen.getByRole('button', { name: 'Guardar' })
    fireEvent.click(save)

    await waitFor(() => {
      expect(save).toBeDisabled()
    })
    expect(save).toHaveAttribute('aria-busy', 'true')

    fireEvent.click(save)
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it('forwards className, data-slot and side to the panel and its slots', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent side="responsive" className="desktop:w-[560px]">
          <SheetHeader className="custom-header">
            <SheetTitle>Slots</SheetTitle>
            <SheetDescription>Reenvío de props.</SheetDescription>
          </SheetHeader>
          <SheetBody className="custom-body" data-testid="body">
            <p>Contenido</p>
          </SheetBody>
          <SheetFooter className="custom-footer">Pie</SheetFooter>
        </SheetContent>
      </Sheet>
    )

    const sheet = screen.getByRole('dialog', { name: 'Slots' })
    expect(sheet).toHaveAttribute('data-slot', 'sheet-content')
    expect(sheet).toHaveAttribute('data-side', 'responsive')
    expect(sheet).toHaveClass('desktop:w-[560px]')

    const header = sheet.querySelector('[data-slot="sheet-header"]')
    const body = screen.getByTestId('body')
    const footer = sheet.querySelector('[data-slot="sheet-footer"]')

    expect(header).toHaveClass('custom-header')
    expect(body).toHaveAttribute('data-slot', 'sheet-body')
    expect(body).toHaveClass('custom-body')
    expect(body).toHaveTextContent('Contenido')
    expect(footer).toHaveClass('custom-footer')
  })

  it('defaults to side right', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetTitle>Por defecto</SheetTitle>
          <SheetDescription>Lado derecho.</SheetDescription>
        </SheetContent>
      </Sheet>
    )

    expect(screen.getByRole('dialog', { name: 'Por defecto' })).toHaveAttribute(
      'data-side',
      'right'
    )
  })

  it('renders header and footer outside a SheetContent without failing', () => {
    render(
      <>
        <SheetHeader data-testid="header">Cabecera</SheetHeader>
        <SheetFooter data-testid="footer">Pie</SheetFooter>
      </>
    )

    expect(screen.getByTestId('header')).toHaveTextContent('Cabecera')
    expect(screen.getByTestId('footer')).toHaveTextContent('Pie')
    expect(screen.queryByRole('button', { name: 'common.close' })).toBeNull()
  })
})
