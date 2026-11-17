import type { CSSProperties, ReactNode } from 'react'
import {
  BarChart3,
  Building2,
  CalendarDays,
  ChartLine,
  ChevronDown,
  CircleAlert,
  FileText,
  Home,
  Inbox,
  KeyRound,
  LayoutGrid,
  List,
  Megaphone,
  Menu,
  MessageSquareText,
  Plug,
  User,
} from 'lucide-react'

import { WhatsAppIcon } from '@/components/icons/whatsapp'
import { Badge } from '@/components/ui/feedback/badge'
import { Card, CardFooter, CardHeader, CardItem } from '@/components/ui/layout/card'
import { IconLabel } from '@/components/ui/data-display/icon-label'
import { StatusDot } from '@/components/ui/feedback/status-dot'
import { Surface } from '@/components/ui/layout/surface'
import { cn } from '@/lib/utils'
import { MockNav } from '@/pages/dev/mock/mock-nav'

// pages/dev/mock/ está en .gitignore y Tailwind no genera utilities que solo aparecen aquí:
// el hover y los valores sin clase versionada van en este bloque, siempre con tokens.
const pageCss = `
[data-il-hover]:hover { background: var(--inset); color: var(--ink); }
[data-il-hover][data-active]:hover { background: var(--selection); color: var(--signal-contrast); }
[data-il-cnav]:hover { background: var(--inset); }
[data-il-cnav][data-active]:hover { background: var(--selection); }
[data-il-cnav]:not(:last-child) { border-inline-end: 1px solid var(--line); }
[data-il-cnav-rail]:hover { background: var(--inset); }
[data-il-cnav-rail][data-active]:hover { background: var(--selection); }
[data-il-group]:hover [data-slot="icon-label-icon"] { opacity: 1; color: var(--signal-contrast); }
`

const railGroups = [
  {
    title: null,
    items: [{ label: 'Inicio', Icon: Home }],
  },
  {
    title: 'Campañas',
    items: [
      { label: 'Campañas', Icon: Megaphone },
      { label: 'Calendario', Icon: CalendarDays },
      { label: 'Plantillas', Icon: MessageSquareText, active: true },
      { label: 'Analítica', Icon: ChartLine },
    ],
  },
  {
    title: 'Conversaciones',
    items: [
      { label: 'Inbox', Icon: Inbox, count: '3', tone: 'signal' },
      { label: 'Supervisión', Icon: BarChart3, count: '2', tone: 'warning' },
    ],
  },
] as const satisfies readonly {
  title: string | null
  items: readonly {
    label: string
    Icon: typeof Home
    active?: boolean
    count?: string
    tone?: 'signal' | 'warning'
  }[]
}[]

const settingsItems = [
  { label: 'Perfil', railLabel: 'Perfil', Icon: User, active: true },
  { label: 'Organización', railLabel: 'Organización', Icon: Building2 },
  { label: 'Integraciones', railLabel: 'Integraciones', Icon: Plug },
  { label: 'Campos', railLabel: 'Campos de contacto', Icon: List },
  { label: 'API keys', railLabel: 'API keys', Icon: KeyRound, beta: true },
] as const satisfies readonly {
  label: string
  railLabel: string
  Icon: typeof Home
  active?: boolean
  beta?: boolean
}[]

const tabbarItems = [
  { label: 'Inicio', Icon: Home },
  { label: 'Campañas', Icon: Megaphone, active: true },
  { label: 'Inbox', Icon: Inbox, unread: true },
  { label: 'Menú', Icon: Menu },
] as const satisfies readonly {
  label: string
  Icon: typeof Home
  active?: boolean
  unread?: boolean
}[]

