import { useState } from 'react'
import {
  Building2,
  ChevronRight,
  KeyRound,
  List,
  Plug,
  User,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/feedback/badge'
import { Button } from '@/components/ui/actions/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardHeading,
  CardItem,
  CardMeta,
  CardTitle,
} from '@/components/ui/layout/card'
import { Field } from '@/components/ui/inputs/field'
import { IconLabel } from '@/components/ui/data-display/icon-label'
import { Input } from '@/components/ui/inputs/input'
import { RadioCard, RadioGroup } from '@/components/ui/selection/radio-group'
import { Separator } from '@/components/ui/layout/separator'
import { StatusDot } from '@/components/ui/feedback/status-dot'
import { StatusLabel } from '@/components/ui/feedback/status-label'
import { cn } from '@/lib/utils'

const navItems: ReadonlyArray<{
  icon: LucideIcon
  label: string
  active?: boolean
  beta?: boolean
}> = [
  { icon: User, label: 'Perfil' },
  { icon: Building2, label: 'Organización', active: true },
  { icon: Plug, label: 'Integraciones' },
  { icon: List, label: 'Campos de contacto' },
  { icon: KeyRound, label: 'API keys', beta: true },
]

export function CardOrganizationExample() {
  return (
    <div className="grid items-start gap-4 tablet:grid-cols-[220px_minmax(0,1fr)]">
      <Card>
        <nav aria-label="Configuración" className="flex flex-col gap-0.5 p-2">
          {navItems.map(({ icon, label, active, beta }) => (
            <button
              key={label}
              type="button"
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-control px-3 text-left text-sm outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-signal-contrast',
                active
                  ? 'bg-selection font-semibold text-ink'
                  : 'text-ink-secondary hover:bg-inset'
              )}
            >
              <IconLabel icon={icon} size="lg">
                {active && <StatusDot tone="signal" size="sm" />}
                {label}
              </IconLabel>
              {beta && (
                <Badge variant="warning" className="ml-auto">
                  Beta
                </Badge>
              )}
            </button>
          ))}
        </nav>
        <Separator variant="inset" />
        <div className="px-4 py-3 text-[10px] leading-relaxed text-muted">
          Secciones según rol
          <br />
          RBAC · 5/5 visibles
        </div>
      </Card>

      <Card divided>
        <CardHeader>
          <CardHeading>
            <CardTitle>Organización</CardTitle>
            <CardMeta mono>ORG-IZEI-CG</CardMeta>
          </CardHeading>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 tablet:grid-cols-2">
            <Field
              step={1}
              label="Nombre de la organización"
              className="max-w-none"
            >
              <Input defaultValue="Izei Consulting Group" />
            </Field>
            <Field
              step={2}
              label="Slug"
              description="El slug es único · cambios solo vía soporte"
              disabled
              className="max-w-none"
            >
              <Input defaultValue="izei-consulting-group" />
            </Field>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 rounded-control border border-dashed border-line-strong bg-inset px-4 py-3">
              <span className="flex-none text-xs text-muted">
                ID de organización
              </span>
              <code className="min-w-0 flex-1 truncate font-mono text-xs tracking-[0.03em] text-ink">
                org_8f3a1c2e-94b7-4d21-a6f0-2c7e5b91d4aa
              </code>
              <Button variant="secondary">Copiar</Button>
            </div>
            <p className="mt-2 text-xs text-muted">
              Úsalo al reportar errores o pedir soporte · no es secreto
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-end text-xs text-muted">
          <span>Plan plataforma · 5 asientos</span>
          <Button variant="primary">Guardar</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

const members = [
  {
    initials: 'AM',
    name: 'Adrián Meza · tú',
    email: 'adrian@izei.mx',
    role: 'Owner',
    roleVariant: 'signal',
    status: 'Activo',
    date: '12 ene 2024',
  },
  {
    initials: 'SG',
    name: 'Sofía Garza',
    email: 'sofia@izei.mx',
    role: 'Admin',
    roleVariant: 'outline',
    status: 'Activo',
    date: '03 mar 2024',
  },
  {
    initials: 'LO',
    name: 'Luis Ochoa',
    email: 'luis@izei.mx',
    role: 'Marketing',
    roleVariant: 'outline',
    status: 'Activo',
    date: '21 may 2024',
  },
  {
    initials: 'CR',
    name: 'Carmen Ruiz',
    email: 'carmen@izei.mx',
    role: 'Agente',
    roleVariant: 'success',
    status: 'Activo',
    date: '02 sep 2024',
  },
  {
    initials: 'PL',
    name: 'Pedro Luna',
    email: 'pedro@izei.mx',
    role: 'Lectura',
    roleVariant: 'outline',
    status: 'Invitado',
    date: 'Inv. 14 mar 2025',
  },
] as const

