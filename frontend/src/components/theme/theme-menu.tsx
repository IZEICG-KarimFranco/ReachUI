import { useTranslation } from 'react-i18next'

import { useTheme } from '@/components/theme/hooks/use-theme'
import type { Theme } from '@/components/theme/theme-context'
import { Menu, type MenuProps } from '@/components/ui/overlays/menu'
import { cn } from '@/lib/utils'

const THEME_LABELS = {
  light: 'mode_toggle.light',
  dark: 'mode_toggle.dark',
  system: 'mode_toggle.system',
} as const satisfies Record<Theme, string>

const THEMES = Object.keys(THEME_LABELS) as Theme[]

type ThemeMenuProps = Pick<MenuProps, 'side' | 'align'> & {
  className?: string
}

/** Theme switch (light, dark, system) for the app topbar and the landing navbar. */
export function ThemeMenu({
  side = 'bottom',
  align = 'end',
  className,
}: ThemeMenuProps) {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const current: Theme = THEMES.includes(theme) ? theme : 'system'

  return (
    <Menu
      side={side}
      align={align}
      label={t('mode_toggle.label')}
      items={THEMES.map((value) => ({
        id: value,
        label: t(THEME_LABELS[value]),
        checked: value === current,
        onSelect: () => setTheme(value),
      }))}
      trigger={
        <button
          type="button"
          data-slot="theme-menu-trigger"
          className={cn(
            'inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control border border-line bg-transparent px-2.75 py-2 text-xs font-semibold text-ink-secondary transition-colors outline-none focus-ring hover:border-signal-contrast hover:text-signal-contrast data-[state=open]:border-signal-contrast data-[state=open]:text-signal-contrast motion-reduce:transition-none',
            className
          )}
        >
          <span
            aria-hidden="true"
            className="size-2.5 max-w-2.5 shrink-0 rounded-[3px] bg-linear-to-r from-ink from-50% to-signal to-50%"
          />
          <span className="sr-only">{t('mode_toggle.label')}</span>
          <span>{t(THEME_LABELS[current])}</span>
        </button>
      }
    />
  )
}
