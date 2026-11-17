import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeMenu } from '@/components/theme/theme-menu'
import type { Theme } from '@/components/theme/theme-context'

const setTheme = vi.fn()
let theme: Theme = 'system'

vi.mock('@/components/theme/hooks/use-theme', () => ({
  useTheme: () => ({ theme, setTheme }),
}))

beforeEach(() => {
  theme = 'system'
})

describe('ThemeMenu', () => {
  it('el disparador nombra la acción y muestra el tema actual', () => {
    render(<ThemeMenu />)

    expect(
      screen.getByRole('button', {
        name: /mode_toggle\.label\s*mode_toggle\.system/,
      })
    ).toHaveTextContent('mode_toggle.system')
  })

  it('lista los tres temas y marca el actual', async () => {
    const user = userEvent.setup()
    theme = 'dark'
    render(<ThemeMenu />)

    await user.click(screen.getByRole('button'))

    expect(
      screen.getByRole('menu', { name: 'mode_toggle.label' })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('menuitemradio')).toHaveLength(3)
    expect(
      screen.getByRole('menuitemradio', { name: 'mode_toggle.dark' })
    ).toHaveAttribute('aria-checked', 'true')
  })

  it('elegir un tema llama a setTheme', async () => {
    const user = userEvent.setup()
    render(<ThemeMenu />)

    await user.click(screen.getByRole('button'))
    await user.click(
      screen.getByRole('menuitemradio', { name: 'mode_toggle.light' })
    )

    expect(setTheme).toHaveBeenCalledWith('light')
  })

  it('un valor guardado desconocido cae en «Sistema»', () => {
    theme = 'sepia' as Theme
    render(<ThemeMenu />)

    expect(screen.getByRole('button')).toHaveTextContent('mode_toggle.system')
  })
})
