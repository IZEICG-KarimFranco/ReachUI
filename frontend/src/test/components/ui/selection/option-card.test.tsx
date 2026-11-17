import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OptionCard } from '@/components/ui/selection/option-card'

describe('OptionCard component', () => {
  it('renders selected state with aria-pressed', () => {
    render(
      <OptionCard
        title="Enviar ahora"
        description="Lanzamiento inmediato"
        selected
      />
    )

    const card = screen.getByRole('button', { name: /enviar ahora/i })
    expect(card.getAttribute('aria-pressed')).toBe('true')
  })

  it('triggers onClick when pressed', () => {
    const handleClick = vi.fn()
    render(<OptionCard title="Programar" onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
