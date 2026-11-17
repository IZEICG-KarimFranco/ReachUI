import * as React from 'react'

/**
 * Hook para disparar acciones con Enter y Espacio en elementos accesibles interactivos.
 */
export function useKeyAction<T extends HTMLElement = HTMLElement>(
  action?: () => void
): React.KeyboardEventHandler<T> | undefined {
  return React.useCallback(
    (e: React.KeyboardEvent<T>) => {
      if (!action) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        action()
      }
    },
    [action]
  )
}
