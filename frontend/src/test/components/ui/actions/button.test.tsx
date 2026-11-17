import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button, IconButton } from '@/components/ui/actions/button'

describe('Button component contract and behaviors', () => {
  it('triggers onClick handler on user click', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Enviar</Button>)

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('blocks clicks and sets aria-disabled when disabled is true', () => {
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Enviar
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('blocks clicks, shows loading spinner, and sets aria-busy when loading is true', () => {
    const handleClick = vi.fn()
    render(
      <Button loading onClick={handleClick}>
        Guardar
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button.getAttribute('aria-busy')).toBe('true')
    expect(button.querySelector('svg')).not.toBeNull()

    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders child element directly when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/dest">Ir al destino</a>
      </Button>
    )

    const link = screen.getByRole('link', { name: /ir al destino/i })
    expect(link).toBeDefined()
    expect(link.getAttribute('data-slot')).toBe('button')
    expect(link.getAttribute('href')).toBe('/dest')
  })

  it('IconButton enforces accessible name and ≥44px target', () => {
    render(<IconButton aria-label="Cerrar panel">✕</IconButton>)
    const button = screen.getByRole('button', { name: 'Cerrar panel' })
    expect(button).toBeDefined()
    expect(button.classList.contains('min-h-[44px]')).toBe(true)
    expect(button.classList.contains('min-w-[44px]')).toBe(true)
  })

  it('preserves variant styles on IconButton without size overriding variant', () => {
    render(
      <IconButton variant="danger" aria-label="Eliminar">
        🗑
      </IconButton>
    )
    const button = screen.getByRole('button', { name: 'Eliminar' })
    expect(button.getAttribute('data-variant')).toBe('danger')
    expect(button.classList.contains('text-error')).toBe(true)
  })
})
