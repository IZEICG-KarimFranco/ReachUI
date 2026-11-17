import { useSyncExternalStore } from 'react'
import type { ToasterProps } from 'sonner'

// Same width as the `desktop` breakpoint in global.css (981 px).
const DESKTOP_QUERY = '(min-width: 61.3125rem)'

// Created once and reused: React reads the snapshot on every Toaster render.
let query: MediaQueryList | null | undefined

function desktopQuery() {
  if (query === undefined) {
    query =
      typeof window.matchMedia === 'function'
        ? window.matchMedia(DESKTOP_QUERY)
        : null
  }
  return query
}

function subscribe(onChange: () => void) {
  const query = desktopQuery()
  query?.addEventListener('change', onChange)
  return () => query?.removeEventListener('change', onChange)
}

function isDesktop() {
  return desktopQuery()?.matches ?? true
}

// Below the desktop breakpoint toasts go on top, so they do not cover the
// footer of a bottom sheet or the tab bar.
export function useToasterPosition(): ToasterProps['position'] {
  return useSyncExternalStore(subscribe, isDesktop, () => true)
    ? 'bottom-center'
    : 'top-center'
}
