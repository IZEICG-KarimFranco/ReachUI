import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import {
  MessageBubble,
  MessagePreview,
} from '@/components/ui/data-display/message-preview'
import type { MessagePreviewModel } from '@/types/message-preview'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'es' } }),
}))

const base: MessagePreviewModel = {
  channel: 'whatsapp',
  variant: 'template',
  direction: 'outbound',
  buttons: [],
  cards: [],
}

describe('MessagePreview', () => {
  it('muestra caption, cuerpo y meta dentro de una figura accesible', () => {
    render(
      <MessagePreview
        caption="WhatsApp · quick replies"
        meta="Plantilla · MARKETING"
        message={{ ...base, title: 'Confirmación de cita', body: 'Hola' }}
      />
    )

    expect(
      screen.getByRole('figure', { name: 'message_preview.aria_label' })
    ).toBeDefined()
    expect(screen.getByText('WhatsApp · quick replies')).toBeDefined()
    expect(screen.getByText('Confirmación de cita')).toBeDefined()
    expect(screen.getByText('Plantilla · MARKETING')).toBeDefined()
  })

  it('resalta las variables sin resolver en lugar de inventar datos', () => {
    render(
      <MessagePreview
        message={{ ...base, body: 'Hola {{nombre}}, tu pedido está listo' }}
      />
    )
    const variable = screen.getByText('{{nombre}}')
    expect(variable.tagName).toBe('SPAN')
    expect(variable.className).toContain('text-signal-contrast')
  })

  it('es de solo lectura: los botones del mensaje no son controles', () => {
    render(
      <MessagePreview
        message={{
          ...base,
          body: '¿Confirmas?',
          buttons: [
            { kind: 'quick_reply', label: 'Confirmar' },
            { kind: 'url', label: 'Rastrear pedido' },
          ],
        }}
      />
    )
    const list = screen.getByRole('list', { name: 'message_preview.buttons' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('muestra un placeholder cuando la media no tiene URL válida', () => {
    render(
      <MessagePreview
        message={{
          ...base,
          body: 'Nueva colección',
          media: { kind: 'image', url: '{{1}}.jpg' },
        }}
      />
    )
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText(/template_types\.image/)).toBeDefined()
  })

  it('muestra la imagen cuando la URL es válida', () => {
    render(
      <MessagePreview
        message={{
          ...base,
          media: { kind: 'image', url: 'https://cdn.example.com/a.jpg' },
        }}
      />
    )
    expect(
      screen.getByRole('img', { name: 'message_preview.media_alt' })
    ).toBeDefined()
  })

  it('muestra documentos con su extensión y nombre', () => {
    render(
      <MessagePreview
        message={{
          ...base,
          body: 'Tu factura',
          media: {
            kind: 'document',
            name: 'factura_marzo.pdf',
            sizeLabel: '240 KB',
          },
        }}
      />
    )
    expect(screen.getByText('PDF')).toBeDefined()
    expect(screen.getByText('factura_marzo.pdf')).toBeDefined()
    expect(screen.getByText('240 KB')).toBeDefined()
  })

  it('el carrusel es una región desplazable alcanzable con teclado', () => {
    render(
      <MessagePreview
        message={{
          ...base,
          body: 'Novedades',
          cards: [
            { body: 'Chamarra', buttons: [{ kind: 'url', label: 'Ver' }] },
            { body: 'Sneakers', buttons: [] },
          ],
        }}
      />
    )
    const region = screen.getByRole('region', {
      name: 'message_preview.carousel',
    })
    expect(region.getAttribute('tabindex')).toBe('0')
    expect(within(region).getByText('Chamarra')).toBeDefined()
  })

  it('muestra el estado vacío cuando no hay contenido', () => {
    render(<MessagePreview message={null} />)
    expect(screen.getByText('twilio.template_preview.empty')).toBeDefined()
  })
})

describe('MessageBubble', () => {
  it('usa el tono de WhatsApp para plantillas y de dirección en conversación', () => {
    const { rerender, container } = render(
      <MessageBubble message={{ ...base, body: 'Plantilla' }} />
    )
    expect(container.firstElementChild?.className).toContain('bg-success/10')

    rerender(
      <MessageBubble
        message={{ ...base, variant: 'conversation', body: 'Hola' }}
      />
    )
    expect(container.firstElementChild?.className).toContain('bg-signal/15')

    rerender(
      <MessageBubble
        message={{
          ...base,
          variant: 'conversation',
          direction: 'inbound',
          body: 'Hola',
        }}
      />
    )
    expect(container.firstElementChild?.className).toContain('self-start')
  })

  it('usa el tono saliente neutro cuando la plantilla no tiene canal', () => {
    const { container } = render(
      <MessageBubble
        message={{ ...base, channel: undefined, body: 'Texto multicanal' }}
      />
    )
    expect(container.firstElementChild?.className).toContain('bg-signal/15')
  })

  it('no renderiza nada sin contenido ni metadatos', () => {
    const { container } = render(<MessageBubble message={{ ...base }} />)
    expect(container.firstChild).toBeNull()
  })

  it('conserva la meta aunque el mensaje no tenga texto', () => {
    render(<MessageBubble message={{ ...base }} meta="09:30 ✓✓" />)
    expect(screen.getByText('09:30 ✓✓')).toBeDefined()
  })

  it('muestra las opciones de una lista', () => {
    render(
      <MessagePreview
        message={{
          ...base,
          body: 'Elige una sucursal',
          listItems: [
            { title: 'Centro', description: 'Abierto hasta las 18:00' },
            { title: 'Norte' },
          ],
          buttons: [{ kind: 'list', label: 'Ver sucursales' }],
        }}
      />
    )
    const list = screen.getByRole('list', {
      name: 'message_preview.list_options',
    })
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(within(list).getByText('Abierto hasta las 18:00')).toBeDefined()
  })
})
