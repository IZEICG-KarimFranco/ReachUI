import { useState, type ComponentProps, type ReactNode } from 'react'
import {
  Building2,
  ChevronRight,
  CircleCheck,
  House,
  Inbox,
  KeyRound,
  List,
  Megaphone,
  Plug,
  TriangleAlert,
  User,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

import { Alert } from '@/components/ui/feedback/alert'
import { Badge } from '@/components/ui/feedback/badge'
import { Button } from '@/components/ui/actions/button'
import { Card as CardPlate } from '@/components/ui/layout/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/overlays/dialog'
import { IconLabel } from '@/components/ui/data-display/icon-label'
import { Field } from '@/components/ui/inputs/field'
import { Input } from '@/components/ui/inputs/input'
import { Label } from '@/components/ui/inputs/label'
import { PhoneInput } from '@/components/ui/inputs/phone-input'
import type { Value as PhoneValue } from 'react-phone-number-input'
import { ChipGroup } from '@/components/ui/selection/chip-group'
import { QuickFilters } from '@/components/ui/navigation/quick-filters'
import { Select } from '@/components/ui/selection/select'
import { StatusDot } from '@/components/ui/feedback/status-dot'
import { StatusLabel } from '@/components/ui/feedback/status-label'
import { AvatarShots } from '@/pages/dev/mock/avatar'
import { CardKeyValueRows } from '@/pages/dev/mock/card'
import { CommandSearchShot } from '@/pages/dev/mock/command'
import { ConfirmDialogShots } from '@/pages/dev/mock/confirm-dialog'
import { EmptyStateShot } from '@/pages/dev/mock/empty'
import { FieldMockCases, LabelShots } from '@/pages/dev/mock/field'
import { MockNav } from '@/pages/dev/mock/mock-nav'
import { PageHeaderShots } from '@/pages/dev/mock/page-header'
import { SeparatorVariantsShot } from '@/pages/dev/mock/separator'
import {
  SheetDetailShot,
  SheetFormErrorShot,
  SheetImportShot,
  SheetImportWizardShot,
} from '@/pages/dev/mock/sheet'
import { IconLabelShots } from '@/pages/dev/mock/icon-label'
import { SkeletonLoadingShot } from '@/pages/dev/mock/skeleton'
import { SpinnerShot } from '@/pages/dev/mock/spinner'
import { toastCases } from '@/pages/dev/mock/toast-cases'

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>
type LabelTone = NonNullable<ComponentProps<typeof StatusLabel>['tone']>
type DotTone = NonNullable<ComponentProps<typeof StatusDot>['tone']>

const comparison: {
  tone: string
  text: string
  badge: BadgeVariant
  legacy: boolean
  label: LabelTone | null
  dot: DotTone | null
}[] = [
  {
    tone: 'success',
    text: 'Aprobada',
    badge: 'success',
    legacy: false,
    label: 'success',
    dot: 'success',
  },
  {
    tone: 'live',
    text: 'En revisión',
    badge: 'warning',
    legacy: false,
    label: 'live',
    dot: 'live',
  },
  {
    tone: 'error',
    text: 'Rechazada',
    badge: 'error',
    legacy: false,
    label: 'error',
    dot: 'error',
  },
  {
    tone: 'info',
    text: 'Enviada',
    badge: 'info',
    legacy: false,
    label: 'info',
    dot: 'info',
  },
  {
    tone: 'signal',
    text: 'Segmento',
    badge: 'signal',
    legacy: false,
    label: 'signal',
    dot: 'signal',
  },
  {
    tone: 'neutral',
    text: 'Borrador',
    badge: 'outline',
    legacy: false,
    label: 'neutral',
    dot: 'neutral',
  },
  {
    tone: 'default',
    text: 'SMS',
    badge: 'default',
    legacy: false,
    label: null,
    dot: null,
  },
]

const functionalBadges: BadgeVariant[] = [
  'outline',
  'default',
  'info',
  'signal',
  'success',
  'warning',
  'error',
]
const legacyBadges: BadgeVariant[] = ['secondary', 'destructive']
const dotTones: DotTone[] = [
  'success',
  'live',
  'error',
  'info',
  'signal',
  'neutral',
]
const alertLegacyVariants = [
  'default',
  'destructive',
  'warning',
  'info',
  'success',
  'primary',
] as const

const members: {
  name: string
  email: string
  role: BadgeVariant
  roleText: string
  tone: LabelTone
  status: string
  date: string
}[] = [
  {
    name: 'Carmen Ruiz',
    email: 'carmen@reach.mx',
    role: 'signal',
    roleText: 'Propietario',
    tone: 'success',
    status: 'Activo',
    date: '14 ene 2024',
  },
  {
    name: 'Luis Soto',
    email: 'luis@reach.mx',
    role: 'success',
    roleText: 'Agente',
    tone: 'success',
    status: 'Activo',
    date: '02 sep 2024',
  },
  {
    name: 'Ana Pérez',
    email: 'ana@reach.mx',
    role: 'outline',
    roleText: 'Visor',
    tone: 'neutral',
    status: 'Pausado',
    date: '21 mar 2025',
  },
]

const navItems = [
  { label: 'Perfil', Icon: User, active: true },
  { label: 'Organización', Icon: Building2 },
  { label: 'Integraciones', Icon: Plug },
  { label: 'Campos de contacto', Icon: List },
  { label: 'API keys', Icon: KeyRound, beta: true },
]

const railItems = [
  { label: 'Inicio', Icon: House },
  { label: 'Campañas', Icon: Megaphone },
  { label: 'Inbox', Icon: Inbox, active: true, count: '3' },
  { label: 'Contactos', Icon: Users },
]

const iconLabelSizes = ['sm', 'md', 'lg'] as const

const iconColors = [
  { label: 'Hereda el color', iconClassName: undefined },
  { label: 'text-success', iconClassName: 'text-success' },
  { label: 'text-live', iconClassName: 'text-live' },
  { label: 'text-error', iconClassName: 'text-error' },
  { label: 'text-info', iconClassName: 'text-info' },
  { label: 'text-signal-contrast', iconClassName: 'text-signal-contrast' },
] as const

const pinned = { duration: Infinity }

const REVIEW_SCOPES = [
  { value: 'read', label: 'read' },
  { value: 'update', label: 'update' },
  { value: 'delete', label: 'delete' },
]

function FieldInheritanceShot() {
  const [scopes, setScopes] = useState<string[]>(['read'])
  const [filter, setFilter] = useState('missing')
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        id="pr384-phone-disabled"
        label="Teléfono (Field disabled)"
        disabled
      >
        <PhoneInput />
      </Field>
      <Field
        id="pr384-phone-readonly"
        label="Teléfono (Field readOnly)"
        readOnly
      >
        <PhoneInput value={'+525512345678' as PhoneValue} />
      </Field>
      <Field
        id="pr384-scopes"
        label="Scopes"
        step={2}
        error="Elige al menos uno"
      >
        <ChipGroup
          options={REVIEW_SCOPES}
          value={scopes}
          onValueChange={setScopes}
        />
      </Field>
      <Field
        id="pr384-scopes-disabled"
        label="Scopes (Field disabled)"
        step={3}
        disabled
      >
        <ChipGroup
          options={REVIEW_SCOPES}
          value={scopes}
          onValueChange={setScopes}
        />
      </Field>
      <div id="pr384-quick-filters">
        <QuickFilters
          ariaLabel="Filtro sin selección"
          options={[
            { value: 'all', label: 'Todas' },
            { value: 'sent', label: 'Enviadas' },
          ]}
          value={filter}
          onValueChange={setFilter}
        />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 className="mb-3 font-mono text-label uppercase text-muted">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-surface border border-line bg-card p-5 text-ink">
      {children}
    </div>
  )
}

