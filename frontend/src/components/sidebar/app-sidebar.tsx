import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/layout/sidebar'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { useTranslation } from 'react-i18next'
import { pages } from '@/lib/app'
import { OrganizationSwitcher } from './organization-switcher'
import { useAgentStatus } from '@/features/inbox/hooks/useAgentStatus'
import { PresenceToggle } from '@/features/inbox/components/presence-toggle'
import { useIncomingRingsStore } from '@/features/inbox/store/incoming-rings'
import { useIsIframe } from '@/hooks/use-is-iframe'

export function AppSidebar() {
  const { t } = useTranslation()
  const { isAgent } = useAgentStatus()
  const isIframe = useIsIframe()
  const ringCount = useIncomingRingsStore((s) => s.rings.size)

  return (
    <Sidebar variant="floating" collapsible="icon">
      {!isIframe && (
        <SidebarHeader>
          <OrganizationSwitcher />
        </SidebarHeader>
      )}
      <SidebarContent>
        <NavGroup items={pages(t).home} />
        <NavGroup
          items={pages(t).campaigns}
          label={t('site_header.campaigns')}
        />
        <NavGroup
          items={pages(t).conversations}
          itemBadges={ringCount > 0 ? { '/inbox': ringCount } : undefined}
        />
        <NavGroup
          items={pages(t).contacts}
          label={t('site_header.contacts.title')}
        />
        <NavGroup items={pages(t).configuration} />
      </SidebarContent>
      {!isIframe && (
        <SidebarFooter>
          {isAgent && <PresenceToggle />}
          <NavUser />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
