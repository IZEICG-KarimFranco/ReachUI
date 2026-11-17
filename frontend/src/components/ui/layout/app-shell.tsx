import * as React from 'react'

import {
  AppShellContext,
  useAppShellState,
} from '@/components/ui/hooks/use-app-shell'
import { cn } from '@/lib/utils'

type AppShellProps = {
  rail: React.ReactNode
  topbar: React.ReactNode
  tabbar?: React.ReactNode
  children: React.ReactNode
  /** Desktop mini rail (64 px); the drawer below 981 px always shows the full rail. */
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  className?: string
  mainClassName?: string
}

/** Frame of the app: rail, topbar, content and mobile tab bar ("AppShell" contract). */
function AppShell({
  rail,
  topbar,
  tabbar,
  children,
  collapsed,
  onCollapsedChange,
  className,
  mainClassName,
}: AppShellProps) {
  const shell = useAppShellState({ collapsed, onCollapsedChange })

  return (
    <AppShellContext.Provider value={shell}>
      <div
        data-slot="app-shell"
        className={cn(
          'flex h-full min-h-0 w-full flex-col overflow-hidden bg-paper text-ink',
          className
        )}
      >
        <div className="relative flex min-h-0 flex-1">
          {rail}
          <div
            aria-hidden="true"
            data-slot="app-shell-scrim"
            onClick={() => shell.closeMobile()}
            className={cn(
              'absolute inset-0 z-scrim bg-panel/35 desktop:hidden',
              !shell.mobileOpen && 'hidden'
            )}
          />
          <div
            data-slot="app-shell-frame"
            className="flex min-w-0 flex-1 flex-col"
          >
            {topbar}
            <main
              className={cn(
                '@container/main min-h-0 flex-1 overflow-y-auto',
                mainClassName
              )}
            >
              {children}
            </main>
          </div>
        </div>
        {tabbar}
      </div>
    </AppShellContext.Provider>
  )
}

export { AppShell }
export type { AppShellProps }
