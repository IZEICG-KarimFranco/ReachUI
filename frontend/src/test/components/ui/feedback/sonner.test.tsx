import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'

import { Toaster } from '@/components/ui/feedback/sonner'

const types = ['success', 'error', 'info', 'warning'] as const

const toastItem = (text: string) =>
  screen.getByText(text).closest('[data-sonner-toast]')

afterEach(() => {
  act(() => {
    toast.dismiss()
  })
})

describe('Toaster component contract', () => {
  it.each(types)('shows a %s toast with a decorative icon', async (type) => {
    render(<Toaster />)
    act(() => {
      toast[type](`Mensaje ${type}`)
    })

    await screen.findByText(`Mensaje ${type}`)
    const item = toastItem(`Mensaje ${type}`)
    expect(item?.getAttribute('data-type')).toBe(type)
    expect(
      item?.querySelector('[data-icon] svg')?.getAttribute('aria-hidden')
    ).toBe('true')
  })

  it('shows a neutral toast without an icon', async () => {
    render(<Toaster />)
    act(() => {
      toast('Cambios guardados')
    })

    await screen.findByText('Cambios guardados')
    expect(toastItem('Cambios guardados')?.querySelector('[data-icon]')).toBe(
      null
    )
  })

  it('shows the loading text and then the result of a promise', async () => {
    render(<Toaster />)
    let resolve: () => void = () => undefined
    const pending = new Promise<void>((done) => {
      resolve = done
    })
    act(() => {
      toast.promise(pending, {
        loading: 'Reintentando',
        success: 'Listo',
        error: 'Falló',
      })
    })

    await screen.findByText('Reintentando')
    const loading = toastItem('Reintentando')
    expect(loading?.getAttribute('data-type')).toBe('loading')
    const spinner = loading?.querySelector('[data-icon] svg')
    expect(spinner?.getAttribute('aria-hidden')).toBe('true')
    expect(loading?.querySelector('[role="status"]')).toBeNull()
    expect(
      spinner?.compareDocumentPosition(screen.getByText('Reintentando')) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()

    await act(async () => {
      resolve()
    })
    await screen.findByText('Listo')
    expect(toastItem('Listo')?.getAttribute('data-type')).toBe('success')
  })

  it('turns the same toast into an error when the promise rejects', async () => {
    render(<Toaster />)
    let reject: (reason: Error) => void = () => undefined
    const pending = new Promise<void>((_, fail) => {
      reject = fail
    })
    act(() => {
      toast.promise(pending, {
        loading: 'Reintentando',
        success: 'Listo',
        error: (error: Error) => `Falló: ${error.message}`,
      })
    })

    await screen.findByText('Reintentando')
    expect(toastItem('Reintentando')?.getAttribute('data-type')).toBe('loading')

    await act(async () => {
      reject(new Error('sin conexión'))
    })
    await screen.findByText('Falló: sin conexión')
    const failed = toastItem('Falló: sin conexión')
    expect(failed?.getAttribute('data-type')).toBe('error')
    expect(
      failed?.querySelector('[data-icon] svg')?.getAttribute('aria-hidden')
    ).toBe('true')
    expect(screen.queryByText('Reintentando')).toBeNull()
    expect(document.querySelectorAll('[data-sonner-toast]')).toHaveLength(1)
  })

  it('renders the description and runs the action once, then closes', async () => {
    const onClick = vi.fn()
    render(<Toaster />)
    act(() => {
      toast('Campaña programada', {
        description: 'Sale mañana',
        action: { label: 'Ver campaña', onClick },
      })
    })

    await screen.findByText('Sale mañana')
    fireEvent.click(screen.getByRole('button', { name: 'Ver campaña' }))

    expect(onClick).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect(screen.queryByText('Campaña programada')).toBeNull()
    )
  })

  it('closes with toast.dismiss', async () => {
    render(<Toaster />)
    let id: string | number = ''
    act(() => {
      id = toast('Temporal')
    })
    await screen.findByText('Temporal')

    act(() => {
      toast.dismiss(id)
    })

    await waitFor(() => expect(screen.queryByText('Temporal')).toBeNull())
  })

  it('closes with the close button, which has an accessible name', async () => {
    render(<Toaster />)
    act(() => {
      toast('Cerrable')
    })
    await screen.findByText('Cerrable')

    fireEvent.click(screen.getByRole('button', { name: 'common.close' }))

    await waitFor(() => expect(screen.queryByText('Cerrable')).toBeNull())
  })

  it('closes by itself after its duration and keeps an infinite one', async () => {
    render(<Toaster />)
    act(() => {
      toast('Se va', { duration: 200 })
      toast('Se queda', { duration: Infinity })
    })
    await screen.findByText('Se va')

    await waitFor(() => expect(screen.queryByText('Se va')).toBeNull(), {
      timeout: 3000,
    })
    expect(screen.getByText('Se queda')).toBeDefined()
  })

  it('announces toasts through a named polite live region', () => {
    render(<Toaster />)

    const region = screen.getByRole('region', {
      name: /user_menu\.notifications/,
    })
    expect(region.getAttribute('aria-live')).toBe('polite')
  })

  it('ignores richColors so every type keeps the Reach panel', async () => {
    render(<Toaster richColors />)
    act(() => {
      toast.error('Sin colores ricos')
    })

    await screen.findByText('Sin colores ricos')
    expect(
      toastItem('Sin colores ricos')?.getAttribute('data-rich-colors')
    ).toBe('false')
  })

  it('shows toasts at the bottom center on desktop unless a toast asks for another position', async () => {
    render(<Toaster />)
    act(() => {
      toast('Por defecto')
      toast('Propia', { position: 'bottom-right' })
    })

    await screen.findByText('Por defecto')
    const byDefault = toastItem('Por defecto')
    expect(byDefault?.getAttribute('data-y-position')).toBe('bottom')
    expect(byDefault?.getAttribute('data-x-position')).toBe('center')

    const own = toastItem('Propia')
    expect(own?.getAttribute('data-y-position')).toBe('bottom')
    expect(own?.getAttribute('data-x-position')).toBe('right')
  })

  it('shows toasts at the top center below the desktop breakpoint', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        matches: false,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    })

    try {
      // The position hook caches its media query: load a fresh copy.
      vi.resetModules()
      const { Toaster: FreshToaster } =
        await import('@/components/ui/feedback/sonner')
      render(<FreshToaster />)
      act(() => {
        toast('En móvil')
      })

      await screen.findByText('En móvil')
      const item = toastItem('En móvil')
      expect(item?.getAttribute('data-y-position')).toBe('top')
      expect(item?.getAttribute('data-x-position')).toBe('center')
    } finally {
      Reflect.deleteProperty(window, 'matchMedia')
    }
  })
})
