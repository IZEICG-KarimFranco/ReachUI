import { beforeAll, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

beforeAll(() => {
  // cmdk desplaza el ítem activo a la vista; jsdom no implementa scrollIntoView.
  Element.prototype.scrollIntoView = vi.fn()
})

function Segments({ onSelect = vi.fn() }: { onSelect?: (v: string) => void }) {
  return (
    <Command>
      <CommandInput placeholder="Buscar segmento…" />
      <CommandList>
        <CommandEmpty>Sin resultados</CommandEmpty>
        <CommandGroup heading="Segmentos">
          <CommandItem onSelect={onSelect}>Clientes activos Q3</CommandItem>
          <CommandItem onSelect={onSelect}>Cliente VIP — abril</CommandItem>
          <CommandItem onSelect={onSelect} disabled>
            Pruebas QA
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Acciones">
          <CommandItem onSelect={onSelect}>
            Nuevo segmento
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

describe('Command', () => {
  it('filters items while typing', async () => {
    const user = userEvent.setup()
    render(<Segments />)

    expect(screen.getAllByRole('option')).toHaveLength(4)
    await user.type(screen.getByRole('combobox'), 'vip')

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0].textContent).toBe('Cliente VIP — abril')
  })

  it('shows the empty message when nothing matches', async () => {
    const user = userEvent.setup()
    render(<Segments />)

    await user.type(screen.getByRole('combobox'), '@@@')

    expect(await screen.findByText('Sin resultados')).toBeDefined()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('selects the active item with the keyboard and skips disabled ones', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Segments onSelect={onSelect} />)

    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    expect(onSelect).toHaveBeenLastCalledWith('Nuevo segmento⌘N')
    expect(
      screen
        .getByRole('option', { name: 'Pruebas QA' })
        .getAttribute('aria-disabled')
    ).toBe('true')
  })

  it('renders group headings, separator and shortcut', () => {
    render(<Segments />)

    expect(screen.getByText('Segmentos')).toBeDefined()
    expect(screen.getByRole('separator')).toBeDefined()
    expect(screen.getByText('⌘N')).toBeDefined()
  })
})

describe('CommandDialog', () => {
  it('uses the localized default title as accessible name', () => {
    render(
      <CommandDialog open>
        <CommandInput />
        <CommandList>
          <CommandItem>Inicio</CommandItem>
        </CommandList>
      </CommandDialog>
    )

    expect(screen.getByRole('dialog', { name: 'common.search' })).toBeDefined()
  })

  it('accepts a custom title', () => {
    render(
      <CommandDialog open title="Ir a…">
        <CommandList />
      </CommandDialog>
    )

    expect(screen.getByRole('dialog', { name: 'Ir a…' })).toBeDefined()
  })
})
