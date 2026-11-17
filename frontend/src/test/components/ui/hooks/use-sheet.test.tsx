import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'

import {
  SheetContext,
  useSheetContext,
  useSheetLayout,
  type SheetContextValue,
} from '@/components/ui/hooks/use-sheet'

describe('useSheetContext', () => {
  it('returns null outside a sheet', () => {
    const { result } = renderHook(() => useSheetContext())

    expect(result.current).toBeNull()
  })

  it('returns the side and close button setting of the enclosing sheet', () => {
    const value = { side: 'responsive', showCloseButton: false } as const
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
    )

    const { result } = renderHook(() => useSheetContext(), { wrapper })

    expect(result.current).toEqual(value)
  })
})

function renderLayout(value: SheetContextValue | null) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
  )
  return renderHook(() => useSheetLayout(), { wrapper }).result.current
}

describe('useSheetLayout', () => {
  it('is not slotted and hides the header close button outside a sheet', () => {
    const { result } = renderHook(() => useSheetLayout())

    expect(result.current).toEqual({ slotted: false, showCloseButton: false })
  })

  it.each(['responsive', 'center'] as const)(
    'is slotted for side %s',
    (side) => {
      expect(renderLayout({ side, showCloseButton: true }).slotted).toBe(true)
    }
  )

  it.each(['right', 'left'] as const)('is not slotted for side %s', (side) => {
    expect(renderLayout({ side, showCloseButton: true }).slotted).toBe(false)
  })

  it('shows the header close button only when slotted and enabled', () => {
    expect(
      renderLayout({ side: 'responsive', showCloseButton: true })
        .showCloseButton
    ).toBe(true)
    expect(
      renderLayout({ side: 'center', showCloseButton: false }).showCloseButton
    ).toBe(false)
    expect(
      renderLayout({ side: 'right', showCloseButton: true }).showCloseButton
    ).toBe(false)
  })
})
