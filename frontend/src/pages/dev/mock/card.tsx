import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/actions/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardItem,
  CardMeta,
  CardTitle,
} from '@/components/ui/layout/card'
import {
  CardCampaignExample,
  CardMembersExample,
  CardOrganizationExample,
} from '@/pages/dev/mock/card-examples'
import { MockNav } from '@/pages/dev/mock/mock-nav'
import { StatusDot } from '@/components/ui/feedback/status-dot'
import { cn } from '@/lib/utils'

const paneRows = [
  { label: 'Número', value: '+52 55 1234 5678', mono: true, accent: false },
  { label: 'Canal', value: 'SMS · WhatsApp', mono: false, accent: false },
  { label: 'Estado', value: 'Activo', mono: true, accent: true },
  { label: 'Latencia', value: '184 ms', mono: true, accent: false },
] as const

const ticketRows = [
  { label: 'Nombre', value: 'Promo primavera — reactivación', accent: false },
  { label: 'Audiencia', value: 'Clientes activos Q1 · 4,820', accent: true },
  { label: 'Canal', value: 'SMS', accent: true },
  { label: 'Remitente', value: '+52 55 1234 5678', accent: false },
  { label: 'Mensaje', value: 'Texto · 1 segmento', accent: false },
  { label: 'Programación', value: 'Inmediato', accent: false },
] as const

const contactRows = [
  { label: 'Teléfono', value: '+52 55 1234 5678', mono: true },
  { label: 'Listas', value: 'Clientes VIP · 2 más', mono: false },
  { label: 'Opt-in', value: '2025-11-04', mono: true },
] as const

const templateRows = [
  {
    name: 'promo_reactivacion_v2',
    preview: 'Hola {nombre} 👋 Te extrañamos en Izei.',
    status: 'Aprobada',
    category: 'Marketing',
    age: 'hace 2 d',
  },
  {
    name: 'recordatorio_cita',
    preview: 'Hola {nombre} 👋',
    status: 'Aprobada',
    category: 'Utility',
    age: 'hace 5 d',
  },
  {
    name: 'factura_mensual',
    preview:
      'Hola {nombre}, tu factura del periodo ya está disponible en tu cuenta.',
    status: 'En revisión',
    category: 'Utility',
    age: 'hace 3 h',
  },
  {
    name: 'nps_encuesta',
    preview:
      'Hola {nombre} — ¿cómo fue tu experiencia con nosotros esta semana?',
    status: 'Borrador',
    category: 'Marketing',
    age: 'ayer',
  },
] as const

