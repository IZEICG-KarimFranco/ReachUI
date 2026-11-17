import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'

import { useMessagePreview } from '@/components/ui/hooks/use-message-preview'
import type { MessagePreviewModel } from '@/types/message-preview'

const base: MessagePreviewModel = {
  channel: 'whatsapp',
  variant: 'template',
  direction: 'outbound',
  buttons: [],
  cards: [],
}

describe('useMessagePreview', () => {
  it('devuelve null sin mensaje', () => {
    const { result } = renderHook(() => useMessagePreview(null))
    expect(result.current).toBeNull()
  })

  it('indica que no hay contenido para un mensaje vacío', () => {
    const { result } = renderHook(() => useMessagePreview(base))
    expect(result.current?.hasContent).toBe(false)
    expect(result.current?.listItems).toEqual([])
  })

  it('separa las variables del título, cuerpo, pie y tarjetas', () => {
    const { result } = renderHook(() =>
      useMessagePreview({
        ...base,
        title: 'Hola {{1}}',
        body: 'Pedido {{2}} listo',
        footer: 'Responde STOP',
        cards: [{ body: 'Talla {{3}}', buttons: [] }],
      })
    )

    expect(result.current?.hasContent).toBe(true)
    expect(result.current?.title).toEqual([
      { kind: 'text', value: 'Hola ' },
      { kind: 'variable', value: '{{1}}' },
    ])
    expect(result.current?.body?.[1]).toEqual({
      kind: 'variable',
      value: '{{2}}',
    })
    expect(result.current?.footer).toEqual([
      { kind: 'text', value: 'Responde STOP' },
    ])
    expect(result.current?.cards[0].body?.[1]).toEqual({
      kind: 'variable',
      value: '{{3}}',
    })
  })

  it('asigna el tono según canal, variante y dirección', () => {
    const tone = (message: MessagePreviewModel) =>
      renderHook(() => useMessagePreview({ ...message, body: 'x' })).result
        .current?.tone

    expect(tone(base)).toBe('whatsapp')
    expect(tone({ ...base, channel: undefined })).toBe('outbound')
    expect(tone({ ...base, variant: 'conversation' })).toBe('outbound')
    expect(tone({ ...base, direction: 'inbound' })).toBe('inbound')
  })
})
