import {
  ArrowUpRight,
  Braces,
  Image,
  KeyRound,
  MessageCircle,
  MessageSquareText,
  MessagesSquare,
  PanelBottom,
  Reply,
  type LucideIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/feedback/badge'
import { Card, CardContent } from '@/components/ui/layout/card'
import { StatusLabel } from '@/components/ui/feedback/status-label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/data-display/table'
import { MockNav } from '@/pages/dev/mock/mock-nav'
import { cn } from '@/lib/utils'

type Extra = { icon: LucideIcon; label: string }
type Tone = 'success' | 'live' | 'error' | 'neutral'
type Category = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'

const categoryClass: Record<Category, string> = {
  MARKETING: 'text-signal-contrast',
  UTILITY: 'text-info',
  AUTHENTICATION: 'text-success',
}

const channels: { icon: LucideIcon; label: string }[] = [
  { icon: MessageCircle, label: 'WhatsApp' },
  { icon: MessagesSquare, label: 'RCS' },
  { icon: MessageSquareText, label: 'SMS' },
]

const rows: {
  name: string
  snippet: string
  reason?: string
  status: string
  tone: Tone
  category: Category
  extras: Extra[]
  channels: [boolean, boolean, boolean]
  updated: string
}[] = [
  {
    name: 'promo_reactivacion_v2',
    snippet: 'Hola {nombre} 👋 Te extrañamos en Izei.',
    status: 'Aprobada',
    tone: 'success',
    category: 'MARKETING',
    extras: [
      { icon: Reply, label: '2 resp. rápidas' },
      { icon: PanelBottom, label: 'Pie' },
      { icon: Braces, label: '2 vars' },
    ],
    channels: [true, false, false],
    updated: 'hace 2 d',
  },
  {
    name: 'recordatorio_cita',
    snippet: 'Hola {nombre} 👋',
    status: 'Aprobada',
    tone: 'success',
    category: 'UTILITY',
    extras: [
      { icon: Reply, label: '2 resp. rápidas' },
      { icon: Braces, label: '2 vars' },
    ],
    channels: [true, false, false],
    updated: 'hace 5 d',
  },
  {
    name: 'bienvenida_v1',
    snippet: '¡Bienvenida a Izei, {nombre}! 🎉',
    status: 'Aprobada',
    tone: 'success',
    category: 'UTILITY',
    extras: [
      { icon: ArrowUpRight, label: '1 acción' },
      { icon: Braces, label: '1 var' },
    ],
    channels: [true, false, false],
    updated: 'hace 1 sem',
  },
  {
    name: 'factura_mensual',
    snippet: 'Hola {nombre}, tu factura del periodo ya está lista.',
    status: 'En revisión',
    tone: 'live',
    category: 'UTILITY',
    extras: [
      { icon: Image, label: 'Documento' },
      { icon: ArrowUpRight, label: '2 acciones' },
      { icon: Braces, label: '2 vars' },
    ],
    channels: [true, false, false],
    updated: 'hace 3 h',
  },
  {
    name: 'nps_encuesta',
    snippet: 'Hola {nombre} — ¿cómo fue tu experiencia con nosotros?',
    status: 'Borrador',
    tone: 'neutral',
    category: 'MARKETING',
    extras: [
      { icon: Reply, label: '5 resp. rápidas' },
      { icon: Braces, label: '1 var' },
    ],
    channels: [true, false, false],
    updated: 'ayer',
  },
  {
    name: 'otp_verificacion',
    snippet: 'Tu código de verificación es {otp}. Vence en 5 minutos.',
    status: 'Aprobada',
    tone: 'success',
    category: 'AUTHENTICATION',
    extras: [
      { icon: KeyRound, label: 'OTP' },
      { icon: Braces, label: '1 var' },
    ],
    channels: [true, false, false],
    updated: 'hace 2 sem',
  },
  {
    name: 'winback_90d',
    snippet: 'Hola {nombre}, han pasado 90 días…',
    reason:
      'Incorrect_category — el contenido es promocional pero se envió como UTILITY.',
    status: 'Rechazada',
    tone: 'error',
    category: 'MARKETING',
    extras: [
      { icon: ArrowUpRight, label: '1 acción' },
      { icon: Braces, label: '2 vars' },
    ],
    channels: [true, false, false],
    updated: 'hace 4 d',
  },
  {
    name: 'aviso_saldo_vencido',
    snippet: '{nombre}, tu saldo de {saldo} vence el {fecha_cita}.',
    status: 'Sin enviar',
    tone: 'neutral',
    category: 'UTILITY',
    extras: [{ icon: Braces, label: '3 vars' }],
    channels: [true, true, true],
    updated: 'hace 6 h',
  },
]

const headers = [
  'Plantilla',
  'Estado',
  'Categoría',
  'Contenido',
  'Canales',
  'Actualizada',
] as const

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-label uppercase text-muted">{children}</h2>
}

function TemplateRows() {
  return (
    <>
      {rows.map((row) => (
        <TableRow key={row.name} className="cursor-pointer">
          <TableCell className="max-w-64">
            <div className="truncate font-mono text-[13px] font-bold">
              {row.name}
            </div>
            <div className="truncate text-xs text-muted">{row.snippet}</div>
            {row.reason && (
              <div className="truncate text-[11.5px] text-error">
                ✕ {row.reason}
              </div>
            )}
          </TableCell>
          <TableCell>
            <StatusLabel tone={row.tone}>{row.status}</StatusLabel>
          </TableCell>
          <TableCell>
            <span
              className={cn(
                'font-mono text-label uppercase tracking-[0.1em]',
                categoryClass[row.category]
              )}
            >
              {row.category}
            </span>
          </TableCell>
          <TableCell>
            <div className="flex max-w-40 flex-wrap gap-1">
              {row.extras.map(({ icon: Icon, label }) => (
                <Badge key={label} variant="outline">
                  <Icon aria-hidden="true" />
                  {label}
                </Badge>
              ))}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              {row.channels.map((on, index) => {
                const { icon: Icon, label } = channels[index]
                return (
                  <Icon
                    key={label}
                    role="img"
                    aria-label={on ? label : `${label} no soportado`}
                    className={cn(
                      'size-4',
                      on ? 'text-signal-contrast' : 'text-muted opacity-50'
                    )}
                  />
                )
              })}
            </div>
          </TableCell>
          <TableCell className="text-right font-mono text-[10.5px] text-muted">
            {row.updated}
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function TableMockPage() {
  return (
    <div className="min-h-dvh w-full bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-5xl p-6">
        <h1 className="mb-2 text-lg font-semibold">
          Table · fila de plantillas (estado actual)
        </h1>
        <p className="mb-6 text-xs text-muted">
          Table sin cambios (sin refactor): solo se arma la fila de
          templates-switchboard con Table, Badge y StatusLabel tal como están.
        </p>

        <section className="mb-8">
          <SectionTitle>
            como en templates-table.tsx hoy · Card + CardContent + Table con
            cabecera
          </SectionTitle>
          <Card className="overflow-hidden">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHead
                        key={header}
                        className={index === headers.length - 1 ? 'text-right' : ''}
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TemplateRows />
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section>
          <SectionTitle>
            Table directo dentro de Card, sin cabecera (como el shot del mock)
          </SectionTitle>
          <Card>
            <Table>
              <TableBody>
                <TemplateRows />
              </TableBody>
            </Table>
          </Card>
        </section>
      </main>
    </div>
  )
}
