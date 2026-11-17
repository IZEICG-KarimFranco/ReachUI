import { describe, expect, it } from 'vitest'
import { Home, Inbox, Megaphone } from 'lucide-react'

import {
  getActiveHref,
  getCrumbs,
  getTabs,
  type AppShellNavGroup,
} from '@/components/ui/lib/app-shell'

const groups: AppShellNavGroup[] = [
  { id: 'home', items: [{ href: '/', label: 'Inicio', icon: Home }] },
  {
    id: 'campaigns',
    label: 'Campañas',
    items: [
      { href: '/campaign', label: 'Campañas', icon: Megaphone },
      { href: '/analytics/campaigns', label: 'Analítica', icon: Megaphone },
    ],
  },
  {
    id: 'contacts',
    label: 'Contactos',
    items: [
      { href: '/contacts', label: 'Contactos', icon: Inbox },
      { href: '/contacts/lists', label: 'Listas', icon: Inbox },
    ],
  },
]

describe('getActiveHref', () => {
  it.each([
    ['/', '/'],
    ['/campaign', '/campaign'],
    ['/campaign/42', '/campaign'],
    ['/analytics/campaigns/list', '/analytics/campaigns'],
    ['/contacts/lists', '/contacts/lists'],
    ['/contacts/lists/7', '/contacts/lists'],
    ['/contacts/9', '/contacts'],
  ])('%s → %s (prefijo más largo)', (pathname, expected) => {
    expect(getActiveHref(groups, pathname)).toBe(expected)
  })

  it.each(['/campaigns', '/inbox', '/configuration'])(
    '%s no activa nada: `/` solo por igualdad y sin prefijos parciales',
    (pathname) => {
      expect(getActiveHref(groups, pathname)).toBeNull()
    }
  )
})

describe('getTabs', () => {
  const modules = [
    { groupId: 'home', label: 'Inicio', icon: Home },
    { groupId: 'campaigns', label: 'Campañas', icon: Megaphone },
    { groupId: 'conversations', label: 'Inbox', icon: Inbox, count: 3 },
  ]

  it('omite módulos sin grupo visible y enlaza al primer hijo', () => {
    const tabs = getTabs(groups, modules, '/analytics/campaigns')

    expect(tabs.map((tab) => [tab.id, tab.href, tab.active])).toEqual([
      ['home', '/', false],
      ['campaigns', '/campaign', true],
    ])
  })

  it('sin ruta activa ninguna pestaña queda activa', () => {
    expect(getTabs(groups, modules, null).some((tab) => tab.active)).toBe(false)
  })
})

describe('getCrumbs', () => {
  it('raíz, grupo y página activa', () => {
    expect(
      getCrumbs(groups, '/contacts/lists', 'Reach').map((crumb) => crumb.label)
    ).toEqual(['Reach', 'Contactos', 'Listas'])
  })

  it('un grupo sin etiqueta no añade migaja', () => {
    expect(getCrumbs(groups, '/', 'Reach').map((c) => c.label)).toEqual([
      'Reach',
      'Inicio',
    ])
  })

  it('sin ruta activa solo queda la raíz', () => {
    expect(getCrumbs(groups, null, 'Reach')).toEqual([
      { id: 'root', label: 'Reach' },
    ])
  })
})
