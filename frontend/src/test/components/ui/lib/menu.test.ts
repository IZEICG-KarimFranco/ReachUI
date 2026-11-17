import { describe, expect, it } from 'vitest'

import {
  getCheckedId,
  isCheckable,
  isMenuSeparator,
  type MenuEntry,
} from '@/components/ui/lib/menu'

const noop = () => {}

describe('isMenuSeparator / isCheckable', () => {
  it('distingue separadores, acciones y acciones marcables', () => {
    const separator: MenuEntry = { id: 's', type: 'separator' }
    const action: MenuEntry = { id: 'a', label: 'A', onSelect: noop }
    const checkable: MenuEntry = {
      id: 'b',
      label: 'B',
      checked: false,
      onSelect: noop,
    }

    expect(isMenuSeparator(separator)).toBe(true)
    expect(isMenuSeparator(action)).toBe(false)
    expect(isCheckable(separator)).toBe(false)
    expect(isCheckable(action)).toBe(false)
    expect(isCheckable(checkable)).toBe(true)
  })
})

describe('getCheckedId', () => {
  it('devuelve null si ningún ítem es marcable', () => {
    expect(getCheckedId([{ id: 'a', label: 'A', onSelect: noop }])).toBeNull()
  })

  it('devuelve el id del ítem marcado', () => {
    expect(
      getCheckedId([
        { id: 'a', label: 'A', checked: false, onSelect: noop },
        { id: 's', type: 'separator' },
        { id: 'b', label: 'B', checked: true, onSelect: noop },
      ])
    ).toBe('b')
  })

  it('devuelve cadena vacía si hay marcables pero ninguno marcado', () => {
    expect(
      getCheckedId([{ id: 'a', label: 'A', checked: false, onSelect: noop }])
    ).toBe('')
  })
})
