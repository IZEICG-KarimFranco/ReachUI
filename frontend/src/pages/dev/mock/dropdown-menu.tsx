import { useState } from 'react'
import {
  ChevronDown,
  Copy,
  Download,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import { StatusDot } from '@/components/ui/feedback/status-dot'
import { Button, IconButton } from '@/components/ui/actions/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/overlays/dropdown-menu'
import { Menu, type MenuEntry } from '@/components/ui/overlays/menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/overlays/sheet'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

const AGENT_STATES = [
  { id: 'available', label: 'Disponible', tone: 'success' },
  { id: 'unavailable', label: 'No disponible', tone: 'error' },
  { id: 'busy', label: 'Ocupado', tone: 'live' },
  { id: 'offline', label: 'Fuera de línea', tone: 'neutral' },
] as const

export default function DropdownMenuMockPage() {
  const [last, setLast] = useState('—')
  const [agentState, setAgentState] = useState<string>('available')
  const [menuLast, setMenuLast] = useState('—')
  const current =
    AGENT_STATES.find((state) => state.id === agentState) ?? AGENT_STATES[0]
  const agentItems: MenuEntry[] = AGENT_STATES.map((state) => ({
    id: state.id,
    label: state.label,
    icon: <StatusDot tone={state.tone} />,
    checked: state.id === agentState,
    onSelect: () => setAgentState(state.id),
  }))
  const actionItems: MenuEntry[] = [
    {
      id: 'edit',
      label: 'Editar',
      icon: Pencil,
      onSelect: () => setMenuLast('Editar'),
    },
    {
      id: 'copy',
      label: 'Duplicar',
      icon: Copy,
      onSelect: () => setMenuLast('Duplicar'),
    },
    {
      id: 'detail',
      label: 'CSV detallado',
      icon: Download,
      disabled: true,
      description:
        'La exportación detallada incluye 182.400 contactos (máx. 100.000). Descarga el resumen por campaña.',
      onSelect: () => setMenuLast('CSV detallado'),
    },
    { id: 'sep', type: 'separator' },
    {
      id: 'delete',
      label: 'Eliminar',
      icon: Trash2,
      danger: true,
      onSelect: () => setMenuLast('Eliminar'),
    },
  ]
  const [showArchived, setShowArchived] = useState(false)
  const [sort, setSort] = useState('recent')

  return (
    <MockShell
      title="DropdownMenu (Menu)"
      description="Contrato «Menu / Tooltip». Arriba el Menu por props; abajo los slots shadcn de DropdownMenu (clases mapeadas a tokens). Teclado: Enter/Espacio abre, flechas recorren, Escape cierra y devuelve el foco."
    >
      <MockSection
        title="Menu · Estado del agente (captura del rail)"
        hint="Menu por props: label, ítems marcables con StatusDot, side=top y ancho del disparador."
      >
        <div style={{ width: 236, paddingTop: 260 }}>
          <Menu
            label="Estado del agente"
            side="top"
            matchTriggerWidth
            items={agentItems}
            trigger={
              <Button
                variant="quiet"
                size="compact"
                className="w-full justify-start"
              >
                <StatusDot tone={current.tone} />
                {current.label}
                <ChevronDown className="ms-auto size-3" aria-hidden="true" />
              </Button>
            }
          />
        </div>
        <ValueReadout>estado: {agentState}</ValueReadout>
      </MockSection>

      <MockSection title="Menu · acciones, deshabilitado con descripción y danger">
        <Menu
          align="start"
          items={actionItems}
          trigger={
            <IconButton aria-label="Acciones de la plantilla" variant="quiet">
              <MoreHorizontal />
            </IconButton>
          }
        />
        <ValueReadout>última acción: {menuLast}</ValueReadout>
      </MockSection>

      <MockSection
        title='Menu · density="compact"'
        hint="Ítems de 32 px y 1 px de margen vertical para menús densos de escritorio. Mismos ítems que las dos secciones de arriba."
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
          <div style={{ width: 236, paddingTop: 180 }}>
            <Menu
              label="Estado del agente"
              side="top"
              matchTriggerWidth
              density="compact"
              items={agentItems}
              trigger={
                <Button
                  variant="quiet"
                  size="compact"
                  className="w-full justify-start"
                >
                  <StatusDot tone={current.tone} />
                  {current.label}
                  <ChevronDown className="ms-auto size-3" aria-hidden="true" />
                </Button>
              }
            />
          </div>
          <Menu
            align="start"
            density="compact"
            items={actionItems}
            trigger={
              <IconButton aria-label="Acciones compactas" variant="quiet">
                <MoreHorizontal />
              </IconButton>
            }
          />
        </div>
      </MockSection>

      <h2 className="mb-4 font-mono text-xs uppercase text-muted">
        DropdownMenu (slots shadcn)
      </h2>

      <MockSection title="Acciones de fila (IconButton + destructiva)">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton aria-label="Acciones de la plantilla" variant="quiet">
              <MoreHorizontal />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>recordatorio_cita</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setLast('Editar')}>
              <Pencil /> Editar
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setLast('Duplicar')}>
              <Copy /> Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              Enviar a Meta (deshabilitado)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setLast('Eliminar')}
            >
              <Trash2 /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ValueReadout>última acción: {last}</ValueReadout>
      </MockSection>

      <MockSection title="Checkbox, radio y submenú">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="compact">
              Vista
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuCheckboxItem
              checked={showArchived}
              onCheckedChange={setShowArchived}
            >
              Mostrar archivadas
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              <DropdownMenuRadioItem value="recent">
                Más recientes
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name">Nombre</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="sent">
                Enviados
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Exportar</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>CSV</DropdownMenuItem>
                <DropdownMenuItem>Excel</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        <ValueReadout>
          archivadas: {String(showArchived)} · orden: {sort}
        </ValueReadout>
      </MockSection>

      <MockSection title="Dentro de un Sheet (capas: z-pop sobre z-sheet)">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="compact">
              Abrir sheet
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Comentarios</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    aria-label="Acciones del comentario"
                    variant="quiet"
                  >
                    <MoreHorizontal />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onSelect={() => setLast('Editar (sheet)')}>
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SheetContent>
        </Sheet>
      </MockSection>

      <MockSection title="Abierto de forma fija (para medir colores)">
        <div className="h-56">
          <DropdownMenu open modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="compact">
                Siempre abierto
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Duplicar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </MockSection>
    </MockShell>
  )
}
