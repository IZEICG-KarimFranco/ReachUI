import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

// The hook caches its MediaQueryList at module level, so each test loads a
// fresh copy of the module after stubbing matchMedia.
async function loadHook() {
  const { useToasterPosition } =
    await import('@/components/ui/hooks/use-toaster-position')
  return useToasterPosition
}

function mockDesktopQuery(initial: boolean) {
  let matches = initial
  const listeners = new Set<() => void>()
  const query = {
    get matches() {
      return matches
    },
    addEventListener: (_: 'change', listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_: 'change', listener: () => void) =>
      listeners.delete(listener),
  }
  const matchMedia = vi.fn(() => query)
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: matchMedia,
  })
  return {
    matchMedia,
    setDesktop: (next: boolean) => {
      matches = next
      listeners.forEach((listener) => listener())
    },
  }
}

beforeEach(() => {
  vi.resetModules()
})

afterEach(() => {
  Reflect.deleteProperty(window, 'matchMedia')
})

describe('useToasterPosition', () => {
  it('places toasts at the bottom center on desktop', async () => {
    mockDesktopQuery(true)
    const useToasterPosition = await loadHook()

    const { result } = renderHook(() => useToasterPosition())

    expect(result.current).toBe('bottom-center')
  })

  it('places toasts at the top center on tablet and mobile', async () => {
    mockDesktopQuery(false)
    const useToasterPosition = await loadHook()

    const { result } = renderHook(() => useToasterPosition())

    expect(result.current).toBe('top-center')
  })

  it('follows the viewport when it crosses the desktop breakpoint', async () => {
    const { setDesktop } = mockDesktopQuery(true)
    const useToasterPosition = await loadHook()
    const { result } = renderHook(() => useToasterPosition())

    act(() => setDesktop(false))
    expect(result.current).toBe('top-center')

    act(() => setDesktop(true))
    expect(result.current).toBe('bottom-center')
  })

  it('creates the media query once across renders and instances', async () => {
    const { matchMedia, setDesktop } = mockDesktopQuery(true)
    const useToasterPosition = await loadHook()

    const first = renderHook(() => useToasterPosition())
    first.rerender()
    act(() => setDesktop(false))
    renderHook(() => useToasterPosition())

    expect(matchMedia).toHaveBeenCalledTimes(1)
  })

  it('falls back to the bottom center without matchMedia', async () => {
    const useToasterPosition = await loadHook()

    const { result } = renderHook(() => useToasterPosition())

    expect(result.current).toBe('bottom-center')
  })
})
