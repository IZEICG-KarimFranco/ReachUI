import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calendar, Home, Inbox, Megaphone } from 'lucide-react'
import { useState } from 'react'

import { AppShell } from '@/components/ui/layout/app-shell'
import {
  AppShellRail,
  AppShellRailBay,
  AppShellRailMenu,
  AppShellRailPresence,
  AppShellRailUser,
} from '@/components/ui/layout/app-shell-rail'
import { AppShellTabbar } from '@/components/ui/layout/app-shell-tabbar'
import { AppShellTopbar } from '@/components/ui/layout/app-shell-topbar'
import type {
  AppShellNavGroup,
  AppShellTab,
} from '@/components/ui/lib/app-shell'
import { Menu } from '@/components/ui/overlays/menu'

const groups: AppShellNavGroup[] = [
  { id: 'home', items: [{ href: '/', label: 'Inicio', icon: Home }] },
  {
    id: 'campaigns',
    label: 'Campañas',
    items: [
      { href: '/calendar', label: 'Calendario', icon: Calendar },
      { href: '/templates', label: 'Plantillas', icon: Megaphone },
    ],
  },
  {
    id: 'conversations',
    label: 'Conversaciones',
    items: [{ href: '/inbox', label: 'Inbox', icon: Inbox, count: 3 }],
  },
  { id: 'empty', label: 'Vacío', items: [] },
]

const tabs: AppShellTab[] = [
  { id: 'home', href: '/', label: 'Inicio', icon: Home, active: false },
  {
    id: 'campaigns',
    href: '/calendar',
    label: 'Campañas',
    icon: Megaphone,
    active: true,
  },
  {
    id: 'conversations',
    href: '/inbox',
    label: 'Inbox',
    icon: Inbox,
    active: false,
    count: 3,
  },
]

function Shell({
  initialCollapsed = false,
  onCollapsedChange = vi.fn(),
  footer,
}: {
  initialCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  footer?: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed)
  return (
    <AppShell
      collapsed={collapsed}
      onCollapsedChange={(next) => {
        onCollapsedChange(next)
        setCollapsed(next)
      }}
      rail={
        <AppShellRail
          label="Navegación principal"
          groups={groups}
          activeHref="/templates"
          footer={footer}
        />
      }
      topbar={
        <AppShellTopbar
          toggleLabel="Alternar barra lateral"
          crumbsLabel="Ruta de navegación"
          crumbs={[
            { id: 'root', label: 'Reach' },
            { id: 'campaigns', label: 'Campañas' },
            { id: '/templates', label: 'Plantillas' },
          ]}
          actions={<button type="button">Tema</button>}
        />
      }
      tabbar={
        <AppShellTabbar label="Accesos rápidos" tabs={tabs} menuLabel="Menú" />
      }
    >
      <p>Contenido</p>
    </AppShell>
  )
}

describe('AppShellRail', () => {
  it('nombra el nav, marca la ruta activa y muestra el contador', () => {
    render(<Shell />)
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' })

    expect(
      within(nav).getByRole('link', { name: 'Plantillas' })
    ).toHaveAttribute('aria-current', 'page')
    expect(
      within(nav).getByRole('link', { name: 'Calendario' })
    ).not.toHaveAttribute('aria-current')
    expect(
      within(nav).getByRole('link', { name: /^Inbox\s*3$/ })
    ).toHaveAttribute('href', '/inbox')
    expect(
      within(nav).getByRole('list', { name: 'Campañas' })
    ).toBeInTheDocument()
  })

  it('no renderiza un grupo sin ítems ni su etiqueta', () => {
    render(<Shell />)

    expect(screen.queryByText('Vacío')).not.toBeInTheDocument()
  })

  it('en mini conserva los nombres accesibles de los enlaces', () => {
    render(<Shell initialCollapsed />)
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' })

    expect(nav.closest('[data-slot=app-shell-rail]')).toHaveAttribute(
      'data-collapsed',
      'true'
    )
    expect(
      within(nav).getByRole('link', { name: 'Plantillas' })
    ).toBeInTheDocument()
  })

  it('las filas de organización, presencia y usuario abren su Menu', async () => {
    const user = userEvent.setup()
    render(
      <Shell
        footer={
          <>
            <Menu
              label="Estado del agente"
              items={[{ id: 'a', label: 'Disponible', onSelect: () => {} }]}
              trigger={
                <AppShellRailPresence label="Disponible" tone="success" />
              }
            />
            <Menu
              label="ana@reach.mx"
              items={[
                {
                  id: 'logout',
                  label: 'Cerrar sesión',
                  danger: true,
                  onSelect: () => {},
                },
              ]}
              trigger={
                <AppShellRailUser name="Ana Pérez" detail="ana@reach.mx" />
              }
            />
            <Menu
              label="Organizaciones"
              items={[{ id: 'o', label: 'Izei', onSelect: () => {} }]}
              trigger={<AppShellRailBay brand="Reach" organization="Izei" />}
            />
          </>
        }
      />
    )

    await user.click(screen.getByRole('button', { name: 'Disponible' }))
    expect(
      screen.getByRole('menu', { name: 'Estado del agente' })
    ).toBeInTheDocument()
    await user.keyboard('{Escape}')

    await user.click(
      screen.getByRole('button', { name: /^Ana Pérez\s*ana@reach\.mx$/ })
    )
    expect(
      screen.getByRole('menuitem', { name: 'Cerrar sesión' })
    ).toBeInTheDocument()
    await user.keyboard('{Escape}')

    await user.click(screen.getByRole('button', { name: /^Reach\s*Izei$/ }))
    expect(
      screen.getByRole('menu', { name: 'Organizaciones' })
    ).toBeInTheDocument()
  })
})

