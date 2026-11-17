import { useCallback, useRef } from 'react'

/**
 * Devuelve el foco al elemento que lo tenía al abrir el modal. Radix solo lo
 * restaura al `DialogTrigger`, y un modal controlado con `open` no tiene uno.
 * Si ese elemento ya no sirve (es `body` o se desmontó), no interviene y deja
 * que Radix decida.
 */
export function useRestoreFocus() {
  const previous = useRef<HTMLElement | null>(null)

  const onOpenAutoFocus = useCallback(() => {
    previous.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
  }, [])

  const onCloseAutoFocus = useCallback((event: Event) => {
    const element = previous.current
    previous.current = null
    if (element && element !== document.body && element.isConnected) {
      event.preventDefault()
      element.focus()
    }
  }, [])

  return { onOpenAutoFocus, onCloseAutoFocus }
}
