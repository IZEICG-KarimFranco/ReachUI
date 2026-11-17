import type { TFunction } from 'i18next'
import type { AppPermissionCode } from '@/types/app'
import { hasAnyPermission } from '@/features/auth/lib/permissions'

import {
  BarChart3,
  CalendarDays,
  ChartNoAxesCombined,
  Home,
  Inbox,
  List,
  type LucideIcon,
  Megaphone,
  MessageSquareDashed,
  Settings,
  Users,
  Zap,
} from 'lucide-react'

export type PageItem = {
  title: string
  url: string
  icon: LucideIcon
  permission?: AppPermissionCode | AppPermissionCode[]
  items?: PageItem[]
  badge?: string
}

export function filterNavItems(
  items: PageItem[],
  granted: readonly AppPermissionCode[]
): PageItem[] {
  return items.flatMap((item) => {
    if (!hasAnyPermission(granted, item.permission)) return []
    if (!item.items?.length) return [item]

    const children = filterNavItems(item.items, granted)
    return children.length > 0 ? [{ ...item, items: children }] : []
  })
}

export const pages = (t: TFunction): Record<string, PageItem[]> => {
  return {
    home: [
      {
        title: t('site_header.home'),
        url: '/',
        icon: Home,
      },
    ],
    campaigns: [
      {
        title: t('site_header.campaigns'),
        url: '/campaign',
        icon: Megaphone,
        permission: 'campaigns.create',
      },
      {
        title: t('site_header.calendar'),
        url: '/calendar',
        icon: CalendarDays,
        permission: 'campaigns.read',
      },
      {
        title: t('site_header.templates'),
        url: '/templates',
        icon: MessageSquareDashed,
        permission: 'campaigns.read',
      },
      {
        title: t('site_header.analytics.label'),
        url: '/analytics/campaigns',
        icon: BarChart3,
        permission: 'campaigns.read',
      },
    ],
    conversations: [
      {
        title: t('site_header.inbox'),
        url: '/inbox',
        icon: Inbox,
        permission: 'conversations.read',
      },
      {
        title: t('site_header.supervision'),
        url: '/supervision',
        icon: ChartNoAxesCombined,
        permission: 'conversations.reports.view',
      },
      {
        title: t('site_header.analytics.label'),
        url: '/analytics/conversations',
        icon: BarChart3,
        permission: 'conversations.reports.view',
      },
    ],
    contacts: [
      {
        title: t('site_header.contacts.title'),
        url: '/contacts',
        icon: Users,
        permission: 'contacts.read',
      },
      {
        title: t('site_header.contacts.lists'),
        url: '/contacts/lists',
        icon: List,
        permission: 'contacts.read',
      },
      {
        title: t('site_header.contacts.segments'),
        url: '/contacts/segments',
        icon: Zap,
        permission: 'contacts.read',
      },
    ],
    configuration: [
      {
        title: t('site_header.settings'),
        url: '/configuration',
        icon: Settings,
      },
    ],
  }
}

export const navbarLanding = (t?: TFunction) => {
  return [
    {
      href: '/#hero',
      label: t?.('landing.navbar.home', { defaultValue: 'Home' }),
      active: true,
    },
    {
      href: '/#features',
      label: t?.('landing.navbar.features', { defaultValue: 'Features' }),
    },
    {
      href: '/#pricing',
      label: t?.('landing.navbar.pricing', { defaultValue: 'Pricing' }),
    },
    {
      href: '/changelog',
      label: t?.('landing.navbar.changelog', { defaultValue: 'Changelog' }),
    },
  ]
}

export const authNavbarLanding = (t?: TFunction) => {
  return {
    signInText: t?.('landing.navbar.sign_in', { defaultValue: 'Sign In' }),
    signInHref: '/sign-in',
    ctaText: t?.('landing.navbar.get_started', { defaultValue: 'Get Started' }),
    ctaHref: '/sign-up',
  }
}
