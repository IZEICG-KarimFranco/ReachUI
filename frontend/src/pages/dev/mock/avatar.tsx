import type { ReactNode } from 'react'
import { ChevronRight, MessageSquare, Users } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/data-display/avatar'
import { RecordList, RecordRow } from '@/components/ui/data-display/record-list'
import { Badge } from '@/components/ui/feedback/badge'
import { StatusLabel } from '@/components/ui/feedback/status-label'
import { Card, CardItem } from '@/components/ui/layout/card'
import { MockSection, MockShell } from '@/pages/dev/mock/mock-shell'

// pages/dev/mock/ está en .gitignore y Tailwind no genera utilities que solo aparecen aquí:
// anchos fijos y el hover van en style o en este bloque, siempre con tokens.
const pageCss = `
[data-av-hover]:hover { background: var(--inset); }
`

const tones = ['signal', 'success', 'panel'] as const
const shapes = ['square', 'circle'] as const
const sizes = ['sm', 'md'] as const

const photo = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#7c5cff"/><circle cx="32" cy="25" r="12" fill="#f2effa"/><path d="M10 64c2-14 11-21 22-21s20 7 22 21z" fill="#f2effa"/></svg>'
)}`
const brokenPhoto = 'data:image/png;base64,broken'

const members = [
  {
    name: 'Adrián Martínez',
    mail: 'adrian@izei.mx',
    role: 'Owner',
    active: true,
  },
  {
    name: 'Lucía Fernández',
    mail: 'lucia@izei.mx',
    role: 'Agente',
    active: true,
  },
  { name: 'Marta Torres', mail: 'marta@izei.mx', role: 'Lectura', active: false },
] as const

function ParamRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <code
        className="shrink-0 font-mono text-xs text-muted"
        style={{ width: 168 }}
      >
        {label}
      </code>
      {children}
    </div>
  )
}

function Caption({ children }: { children: ReactNode }) {
  return <span className="text-xs text-ink-secondary">{children}</span>
}

export function AvatarMockShot() {
  return (
    <div data-shot="avatar" className="flex items-center gap-3">
      <Avatar name="Ana Martínez" />
      <Avatar name="Luis Fernando" tone="success" shape="circle" />
      <Avatar name="Marta Torres" tone="panel" />
    </div>
  )
}

export function AvatarMatrixShot() {
  return (
    <div className="grid gap-4">
      {sizes.map((size) =>
        shapes.map((shape) => (
          <ParamRow key={`${size}-${shape}`} label={`${size} · ${shape}`}>
            {tones.map((tone) => (
              <Avatar
                key={tone}
                name="Ana Martínez"
                size={size}
                shape={shape}
                tone={tone}
              />
            ))}
          </ParamRow>
        ))
      )}
    </div>
  )
}

export function AvatarSourceShot() {
  return (
    <div className="grid gap-4">
      <ParamRow label="src (carga bien)">
        <Avatar name="Ana Martínez" src={photo} />
        <Avatar name="Ana Martínez" src={photo} size="md" shape="circle" />
        <Caption>alt = name</Caption>
      </ParamRow>
      <ParamRow label="src (imagen rota)">
        <Avatar name="Ana Martínez" src={brokenPhoto} />
        <Avatar
          name="Ana Martínez"
          src={brokenPhoto}
          size="md"
          shape="circle"
        />
        <Caption>cae a las iniciales</Caption>
      </ParamRow>
      <ParamRow label="sin src">
        <Avatar name="Ana Martínez" />
        <Avatar name="Ana Martínez" size="md" shape="circle" />
      </ParamRow>
    </div>
  )
}

const initialsCases = [
  { label: 'una palabra', name: 'Ana' },
  { label: 'dos palabras', name: 'Ana Martínez' },
  { label: 'tres palabras', name: 'Luis Fernando Torres' },
  { label: 'acentos y ñ', name: 'óscar ñúñez' },
  { label: 'espacios extra', name: '   Marta    Torres  ' },
  { label: 'emoji', name: '🙂 Equipo Ventas' },
  { label: 'vacío', name: '' },
] as const

export function AvatarInitialsShot() {
  return (
    <div className="grid gap-3">
      {initialsCases.map(({ label, name }) => (
        <ParamRow key={label} label={label}>
          <Avatar name={name} />
          <Caption>
            name=<code className="font-mono">{JSON.stringify(name)}</code>
          </Caption>
        </ParamRow>
      ))}
    </div>
  )
}

export function AvatarFallbackShot() {
  return (
    <div className="grid gap-4">
      <ParamRow label="fallback={<Icon />}">
        <Avatar
          name="Canal WhatsApp"
          tone="success"
          fallback={<MessageSquare aria-hidden="true" className="size-4" />}
        />
        <Avatar
          name="Equipo de ventas"
          tone="panel"
          shape="circle"
          size="md"
          fallback={<Users aria-hidden="true" className="size-5" />}
        />
      </ParamRow>
      <ParamRow label="fallback + src roto">
        <Avatar
          name="Canal WhatsApp"
          tone="success"
          src={brokenPhoto}
          fallback={<MessageSquare aria-hidden="true" className="size-4" />}
        />
        <Caption>el nodo sustituye a las iniciales</Caption>
      </ParamRow>
    </div>
  )
}

export function AvatarA11yShot() {
  return (
    <div className="grid gap-4">
      <ParamRow label="por defecto">
        <Avatar name="Ana Martínez" />
        <Caption>role=&quot;img&quot; · aria-label=&quot;Ana Martínez&quot;</Caption>
      </ParamRow>
      <ParamRow label="decorative">
        <Avatar name="Ana Martínez" decorative />
        <span className="text-sm text-ink">Ana Martínez</span>
        <Caption>aria-hidden: el nombre ya está al lado</Caption>
      </ParamRow>
      <ParamRow label='name=""'>
        <Avatar name="" />
        <Caption>aria-hidden automático (sin nombre accesible)</Caption>
      </ParamRow>
    </div>
  )
}

export function AvatarLegacyShot() {
  return (
    <ParamRow label="children (LEGACY)">
      <Avatar className="h-8 w-8">
        <AvatarImage src={photo} alt="Ana Martínez" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>
      <Avatar className="h-8 w-8">
        <AvatarFallback>LF</AvatarFallback>
      </Avatar>
      <Caption>Avatar + AvatarImage + AvatarFallback (13 consumidores)</Caption>
    </ParamRow>
  )
}

export function AvatarRailUserShot() {
  return (
    <aside
      className="overflow-hidden rounded-surface border border-line text-ink"
      style={{ width: 'var(--rail-w)', background: 'var(--paper-secondary)' }}
    >
      <button
        type="button"
        data-av-hover=""
        className="focus-ring flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors"
      >
        <Avatar name="Adrián Martínez" decorative />
        <span className="min-w-0">
          <b className="block truncate text-sm font-semibold">Adrián M.</b>
          <span className="text-xs text-muted">Owner</span>
        </span>
        <span aria-hidden="true" className="ms-auto font-bold text-muted">
          ···
        </span>
      </button>
    </aside>
  )
}

export function AvatarMembersShot() {
  return (
    <Card divided className="w-full text-sm text-ink">
      {members.map((member) => (
        <CardItem key={member.mail} className="flex items-center gap-3">
          <Avatar name={member.name} decorative />
          <span className="min-w-0 flex-1">
            <b className="block truncate font-semibold">{member.name}</b>
            <span className="block truncate text-xs text-muted">
              {member.mail}
            </span>
          </span>
          <Badge variant="outline">{member.role}</Badge>
          <StatusLabel tone={member.active ? 'success' : 'neutral'}>
            {member.active ? 'Activo' : 'Invitado'}
          </StatusLabel>
          <ChevronRight aria-hidden="true" className="size-4 text-muted" />
        </CardItem>
      ))}
    </Card>
  )
}

export function AvatarContactsShot() {
  return (
    <RecordList title="Contactos recientes" footerCount="3 de 4,820">
      <RecordRow
        leading={<Avatar name="Lucía Fernández" decorative />}
        title="Lucía Fernández"
        status="En conversación"
        statusTone="live"
        meta="+52 55 8765 4321"
      />
      <RecordRow
        leading={<Avatar name="Marco Ruiz" src={photo} decorative />}
        title="Marco Ruiz"
        status="Activo"
        statusTone="ok"
        meta="+52 33 2345 6789"
      />
      <RecordRow
        leading={<Avatar name="" decorative />}
        title="+52 81 9876 5432"
        status="Sin nombre"
        statusTone="idle"
        meta="hace 3 d"
      />
    </RecordList>
  )
}

export function AvatarSheetHeaderShot() {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3.5 rounded-surface border border-line bg-paper p-4">
        <Avatar name="Lucía Fernández" size="md" decorative />
        <span className="min-w-0">
          <b className="block text-base font-semibold">Lucía Fernández</b>
          <StatusLabel tone="success">Activo</StatusLabel>
        </span>
      </div>
      <div className="flex items-center gap-3 rounded-surface border border-line bg-paper p-4">
        <Avatar name="Marco Ruiz" decorative />
        <span className="min-w-0">
          <b className="block text-base font-semibold">Marco Ruiz</b>
          <span className="font-mono text-xs text-muted">CT-0446</span>
        </span>
      </div>
    </div>
  )
}

const paramShots = [
  {
    title: 'size × shape × tone',
    hint: 'sm 34 px · md 44 px; square rounded-control, circle rounded-port; tonos signal, success y panel.',
    Shot: AvatarMatrixShot,
  },
  {
    title: 'src',
    hint: 'Radix muestra el fallback mientras carga y si la imagen falla.',
    Shot: AvatarSourceShot,
  },
  {
    title: 'name → iniciales',
    hint: 'Primera letra de las dos primeras palabras; vacío da «?».',
    Shot: AvatarInitialsShot,
  },
  {
    title: 'fallback',
    hint: 'Un ReactNode sustituye a las iniciales.',
    Shot: AvatarFallbackShot,
  },
  {
    title: 'Accesibilidad · decorative',
    hint: 'El nombre accesible es name con o sin imagen; decorative lo oculta.',
    Shot: AvatarA11yShot,
  },
  {
    title: 'Composición legacy',
    hint: 'Un Avatar con children se despacha a LegacyAvatar.',
    Shot: AvatarLegacyShot,
  },
] as const

const contextShots = [
  {
    title: 'Shot avatar · t03-shell',
    hint: 'Los tres avatares del mock: signal, success circle y panel.',
    Shot: AvatarMockShot,
  },
  {
    title: 'Usuario del rail · .ruser',
    hint: 'decorative junto al nombre y el rol.',
    Shot: AvatarRailUserShot,
  },
  {
    title: 'Miembros · .mrow',
    hint: 'Card divided con rol y estado.',
    Shot: AvatarMembersShot,
  },
  {
    title: 'Contactos · RecordRow leading',
    hint: 'Con iniciales, con foto y sin nombre.',
    Shot: AvatarContactsShot,
  },
  {
    title: 'Cabecera de ficha · #sm-av / #ic-av',
    hint: 'md en la ficha de miembro, sm en la de contacto.',
    Shot: AvatarSheetHeaderShot,
  },
] as const

export function AvatarShots() {
  return (
    <div className="flex w-full flex-col gap-8">
      <style>{pageCss}</style>
      {[...paramShots, ...contextShots].map(
        ({ title, hint, Shot: ShotComponent }) => (
          <section key={title} className="flex min-w-0 flex-col gap-3">
            <div>
              <h2 className="font-mono text-xs text-muted uppercase">
                {title}
              </h2>
              <p className="mt-1 text-xs text-ink-secondary">{hint}</p>
            </div>
            <ShotComponent />
          </section>
        )
      )}
    </div>
  )
}

export default function AvatarMockPage() {
  return (
    <MockShell
      title="Avatar"
      description="Cada parámetro por separado y los casos del mock (t03-shell, rail, miembros, contactos y fichas) en contexto."
    >
      <style>{pageCss}</style>
      {paramShots.map(({ title, hint, Shot: ShotComponent }) => (
        <MockSection key={title} title={title} hint={hint}>
          <ShotComponent />
        </MockSection>
      ))}
      <h2 className="mb-4 text-base font-semibold">En contexto</h2>
      {contextShots.map(({ title, hint, Shot: ShotComponent }) => (
        <MockSection key={title} title={title} hint={hint}>
          <ShotComponent />
        </MockSection>
      ))}
    </MockShell>
  )
}
