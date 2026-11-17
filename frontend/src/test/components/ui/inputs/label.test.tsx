import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/inputs/label'

function renderFormLabel(props: {
  step?: string | number
  required?: boolean
}) {
  return render(
    <>
      <Label variant="form" htmlFor="sender" {...props}>
        Remitente
      </Label>
      <input id="sender" />
    </>
  )
}

describe('Label', () => {
  it('defaults to the legacy variant and still associates by htmlFor', () => {
    render(
      <>
        <Label htmlFor="legacy-input">Nombre</Label>
        <input id="legacy-input" />
      </>
    )

    const label = screen.getByText('Nombre')
    expect(label.getAttribute('data-variant')).toBe('legacy')
    expect(screen.getByLabelText('Nombre').getAttribute('id')).toBe(
      'legacy-input'
    )
  })

  it('renders the form variant without an index when step is omitted', () => {
    const { container } = renderFormLabel({})

    expect(screen.getByText('Remitente').getAttribute('data-variant')).toBe(
      'form'
    )
    expect(container.querySelector('[data-slot="label-step"]')).toBeNull()
    expect(screen.getByRole('textbox', { name: 'Remitente' })).toBeDefined()
  })

  it('shows a padded decorative index that is not part of the accessible name', () => {
    renderFormLabel({ step: 1 })

    const index = screen.getByText('01')
    expect(index.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByRole('textbox', { name: 'Remitente' })).toBeDefined()
  })

  it('formats numeric and string steps the same way', () => {
    const { unmount } = renderFormLabel({ step: 3 })
    expect(screen.getByText('03')).toBeDefined()
    unmount()

    renderFormLabel({ step: '3' })
    expect(screen.getByText('03')).toBeDefined()
  })

  it('keeps steps that already have two digits', () => {
    renderFormLabel({ step: 12 })

    expect(screen.getByText('12')).toBeDefined()
  })

  it('still names a disabled control', () => {
    render(
      <>
        <Label variant="form" htmlFor="channel" step={3}>
          Canal
        </Label>
        <input id="channel" disabled />
      </>
    )

    const input = screen.getByRole('textbox', { name: 'Canal' })
    expect(input.hasAttribute('disabled')).toBe(true)
  })

  it('keeps long text whole in the accessible name', () => {
    const text =
      'Una etiqueta muy larga que debería envolver sin montarse sobre el índice'
    render(
      <>
        <Label variant="form" htmlFor="long" step={4}>
          {text}
        </Label>
        <input id="long" />
      </>
    )

    expect(screen.getByRole('textbox', { name: text })).toBeDefined()
  })

  it('marks required with a hidden asterisk and keeps the name as the text', () => {
    renderFormLabel({ step: '02', required: true })

    expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByRole('textbox', { name: 'Remitente' })).toBeDefined()
  })
})
