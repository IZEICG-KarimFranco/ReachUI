import { useTranslation } from 'react-i18next'

import type { MenuEntry } from '@/components/ui/overlays/menu'
import { useAuthStore } from '@/features/auth/store/auth'

/** Signed-in user for the rail row and its menu (log out only). */
export function useUserMenu(): {
  name: string
  email: string
  avatarUrl?: string
  items: MenuEntry[]
} | null {
  const { t } = useTranslation()
  const userProfile = useAuthStore((state) => state.userProfile)
  const signOut = useAuthStore((state) => state.signOut)

  if (!userProfile) return null

  return {
    name: userProfile.full_name || userProfile.email,
    email: userProfile.email,
    avatarUrl: userProfile.avatar_url,
    items: [
      {
        id: 'logout',
        label: t('user_menu.logout'),
        danger: true,
        onSelect: () => void signOut(),
      },
    ],
  }
}
