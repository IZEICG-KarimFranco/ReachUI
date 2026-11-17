import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Steps, type StepItem } from '@/components/ui/navigation/steps'

describe('Steps component contract, accessibility, and interactions (R6)', () => {
  const sampleSteps: StepItem[] = [
    {
      number: 1,
      label: 'Audiencia y destinatarios de la campaña',
      status: 'done',
    },
    { number: 2, label: 'Mensaje', status: 'current' },
    { number: 3, label: 'Envío programado', status: 'upcoming' },
    { number: 4, label: 'Revisión final', status: 'upcoming', disabled: true },
  ]

  it('renders correctly with semantically accurate aria attributes', () => {
    render(<Steps steps={sampleSteps} />)

    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()

    const currentStep = screen.getByRole('listitem', { current: 'step' })
    expect(currentStep).toBeInTheDocument()
    expect(currentStep).toHaveTextContent('Mensaje')

    expect(screen.getByText(/completado|done/i)).toBeInTheDocument()
  })

  it('handles mouse click with single call to onStepClick', async () => {
    const user = userEvent.setup()
    const handleStepClick = vi.fn()

    render(<Steps steps={sampleSteps} onStepClick={handleStepClick} />)

    const firstStepButton = screen.getByRole('button', { name: /audiencia/i })
    await user.click(firstStepButton)

    expect(handleStepClick).toHaveBeenCalledTimes(1)
    expect(handleStepClick).toHaveBeenCalledWith(0)
  })

  it('handles keyboard navigation with Enter and Space with single call', async () => {
    const user = userEvent.setup()
    const handleStepClick = vi.fn()

    render(<Steps steps={sampleSteps} onStepClick={handleStepClick} />)

    const thirdStepButton = screen.getByRole('button', { name: /envío/i })
    thirdStepButton.focus()
    expect(thirdStepButton).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(handleStepClick).toHaveBeenCalledTimes(1)
    expect(handleStepClick).toHaveBeenCalledWith(2)

    await user.keyboard(' ')
    expect(handleStepClick).toHaveBeenCalledTimes(2)
    expect(handleStepClick).toHaveBeenCalledWith(2)
  })

  it('does not trigger onStepClick on disabled steps', async () => {
    const handleStepClick = vi.fn()

    render(<Steps steps={sampleSteps} onStepClick={handleStepClick} />)

    expect(
      screen.queryByRole('button', { name: /revisión final/i })
    ).not.toBeInTheDocument()
    expect(screen.getByText('Revisión final')).toBeInTheDocument()
  })

  it('renders nothing when steps list is empty', () => {
    const { container } = render(<Steps steps={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
