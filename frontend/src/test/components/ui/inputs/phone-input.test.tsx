import { beforeAll, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PhoneInput } from '@/components/ui/inputs/phone-input'
import { Field } from '@/components/ui/inputs/field'

beforeAll(() => {
  // cmdk desplaza el ítem activo a la vista; jsdom no implementa scrollIntoView.
  Element.prototype.scrollIntoView = vi.fn()
})

describe('PhoneInput', () => {
  it('starts with the Mexican calling code and names the country trigger', () => {
    render(<PhoneInput />)

    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('+52')
    expect(
      screen.getByRole('button', { name: 'common.country: Mexico' })
    ).toBeDefined()
  })

  it('emits an E.164 value while typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PhoneInput onChange={onChange} />)

    await user.type(screen.getByRole('textbox'), '5512345678')

    expect(onChange).toHaveBeenLastCalledWith('+525512345678')
  })

  it('searches by calling code and switches the country', async () => {
    const user = userEvent.setup()
    render(<PhoneInput />)

    await user.click(screen.getByRole('button', { name: /common.country/ }))
    await user.type(
      screen.getByPlaceholderText('common.search_placeholder'),
      '+34'
    )
    await user.click(screen.getByRole('option', { name: /Spain/ }))

    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('+34')
    expect(
      screen.getByRole('button', { name: 'common.country: Spain' })
    ).toBeDefined()
  })

  it('shows the empty message when no country matches', async () => {
    const user = userEvent.setup()
    render(<PhoneInput />)

    await user.click(screen.getByRole('button', { name: /common.country/ }))
    await user.type(
      screen.getByPlaceholderText('common.search_placeholder'),
      '@@@'
    )

    expect(await screen.findByText('common.no_results')).toBeDefined()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('disables the input and the country trigger', () => {
    render(<PhoneInput disabled />)

    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(
      true
    )
    expect(
      (
        screen.getByRole('button', {
          name: /common.country/,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
  })

  it.each([
    ['disabled', { disabled: true }],
    ['readOnly', { readOnly: true }],
  ])('locks the country trigger inside a %s Field', (_, fieldProps) => {
    render(
      <Field label="Teléfono" {...fieldProps}>
        <PhoneInput />
      </Field>
    )

    expect(
      screen.getByRole('button', { name: /common.country/ })
    ).toBeDisabled()
  })

  it('takes label and error state from Field', () => {
    render(
      <Field label="Teléfono" error="Número inválido">
        <PhoneInput />
      </Field>
    )

    const input = screen.getByRole('textbox', { name: 'Teléfono' })
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })
})
