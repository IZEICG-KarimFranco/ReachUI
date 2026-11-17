'use client'

import { usePermission } from '@/features/auth/hooks/usePermission'
import { Link } from 'wouter'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/feedback/badge'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/layout/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/layout/collapsible'
import { filterNavItems, type PageItem } from '@/lib/app'

export function NavGroup({
  items,
  label,
  itemBadges,
}: {
  items: PageItem[]
  label?: string
  /** Optional badge count per item URL (e.g. pending ring count on /inbox). */
  itemBadges?: Record<string, number>
}) {
  const { permissions } = usePermission()
  const filteredItems = filterNavItems(items, permissions)

  if (filteredItems.length === 0) return null

  const hasSubItems = filteredItems.some((item) => !!item.items)

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {filteredItems.map((item) => (
            <NavItem
              key={item.title}
              item={item}
              withSub={hasSubItems}
              badge={itemBadges?.[item.url]}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function NavItemBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <SidebarMenuBadge>
      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground animate-pulse">
        {count}
      </span>
    </SidebarMenuBadge>
  )
}

export function NavItem({
  item,
  withSub,
  badge,
}: {
  item: PageItem
  withSub?: boolean
  badge?: number
}) {
  const { hasPermission } = usePermission()

  if (item.permission && !hasPermission(item.permission)) {
    return null
  }

  if (!withSub) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={item.url === window.location.pathname}
          asChild
        >
          <Link href={item.url} className="relative">
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
            {item.badge && (
              <span className="absolute top-1 right-1 size-1 bg-primary rounded-full animate-pulse" />
            )}
          </Link>
        </SidebarMenuButton>
        {badge !== undefined && <NavItemBadge count={badge} />}
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={item.items?.some(
        (subItem) => subItem.url === window.location.pathname
      )}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={item.url === window.location.pathname}
          >
            <div className="relative">
              {item.icon && <item.icon />}
              {item.badge && (
                <span className="absolute top-1 right-1 size-1 bg-primary rounded-full animate-pulse" />
              )}
            </div>
            <span>{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild>
                  <Link href={subItem.url}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
