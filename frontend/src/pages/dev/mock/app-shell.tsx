import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Boxes,
  FileText,
  Plug,
  Plus,
  Receipt,
  Workflow,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'wouter'

import { buildAppNav } from '@/components/sidebar/lib/app-nav'
import { ThemeMenu } from '@/components/theme/theme-menu'
import { Button } from '@/components/ui/actions/button'
import { StatusDot } from '@/components/ui/feedback/status-dot'
import { Field } from '@/components/ui/inputs/field'
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
import { Card } from '@/components/ui/layout/card'
import {
  getActiveHref,
  getCrumbs,
  type AppShellNavGroup,
} from '@/components/ui/lib/app-shell'
import { type MenuEntry } from '@/components/ui/overlays/menu'
import { ChipGroup } from '@/components/ui/selection/chip-group'
import { Select } from '@/components/ui/selection/select'
import { Switch } from '@/components/ui/selection/switch'
import {
  CONVERSATIONS_PERMISSIONS,
  hasAllPermissions,
} from '@/features/auth/lib/permissions'
import type { AppPermissionCode } from '@/types/app'

// Permission catalog and system roles, copied from supabase/seeds/seed_system_rbac.sql.
const RESOURCES: Record<string, AppPermissionCode[]> = {
  Campaigns: [
    'campaigns.read',
    'campaigns.execute',
    'campaigns.create',
    'campaigns.update',
    'campaigns.delete',
    'campaigns.reports.view',
  ],
  Conversations: [
    'conversations.read',
    'conversations.create',
    'conversations.update',
    'conversations.delete',
    'conversations.reports.view',
  ],
  Organization: ['org.create', 'org.read', 'org.update', 'org.members.manage'],
  Contacts: [
    'contacts.read',
    'contacts.create',
    'contacts.update',
    'contacts.delete',
  ],
  Settings: ['twilio.read', 'twilio.manage', 'api_keys.manage'],
  Templates: ['templates.read'],
  Reporting: ['reporting.all'],
  Router: ['router.manage'],
}

const ALL = Object.values(RESOURCES).flat()
const of = (...resources: string[]) =>
  resources.flatMap((resource) => RESOURCES[resource])

const ROLES: Record<string, AppPermissionCode[]> = {
  Viewer: ALL.filter(
    (code) => code.endsWith('.read') || code.endsWith('.view')
  ),
  Owner: ALL.filter((code) => code !== 'org.create'),
  Admin: ALL.filter((code) => code !== 'org.create'),
  Marketing: [
    ...of('Campaigns', 'Contacts'),
    'reporting.all',
    'conversations.read',
    'twilio.read',
    'templates.read',
  ],
  Conversation: [...of('Conversations', 'Contacts'), 'templates.read'],
  Agent: [...of('Conversations', 'Contacts'), 'twilio.read', 'templates.read'],
  'platform-admin': ALL,
}

const ORGANIZATIONS = ['Izei Consulting Group', 'Reach Demo', 'Acme Retail']

const PRESENCE = [
  { id: 'available', key: 'agent.status.available', tone: 'success' },
  { id: 'unavailable', key: 'agent.status.unavailable', tone: 'error' },
  { id: 'busy', key: 'agent.status.busy', tone: 'live' },
  { id: 'offline', key: 'agent.status.offline', tone: 'neutral' },
] as const

// Fictitious modules to check the rail scroll with many entries (20 items in 4 groups).
const EXTRA_ICONS = [Boxes, Workflow, Plug, FileText, Receipt]
const EXTRA_GROUPS: AppShellNavGroup[] = [
  'Automatizaciones',
  'Integraciones',
  'Reportes',
  'Facturación',
].map((label, groupIndex) => ({
  id: `extra-${groupIndex}`,
  label,
  items: Array.from({ length: 5 }, (_, itemIndex) => {
    const number = groupIndex * 5 + itemIndex + 1
    return {
      href: `/extra/${number}`,
      label: `Módulo ${number}`,
      icon: EXTRA_ICONS[itemIndex],
      ...(number === 1 ? { count: 2, countTone: 'live' as const } : {}),
    }
  }),
}))

const RING_OPTIONS = ['0', '3', '12'].map((value) => ({ value, label: value }))

