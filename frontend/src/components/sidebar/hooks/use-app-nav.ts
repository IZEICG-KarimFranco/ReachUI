import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'

import { buildAppNav, type AppNav } from '@/components/sidebar/lib/app-nav'
import { usePermission } from '@/features/auth/hooks/usePermission'
import { useIncomingRingsStore } from '@/features/inbox/store/incoming-rings'

/** Shell navigation already filtered by permissions, with the active route from wouter. */
export function useAppNav(): AppNav {
  const { t } = useTranslation()
  const { permissions } = usePermission()
  const [pathname] = useLocation()
  const ringCount = useIncomingRingsStore((state) => state.rings.size)

  return useMemo(
    () => buildAppNav({ t, permissions, pathname, ringCount }),
    [t, permissions, pathname, ringCount]
  )
}
