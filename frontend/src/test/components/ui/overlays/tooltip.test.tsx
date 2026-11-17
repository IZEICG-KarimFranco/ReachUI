import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/overlays/tooltip'

describe('Tooltip component contract and behaviors (R6)', () => {
  it('reveals tooltip on focus and closes on blur', async () => {
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button">Action</button>
        </TooltipTrigger>
        <TooltipContent>Información complementaria</TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByRole('button', { name: 'Action' })

    fireEvent.focus(trigger)
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toBeInTheDocument()
      expect(tooltip.textContent).toContain('Información complementaria')
    })

    fireEvent.blur(trigger)
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  it('reveals tooltip on focus and closes on Escape key', async () => {
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button">Trigger Escape</button>
        </TooltipTrigger>
        <TooltipContent>Detalle de ayuda</TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByRole('button', { name: 'Trigger Escape' })

    fireEvent.focus(trigger)
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    fireEvent.keyDown(trigger, { key: 'Escape', code: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })
})