export default function AppShellMockPage() {
  const { t, i18n } = useTranslation()
  const english = i18n.resolvedLanguage === 'en'
  const [pathname] = useLocation()
  const [role, setRole] = useState('Viewer')
  const [permissions, setPermissions] = useState<AppPermissionCode[]>(
    ROLES.Viewer
  )
  const [iframe, setIframe] = useState(false)
  const [rings, setRings] = useState('3')
  const [collapsed, setCollapsed] = useState(false)
  const [manyModules, setManyModules] = useState(false)
  const [organization, setOrganization] = useState(ORGANIZATIONS[0])
  const [presence, setPresence] =
    useState<(typeof PRESENCE)[number]['id']>('available')

  const isAgent = hasAllPermissions(permissions, CONVERSATIONS_PERMISSIONS)
  const nav = useMemo(() => {
    const base = buildAppNav({
      t,
      permissions,
      pathname,
      ringCount: Number(rings),
    })
    if (!manyModules) return base
    const configuration = base.groups.filter(
      (group) => group.id === 'configuration'
    )
    const groups = [
      ...base.groups.filter((group) => group.id !== 'configuration'),
      ...EXTRA_GROUPS,
      ...configuration,
    ]
    const activeHref = getActiveHref(groups, pathname)
    return {
      ...base,
      groups,
      activeHref,
      crumbs: getCrumbs(groups, activeHref, t('name')),
    }
  }, [t, permissions, pathname, rings, manyModules])
  const current = PRESENCE.find((option) => option.id === presence)
  const currentPresence = current ?? PRESENCE[0]

  const organizationItems: MenuEntry[] = [
    ...ORGANIZATIONS.map((name) => ({
      id: name,
      label: name,
      checked: name === organization,
      onSelect: () => setOrganization(name),
    })),
    ...(permissions.includes('org.create')
      ? [
          { id: 'create-separator', type: 'separator' as const },
          {
            id: 'create-organization',
            label: t('configuration.organization.create'),
            icon: Plus,
            onSelect: () => undefined,
          },
        ]
      : []),
  ]

  const rail = (
    <AppShellRail
      label={t('sidebar.navigation')}
      groups={nav.groups}
      activeHref={nav.activeHref}
      header={
        iframe ? undefined : (
          <AppShellRailMenu
            placement="header"
            label={t('organizations')}
            items={organizationItems}
            trigger={
              <AppShellRailBay brand={t('name')} organization={organization} />
            }
          />
        )
      }
      footer={
        iframe ? undefined : (
          <>
            {isAgent && (
              <AppShellRailMenu
                placement="footer"
                density="compact"
                label={t('agent.status.label')}
                items={PRESENCE.map((option) => ({
                  id: option.id,
                  label: t(option.key),
                  icon: <StatusDot tone={option.tone} />,
                  checked: option.id === presence,
                  onSelect: () => setPresence(option.id),
                }))}
                trigger={
                  <AppShellRailPresence
                    label={t(currentPresence.key)}
                    tone={currentPresence.tone}
                  />
                }
              />
            )}
            <AppShellRailMenu
              placement="footer"
              label="adrian.morales@izei-consulting-group.com"
              items={[
                {
                  id: 'logout',
                  label: t('user_menu.logout'),
                  danger: true,
                  onSelect: () => undefined,
                },
              ]}
              trigger={
                <AppShellRailUser
                  name="Adrián Morales"
                  detail="adrian.morales@izei-consulting-group.com"
                />
              }
            />
          </>
        )
      }
    />
  )

  return (
    <div style={{ height: '100svh', width: '100%' }}>
      <AppShell
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        rail={rail}
        topbar={
          <AppShellTopbar
            toggleLabel={t('sidebar.toggle')}
            crumbs={nav.crumbs}
            crumbsLabel={t('sidebar.breadcrumb')}
            actions={iframe ? undefined : <ThemeMenu />}
          />
        }
        tabbar={
          <AppShellTabbar
            label={t('sidebar.quick_access')}
            tabs={nav.tabs}
            menuLabel={t('sidebar.menu')}
          />
        }
      >
        <div
          className="flex flex-col items-center"
          style={{ padding: 'var(--page-y) var(--page-x)', gap: 24 }}
        >
          <Button asChild variant="secondary">
            <Link href="~/dev/mock">
              <ArrowLeft aria-hidden="true" />
              Volver al menú
            </Link>
          </Button>

          <Card className="p-6" style={{ width: '100%', maxWidth: 760 }}>
            <h1 className="text-title text-ink">AppShell · simulación</h1>
            <p className="mt-1 text-xs text-muted">
              Ruta simulada <code className="font-mono">{pathname}</code> ·
              activo <code className="font-mono">{nav.activeHref ?? '—'}</code>{' '}
              · {permissions.length} permisos ·{' '}
              {isAgent ? 'agente' : 'sin presencia'}
            </p>

            <div
              className="mt-6 grid gap-4"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              }}
            >
              <Field label="Rol del seed">
                <Select
                  value={role}
                  placeholder="Personalizado"
                  onValueChange={(value) => {
                    setRole(value)
                    setPermissions(ROLES[value])
                  }}
                  options={Object.keys(ROLES).map((name) => ({
                    value: name,
                    label: name,
                  }))}
                />
              </Field>
              <Field label="Rings entrantes (Inbox)">
                <Select
                  value={rings}
                  onValueChange={setRings}
                  options={RING_OPTIONS}
                />
              </Field>
              <div className="flex flex-col gap-3">
                <Switch
                  label="Dentro de Flex (iframe)"
                  checked={iframe}
                  onCheckedChange={setIframe}
                />
                <Switch
                  label="Rail mini (escritorio)"
                  checked={collapsed}
                  onCheckedChange={setCollapsed}
                />
                <Switch
                  label="+20 módulos (scroll del rail)"
                  checked={manyModules}
                  onCheckedChange={setManyModules}
                />
                <Switch
                  label={`Idioma: inglés (activo: ${english ? 'en' : 'es'})`}
                  checked={english}
                  onCheckedChange={(checked) =>
                    void i18n.changeLanguage(checked ? 'en' : 'es')
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {Object.entries(RESOURCES).map(([resource, codes]) => (
                <div key={resource}>
                  <p className="mb-2 text-xs font-semibold text-muted">
                    {resource}
                  </p>
                  <ChipGroup
                    ariaLabel={`Permisos de ${resource}`}
                    options={codes.map((code) => ({
                      value: code,
                      label: code,
                    }))}
                    value={permissions.filter((code) => codes.includes(code))}
                    onValueChange={(selected) => {
                      setRole('')
                      setPermissions([
                        ...permissions.filter((code) => !codes.includes(code)),
                        ...(selected as AppPermissionCode[]),
                      ])
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </AppShell>
    </div>
  )
}