export function CardMembersExample() {
  return (
    <Card divided>
      <CardHeader>
        <CardHeading>
          <CardTitle>Miembros</CardTitle>
          <CardMeta>{members.length} miembros</CardMeta>
        </CardHeading>
        <Button variant="secondary">+ Invitar</Button>
      </CardHeader>
      {members.map(
        ({ initials, name, email, role, roleVariant, status, date }) => (
          <CardItem key={email} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-10 flex-none place-items-center rounded-control bg-selection text-xs font-bold text-signal-contrast"
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{name}</div>
              <div className="truncate text-xs text-muted">{email}</div>
            </div>
            <Badge variant={roleVariant} className="shrink-0">
              {role}
            </Badge>
            <StatusLabel
              tone={status === 'Activo' ? 'success' : 'live'}
              dotPosition="left"
              className="shrink-0"
            >
              {status}
            </StatusLabel>
            <span className="hidden flex-none font-mono text-[10.5px] text-muted tablet:block">
              {date}
            </span>
            <ChevronRight
              aria-hidden="true"
              className="size-4 flex-none text-muted"
            />
          </CardItem>
        )
      )}
      <CardFooter className="justify-end text-xs text-muted">
        5 de 5 asientos en uso
      </CardFooter>
    </Card>
  )
}

const audiences = [
  {
    id: 'clientes-q1',
    icon: List,
    name: 'Clientes activos Q1',
    meta: 'Actualizada hace 2 días',
    count: '4,820',
  },
  {
    id: 'vip',
    icon: Zap,
    name: 'VIP · Alto valor',
    meta: 'Segmento dinámico · compras > $2,000',
    count: '312',
  },
  {
    id: 'inactivos',
    icon: Zap,
    name: 'Inactivos +30 días',
    meta: 'Segmento dinámico · últ. compra > 30d',
    count: '1,204',
  },
] as const

const audienceFilters = ['Todas', 'Listas', 'Segmentos'] as const

export function CardCampaignExample() {
  const [selectedId, setSelectedId] = useState<string>(audiences[0].id)
  const [filter, setFilter] = useState<string>(audienceFilters[0])
  const selected = audiences.find(({ id }) => id === selectedId) ?? audiences[0]

  return (
    <div className="grid items-start gap-4 desktop:grid-cols-[minmax(0,1fr)_340px]">
      <Card divided>
        <CardHeader>
          <CardHeading>
            <CardTitle>Audiencia · destino</CardTitle>
            <CardMeta>1 selección</CardMeta>
          </CardHeading>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field label="Nombre de la campaña" className="max-w-none">
            <Input defaultValue="Promo primavera — reactivación" />
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              aria-label="Buscar audiencia"
              placeholder="Buscar por nombre…"
              className="min-w-[200px] flex-1"
            />
            <div className="flex gap-2">
              {audienceFilters.map((label) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={filter === label}
                  onClick={() => setFilter(label)}
                  className={cn(
                    'min-h-8 cursor-pointer rounded-pill border px-3.5 text-xs font-semibold outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-signal-contrast',
                    filter === label
                      ? 'border-ink bg-ink text-paper'
                      : 'border-control bg-card text-ink-secondary hover:border-line-strong'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <RadioGroup
            aria-label="Audiencia destino"
            value={selectedId}
            onValueChange={setSelectedId}
          >
            {audiences.map(({ id, name, meta, count }) => (
              <RadioCard
                key={id}
                value={id}
                title={name}
                description={meta}
                badge={
                  <span className="font-mono text-xs font-bold">{count}</span>
                }
              />
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card divided className="shadow-1">
          <CardHeader>
            <CardHeading>
              <CardTitle>Papeleta</CardTitle>
              <CardMeta mono>CMP-0441</CardMeta>
            </CardHeading>
            <span>
              <StatusDot tone="success" />
            </span>
          </CardHeader>
          {[
            ['Nombre', 'Promo primavera — reactivación', false],
            ['Audiencia', `${selected.name} · ${selected.count}`, true],
            ['Canal', 'SMS', true],
            ['Remitente', '+52 55 1234 5678', false],
            ['Mensaje', 'Plantilla · promo_reactivacion_v2', false],
            ['Programación', 'Inmediato', false],
          ].map(([label, value, accent]) => (
            <CardItem
              key={String(label)}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <span className="flex-none text-muted">{label}</span>
              <span
                className={cn(
                  'min-w-0 truncate text-right font-mono',
                  accent && 'font-bold text-signal-contrast'
                )}
              >
                {value}
              </span>
            </CardItem>
          ))}
        </Card>

        <Card divided className="shadow-1">
          <CardHeader>
            <CardHeading>
              <CardTitle className="font-normal text-muted">
                Vista previa
              </CardTitle>
              <CardMeta mono>SMS · +52 55 1234 5678</CardMeta>
            </CardHeading>
          </CardHeader>
          <CardContent>
            <div className="rounded-surface bg-selection p-3 text-sm leading-normal">
              Hola{' '}
              <span className="font-semibold text-signal-contrast">María</span>,
              tu pedido{' '}
              <span className="font-semibold text-signal-contrast">
                #A-2291
              </span>{' '}
              ya está listo. Recógelo hoy y obtén 15% en tu próxima compra. —
              Izei CG
              <div className="mt-2 text-right font-mono text-[10px] text-muted">
                10:42 · entregado ✓
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