function Cell({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center border-t border-line py-3">
      {children}
    </div>
  )
}

function Head({ children }: { children: ReactNode }) {
  return (
    <div className="pb-2 font-mono text-label uppercase text-muted">
      {children}
    </div>
  )
}

const sameLine: {
  name: string
  badge: BadgeVariant
  badgeText: string
  tone: LabelTone
  text: string
}[] = [
  {
    name: 'Black Friday',
    badge: 'outline',
    badgeText: 'SMS',
    tone: 'success',
    text: 'Aprobada',
  },
  {
    name: 'Recordatorio de pago',
    badge: 'info',
    badgeText: 'LISTA',
    tone: 'live',
    text: 'En revisión',
  },
  {
    name: 'Bienvenida a clientes',
    badge: 'signal',
    badgeText: 'SEGMENTO',
    tone: 'error',
    text: 'Rechazada',
  },
  {
    name: 'Encuesta NPS',
    badge: 'outline',
    badgeText: 'WHATSAPP',
    tone: 'info',
    text: 'Enviada',
  },
  {
    name: 'Promo de verano',
    badge: 'outline',
    badgeText: 'RCS',
    tone: 'neutral',
    text: 'Borrador',
  },
]

function SameLineRows({ size }: { size: 'default' | 'inline' }) {
  return (
    <ul className="divide-y divide-line">
      {sameLine.map((row) => (
        <li key={row.name} className="flex items-center gap-3 py-3 text-sm">
          <span className="min-w-0 flex-1 truncate">{row.name}</span>
          <span className="flex w-24 shrink-0 justify-end">
            <Badge variant={row.badge}>{row.badgeText}</Badge>
          </span>
          <span className="w-32 shrink-0">
            <StatusLabel tone={row.tone} size={size}>
              {row.text}
            </StatusLabel>
          </span>
        </li>
      ))}
    </ul>
  )
}

