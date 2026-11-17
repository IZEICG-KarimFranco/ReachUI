import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Surface } from '@/components/ui/layout/surface'

describe('Surface component contract', () => {
  it('renders its children as a plate by default', () => {
    render(
      <Surface data-testid="plate">
        <span>Teléfono</span>
      </Surface>
    )
    const plate = screen.getByTestId('plate')
    expect(plate.getAttribute('data-slot')).toBe('surface')
    expect(plate.getAttribute('data-variant')).toBe('plate')
    expect(screen.getByText('Teléfono').parentElement).toBe(plate)
  })

  it('accepts semantic roles and accessible names from the consumer', () => {
    render(
      <Surface role="region" aria-label="Datos del contacto">
        <p>+52 55 1234 5678</p>
      </Surface>
    )
    expect(
      screen.getByRole('region', { name: 'Datos del contacto' })
    ).toHaveTextContent('+52 55 1234 5678')
  })

  it('forwards className, id and inline style', () => {
    render(
      <Surface
        data-testid="plate"
        id="contact-plate"
        className="max-w-[520px]"
        style={{ minHeight: 140 }}
      />
    )
    const plate = screen.getByTestId('plate')
    expect(plate.id).toBe('contact-plate')
    expect(plate.classList.contains('max-w-[520px]')).toBe(true)
    expect(plate.style.minHeight).toBe('140px')
  })

  it('lets a consumer override the data-slot of the plate', () => {
    render(<Surface data-testid="plate" data-slot="card" />)
    expect(screen.getByTestId('plate').getAttribute('data-slot')).toBe('card')
  })
})

describe('Surface pane variant', () => {
  it('is a plate unless the consumer asks for the pane', () => {
    render(
      <>
        <Surface data-testid="default" />
        <Surface data-testid="pane" variant="pane" />
      </>
    )
    expect(screen.getByTestId('default').getAttribute('data-variant')).toBe(
      'plate'
    )
    expect(screen.getByTestId('pane').getAttribute('data-variant')).toBe('pane')
  })

  it('keeps its content in the dark theme scope so descendants resolve dark tokens in any mode', () => {
    render(
      <>
        <Surface variant="pane">
          <span>Latencia</span>
        </Surface>
        <Surface>
          <span>Número</span>
        </Surface>
      </>
    )
    expect(screen.getByText('Latencia').closest('.dark')).not.toBeNull()
    expect(screen.getByText('Número').closest('.dark')).toBeNull()
  })

  it('renders its children and forwards props like the plate does', () => {
    render(
      <Surface variant="pane" role="region" aria-label="Equipo Twilio" id="eq">
        <p>184 ms</p>
      </Surface>
    )
    const pane = screen.getByRole('region', { name: 'Equipo Twilio' })
    expect(pane.id).toBe('eq')
    expect(pane).toHaveTextContent('184 ms')
  })
})
