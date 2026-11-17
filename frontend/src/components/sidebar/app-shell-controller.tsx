import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppNav } from '@/components/sidebar/hooks/use-app-nav'
import { useOrganizationMenu } from '@/components/sidebar/hooks/use-organization-menu'
import { usePresenceMenu } from '@/components/sidebar/hooks/use-presence-menu'
import { useRailCollapsedStore } from '@/components/sidebar/hooks/use-rail-collapsed'
import { useUserMenu } from '@/components/sidebar/hooks/use-user-menu'
import { ThemeMenu } from '@/components/theme/theme-menu'
import { StatusDot } from '@/components/ui/feedback/status-dot'
import { AppShell } from '@/components/ui/layout/app-shell'
import {
  AppShellRail,
  AppShellRailBay,
  AppShellRailMenu,
  AppShellRailPresence,
  AppShellRailUser,
} from '@/components/ui/layout/app-shell-rail'
import { AppShellTabbar } from '@/components/ui/layout/app-shell-tabbar'
import { AppShellTopbar } from '@/components/ui/layout/app-shell-topbar'
import { useAgentPresence } from '@/features/inbox/hooks/useAgentPresence'
import { useAgentRealtime } from '@/features/inbox/hooks/useAgentRealtime'
import { useIsIframe } from '@/hooks/use-is-iframe'

/** Presence side effects that used to live inside `PresenceToggle`; mounted only for agents outside Flex. */
function AgentPresenceEffects() {
  useAgentPresence()
  useAgentRealtime()
  return null
}

function OrganizationSelector() {
  const { t } = useTranslation()
  const organization = useOrganizationMenu()
  if (!organization) return null

  return (
    <AppShellRailMenu
      placement="header"
      label={t('organizations')}
      items={organization.items}
      trigger={
        <AppShellRailBay brand={t('name')} organization={organization.name} />
      }
    />
  )
}

function PresenceSelector() {
  const { t } = useTranslation()
  const presence = usePresenceMenu()
  if (!presence.isAgent) return null

  return (
    <>
      <AgentPresenceEffects />
      <AppShellRailMenu
        placement="footer"
        density="compact"
        label={t('agent.status.label')}
        items={presence.options.map((option) => ({
          id: option.id,
          label: option.label,
          icon: <StatusDot tone={option.tone} />,
          checked: option.checked,
          disabled: presence.updating,
          onSelect: () => presence.select(option.id),
        }))}
        trigger={
          <AppShellRailPresence
            label={presence.current.label}
            tone={presence.current.tone}
          />
        }
      />
    </>
  )
}

function UserSelector() {
  const user = useUserMenu()
  if (!user) return null

  return (
    <AppShellRailMenu
      placement="footer"
      label={user.email}
      items={user.items}
      trigger={
        <AppShellRailUser
          name={user.name}
          detail={user.email}
          src={user.avatarUrl}
        />
      }
    />
  )
}

/** Wires permissions, stores, iframe and i18n into the presentational `AppShell`. */
export function AppShellController({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const isIframe = useIsIframe()
  const collapsed = useRailCollapsedStore((state) => state.collapsed)
  const setCollapsed = useRailCollapsedStore((state) => state.setCollapsed)
  const nav = useAppNav()

  return (
    <AppShell
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      mainClassName="px-2 py-2"
      rail={
        <AppShellRail
          label={t('sidebar.navigation')}
          groups={nav.groups}
          activeHref={nav.activeHref}
          header={isIframe ? undefined : <OrganizationSelector />}
          footer={
            isIframe ? undefined : (
              <>
                <PresenceSelector />
                <UserSelector />
              </>
            )
          }
        />
      }
      topbar={
        <AppShellTopbar
          toggleLabel={t('sidebar.toggle')}
          crumbs={nav.crumbs}
          crumbsLabel={t('sidebar.breadcrumb')}
          actions={isIframe ? undefined : <ThemeMenu />}
        />
      }
      tabbar={
        <AppShellTabbar
          label={t('sidebar.quick_access')}
          tabs={nav.tabs}
          menuLabel={t('sidebar.menu')}
        />
      }
    >
      {children}
    </AppShell>
  )
}
