import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from 'react'

import { APP_SHELL_DESKTOP_QUERY } from '@/components/ui/lib/app-shell'

type AppShellContextValue = {
  /** ≥981 px: fixed rail; below it the rail is a drawer. */
  isDesktop: boolean
  collapsed: boolean
  toggleCollapsed: () => void
  mobileOpen: boolean
  toggleMobile: () => void
  /** Closes the drawer; by default focus goes back to the tab bar's Menu button. */
  closeMobile: (restoreFocus?: boolean) => void
  railId: string
  railRef: RefObject<HTMLDivElement | null>
  menuButtonRef: RefObject<HTMLButtonElement | null>
}

const AppShellContext = createContext<AppShellContextValue | null>(null)

function subscribeDesktop(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {}
  const query = window.matchMedia(APP_SHELL_DESKTOP_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function isDesktopSnapshot() {
  if (typeof window.matchMedia !== 'function') return true
  return window.matchMedia(APP_SHELL_DESKTOP_QUERY).matches
}

function useAppShell() {
  const context = useContext(AppShellContext)
  if (!context) throw new Error('useAppShell must be used within <AppShell>')
  return context
}

function useAppShellState({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}): AppShellContextValue {
  const [mobileOpen, setMobileOpen] = useState(false)
  const railId = useId()
  const railRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const closeMobile = useCallback((restoreFocus = true) => {
    setMobileOpen(false)
    if (restoreFocus) menuButtonRef.current?.focus()
  }, [])

  const toggleMobile = useCallback(() => setMobileOpen((open) => !open), [])

  const toggleCollapsed = useCallback(
    () => onCollapsedChange(!collapsed),
    [collapsed, onCollapsedChange]
  )

  useEffect(() => {
    if (!mobileOpen) return
    railRef.current
      ?.querySelector<HTMLElement>('a[href], button:not(:disabled)')
      ?.focus()

    // Radix menus handle Escape first (capture phase) and prevent it.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      closeMobile()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen, closeMobile])

  // Ctrl/Cmd+B toggles the mini rail, as the previous sidebar did.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'b' || !(event.metaKey || event.ctrlKey)) return
      event.preventDefault()
      toggleCollapsed()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleCollapsed])

  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    isDesktopSnapshot,
    () => true
  )

  useEffect(() => {
    if (isDesktop) setMobileOpen(false)
  }, [isDesktop])

  return useMemo(
    () => ({
      isDesktop,
      collapsed,
      toggleCollapsed,
      mobileOpen,
      toggleMobile,
      closeMobile,
      railId,
      railRef,
      menuButtonRef,
    }),
    [
      isDesktop,
      collapsed,
      toggleCollapsed,
      mobileOpen,
      toggleMobile,
      closeMobile,
      railId,
    ]
  )
}

const ACTIVE_ITEM_MARGIN = 8

/**
 * Scrolls `container` (only that element, not the page) so the item marked
 * `aria-current="page"` is visible, on mount and whenever the active route or
 * the list of entries changes (`entriesKey`; e.g. permissions arriving after
 * load push the active item down). Counters do not trigger it.
 */
function useActiveItemInView(
  containerRef: RefObject<HTMLElement | null>,
  activeHref: string | null,
  entriesKey = ''
) {
  useEffect(() => {
    const container = containerRef.current
    const item = container?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!container || !item) return

    const bounds = container.getBoundingClientRect()
    const itemBounds = item.getBoundingClientRect()
    if (itemBounds.top < bounds.top) {
      container.scrollTop -= bounds.top - itemBounds.top + ACTIVE_ITEM_MARGIN
    } else if (itemBounds.bottom > bounds.bottom) {
      container.scrollTop +=
        itemBounds.bottom - bounds.bottom + ACTIVE_ITEM_MARGIN
    }
  }, [containerRef, activeHref, entriesKey])
}

export { AppShellContext, useActiveItemInView, useAppShell, useAppShellState }
export type { AppShellContextValue }