describe('AppShellTopbar', () => {
  it('el burger alterna collapsed y refleja aria-expanded sobre el rail', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()
    render(<Shell onCollapsedChange={onCollapsedChange} />)
    const burger = screen.getByRole('button', {
      name: 'Alternar barra lateral',
    })
    const rail = document.querySelector('[data-slot=app-shell-rail]')

    expect(burger).toHaveAttribute('aria-expanded', 'true')
    expect(burger).toHaveAttribute('aria-controls', rail?.id)

    await user.click(burger)

    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(burger).toHaveAttribute('aria-expanded', 'false')
  })

  it('las migas marcan la última como página actual', () => {
    render(<Shell />)
    const crumbs = screen.getByRole('navigation', {
      name: 'Ruta de navegación',
    })

    expect(within(crumbs).getAllByRole('listitem')).toHaveLength(3)
    expect(within(crumbs).getByText('Plantillas')).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('button', { name: 'Tema' })).toBeInTheDocument()
  })
})

describe('AppShellTabbar', () => {
  it('lista los módulos, marca el activo y anuncia el contador', () => {
    render(<Shell />)
    const tabbar = screen.getByRole('navigation', { name: 'Accesos rápidos' })

    expect(
      within(tabbar).getByRole('link', { name: 'Campañas' })
    ).toHaveAttribute('aria-current', 'page')
    expect(
      within(tabbar).getByRole('link', { name: /^Inbox\s*3$/ })
    ).toBeInTheDocument()
  })

  it('Menú abre el rail como drawer y el scrim lo cierra devolviendo el foco', async () => {
    const user = userEvent.setup()
    render(<Shell />)
    const menu = screen.getByRole('button', { name: 'Menú' })
    const rail = document.querySelector('[data-slot=app-shell-rail]')

    expect(menu).toHaveAttribute('aria-controls', rail?.id)
    await user.click(menu)

    expect(menu).toHaveAttribute('aria-expanded', 'true')
    expect(rail).toHaveAttribute('data-open', 'true')

    const scrim = document.querySelector('[data-slot=app-shell-scrim]')
    if (!scrim) throw new Error('scrim missing')
    await user.click(scrim)

    expect(menu).toHaveAttribute('aria-expanded', 'false')
    expect(menu).toHaveFocus()
  })

  it('navegar desde el drawer lo cierra', async () => {
    const user = userEvent.setup()
    render(<Shell />)
    await user.click(screen.getByRole('button', { name: 'Menú' }))
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' })

    await user.click(within(nav).getByRole('link', { name: 'Calendario' }))

    expect(screen.getByRole('button', { name: 'Menú' })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })
})

describe('AppShellRailMenu', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'matchMedia')
  })

  function renderUserMenu(initialCollapsed = false) {
    return renderRailMenu({ initialCollapsed })
  }

  function renderRailMenu({
    initialCollapsed = false,
    density,
  }: {
    initialCollapsed?: boolean
    density?: 'compact'
  }) {
    render(
      <Shell
        initialCollapsed={initialCollapsed}
        footer={
          <AppShellRailMenu
            placement="footer"
            density={density}
            label="ana@reach.mx"
            items={[
              { id: 'logout', label: 'Cerrar sesión', onSelect: () => {} },
            ]}
            trigger={
              <AppShellRailUser name="Ana Pérez" detail="ana@reach.mx" />
            }
          />
        }
      />
    )
    return screen.getByRole('button', { name: /^Ana Pérez/ })
  }

  const panel = () =>
    screen.getByRole('menu', { name: 'ana@reach.mx' }).closest('[data-side]')

  it('rail expandido: abre encima de la fila, dentro del rail y con margen', async () => {
    const user = userEvent.setup()
    await user.click(renderUserMenu())

    expect(panel()).toHaveAttribute('data-side', 'top')
    expect(panel()).toHaveStyle({ '--menu-inset': '12px' })
  })

  it('density compact se respeta en escritorio', async () => {
    const user = userEvent.setup()
    await user.click(renderRailMenu({ density: 'compact' }))

    expect(panel()).toHaveAttribute('data-density', 'compact')
  })

  it('en el drawer táctil vuelve a la densidad por defecto (44 px)', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    })
    const user = userEvent.setup()
    await user.click(renderRailMenu({ density: 'compact' }))

    expect(panel()).toHaveAttribute('data-density', 'default')
  })

  it('rail mini: abre a la derecha del rail, fuera de él', async () => {
    const user = userEvent.setup()
    await user.click(renderUserMenu(true))

    expect(panel()).toHaveAttribute('data-side', 'right')
  })

  it('en el drawer abre encima de la fila aunque el rail esté en mini', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    })
    const user = userEvent.setup()
    await user.click(renderUserMenu(true))

    expect(panel()).toHaveAttribute('data-side', 'top')
    expect(panel()).toHaveStyle({ '--menu-inset': '12px' })
  })
})
