import type { KeyboardEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

import { useDonutSelection } from '@/components/ui/hooks/use-donut-selection'

const keyEvent = (key: string) => {
  const preventDefault = vi.fn()
  return {
    event: { key, preventDefault } as unknown as KeyboardEvent,
    preventDefault,
  }
}

describe('useDonutSelection', () => {
  it('fija un segmento y lo libera al repetir', () => {
    const { result } = renderHook(() => useDonutSelection())

    act(() => result.current.toggle('a'))
    expect(result.current.selected).toBe('a')
    expect(result.current.active).toBe('a')

    act(() => result.current.toggle('a'))
    expect(result.current.selected).toBeNull()
    expect(result.current.active).toBeNull()
  })

  it('la previsualización tiene prioridad sobre el segmento fijado', () => {
    const { result } = renderHook(() => useDonutSelection())

    act(() => result.current.toggle('a'))
    act(() => result.current.preview('b'))
    expect(result.current.active).toBe('b')
    expect(result.current.isPreviewing).toBe(true)

    act(() => result.current.clearPreview())
    expect(result.current.active).toBe('a')
    expect(result.current.isPreviewing).toBe(false)
  })

  it('Enter y Espacio fijan el segmento y evitan el scroll', () => {
    const { result } = renderHook(() => useDonutSelection())

    const enter = keyEvent('Enter')
    act(() => result.current.onKeyDown('a')(enter.event))
    expect(result.current.selected).toBe('a')
    expect(enter.preventDefault).toHaveBeenCalled()

    const space = keyEvent(' ')
    act(() => result.current.onKeyDown('b')(space.event))
    expect(result.current.selected).toBe('b')
    expect(space.preventDefault).toHaveBeenCalled()
  })

  it('Escape libera el segmento fijado y otras teclas no hacen nada', () => {
    const { result } = renderHook(() => useDonutSelection())

    act(() => result.current.toggle('a'))
    act(() => result.current.onKeyDown('a')(keyEvent('Tab').event))
    expect(result.current.selected).toBe('a')

    act(() => result.current.onKeyDown('a')(keyEvent('Escape').event))
    expect(result.current.selected).toBeNull()
  })
})
