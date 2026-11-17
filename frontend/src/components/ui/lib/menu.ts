import type { IconSource } from '@/components/ui/lib/icon-label'

type MenuAction = {
  id: string
  label: string
  icon?: IconSource
  description?: string
  disabled?: boolean
  danger?: boolean
  /** If any item defines it, those items are announced as `menuitemradio`. */
  checked?: boolean
  /** Receives the Radix `select` event (`preventDefault()` keeps the menu open). */
  onSelect: (event: Event) => void
}

type MenuSeparator = { id: string; type: 'separator' }

type MenuEntry = MenuAction | MenuSeparator

function isMenuSeparator(entry: MenuEntry): entry is MenuSeparator {
  return 'type' in entry && entry.type === 'separator'
}

function isCheckable(entry: MenuEntry): entry is MenuAction {
  return !isMenuSeparator(entry) && entry.checked !== undefined
}

/** `null` if no item is checkable; otherwise the checked item's id, or `''`. */
function getCheckedId(entries: MenuEntry[]): string | null {
  const checkable = entries.filter(isCheckable)
  if (checkable.length === 0) return null
  return checkable.find((entry) => entry.checked)?.id ?? ''
}

export { getCheckedId, isCheckable, isMenuSeparator }
export type { MenuAction, MenuEntry, MenuSeparator }
