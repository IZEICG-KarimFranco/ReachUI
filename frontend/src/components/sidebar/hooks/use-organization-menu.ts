import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { MenuEntry } from '@/components/ui/overlays/menu'
import { usePermission } from '@/features/auth/hooks/usePermission'
import { useAuthStore } from '@/features/auth/store/auth'
import { useOrganizationDialogStore } from '@/features/configuration/store/organization-dialog'
import { useAgentStore } from '@/features/inbox/store/agent'
import { getOrganizations } from '@/services/organization'
import type { Organization } from '@/types/app'

/** Current organization and the selector entries (switch + create with `org.create`). */
export function useOrganizationMenu(): {
  name: string
  items: MenuEntry[]
} | null {
  const { t } = useTranslation()
  const organization = useAuthStore((state) => state.organization)
  const setCurrentOrganization = useAuthStore(
    (state) => state.setCurrentOrganization
  )
  const { hasPermission } = usePermission()
  const openCreateOrganizationDialog = useOrganizationDialogStore(
    (state) => state.openCreateOrganizationDialog
  )
  const [organizations, setOrganizations] = useState<Organization[]>([])

  useEffect(() => {
    let active = true
    getOrganizations()
      .then((result) => {
        if (active) setOrganizations(result)
      })
      .catch((error) => console.error('Failed to load organizations:', error))
    return () => {
      active = false
    }
  }, [])

  if (!organization) return null

  const switchOrganization = async (organizationId: string) => {
    if (organization.id === organizationId) return
    try {
      useAgentStore.getState().reset()
      await setCurrentOrganization(organizationId)
      window.location.reload()
    } catch (error) {
      console.error('Failed to switch organization:', error)
    }
  }

  const items: MenuEntry[] = organizations.map((option) => ({
    id: option.id,
    label: option.name,
    checked: option.id === organization.id,
    onSelect: () => void switchOrganization(option.id),
  }))

  if (hasPermission('org.create')) {
    items.push(
      { id: 'create-separator', type: 'separator' },
      {
        id: 'create-organization',
        label: t('configuration.organization.create'),
        icon: Plus,
        onSelect: () => openCreateOrganizationDialog(),
      }
    )
  }

  return { name: organization.name, items }
}
