import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, renderHook } from '@testing-library/react'

import {
  useActiveItemInView,
  useAppShellState,
} from '@/components/ui/hooks/use-app-shell'

function mockDesktopQuery() {
  const listeners = new Set<() => void>()
  let matches = false
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn(() => ({
      get matches() {
        return matches
      },
      addEventListener: (_: 'change', listener: () => void) =>
        listeners.add(listener),
      removeEventListener: (_: 'change', listener: () => void) =>
        listeners.delete(listener),
    })),
  })
  return {
    setDesktop: (next: boolean) => {
      matches = next
      listeners.forEach((listener) => listener())
    },
  }
}

afterEach(() => {
  Reflect.deleteProperty(window, 'matchMedia')
})

function setup(collapsed = false) {
  const onCollapsedChange = vi.fn()
  const hook = renderHook(() =>
    useAppShellState({ collapsed, onCollapsedChange })
  )
  const button = document.createElement('button')
  document.body.appendChild(button)
  hook.result.current.menuButtonRef.current = button
  return { ...hook, onCollapsedChange, button }
}

describe('useAppShellState', () => {
  it('collapsed es controlado: toggleCollapsed pide el valor contrario', () => {
    const { result, onCollapsedChange } = setup(true)

    act(() => result.current.toggleCollapsed())

    expect(onCollapsedChange).toHaveBeenCalledWith(false)
    expect(result.current.collapsed).toBe(true)
  })

  it('Ctrl/Cmd+B alterna el rail mini', () => {
    const { onCollapsedChange } = setup(false)

    act(() => {
      fireEvent.keyDown(window, { key: 'b', ctrlKey: true })
    })
    expect(onCollapsedChange).toHaveBeenCalledWith(true)

    act(() => {
      fireEvent.keyDown(window, { key: 'b' })
    })
    expect(onCollapsedChange).toHaveBeenCalledTimes(1)
  })

  it('abre y cierra el drawer con toggleMobile', () => {
    const { result } = setup()

    act(() => result.current.toggleMobile())
    expect(result.current.mobileOpen).toBe(true)

    act(() => result.current.toggleMobile())
    expect(result.current.mobileOpen).toBe(false)
  })

  it('Escape cierra el drawer y devuelve el foco al botón Menú', () => {
    const { result, button } = setup()
    act(() => result.current.toggleMobile())

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })

    expect(result.current.mobileOpen).toBe(false)
    expect(document.activeElement).toBe(button)
  })

  it('ignora el Escape que ya consumió un menú abierto', () => {
    const { result } = setup()
    act(() => result.current.toggleMobile())

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    })
    event.preventDefault()
    act(() => {
      document.dispatchEvent(event)
    })

    expect(result.current.mobileOpen).toBe(true)
  })

  it('closeMobile(false) cierra sin mover el foco', () => {
    const { result, button } = setup()
    act(() => result.current.toggleMobile())

    act(() => result.current.closeMobile(false))

    expect(result.current.mobileOpen).toBe(false)
    expect(document.activeElement).not.toBe(button)
  })

  it('se cierra al pasar al breakpoint de escritorio', () => {
    const media = mockDesktopQuery()
    const { result } = setup()
    act(() => result.current.toggleMobile())

    act(() => media.setDesktop(true))

    expect(result.current.mobileOpen).toBe(false)
  })
})

function rect(top: number, bottom: number): DOMRect {
  return {
    top,
    bottom,
    left: 0,
    right: 100,
    width: 100,
    height: bottom - top,
    x: 0,
    y: top,
    toJSON: () => ({}),
  }
}

function setupList(itemTop: number, itemBottom: number) {
  const container = document.createElement('nav')
  const item = document.createElement('a')
  item.setAttribute('aria-current', 'page')
  container.appendChild(item)
  document.body.appendChild(container)
  container.getBoundingClientRect = () => rect(100, 500)
  item.getBoundingClientRect = () => rect(itemTop, itemBottom)
  container.scrollTop = 200
  return { container, ref: { current: container } }
}

describe('useActiveItemInView', () => {
  it('baja la lista si el ítem activo queda debajo de lo visible', () => {
    const { container, ref } = setupList(560, 600)
    renderHook(() => useActiveItemInView(ref, '/extra/20'))

    expect(container.scrollTop).toBe(200 + (600 - 500) + 8)
  })

  it('sube la lista si el ítem activo queda encima de lo visible', () => {
    const { container, ref } = setupList(40, 80)
    renderHook(() => useActiveItemInView(ref, '/'))

    expect(container.scrollTop).toBe(200 - (100 - 40) - 8)
  })

  it('no mueve la lista si el ítem activo ya se ve', () => {
    const { container, ref } = setupList(200, 240)
    renderHook(() => useActiveItemInView(ref, '/calendar'))

    expect(container.scrollTop).toBe(200)
  })

  it('vuelve a revisar cuando cambian las entradas, no solo la ruta', () => {
    const { container, ref } = setupList(200, 240)
    const { rerender } = renderHook(
      ({ entries }: { entries: string }) =>
        useActiveItemInView(ref, '/configuration', entries),
      { initialProps: { entries: '/|/configuration' } }
    )
    expect(container.scrollTop).toBe(200)

    const item = container.querySelector('a')
    if (!item) throw new Error('item missing')
    item.getBoundingClientRect = () => rect(560, 600)
    rerender({ entries: '/|/calendar|/inbox|/configuration' })

    expect(container.scrollTop).toBe(200 + (600 - 500) + 8)
  })
})
