import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { KeyboardEvent } from 'react'

import { useRovingFocus } from '@/components/ui/hooks/use-roving-focus'

const items = [{ value: 'a' }, { value: 'b', disabled: true }, { value: 'c' }]

function keyEvent(key: string) {
  let prevented = false
  const event = {
    key,
    preventDefault: () => {
      prevented = true
    },
  } as unknown as KeyboardEvent<HTMLElement>
  return { event, wasPrevented: () => prevented }
}

describe('useRovingFocus', () => {
  it('gives a single tab stop to the active item', () => {
    const { result } = renderHook(() => useRovingFocus(items, 2))
    expect(
      items.map((_, idx) => result.current.getItemProps(idx).tabIndex)
    ).toEqual([-1, -1, 0])
  })

  it('moves focus with the arrows, skipping disabled items, and remembers it as the tab stop', () => {
    const buttons = items.map(() => document.createElement('button'))
    buttons.forEach((button) => document.body.appendChild(button))
    const { result } = renderHook(() => useRovingFocus(items, 0))
    buttons.forEach((button, idx) =>
      result.current.getItemProps(idx).ref(button)
    )

    const right = keyEvent('ArrowRight')
    act(() => result.current.getItemProps(0).onKeyDown(right.event))
    expect(right.wasPrevented()).toBe(true)
    expect(buttons[2]).toHaveFocus()

    act(() => result.current.getItemProps(2).onFocus())
    expect(result.current.getItemProps(2).tabIndex).toBe(0)
    expect(result.current.getItemProps(0).tabIndex).toBe(-1)

    buttons.forEach((button) => button.remove())
  })

  it('keeps the tab stop on the focused item when the items are reordered, and drops it when the item is removed', () => {
    const options = [{ value: 'a' }, { value: 'b' }, { value: 'c' }]
    const { result, rerender } = renderHook(
      ({ list }) => useRovingFocus(list, 0),
      { initialProps: { list: options } }
    )
    act(() => result.current.getItemProps(1).onFocus())

    rerender({ list: [options[2], options[0], options[1]] })
    expect(
      [0, 1, 2].map((idx) => result.current.getItemProps(idx).tabIndex)
    ).toEqual([-1, -1, 0])

    rerender({ list: [options[0], options[2]] })
    expect(
      [0, 1].map((idx) => result.current.getItemProps(idx).tabIndex)
    ).toEqual([0, -1])
  })

  it('ignores keys other than the horizontal arrows', () => {
    const { result } = renderHook(() => useRovingFocus(items, 0))
    const enter = keyEvent('Enter')
    act(() => result.current.getItemProps(0).onKeyDown(enter.event))
    expect(enter.wasPrevented()).toBe(false)
  })
})
