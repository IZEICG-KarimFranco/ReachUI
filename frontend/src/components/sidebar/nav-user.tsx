'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/overlays/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/layout/sidebar'
import { useAuthStore } from '@/features/auth/store/auth'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/data-display/avatar'
import { useTranslation } from 'react-i18next'
import { useAgentStatus } from '@/features/inbox/hooks/useAgentStatus'
import { Circle } from 'lucide-react'

export function NavUser() {
  const { isMobile, open } = useSidebar()
  const { userProfile, signOut } = useAuthStore()
  const { t } = useTranslation()
  const { isAgent } = useAgentStatus()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg overflow-hidden">
                <AvatarImage
                  src={userProfile?.avatar_url}
                  alt={userProfile?.full_name}
                />
                <AvatarFallback className="rounded-lg">
                  {userProfile?.full_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {(open || isMobile) && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userProfile?.full_name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userProfile?.email}
                  </span>
                </div>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={userProfile?.avatar_url}
                    alt={userProfile?.full_name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {userProfile?.full_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userProfile?.full_name}
                  </span>
                  <span className="truncate text-xs">{userProfile?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAgent && (
              <DropdownMenuItem disabled aria-label={t('agent.menu.active')}>
                <Circle
                  className="mr-2 h-4 w-4 text-green-500"
                  aria-hidden="true"
                />
                {t('agent.menu.active')}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" asChild>
              <button onClick={signOut} className="w-full">
                {t('user_menu.logout')}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
