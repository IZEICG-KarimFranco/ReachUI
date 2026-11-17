import * as React from 'react'
import { Menu as MenuIcon } from 'lucide-react'

import { IconButton } from '@/components/ui/actions/button'
import { useAppShell } from '@/components/ui/hooks/use-app-shell'
import type { AppShellCrumb } from '@/components/ui/lib/app-shell'
import { cn } from '@/lib/utils'

type AppShellTopbarProps = {
  /** Accessible name of the burger that collapses the rail (desktop only). */
  toggleLabel: string
  crumbs: AppShellCrumb[]
  /** Accessible name of the breadcrumb `<nav>`. */
  crumbsLabel: string
  actions?: React.ReactNode
  className?: string
}

/** Top bar: burger (≥981 px), breadcrumb and an actions slot. No search or bell. */
function AppShellTopbar({
  toggleLabel,
  crumbs,
  crumbsLabel,
  actions,
  className,
}: AppShellTopbarProps) {
  const { collapsed, toggleCollapsed, railId } = useAppShell()

  return (
    <header
      data-slot="app-shell-topbar"
      className={cn(
        'flex h-15.5 shrink-0 items-center gap-4 border-b border-line bg-paper px-(--page-x) max-tablet:h-14',
        className
      )}
    >
      <IconButton
        aria-label={toggleLabel}
        aria-expanded={!collapsed}
        aria-controls={railId}
        onClick={toggleCollapsed}
        className="max-desktop:hidden"
      >
        <MenuIcon aria-hidden="true" />
      </IconButton>
      <nav aria-label={crumbsLabel} className="min-w-0 flex-1">
        <ol className="flex min-w-0 items-center gap-2 overflow-hidden text-[13px] whitespace-nowrap text-muted">
          {crumbs.map((crumb, index) => {
            const first = index === 0
            const last = index === crumbs.length - 1
            return (
              <li
                key={crumb.id}
                className={cn(
                  'flex items-center gap-2',
                  last ? 'min-w-0' : 'shrink-0 max-tablet:hidden'
                )}
              >
                {!first && (
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-line-strong max-tablet:hidden"
                  >
                    /
                  </span>
                )}
                <span
                  aria-current={last ? 'page' : undefined}
                  className={cn(
                    'truncate',
                    (first || last) && 'font-bold text-ink'
                  )}
                >
                  {crumb.label}
                </span>
              </li>
            )
          })}
        </ol>
      </nav>
      {actions && (
        <div className="ms-auto flex shrink-0 items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  )
}

export { AppShellTopbar }
export type { AppShellTopbarProps }
