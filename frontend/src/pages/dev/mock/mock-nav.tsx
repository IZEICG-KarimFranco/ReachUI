import { House } from 'lucide-react'
import { Link, useLocation } from 'wouter'

import { useTheme } from '@/components/theme/hooks/use-theme'
import { Button } from '@/components/ui/actions/button'
import { IconLabel } from '@/components/ui/data-display/icon-label'
import { cn } from '@/lib/utils'
import { MOCK_PAGES } from '@/pages/dev/mock/mock-pages'

const navLinkBase =
  'inline-flex items-center rounded-control px-2.5 py-1.5 text-xs transition-colors outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-signal-contrast motion-reduce:transition-none'

export function MockNav() {
  const [location] = useLocation()
  const { theme, setTheme } = useTheme()
  const isHome = location === '/dev/mock'

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-line bg-card px-4 py-2.5 sm:px-6">
      <Link
        href="/dev/mock"
        aria-current={isHome ? 'page' : undefined}
        className={cn(
          navLinkBase,
          isHome
            ? 'bg-selection font-semibold text-signal-contrast'
            : 'font-semibold text-ink hover:bg-control/50'
        )}
      >
        <IconLabel icon={House} size="sm">
          Inicio
        </IconLabel>
      </Link>

      <span aria-hidden="true" className="text-xs text-muted">
        /
      </span>

      <nav
        aria-label="Pantallas mock"
        className="flex flex-wrap items-center gap-1"
      >
        {MOCK_PAGES.map((item) => {
          const active = location === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              aria-current={active ? 'page' : undefined}
              className={cn(
                navLinkBase,
                active
                  ? 'bg-selection font-semibold text-signal-contrast'
                  : 'text-ink-secondary hover:bg-control/50 hover:text-ink'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Button
        variant="secondary"
        size="compact"
        className="ml-auto"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? 'Claro' : 'Oscuro'}
      </Button>
    </header>
  )
}
