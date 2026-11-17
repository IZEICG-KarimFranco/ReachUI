import { createContext, useContext } from 'react'

export type SheetSide = 'responsive' | 'center' | 'right' | 'left'

export interface SheetContextValue {
  side: SheetSide
  showCloseButton: boolean
}

export const SheetContext = createContext<SheetContextValue | null>(null)

export function useSheetContext() {
  return useContext(SheetContext)
}

export function useSheetLayout() {
  const sheet = useSheetContext()
  const slotted = sheet?.side === 'responsive' || sheet?.side === 'center'

  return {
    slotted,
    showCloseButton: slotted && sheet?.showCloseButton === true,
  }
}
