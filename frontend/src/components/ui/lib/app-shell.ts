import type { IconSource } from '@/components/ui/lib/icon-label'

/** Same width as the `desktop` breakpoint in global.css (981 px). */
const APP_SHELL_DESKTOP_QUERY = '(min-width: 61.3125rem)'

type AppShellNavItem = {
  href: string
  label: string
  icon: IconSource
  count?: number
  countTone?: 'signal' | 'live'
}

type AppShellNavGroup = {
  id: string
  label?: string
  items: AppShellNavItem[]
}

type AppShellTabModule = {
  groupId: string
  label: string
  icon: IconSource
  count?: number
}

type AppShellTab = {
  id: string
  href: string
  label: string
  icon: IconSource
  active: boolean
  count?: number
}

type AppShellCrumb = {
  id: string
  label: string
}

function matchesHref(href: string, pathname: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Longest `href` equal to the pathname or a prefix followed by `/`; `/` only matches itself. */
function getActiveHref(
  groups: AppShellNavGroup[],
  pathname: string
): string | null {
  let active: string | null = null
  for (const group of groups) {
    for (const item of group.items) {
      if (!matchesHref(item.href, pathname)) continue
      if (active === null || item.href.length > active.length) {
        active = item.href
      }
    }
  }
  return active
}

/** A module is shown when its group has a visible item, and links to the first one. */
function getTabs(
  groups: AppShellNavGroup[],
  modules: AppShellTabModule[],
  activeHref: string | null
): AppShellTab[] {
  return modules.flatMap((module) => {
    const group = groups.find((candidate) => candidate.id === module.groupId)
    const first = group?.items[0]
    if (!group || !first) return []

    return [
      {
        id: module.groupId,
        href: first.href,
        label: module.label,
        icon: module.icon,
        count: module.count,
        active: group.items.some((item) => item.href === activeHref),
      },
    ]
  })
}

/** Root, group label (if any) and active item. */
function getCrumbs(
  groups: AppShellNavGroup[],
  activeHref: string | null,
  rootLabel: string
): AppShellCrumb[] {
  const root = { id: 'root', label: rootLabel }
  if (activeHref === null) return [root]

  for (const group of groups) {
    const item = group.items.find((candidate) => candidate.href === activeHref)
    if (!item) continue
    return [
      root,
      ...(group.label ? [{ id: group.id, label: group.label }] : []),
      { id: item.href, label: item.label },
    ]
  }
  return [root]
}

export { APP_SHELL_DESKTOP_QUERY, getActiveHref, getCrumbs, getTabs }
export type {
  AppShellCrumb,
  AppShellNavGroup,
  AppShellNavItem,
  AppShellTab,
  AppShellTabModule,
}
