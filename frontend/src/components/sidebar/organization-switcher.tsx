'use client'

import { useState, useEffect } from 'react'
import {
  Building2,
  Briefcase,
  Sparkles,
  ChevronsUpDown,
  Plus,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/overlays/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/layout/sidebar'
import { useAuthStore } from '@/features/auth/store/auth'
import type { Organization } from '@/types/app'
import { getOrganizations } from '@/services/organization'
import Logo from '@/components/shared/logo'
import { useAgentStore } from '@/features/inbox/store/agent'
import { usePermission } from '@/features/auth/hooks/usePermission'
import { useOrganizationDialogStore } from '@/features/configuration/store/organization-dialog'

// Icon mapping for organizations - use generic icons based on index
const organizationIcons = [Building2, Briefcase, Sparkles, Building2, Briefcase]

export function OrganizationSwitcher() {
  const { t } = useTranslation()
  const { isMobile } = useSidebar()
  const { organization, setCurrentOrganization } = useAuthStore()
  const { hasPermission } = usePermission()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const openCreateOrganizationDialog = useOrganizationDialogStore(
    (state) => state.openCreateOrganizationDialog
  )

  useEffect(() => {
    const fetchOrganizations = async () => {
      const organizations = await getOrganizations()
      setOrganizations(organizations)
    }
    fetchOrganizations()
  }, [])

  if (!organization) return null

  const handleSwitchOrganization = async (organizationId: string) => {
    if (organization.id === organizationId) return
    try {
      useAgentStore.getState().reset()
      await setCurrentOrganization(organizationId)
      window.location.reload()
    } catch (error) {
      console.error('Failed to switch organization:', error)
    }
  }

  const canCreateOrganization = hasPermission('org.create')

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="h-full w-auto aspect-square">
                <Logo size={8} withText={false} isLink={false} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {organization.name}
                </span>
                <span className="truncate text-xs">
                  {t('configuration.organization.title', {
                    defaultValue: 'Organization',
                  })}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                {t('organizations', { defaultValue: 'Organizations' })}
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={organization?.id?.toString() || ''}
                onValueChange={(value) => handleSwitchOrganization(value)}
              >
                {organizations.map((o, index) => {
                  const Icon =
                    organizationIcons[index % organizationIcons.length]
                  return (
                    <DropdownMenuRadioItem key={o.id} value={o.id.toString()}>
                      <Icon />
                      {o.name}
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            {canCreateOrganization && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2"
                  onSelect={() => openCreateOrganizationDialog()}
                >
                  <Plus className="size-4" />
                  {t('configuration.organization.create')}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