const scopeGroups = [
  {
    title: 'Campañas',
    items: [
      'campaigns.read',
      'campaigns.create',
      'campaigns.update',
      'campaigns.execute',
      'campaigns.delete',
      'campaigns.reports.view',
    ],
  },
  {
    title: 'Conversaciones',
    items: [
      'conversations.read',
      'conversations.create',
      'conversations.update',
      'conversations.delete',
      'conversations.reports.view',
    ],
  },
  {
    title: 'Contactos',
    items: [
      'contacts.read',
      'contacts.create',
      'contacts.update',
      'contacts.delete',
    ],
  },
  {
    title: 'Organización',
    items: ['org.read', 'org.update', 'org.members.manage'],
  },
  { title: 'Twilio', items: ['twilio.read', 'twilio.manage'] },
  { title: 'Reportes', items: ['reporting.all'] },
]

const expirationOptions = [
  { value: '30', label: '30 días' },
  { value: '90', label: '90 días', description: 'Rotación trimestral' },
  { value: 'never', label: 'Sin expiración' },
]

function ScopesShot() {
  const [scopes, setScopes] = useState<string[]>([
    'campaigns.update',
    'campaigns.execute',
    'conversations.update',
  ])

  return (
    <div
      className="flex max-w-md flex-col gap-5"
      data-shot="quick-filters-multiple"
    >
      <Field
        label="Nombre"
        step={1}
        description="Identifica la integración que la usa"
      >
        <Input placeholder="Ej. ERP — sync nocturno" />
      </Field>
      <div
        role="group"
        aria-labelledby="scopes-title"
        className="flex flex-col gap-3"
      >
        <Label variant="form" id="scopes-title" step={2}>
          Scopes
        </Label>
        {scopeGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1.5">
            <p className="text-xs font-bold text-muted">{group.title}</p>
            <ChipGroup
              ariaLabel={group.title}
              options={group.items.map((item) => ({
                value: item,
                label: item.split('.').slice(1).join('·'),
              }))}
              value={scopes}
              onValueChange={setScopes}
            />
          </div>
        ))}
        <p className="text-xs text-muted">
          Seleccionados:{' '}
          <code className="font-mono">{scopes.join(', ') || '—'}</code>
        </p>
      </div>
      <Field label="Expiración" step={3}>
        <Select options={expirationOptions} defaultValue="90" />
      </Field>
    </div>
  )
}

