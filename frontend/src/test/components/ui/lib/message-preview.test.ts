import { describe, expect, it } from 'vitest'

import {
  bubbleTone,
  describeMedia,
  hasContent,
  MEDIA_LABEL_KEY,
  splitVariables,
} from '@/components/ui/lib/message-preview'
import type { MessagePreviewModel } from '@/types/message-preview'

const base: MessagePreviewModel = {
  channel: 'whatsapp',
  variant: 'template',
  direction: 'outbound',
  buttons: [],
  cards: [],
}

describe('splitVariables', () => {
  it('separa texto y variables sin perder contenido', () => {
    expect(splitVariables('Hola {{nombre}}, pedido {{ 2 }}.')).toEqual([
      { kind: 'text', value: 'Hola ' },
      { kind: 'variable', value: '{{nombre}}' },
      { kind: 'text', value: ', pedido ' },
      { kind: 'variable', value: '{{ 2 }}' },
      { kind: 'text', value: '.' },
    ])
  })

  it('no marca llaves incompletas como variables', () => {
    expect(splitVariables('Hola {{nombre')).toEqual([
      { kind: 'text', value: 'Hola {{nombre' },
    ])
  })
})

describe('bubbleTone', () => {
  it('distingue entrante, plantilla de WhatsApp y saliente neutro', () => {
    expect(bubbleTone({ ...base, direction: 'inbound' })).toBe('inbound')
    expect(bubbleTone(base)).toBe('whatsapp')
    expect(bubbleTone({ ...base, channel: 'sms' })).toBe('outbound')
    expect(bubbleTone({ ...base, channel: undefined })).toBe('outbound')
    expect(bubbleTone({ ...base, variant: 'conversation' })).toBe('outbound')
  })
})

describe('describeMedia', () => {
  it('muestra imagen y video solo con URL http(s) válida', () => {
    expect(
      describeMedia({ kind: 'image', url: 'https://cdn.test/a.jpg' })
    ).toEqual({ as: 'image', url: 'https://cdn.test/a.jpg' })
    expect(
      describeMedia({ kind: 'video', url: 'https://cdn.test/a.mp4' })
    ).toEqual({ as: 'video', url: 'https://cdn.test/a.mp4' })
    expect(describeMedia({ kind: 'image', url: '{{1}}.jpg' })).toEqual({
      as: 'placeholder',
      ext: 'JPG',
    })
  })

  it('obtiene nombre y extensión del documento desde la URL', () => {
    expect(
      describeMedia({
        kind: 'document',
        url: 'https://cdn.test/files/factura.pdf?token=1',
      })
    ).toEqual({
      as: 'document',
      name: 'factura.pdf?token=1',
      ext: 'PDF',
      sizeLabel: undefined,
    })
  })

  it('usa placeholder para archivos desconocidos', () => {
    expect(describeMedia({ kind: 'unknown' })).toEqual({
      as: 'placeholder',
      ext: undefined,
    })
  })
})

describe('hasContent', () => {
  it('detecta cualquier parte visible del mensaje', () => {
    expect(hasContent(base)).toBe(false)
    expect(hasContent({ ...base, body: 'Hola' })).toBe(true)
    expect(hasContent({ ...base, listItems: [{ title: 'A' }] })).toBe(true)
    expect(
      hasContent({ ...base, buttons: [{ kind: 'url', label: 'Ver' }] })
    ).toBe(true)
  })
})

describe('MEDIA_LABEL_KEY', () => {
  it('reutiliza las claves de tipos de plantilla', () => {
    expect(MEDIA_LABEL_KEY).toEqual({
      image: 'template_types.image',
      video: 'template_types.video',
      document: 'template_types.document',
      unknown: 'message_preview.media.unknown',
    })
  })
})
