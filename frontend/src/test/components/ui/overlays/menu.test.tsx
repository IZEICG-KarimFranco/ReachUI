import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pencil } from 'lucide-react'

import { Menu, type MenuEntry } from '@/components/ui/overlays/menu'

function renderMenu(items: MenuEntry[], label?: string) {
  render(
    <Menu
      label={label}
      trigger={<button type="button">Acciones</button>}
      items={items}
    />
  )
  return screen.getByRole('button', { name: 'Acciones' })
}

const noop = () => {}

describe('Menu', () => {
  it('abre con clic y lista sus acciones', async () => {
    const user = userEvent.setup()
    const trigger = renderMenu([
      { id: 'edit', label: 'Editar', icon: Pencil, onSelect: noop },
      { id: 'copy', label: 'Duplicar', onSelect: noop },
    ])

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menuitem', { name: 'Editar' })).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: 'Duplicar' })
    ).toBeInTheDocument()
  })

  it.each(['{Enter}', ' '])('abre con el teclado (%s)', async (key) => {
    const user = userEvent.setup()
    const trigger = renderMenu([
      { id: 'edit', label: 'Editar', onSelect: noop },
    ])

    trigger.focus()
    await user.keyboard(key)

    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('recorre con flechas y salta el ítem deshabilitado', async () => {
    const user = userEvent.setup()
    const trigger = renderMenu([
      { id: 'a', label: 'Primero', onSelect: noop },
      { id: 'b', label: 'Bloqueado', disabled: true, onSelect: noop },
      { id: 'c', label: 'Tercero', onSelect: noop },
    ])

    trigger.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('menuitem', { name: 'Primero' })).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Tercero' })).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('menuitem', { name: 'Primero' })).toHaveFocus()
  })

  it('Escape cierra y devuelve el foco al disparador', async () => {
    const user = userEvent.setup()
    const trigger = renderMenu([
      { id: 'edit', label: 'Editar', onSelect: noop },
    ])

    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('un ítem deshabilitado no dispara su callback', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const trigger = renderMenu([
      { id: 'b', label: 'Bloqueado', disabled: true, onSelect },
    ])

    await user.click(trigger)
    const item = screen.getByRole('menuitem', { name: 'Bloqueado' })
    expect(item).toHaveAttribute('aria-disabled', 'true')
    await user.click(item)

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('una acción danger dispara su callback y cierra el menú', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const trigger = renderMenu([
      { id: 'edit', label: 'Editar', onSelect: noop },
      { id: 'sep', type: 'separator' },
      { id: 'delete', label: 'Eliminar', danger: true, onSelect: onDelete },
    ])

    await user.click(trigger)
    expect(screen.getByRole('separator')).toBeInTheDocument()
    await user.click(screen.getByRole('menuitem', { name: 'Eliminar' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('anuncia el ítem marcado con aria-checked y nombra el menú con su cabecera', async () => {
    const user = userEvent.setup()
    const onBusy = vi.fn()
    const trigger = renderMenu(
      [
        { id: 'available', label: 'Disponible', checked: true, onSelect: noop },
        { id: 'busy', label: 'Ocupado', checked: false, onSelect: onBusy },
      ],
      'Estado del agente'
    )

    await user.click(trigger)

    expect(
      screen.getByRole('menu', { name: 'Estado del agente' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitemradio', { name: 'Disponible' })
    ).toHaveAttribute('aria-checked', 'true')
    const busy = screen.getByRole('menuitemradio', { name: 'Ocupado' })
    expect(busy).toHaveAttribute('aria-checked', 'false')

    await user.click(busy)
    expect(onBusy).toHaveBeenCalledTimes(1)
  })

  it('anuncia la descripción del ítem sin mezclarla con su nombre', async () => {
    const user = userEvent.setup()
    const trigger = renderMenu([
      {
        id: 'detail',
        label: 'CSV detallado',
        description: 'Supera el máximo de filas',
        disabled: true,
        onSelect: noop,
      },
    ])

    await user.click(trigger)

    expect(
      screen.getByRole('menuitem', { name: 'CSV detallado' })
    ).toHaveAccessibleDescription('Supera el máximo de filas')
  })

  it('density="compact" conserva la navegación con teclado y la selección', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Menu
        density="compact"
        trigger={<button type="button">Acciones</button>}
        items={[
          { id: 'edit', label: 'Editar', onSelect: noop },
          { id: 'copy', label: 'Duplicar', onSelect },
        ]}
      />
    )

    screen.getByRole('button', { name: 'Acciones' }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('menu')).toHaveAttribute('data-density', 'compact')

    await user.keyboard('{ArrowDown}{Enter}')
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('inset: el panel deja ese margen a cada lado del disparador', async () => {
    const user = userEvent.setup()
    render(
      <Menu
        inset={12}
        label="Cuenta"
        trigger={<button type="button">Acciones</button>}
        items={[{ id: 'a', label: 'Cerrar sesión', onSelect: noop }]}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Acciones' }))

    expect(screen.getByRole('menu', { name: 'Cuenta' })).toHaveStyle({
      '--menu-inset': '12px',
    })
  })
})