export default function MockAllPage() {
  return (
    <div className="min-h-screen w-full bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full p-6" style={{ maxWidth: 1024 }}>
        <h1 className="mb-8 text-lg font-semibold">
          Badge · StatusLabel · StatusDot · Alert · Dialog · Skeleton
        </h1>

        <Section title="ChipGroup · scopes de «Crear llave» (config-switchboard)">
          <Card>
            <ScopesShot />
          </Card>
        </Section>

        <Section title="Field · casos del mock (label, step, description, error)">
          <Card>
            <FieldMockCases />
          </Card>
        </Section>

        <Section title="PhoneInput · normal, error, deshabilitado y con valor">
          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Teléfono">
                <PhoneInput placeholder="+52 55 1234 5678" />
              </Field>
              <Field label="Teléfono" error="Número inválido">
                <PhoneInput />
              </Field>
              <Field label="Teléfono" disabled>
                <PhoneInput disabled />
              </Field>
              <Field label="Teléfono">
                <PhoneInput value={'+525512345678' as PhoneValue} />
              </Field>
            </div>
          </Card>
        </Section>

        <Section title="Review PR #384 · herencia de Field y QuickFilters sin selección">
          <Card>
            <FieldInheritanceShot />
          </Card>
        </Section>

        <Section title="Command · select-search-open">
          <Card>
            <CommandSearchShot />
          </Card>
        </Section>

        <Section title="Label · .flab / .nnum (legacy, form, step, Field)">
          <Card>
            <LabelShots />
          </Card>
        </Section>

        <Section title="Badge + StatusLabel · en el mismo renglón">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <p className="mb-1 font-mono text-label uppercase text-muted">
                StatusLabel · default
              </p>
              <SameLineRows size="default" />
            </Card>
            <Card>
              <p className="mb-1 font-mono text-label uppercase text-muted">
                StatusLabel · inline
              </p>
              <SameLineRows size="inline" />
            </Card>
          </div>
        </Section>

        <Section title="Badge vs StatusLabel · misma fila, mismo texto">
          <Card>
            <div className="overflow-x-auto">
              <div
                className="grid gap-x-4"
                style={{
                  minWidth: 860,
                  gridTemplateColumns: '200px repeat(4, minmax(0, 1fr))',
                }}
              >
                <Head>Tono</Head>
                <Head>Badge</Head>
                <Head>StatusLabel · default</Head>
                <Head>StatusLabel · inline</Head>
                <Head>StatusDot + texto</Head>
                {comparison.map((row) => (
                  <div key={row.tone} className="contents">
                    <Cell>
                      <span className="whitespace-nowrap font-mono text-xs text-ink-secondary">
                        {row.tone}
                      </span>
                      {row.legacy && (
                        <span className="ml-2 whitespace-nowrap font-mono text-label uppercase text-muted">
                          badge legacy
                        </span>
                      )}
                    </Cell>
                    <Cell>
                      <Badge variant={row.badge}>
                        {row.text.toUpperCase()}
                      </Badge>
                    </Cell>
                    <Cell>
                      {row.label ? (
                        <StatusLabel tone={row.label}>{row.text}</StatusLabel>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </Cell>
                    <Cell>
                      {row.label ? (
                        <StatusLabel tone={row.label} size="inline">
                          {row.text}
                        </StatusLabel>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </Cell>
                    <Cell>
                      {row.dot ? (
                        <StatusDot tone={row.dot}>
                          <span className="text-xs font-semibold">
                            {row.text}
                          </span>
                        </StatusDot>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </Cell>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Section>

        <Section title="En contexto · nav de configuración">
          <div className="w-64 rounded-surface border border-line bg-card p-3 text-ink">
            <ul className="flex flex-col gap-1">
              {navItems.map(({ label, Icon, active, beta }) => (
                <li
                  key={label}
                  className={`flex items-center rounded-control px-3 py-2.5 ${
                    active ? 'bg-selection font-bold' : 'text-ink-secondary'
                  }`}
                >
                  <IconLabel icon={Icon}>
                    {active ? (
                      <StatusDot tone="signal" size="sm">
                        {label}
                      </StatusDot>
                    ) : (
                      label
                    )}
                  </IconLabel>
                  {beta && (
                    <Badge variant="warning" className="ml-auto">
                      Beta
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-line px-3 pt-3 text-xs text-muted">
              <p>Secciones según rol</p>
              <p>RBAC · 5/5 visibles</p>
            </div>
          </div>
        </Section>

        <Section title="En contexto · sidebar (IconLabel lg)">
          <div className="w-64 rounded-surface border border-line bg-card p-3 text-ink">
            <ul className="flex flex-col gap-0.5">
              {railItems.map(({ label, Icon, active, count }) => (
                <li
                  key={label}
                  className={`flex items-center rounded-control px-3 py-2.5 font-medium ${
                    active
                      ? 'bg-selection text-signal-contrast'
                      : 'text-ink-secondary'
                  }`}
                >
                  <IconLabel icon={Icon} size="lg">
                    {label}
                  </IconLabel>
                  {count && (
                    <Badge variant="signal" className="ml-auto">
                      {count}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-line px-3 pt-3 text-xs text-ink-secondary">
              <StatusDot tone="success">Disponible</StatusDot>
            </div>
          </div>
        </Section>

        <Section title="En contexto · fila de miembros">
          <Card>
            <ul className="divide-y divide-line">
              {members.map((m) => (
                <li key={m.email} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{m.name}</p>
                    <p className="truncate text-xs text-muted">{m.email}</p>
                  </div>
                  <Badge variant={m.role}>{m.roleText}</Badge>
                  <StatusLabel tone={m.tone} size="inline" dotPosition="left">
                    {m.status}
                  </StatusLabel>
                  <span className="w-24 shrink-0 font-mono text-xs text-muted">
                    {m.date}
                  </span>
                  <ChevronRight
                    className="size-4 text-muted"
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
          </Card>
        </Section>

        <Section title="Badge · variantes">
          <Card>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              {functionalBadges.map((variant) => (
                <Badge key={variant} variant={variant}>
                  {variant.toUpperCase()}
                </Badge>
              ))}
            </div>
            <p className="mb-2 font-mono text-label uppercase text-muted">
              LEGACY · borrar al terminar la migración
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {legacyBadges.map((variant) => (
                <Badge key={variant} variant={variant}>
                  {variant.toUpperCase()}
                </Badge>
              ))}
            </div>
          </Card>
        </Section>

        <Section title="StatusLabel · opciones">
          <Card>
            <div className="flex flex-wrap items-center gap-6">
              <StatusLabel tone="live">En revisión</StatusLabel>
              <StatusLabel tone="live" pulse>
                En revisión · pulse
              </StatusLabel>
              <StatusLabel tone="success" dotPosition="left">
                Activo · dot izquierda
              </StatusLabel>
              <StatusLabel
                tone="success"
                size="inline"
                dotPosition="left"
                pulse
              >
                Activo · inline pulse
              </StatusLabel>
            </div>
          </Card>
        </Section>

        <Section title="StatusDot · tonos y tamaños">
          <Card>
            <div className="mb-4 flex flex-wrap items-center gap-6">
              {dotTones.map((tone) => (
                <StatusDot key={tone} tone={tone}>
                  {tone}
                </StatusDot>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <StatusDot tone="success" size="sm">
                sm
              </StatusDot>
              <StatusDot tone="success" size="md">
                md
              </StatusDot>
              <StatusDot tone="success" aria-label="Conectado" />
            </div>
          </Card>
        </Section>

        <Section title="IconLabel · casos del mock">
          <IconLabelShots />
        </Section>

        <Section title="Avatar · tonos, formas, tamaños y estados">
          <AvatarShots />
        </Section>

        <Section title="PageHeader y SectionHeading · casos">
          <PageHeaderShots />
        </Section>

        <Section title="IconLabel · tamaños, color del icono y composición">
          <Card>
            <div className="mb-4 flex flex-wrap items-center gap-6">
              {iconLabelSizes.map((size) => (
                <IconLabel key={size} icon={Users} size={size}>
                  {size}
                </IconLabel>
              ))}
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-6">
              {iconColors.map(({ label, iconClassName }) => (
                <IconLabel
                  key={label}
                  icon={CircleCheck}
                  iconClassName={iconClassName}
                >
                  {label}
                </IconLabel>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <IconLabel icon={Plug} />
              <IconLabel
                icon={TriangleAlert}
                iconClassName="text-live"
                aria-label="Advertencia"
              />
              <IconLabel icon={Megaphone} size="lg">
                <Badge variant="warning">Beta</Badge>
              </IconLabel>
              <IconLabel icon={User}>
                <StatusLabel tone="success" size="inline" dotPosition="left">
                  Activo
                </StatusLabel>
              </IconLabel>
              <IconLabel icon={Inbox} className="text-ink-secondary">
                Texto con className
              </IconLabel>
            </div>
          </Card>
        </Section>

        <Section title="Toast · tipos y casos reales (toasts fijos hasta cerrarlos)">
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              {toastCases.map(({ label, run }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  onClick={() => run(pinned)}
                >
                  {label}
                </Button>
              ))}
              <Button size="sm" onClick={() => toast.dismiss()}>
                Cerrar todos
              </Button>
            </div>
          </Card>
        </Section>

        <Section title="Alert · tonos">
          <div className="flex flex-col gap-3">
            <Alert
              tone="info"
              title="Twilio conectado."
              action={{ label: 'Detalles', href: '#' }}
              description="La verificación tardó 184 ms."
            />
            <Alert
              tone="success"
              title="Plantilla aprobada."
              description="Ya puedes usarla en tus campañas."
            />
            <Alert
              tone="warning"
              title="2 plantillas en revisión."
              action={{ label: 'Ver plantillas', href: '#' }}
              description="Meta suele responder en menos de 24 h."
            />
            <Alert
              tone="error"
              title="Sync falló"
              description="No pudimos actualizar el estado de la plantilla. Reintenta en unos minutos."
            />
            <Alert
              tone="signal"
              title="Sesión"
              description="Tu sesión usa el correo del SSO. El nombre y teléfono son los datos visibles para tu equipo en el inbox y la supervisión."
            />
            <Alert tone="info" description="Sin título ni acción." />
          </div>
          <p className="mb-2 mt-8 font-mono text-label uppercase text-muted">
            LEGACY · variant (borrar al terminar la migración)
          </p>
          <div className="flex flex-col gap-3">
            {alertLegacyVariants.map((variant) => (
              <Alert key={variant} variant={variant}>
                variant="{variant}"
              </Alert>
            ))}
          </div>
        </Section>

        <Section title="Dialog · primitiva base">
          <Card>
            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="compact">
                    Abrir Dialog (con botón X)
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Guardar filtro</DialogTitle>
                    <DialogDescription>
                      Combina reglas de contactos y compártelo con tu equipo.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary">Cancelar</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="primary">Guardar</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="compact">
                    Abrir Dialog (sin botón X)
                  </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false}>
                  <DialogHeader>
                    <DialogTitle>¿Revocar llave de API?</DialogTitle>
                    <DialogDescription>
                      Las integraciones que usen esta llave dejarán de funcionar
                      de inmediato.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary">Cancelar</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="danger">Revocar llave</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </Section>

        <Section title="ConfirmDialog · confirmar y destructivo">
          <Card>
            <ConfirmDialogShots />
          </Card>
        </Section>

        <Section title="Skeleton · loading-skeleton">
          <SkeletonLoadingShot />
        </Section>

        <Section title="Spinner · tamaños">
          <SpinnerShot />
        </Section>

        <Section title="EmptyState · empty-state">
          <EmptyStateShot />
        </Section>

        <Section title="Card · plate con CardItem">
          <CardPlate divided className="w-full max-w-[440px]">
            <CardKeyValueRows />
          </CardPlate>
        </Section>

        <Section title="Separator · full e inset">
          <SeparatorVariantsShot />
        </Section>

        <Section title="Sheet · sheet-detail, sheet-form-error y sheet-import">
          <div className="flex flex-wrap gap-3">
            <SheetDetailShot />
            <SheetFormErrorShot />
            <SheetImportShot />
            <SheetImportWizardShot />
          </div>
        </Section>
      </main>
    </div>
  )
}