export function CardKeyValueRows() {
  return (
    <>
      {contactRows.map(({ label, value, mono }) => (
        <CardItem
          key={label}
          className="flex items-center justify-between gap-3"
        >
          <span className="flex-none text-xs text-muted">{label}</span>
          <span
            className={
              mono
                ? 'min-w-0 truncate text-right font-mono text-[10.5px] font-semibold tracking-[0.04em]'
                : 'min-w-0 truncate text-right text-xs font-semibold'
            }
          >
            {value}
          </span>
        </CardItem>
      ))}
    </>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-2 text-label uppercase text-muted">{children}</h2>
}

export default function CardMockPage() {
  return (
    <div className="min-h-dvh w-full bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-6 text-lg font-semibold">Card · slots y líneas</h1>

        <section className="mb-8">
          <SectionTitle>
            lista clave/valor con CardItem (sheet-detail)
          </SectionTitle>
          <Card divided className="w-full max-w-[440px]">
            <CardKeyValueRows />
          </Card>
        </section>

        <section className="mb-8">
          <SectionTitle>
            cabecera · título + meta, ID mono y descripción debajo
          </SectionTitle>
          <div className="grid w-full max-w-[520px] gap-3">
            <Card divided>
              <CardHeader>
                <CardHeading>
                  <CardTitle>Campos de contacto</CardTitle>
                  <CardMeta>7 campos</CardMeta>
                </CardHeading>
                <Button variant="secondary">+ Campo</Button>
              </CardHeader>
              <CardItem className="text-sm">Teléfono</CardItem>
            </Card>
            <Card>
              <CardHeader>
                <CardHeading>
                  <CardTitle>Organización</CardTitle>
                  <CardMeta mono>ORG-IZEI-CG</CardMeta>
                </CardHeading>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardHeading>
                  <CardTitle>Equipo</CardTitle>
                  <CardMeta>5 miembros</CardMeta>
                  <CardDescription>
                    Gestiona a tu equipo y sus niveles de acceso.
                  </CardDescription>
                </CardHeading>
                <Button variant="secondary">+ Invitar colaborador</Button>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="mb-8">
          <SectionTitle>
            CardHeader + CardContent + CardFooter (empty-state)
          </SectionTitle>
          <Card divided className="w-full max-w-[520px]">
            <CardHeader>
              <CardHeading>
                <CardTitle>Segmentos</CardTitle>
                <CardMeta>0 activos</CardMeta>
              </CardHeading>
            </CardHeader>
            <CardContent centered className="min-h-[140px] text-xs text-muted">
              Aún no hay segmentos.
            </CardContent>
            <CardFooter className="justify-end text-xs text-muted">
              <Button variant="quiet" size="compact">
                Crear segmento
                <ArrowRight aria-hidden="true" />
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="mb-8">
          <SectionTitle>
            items entre cabecera y pie (sin doble línea junto al pie)
          </SectionTitle>
          <Card divided className="w-full max-w-[520px]">
            <CardHeader>
              <CardHeading>
                <CardTitle>Listas</CardTitle>
                <CardMeta>3 listas</CardMeta>
              </CardHeading>
            </CardHeader>
            <CardItem className="text-sm">Clientes VIP</CardItem>
            <CardItem className="text-sm">Base general</CardItem>
            <CardItem className="text-sm">Inactivos 90 d</CardItem>
            <CardFooter className="justify-end text-xs text-muted">
              Mostrando 3 de 3
            </CardFooter>
          </Card>
        </section>

        <section className="mb-8">
          <SectionTitle>card dentro de card (plate y pane)</SectionTitle>
          <Card className="w-full max-w-[520px]">
            <CardHeader>
              <CardHeading>
                <CardTitle>Campaña CMP-0441</CardTitle>
                <CardMeta>2 bloques</CardMeta>
              </CardHeading>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Card divided>
                <CardHeader>
                  <CardHeading>
                    <CardTitle>Audiencia</CardTitle>
                  </CardHeading>
                </CardHeader>
                <CardItem className="text-sm">Clientes VIP</CardItem>
                <CardItem className="text-sm">Base general</CardItem>
              </Card>
              <Card variant="pane" divided>
                <CardHeader>
                  <CardHeading>
                    <CardTitle>EQUIPO · TWILIO</CardTitle>
                  </CardHeading>
                </CardHeader>
                <CardItem className="text-xs">Conectado</CardItem>
              </Card>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <SectionTitle>
            variant=&quot;pane&quot; · surface-panel-dark (t03-shell.html:117)
          </SectionTitle>
          <Card variant="pane" divided className="w-full max-w-[420px]">
            <CardHeader>
              <CardHeading>
                <CardTitle>EQUIPO · TWILIO</CardTitle>
              </CardHeading>
              <span>
                <StatusDot
                  tone="success"
                  className="shadow-[0_0_6px_var(--success)]"
                />
              </span>
            </CardHeader>
            {paneRows.map(({ label, value, mono, accent }) => (
              <CardItem
                key={label}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="flex-none text-muted">{label}</span>
                <span
                  className={cn(
                    'min-w-0 truncate text-right',
                    mono && 'font-mono text-[10.5px] tracking-[0.04em]',
                    accent && 'font-bold text-signal-contrast'
                  )}
                >
                  {value}
                </span>
              </CardItem>
            ))}
          </Card>
        </section>

        <section className="mb-8">
          <SectionTitle>
            variant=&quot;pane&quot; · papeleta de envío
            (campaign-wizard.html:411)
          </SectionTitle>
          <Card variant="pane" divided className="w-full max-w-[420px]">
            <CardHeader>
              <CardHeading>
                <CardTitle>Papeleta</CardTitle>
                <CardMeta mono>CMP-0441</CardMeta>
              </CardHeading>
              <span>
                <StatusDot
                  tone="success"
                  className="shadow-[0_0_6px_var(--success)]"
                />
              </span>
            </CardHeader>
            {ticketRows.map(({ label, value, accent }) => (
              <CardItem
                key={label}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="flex-none text-muted">{label}</span>
                <span
                  className={cn(
                    'min-w-0 truncate text-right font-mono text-[10.5px] tracking-[0.04em]',
                    accent && 'font-bold text-signal-contrast'
                  )}
                >
                  {value}
                </span>
              </CardItem>
            ))}
          </Card>
        </section>

        <section className="mb-8">
          <SectionTitle>
            sin divided (valor por defecto): el consumidor pone sus propias
            líneas
          </SectionTitle>
          <Card className="w-full max-w-[520px]">
            <CardItem className="border-b border-line text-sm">
              Fila con línea propia
            </CardItem>
            <CardItem className="text-sm">
              Fila sin línea: Card no dibuja ninguna
            </CardItem>
          </Card>
        </section>

        <section>
          <SectionTitle>
            Card con padding del consumidor (hijos sueltos)
          </SectionTitle>
          <Card className="p-4 text-sm">Contenido libre dentro del Card.</Card>
        </section>
      </main>

      <section className="px-6 pb-10">
        <SectionTitle>
          Card a todo el ancho de la pantalla (tabla de plantillas)
        </SectionTitle>
        <Card divided className="w-full">
          {templateRows.map(({ name, preview, status, category, age }) => (
            <CardItem
              key={name}
              className="grid grid-cols-[minmax(0,1fr)_5rem] items-center gap-4 tablet:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_5rem]"
            >
              <div className="min-w-0">
                <div className="truncate font-mono text-sm font-bold">
                  {name}
                </div>
                <div className="truncate text-xs text-muted">{preview}</div>
              </div>
              <span className="hidden text-xs font-semibold text-ink-secondary tablet:block">
                {status}
              </span>
              <span className="hidden font-mono text-label uppercase tracking-[0.08em] text-signal-contrast tablet:block">
                {category}
              </span>
              <span className="text-right font-mono text-[10.5px] text-muted">
                {age}
              </span>
            </CardItem>
          ))}
          <CardFooter className="justify-end text-xs text-muted">
            Mostrando 4 de 4
          </CardFooter>
        </Card>
      </section>

      <section className="flex flex-col gap-10 px-6 pb-10">
        <div>
          <SectionTitle>
            en contexto · configuración de organización (nav + formulario)
          </SectionTitle>
          <CardOrganizationExample />
        </div>
        <div>
          <SectionTitle>
            en contexto · miembros (lista con cabecera y pie)
          </SectionTitle>
          <CardMembersExample />
        </div>
        <div>
          <SectionTitle>
            en contexto · nueva campaña (audiencia + papeleta y vista previa)
          </SectionTitle>
          <CardCampaignExample />
        </div>
      </section>
    </div>
  )
}
