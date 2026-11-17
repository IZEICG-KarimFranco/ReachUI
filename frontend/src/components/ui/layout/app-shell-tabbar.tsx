import { Menu as MenuIcon } from 'lucide-react'
import { Link } from 'wouter'

import { IconLabel } from '@/components/ui/data-display/icon-label'
import { StatusDot } from '@/components/ui/feedback/status-dot'
import { useAppShell } from '@/components/ui/hooks/use-app-shell'
import type { AppShellTab } from '@/components/ui/lib/app-shell'
import { isIconComponent } from '@/components/ui/lib/icon-label'
import { cn } from '@/lib/utils'

type AppShellTabbarProps = {
  /** Accessible name of the tab bar `<nav>`. */
  label: string
  tabs: AppShellTab[]
  /** Text of the button that opens the rail as a drawer. */
  menuLabel: string
  className?: string
}

const tabClassName =
  'relative flex min-w-0 flex-1 cursor-pointer px-1 pt-2.25 pb-2.5 text-xs text-muted'

function TabIcon({ tab }: { tab: AppShellTab }) {
  const Icon = tab.icon
  return (
    <span className="relative inline-flex">
      {isIconComponent(Icon) ? <Icon className="size-4.5" /> : Icon}
      <StatusDot
        tone="error"
        size="sm"
        className="absolute -top-0.5 -right-1.5"
      />
    </span>
  )
}

/** Mobile tab bar (below 981 px): main modules plus a Menu button that opens the rail. */
function AppShellTabbar({
  label,
  tabs,
  menuLabel,
  className,
}: AppShellTabbarProps) {
  const { mobileOpen, toggleMobile, closeMobile, railId, menuButtonRef } =
    useAppShell()

  return (
    <nav
      aria-label={label}
      data-slot="app-shell-tabbar"
      className={cn(
        'z-tabbar flex shrink-0 border-t border-line bg-paper-secondary desktop:hidden',
        className
      )}
    >
      {tabs.map((tab) => {
        const hasCount = tab.count !== undefined && tab.count > 0
        return (
          <IconLabel
            key={tab.id}
            asChild
            size="lg"
            layout="stacked"
            icon={hasCount ? <TabIcon tab={tab} /> : tab.icon}
            className={cn(
              tabClassName,
              'aria-[current=page]:font-semibold aria-[current=page]:text-signal-contrast'
            )}
          >
            <Link
              href={tab.href}
              aria-current={tab.active ? 'page' : undefined}
              onClick={() => {
                if (mobileOpen) closeMobile(false)
              }}
            >
              {tab.label}
              {hasCount && <span className="sr-only"> {tab.count}</span>}
            </Link>
          </IconLabel>
        )
      })}
      <IconLabel
        asChild
        size="lg"
        layout="stacked"
        icon={MenuIcon}
        className={cn(
          tabClassName,
          'aria-expanded:font-semibold aria-expanded:text-signal-contrast'
        )}
      >
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls={railId}
          onClick={toggleMobile}
        >
          {menuLabel}
        </button>
      </IconLabel>
    </nav>
  )
}

export { AppShellTabbar }
export type { AppShellTabbarProps }