const campaigns = [
  {
    name: 'Promo primavera',
    contacts: '4,820',
    status: 'Entregada',
    className: 'text-success',
  },
  {
    name: 'Reactivación Q2',
    contacts: '1,204',
    status: 'En curso',
    className: 'text-live',
  },
  {
    name: 'Recordatorio de pago',
    contacts: '312',
    status: 'Fallida',
    className: 'text-error',
  },
  {
    name: 'Encuesta NPS',
    contacts: '640',
    status: 'Borrador',
    className: 'text-muted',
  },
] as const

const errorBlockStyle: CSSProperties = {
  borderColor: 'color-mix(in srgb, var(--error) 30%, var(--line))',
  background: 'color-mix(in srgb, var(--error) 7%, var(--card))',
}

function Shot({
  id,
  title,
  note,
  children,
}: {
  id: string
  title: string
  note: string
  children: ReactNode
}) {
  return (
    <section data-shot={id} className="flex min-w-0 flex-col gap-3">
      <div>
        <h2 className="font-mono text-[10px] tracking-widest text-muted uppercase">
          {title}
        </h2>
        <p className="mt-1 text-xs text-ink-secondary">{note}</p>
      </div>
      {children}
    </section>
  )
}

export function IconLabelRailShot() {
  return (
    <aside
      className="flex flex-col overflow-hidden rounded-surface border border-line text-ink"
      style={{ width: 'var(--rail-w)', background: 'var(--paper-secondary)' }}
    >
      <div className="flex items-center gap-3 border-b border-line p-4">
        <LayoutGrid aria-hidden className="size-5 text-signal" />
        <div className="min-w-0">
          <p className="text-base font-semibold">Reach</p>
          <p className="truncate text-xs text-muted">Izei Consulting Group</p>
        </div>
      </div>

      <nav className="flex flex-col py-3">
        {railGroups.map(({ title, items }) => (
          <div key={title ?? 'root'} className="mb-3 flex flex-col gap-0.5">
            {title && (
              <p className="px-4 pt-2 pb-2 text-xs font-semibold text-muted">
                {title}
              </p>
            )}
            {items.map((item) => {
              const active = 'active' in item && item.active
              return (
                <IconLabel
                  key={item.label}
                  icon={item.Icon}
                  size="lg"
                  asChild
                  iconClassName={cn(!active && 'opacity-80')}
                  trailing={
                    'count' in item && (
                      <Badge variant={item.tone}>{item.count}</Badge>
                    )
                  }
                  className={cn(
                    'focus-ring mx-2 flex rounded-control px-3 py-2 font-medium transition-colors',
                    active
                      ? 'bg-selection font-semibold text-signal-contrast'
                      : 'text-ink-secondary'
                  )}
                >
                  <a
                    href="#rail"
                    data-il-hover=""
                    data-active={active || undefined}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </IconLabel>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-line">
        <IconLabel
          icon={<StatusDot tone="success" />}
          asChild
          trailing={<ChevronDown aria-hidden className="size-3 text-muted" />}
          className="focus-ring flex w-full px-4 py-3 text-xs text-ink-secondary transition-colors"
        >
          <button type="button" data-il-hover="">
            Disponible
          </button>
        </IconLabel>
      </div>
    </aside>
  )
}

export function IconLabelTabbarShot() {
  return (
    <nav
      className="flex w-full max-w-sm overflow-hidden rounded-surface border border-line"
      style={{ background: 'var(--paper-secondary)' }}
    >
      {tabbarItems.map((item) => {
        const active = 'active' in item && item.active
        const unread = 'unread' in item && item.unread
        return (
          <IconLabel
            key={item.label}
            icon={
              <span className="relative inline-flex">
                <item.Icon className="size-4.5" />
                {unread && (
                  <StatusDot
                    tone="error"
                    size="sm"
                    className="absolute -top-0.5"
                    style={{ right: -6 }}
                  />
                )}
              </span>
            }
            layout="stacked"
            asChild
            className={cn(
              'focus-ring flex-1 px-1 py-2 text-xs',
              active ? 'font-semibold text-signal-contrast' : 'text-muted'
            )}
          >
            <a
              href="#tabbar"
              aria-current={active ? 'page' : undefined}
              aria-label={
                unread ? `${item.label}, mensajes sin leer` : undefined
              }
            >
              {item.label}
            </a>
          </IconLabel>
        )
      })}
    </nav>
  )
}

export function IconLabelCnavStripShot() {
  return (
    <div className="flex w-full overflow-x-auto rounded-control border border-line bg-card">
      {settingsItems.map((item) => {
        const active = 'active' in item && item.active
        return (
          <IconLabel
            key={item.label}
            icon={item.Icon}
            layout="stacked"
            tone={active ? 'default' : 'muted'}
            iconClassName={cn(active && 'text-signal-contrast')}
            asChild
            className={cn(
              'focus-ring flex-1 items-start px-3.5 py-3 text-left whitespace-nowrap transition-colors',
              active ? 'bg-selection font-bold text-ink' : 'text-ink-secondary'
            )}
          >
            <button
              type="button"
              data-il-cnav=""
              data-active={active || undefined}
              aria-current={active ? 'page' : undefined}
              style={{ minWidth: 108 }}
            >
              <span className="flex items-center gap-2">
                {active && <StatusDot tone="signal" size="sm" />}
                {item.label}
                {'beta' in item && <Badge variant="warning">Beta</Badge>}
              </span>
            </button>
          </IconLabel>
        )
      })}
    </div>
  )
}

export function IconLabelCnavRailShot() {
  return (
    <Surface className="flex w-full max-w-xs flex-col gap-0.5 p-2">
      {settingsItems.map((item) => {
        const active = 'active' in item && item.active
        return (
          <IconLabel
            key={item.label}
            icon={item.Icon}
            tone={active ? 'default' : 'muted'}
            iconClassName={cn(active && 'text-signal-contrast')}
            trailing={'beta' in item && <Badge variant="warning">Beta</Badge>}
            asChild
            className={cn(
              'focus-ring flex w-full rounded-control px-3 py-2 text-left transition-colors',
              active ? 'bg-selection font-bold text-ink' : 'text-ink-secondary'
            )}
          >
            <button
              type="button"
              data-il-cnav-rail=""
              data-active={active || undefined}
              aria-current={active ? 'page' : undefined}
            >
              <span className="flex items-center gap-2">
                {active && <StatusDot tone="signal" size="sm" />}
                {item.railLabel}
              </span>
            </button>
          </IconLabel>
        )
      })}
      <p className="mx-2 mt-1 border-t border-line px-1 pt-3 pb-1 text-xs text-muted">
        5 secciones · según rol
      </p>
    </Surface>
  )
}

export function IconLabelMetaShot() {
  return (
    <Card divided className="w-full max-w-xl text-sm text-ink">
      <CardHeader>
        <span className="font-semibold">Últimas campañas</span>
        <a href="#meta" className="focus-ring-inline text-signal-contrast">
          Ver todas
        </a>
      </CardHeader>
      {campaigns.map((campaign) => (
        <CardItem key={campaign.name} className="flex items-center gap-3">
          <span className="truncate font-medium">{campaign.name}</span>
          <span className="shrink-0 text-xs text-muted">
            {campaign.contacts} contactos
          </span>
          <IconLabel
            icon={<StatusDot tone="current" size="sm" />}
            iconPosition="end"
            size="sm"
            className={cn('ms-auto shrink-0 font-semibold', campaign.className)}
          >
            {campaign.status}
          </IconLabel>
        </CardItem>
      ))}
      <CardFooter className="justify-end text-xs text-muted">
        4 de 12
      </CardFooter>
    </Card>
  )
}

export function IconLabelMultilineShot() {
  return (
    <Surface className="flex w-full max-w-xl flex-col gap-2 p-4 text-ink">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">+52 55 1234 5678</span>
        <span className="font-mono text-xs text-muted">14:32</span>
      </div>
      <div
        className="flex flex-col gap-1 rounded-control border px-2.5 py-2"
        style={errorBlockStyle}
      >
        <IconLabel
          icon={CircleAlert}
          size="sm"
          multiline
          iconClassName="text-error"
          className="text-ink-secondary"
        >
          <span>
            <span className="block font-mono text-[10px] font-bold tracking-wider text-error">
              ERROR 63016
            </span>
            El número no tiene WhatsApp activo o bloqueó los mensajes de la
            organización. Revisa el contacto antes de reintentar el envío.
          </span>
        </IconLabel>
      </div>
    </Surface>
  )
}

export function IconLabelAttachmentShot() {
  return (
    <div className="flex w-full max-w-xl justify-start">
      <div className="flex max-w-xs min-w-0 flex-col gap-1 rounded-surface border border-line bg-card px-3 py-2.5 text-sm text-ink">
        <IconLabel
          icon={
            <span className="rounded bg-signal px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-on-signal">
              PDF
            </span>
          }
          size="sm"
          truncate
          trailing={
            <span className="font-mono text-[10px] text-muted">1,2 MB</span>
          }
          className="flex w-full rounded-control border border-line bg-selection px-2.5 py-2"
        >
          campaña-reactivacion-clientes-inactivos-octubre.pdf
        </IconLabel>
        <p>Te comparto el reporte de la campaña.</p>
        <span className="self-end font-mono text-[10px] text-muted">14:35</span>
      </div>
    </div>
  )
}

export function IconLabelBasicsShot() {
  return (
    <Surface className="flex w-full max-w-xl flex-col gap-4 p-4 text-ink">
      <div className="flex flex-wrap items-center gap-6">
        <IconLabel icon={LayoutGrid} size="sm">
          sm · 12 px
        </IconLabel>
        <IconLabel icon={LayoutGrid}>md · 16 px</IconLabel>
        <IconLabel icon={LayoutGrid} size="lg">
          lg · 18 px
        </IconLabel>
        <IconLabel icon={LayoutGrid} tone="muted">
          tone muted
        </IconLabel>
        <IconLabel icon={Plug} aria-label="Integraciones" />
      </div>
      <a
        href="#basics"
        data-il-group=""
        className="focus-ring flex items-center justify-between rounded-control border border-line px-3 py-2 text-sm text-ink-secondary transition-colors hover:text-ink"
      >
        <IconLabel
          icon={Megaphone}
          tone="muted"
          iconClassName="transition-colors"
        >
          Hover del padre (pasa el ratón)
        </IconLabel>
        <ChevronDown aria-hidden className="size-4 -rotate-90 text-muted" />
      </a>
    </Surface>
  )
}

const paramSizes = ['sm', 'md', 'lg'] as const
const paramLayouts = ['inline', 'stacked'] as const
const longName = 'campaña-reactivacion-clientes-inactivos-octubre.pdf'
const longText =
  'El número no tiene WhatsApp activo o bloqueó los mensajes de la organización.'

function ParamCard({ children }: { children: ReactNode }) {
  return (
    <Surface className="grid w-full max-w-xl gap-4 p-4 text-ink">
      {children}
    </Surface>
  )
}

function ParamRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 gap-x-6">
      <code className="w-36 shrink-0 font-mono text-xs text-muted">
        {label}
      </code>
      {children}
    </div>
  )
}

export function IconLabelSizeLayoutShot() {
  return (
    <ParamCard>
      {paramLayouts.map((layout) => (
        <ParamRow key={layout} label={`layout="${layout}"`}>
          {paramSizes.map((size) => (
            <IconLabel key={size} icon={Inbox} size={size} layout={layout}>
              {size}
            </IconLabel>
          ))}
        </ParamRow>
      ))}
    </ParamCard>
  )
}

export function IconLabelToneShot() {
  return (
    <ParamCard>
      <ParamRow label='tone="default"'>
        <IconLabel icon={Megaphone}>Campañas</IconLabel>
      </ParamRow>
      <ParamRow label='tone="muted"'>
        <IconLabel icon={Megaphone} tone="muted">
          Campañas
        </IconLabel>
      </ParamRow>
      <ParamRow label="iconClassName">
        <IconLabel icon={Megaphone} iconClassName="text-signal-contrast">
          signal
        </IconLabel>
        <IconLabel icon={CircleAlert} iconClassName="text-error">
          error
        </IconLabel>
        <IconLabel icon={Megaphone} iconClassName="opacity-80">
          opacity-80
        </IconLabel>
      </ParamRow>
    </ParamCard>
  )
}

export function IconLabelIconShot() {
  return (
    <ParamCard>
      <ParamRow label='iconPosition="start"'>
        <IconLabel icon={<StatusDot tone="current" size="sm" />}>
          Entregada
        </IconLabel>
      </ParamRow>
      <ParamRow label='iconPosition="end"'>
        <IconLabel
          icon={<StatusDot tone="current" size="sm" />}
          iconPosition="end"
        >
          Entregada
        </IconLabel>
      </ParamRow>
      <ParamRow label="icon={Lucide}">
        <IconLabel icon={Plug}>Integraciones</IconLabel>
      </ParamRow>
      <ParamRow label="icon={<nodo />}">
        <IconLabel icon={<StatusDot tone="success" />}>Disponible</IconLabel>
        <IconLabel icon={<WhatsAppIcon className="size-4 text-success" />}>
          WhatsApp
        </IconLabel>
      </ParamRow>
      <ParamRow label="solo icono">
        <IconLabel icon={Plug} aria-label="Integraciones" />
      </ParamRow>
    </ParamCard>
  )
}

export function IconLabelTextShot() {
  return (
    <ParamCard>
      <ParamRow label="multiline={false}">
        <div style={{ width: 224 }}>
          <IconLabel icon={CircleAlert} size="sm" iconClassName="text-error">
            {longText}
          </IconLabel>
        </div>
      </ParamRow>
      <ParamRow label="multiline">
        <div style={{ width: 224 }}>
          <IconLabel
            icon={CircleAlert}
            size="sm"
            multiline
            iconClassName="text-error"
          >
            {longText}
          </IconLabel>
        </div>
      </ParamRow>
      <ParamRow label="truncate={false}">
        <div style={{ width: 224 }}>
          <IconLabel icon={FileText} size="sm" tone="muted">
            {longName}
          </IconLabel>
        </div>
      </ParamRow>
      <ParamRow label="truncate">
        <div style={{ width: 224 }}>
          <IconLabel icon={FileText} size="sm" tone="muted" truncate>
            {longName}
          </IconLabel>
        </div>
      </ParamRow>
    </ParamCard>
  )
}

export function IconLabelSlotsShot() {
  return (
    <ParamCard>
      <ParamRow label="trailing (Badge)">
        <IconLabel
          icon={Inbox}
          trailing={<Badge variant="signal">3</Badge>}
          className="w-48"
        >
          Inbox
        </IconLabel>
      </ParamRow>
      <ParamRow label="trailing (chevron)">
        <IconLabel
          icon={<StatusDot tone="success" />}
          trailing={<ChevronDown aria-hidden className="size-3 text-muted" />}
          className="w-48 text-xs"
        >
          Disponible
        </IconLabel>
      </ParamRow>
      <ParamRow label="asChild <a>">
        <IconLabel
          icon={Home}
          asChild
          className="focus-ring-inline text-signal-contrast"
        >
          <a href="#slots">Ir al inicio</a>
        </IconLabel>
      </ParamRow>
      <ParamRow label="asChild <button>">
        <IconLabel
          icon={Plug}
          asChild
          className="focus-ring rounded-control border border-line px-3 py-1.5"
        >
          <button type="button">Conectar</button>
        </IconLabel>
      </ParamRow>
    </ParamCard>
  )
}

const paramShots = [
  {
    id: 'param-size',
    title: 'size × layout',
    note: 'sm 12 px · md 16 px · lg 18 px; stacked pone el icono encima.',
    Shot: IconLabelSizeLayoutShot,
  },
  {
    id: 'param-tone',
    title: 'tone e iconClassName',
    note: 'muted atenúa el icono; el color activo lo pone el consumidor.',
    Shot: IconLabelToneShot,
  },
  {
    id: 'param-icon',
    title: 'icon e iconPosition',
    note: 'LucideIcon o cualquier nodo (punto, icono de marca); a la izquierda o a la derecha.',
    Shot: IconLabelIconShot,
  },
  {
    id: 'param-text',
    title: 'multiline y truncate',
    note: 'En una caja de 224 px.',
    Shot: IconLabelTextShot,
  },
  {
    id: 'param-slots',
    title: 'trailing y asChild',
    note: 'trailing se empuja al final si la raíz tiene ancho; asChild renderiza el <a> o <button> como raíz.',
    Shot: IconLabelSlotsShot,
  },
] as const

const shots = [
  {
    id: 'rail',
    title: 'app-shell-rail · .ritem + .presence',
    note: 'size="lg", asChild sobre <a>, trailing con Badge; presencia con StatusDot y chevron.',
    Shot: IconLabelRailShot,
  },
  {
    id: 'tabbar',
    title: 'app-shell-tabbar · .tabbar',
    note: 'layout="stacked"; el icono es un nodo con punto de no leído.',
    Shot: IconLabelTabbarShot,
  },
  {
    id: 'cnav-strip',
    title: 'cnav-strip · .cnit',
    note: 'layout="stacked" alineado al inicio, tone="muted" en los inactivos.',
    Shot: IconLabelCnavStripShot,
  },
  {
    id: 'cnav-rail',
    title: 'cnav-rail',
    note: 'Fila inline, trailing con Badge «Beta».',
    Shot: IconLabelCnavRailShot,
  },
  {
    id: 'meta',
    title: 'surface-plate · .ist / .hst',
    note: 'size="sm", iconPosition="end" con StatusDot tone="current".',
    Shot: IconLabelMetaShot,
  },
  {
    id: 'multiline',
    title: 'Bloque de error · .eblk',
    note: 'multiline: el icono queda en la primera línea.',
    Shot: IconLabelMultilineShot,
  },
  {
    id: 'attachment',
    title: 'Adjunto en burbuja · .bub .bdoc',
    note: 'truncate, icono como nodo (etiqueta PDF) y trailing con el tamaño.',
    Shot: IconLabelAttachmentShot,
  },
  {
    id: 'basics',
    title: 'Hover del padre',
    note: 'El padre pinta el icono al hacer hover con [data-slot="icon-label-icon"] o group-hover.',
    Shot: IconLabelBasicsShot,
  },
] as const

export function IconLabelShots() {
  return (
    <div className="flex w-full flex-col gap-8">
      <style>{pageCss}</style>
      <h2 className="text-base font-semibold">Parámetros</h2>
      {paramShots.map(({ id, title, note, Shot: ShotComponent }) => (
        <Shot key={id} id={id} title={title} note={note}>
          <ShotComponent />
        </Shot>
      ))}
      <h2 className="mt-4 text-base font-semibold">En contexto</h2>
      {shots.map(({ id, title, note, Shot: ShotComponent }) => (
        <Shot key={id} id={id} title={title} note={note}>
          <ShotComponent />
        </Shot>
      ))}
    </div>
  )
}

export default function IconLabelMockPage() {
  return (
    <div className="min-h-screen w-full bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="mb-1 text-lg font-semibold">IconLabel</h1>
        <p className="mb-8 text-sm text-ink-secondary">
          Cada parámetro por separado y los casos del mock
          (switchboard-soft.css) en contexto.
        </p>
        <IconLabelShots />
      </main>
    </div>
  )
}
