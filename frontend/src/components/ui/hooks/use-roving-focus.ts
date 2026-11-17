import * as React from 'react'
import {
  findEnabledIndex,
  resolveTabStop,
} from '@/components/ui/lib/roving-focus'

/**
 * Roving tabindex for a horizontal group: only one item is tabbable and
 * ArrowLeft/ArrowRight move focus between enabled items, wrapping around.
 * The last focused item is remembered by `value`, so it survives reordering
 * and filtering. Spread `getItemProps(index)` on each item.
 */
export function useRovingFocus(
  items: ReadonlyArray<{ value: string; disabled?: boolean }>,
  activeIndex: number
) {
  const itemsRef = React.useRef<(HTMLElement | null)[]>([])
  const [focusValue, setFocusValue] = React.useState<string | null>(null)
  const focusIndex =
    focusValue === null
      ? null
      : items.findIndex((item) => item.value === focusValue)
  const tabStop = resolveTabStop(items, focusIndex, activeIndex)

  const getItemProps = (index: number) => ({
    ref: (el: HTMLElement | null) => {
      itemsRef.current[index] = el
    },
    tabIndex: index === tabStop ? 0 : -1,
    onFocus: () => setFocusValue(items[index].value),
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
      if (step === 0) return
      e.preventDefault()
      const next = findEnabledIndex(items, index + step, step)
      if (next >= 0 && next !== index) itemsRef.current[next]?.focus()
    },
  })

  return { getItemProps }
}
