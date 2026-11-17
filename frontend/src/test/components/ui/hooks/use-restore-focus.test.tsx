import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'

import { useRestoreFocus } from '@/components/ui/hooks/use-restore-focus'

describe('useRestoreFocus', () => {
  it('returns focus to the element focused when the modal opened', () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    const { result } = renderHook(() => useRestoreFocus())
    act(() => result.current.onOpenAutoFocus())

    const inside = document.createElement('button')
    document.body.appendChild(inside)
    inside.focus()

    const event = new Event('focusScope.unmountAutoFocus', { cancelable: true })
    act(() => result.current.onCloseAutoFocus(event))

    expect(event.defaultPrevented).toBe(true)
    expect(trigger).toHaveFocus()

    trigger.remove()
    inside.remove()
  })

  it('does not throw when nothing was focused or the element is gone', () => {
    const { result } = renderHook(() => useRestoreFocus())
    const event = new Event('focusScope.unmountAutoFocus', { cancelable: true })

    expect(() =>
      act(() => result.current.onCloseAutoFocus(event))
    ).not.toThrow()
  })

  it('leaves focus to Radix when the opener is gone', () => {
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    opener.focus()

    const { result } = renderHook(() => useRestoreFocus())
    act(() => result.current.onOpenAutoFocus())
    opener.remove()

    const event = new Event('focusScope.unmountAutoFocus', { cancelable: true })
    act(() => result.current.onCloseAutoFocus(event))

    expect(event.defaultPrevented).toBe(false)
  })

  it('leaves focus to Radix when nothing but body had focus on open', () => {
    ;(document.activeElement as HTMLElement | null)?.blur()

    const { result } = renderHook(() => useRestoreFocus())
    act(() => result.current.onOpenAutoFocus())

    const event = new Event('focusScope.unmountAutoFocus', { cancelable: true })
    act(() => result.current.onCloseAutoFocus(event))

    expect(event.defaultPrevented).toBe(false)
  })
})
