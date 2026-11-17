import { useState, type ReactNode } from 'react'
import { CheckIcon, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/actions/button'
import { Combobox } from '@/components/ui/selection/combobox'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/selection/command'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

const segments: Array<[string, string]> = [
  ['Clientes activos Q3', '4,820 contactos'],
  ['Cliente VIP — abril', '320 contactos'],
  ['Clientes VIP — CDMX norte', '96 contactos'],
  ['Clientes con carrito abandonado', '1,204 contactos'],
  ['Clientes reactivados 2025', '640 contactos'],
  ['Clientes zona sur', '388 contactos'],
  ['Clientes referidos', '175 contactos'],
  ['Newsletter abril', '2,930 contactos'],
  ['Prospectos feria', '812 contactos'],
  ['Proveedores', '44 contactos'],
  ['Equipo interno', '12 contactos'],
  ['Pruebas QA', '5 contactos'],
  ['Clientes 2024', '6,110 contactos'],
  ['Clientes 2025', '5,802 contactos'],
  ['Soporte frecuente', '210 contactos'],
  ['Mayoristas', '67 contactos'],
  ['Minoristas', '1,540 contactos'],
  ['Distribuidores', '23 contactos'],
  ['Aliados comerciales', '18 contactos'],
  ['Prensa', '31 contactos'],
  ['Eventos 2025', '492 contactos'],
  ['Encuestados NPS', '1,870 contactos'],
]

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-sm overflow-hidden rounded-control border border-line bg-card shadow-pop">
      {children}
    </div>
  )
}

export function CommandSearchShot() {
  const [segment, setSegment] = useState('Cliente VIP — abril')

  return (
    <>
      <Panel>
        <Command>
          <CommandInput placeholder="Buscar segmento…" />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {segments.map(([name, meta]) => (
                <CommandItem
                  key={name}
                  value={name}
                  onSelect={setSegment}
                  data-checked={segment === name || undefined}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{name}</span>
                    <span className="text-xs font-normal text-muted">
                      {meta}
                    </span>
                  </span>
                  {segment === name && <CheckIcon aria-hidden="true" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </Panel>
      <ValueReadout>value: {segment}</ValueReadout>
    </>
  )
}

export default function CommandMockPage() {
  const [sender, setSender] = useState('main')
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <MockShell
      title="Command"
      description="Lista con búsqueda (cmdk) que usan Combobox, PhoneInput y el Select searchable. Mock: t02-controls «select-search-open» y «select-empty-loading»."
    >
      <MockSection
        title="select-search-open · 22 segmentos"
        hint="Escribe para filtrar; flechas y Enter eligen. El elegido lleva data-checked."
      >
        <CommandSearchShot />
      </MockSection>

      <MockSection title="select-empty-loading · vacío">
        <Panel>
          <Command>
            <CommandInput placeholder="Buscar segmento…" value="xyz" readOnly />
            <CommandList>
              <CommandEmpty>Sin resultados para «xyz»</CommandEmpty>
              <CommandGroup>
                <CommandItem value="Clientes activos">
                  Clientes activos
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Panel>
      </MockSection>

      <MockSection
        title="Grupos, separador, shortcut e ítem deshabilitado"
        hint="Sin equivalente en el mock: estructura de cmdk con tokens del panel."
      >
        <Panel>
          <Command>
            <CommandInput placeholder="Buscar…" />
            <CommandList>
              <CommandEmpty>Sin resultados</CommandEmpty>
              <CommandGroup heading="Segmentos">
                <CommandItem>
                  <Users />
                  Clientes activos Q3
                </CommandItem>
                <CommandItem disabled>
                  <Users />
                  Pruebas QA (deshabilitado)
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Acciones">
                <CommandItem>
                  <Plus />
                  Nuevo segmento
                  <CommandShortcut>⌘N</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Panel>
      </MockSection>

      <MockSection
        title="En contexto · Combobox (Popover + Command)"
        hint="Combobox no se refactorizó: su disparador sigue con Button outline."
      >
        <div className="max-w-sm">
          <Combobox
            options={[
              { value: 'main', label: '+52 55 1234 5678' },
              { value: 'wa', label: '+52 55 8765 4321' },
              { value: 'us', label: '+1 415 555 0132', disabled: true },
            ]}
            value={sender}
            onChange={setSender}
            searchPlaceholder="Buscar remitente…"
            emptyMessage="Sin resultados"
          />
        </div>
        <ValueReadout>value: {sender}</ValueReadout>
      </MockSection>

      <MockSection title="CommandDialog · título y descripción por defecto (i18n)">
        <Button variant="secondary" onClick={() => setDialogOpen(true)}>
          Abrir CommandDialog
        </Button>
        <CommandDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <CommandInput placeholder="Buscar…" />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup heading="Ir a">
              {segments.slice(0, 8).map(([name]) => (
                <CommandItem key={name} onSelect={() => setDialogOpen(false)}>
                  <Users />
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </MockSection>
    </MockShell>
  )
}
