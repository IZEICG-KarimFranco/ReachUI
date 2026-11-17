import type { TFunction } from 'i18next'
import { Home, Inbox, Megaphone, Users } from 'lucide-react'

import {
  getActiveHref,
  getCrumbs,
  getTabs,
  type AppShellCrumb,
  type AppShellNavGroup,
  type AppShellTab,
} from '@/components/ui/lib/app-shell'
import { filterNavItems, pages, type PageItem } from '@/lib/app'
import type { AppPermissionCode } from '@/types/app'

type AppNav = {
  groups: AppShellNavGroup[]
  activeHref: string | null
  tabs: AppShellTab[]
  crumbs: AppShellCrumb[]
}

const INBOX_HREF = '/inbox'

/** Rail groups, tab bar and breadcrumb for the granted permissions. Pure: the dev mock calls it with local permissions. */
function buildAppNav({
  t,
  permissions,
  pathname,
  ringCount,
}: {
  t: TFunction
  permissions: readonly AppPermissionCode[]
  pathname: string
  ringCount: number
}): AppNav {
  const sections = pages(t)
  const definitions: { id: string; label?: string; items: PageItem[] }[] = [
    { id: 'home', items: sections.home },
    {
      id: 'campaigns',
      label: t('site_header.campaigns'),
      items: sections.campaigns,
    },
    {
      id: 'conversations',
      label: t('site_header.conversations'),
      items: sections.conversations,
    },
    {
      id: 'contacts',
      label: t('site_header.contacts.title'),
      items: sections.contacts,
    },
    { id: 'configuration', items: sections.configuration },
  ]
  const inboxCount = ringCount > 0 ? ringCount : undefined

  const groups = definitions.flatMap(({ id, label, items }) => {
    const visible = filterNavItems(items, permissions)
    if (visible.length === 0) return []
    return [
      {
        id,
        label,
        items: visible.map((item) => ({
          href: item.url,
          label: item.title,
          icon: item.icon,
          count: item.url === INBOX_HREF ? inboxCount : undefined,
        })),
      },
    ]
  })

  const activeHref = getActiveHref(groups, pathname)
  const tabs = getTabs(
    groups,
    [
      { groupId: 'home', label: t('site_header.home'), icon: Home },
      {
        groupId: 'campaigns',
        label: t('site_header.campaigns'),
        icon: Megaphone,
      },
      {
        groupId: 'conversations',
        label: t('site_header.inbox'),
        icon: Inbox,
        count: inboxCount,
      },
      {
        groupId: 'contacts',
        label: t('site_header.contacts.title'),
        icon: Users,
      },
    ],
    activeHref
  )

  return {
    groups,
    activeHref,
    tabs,
    crumbs: getCrumbs(groups, activeHref, t('name')),
  }
}

export { buildAppNav }
export type { AppNav }
