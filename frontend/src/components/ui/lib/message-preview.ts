import type {
  BubbleTone,
  MediaDisplay,
  MessagePreviewModel,
  PreviewButtonKind,
  PreviewMedia,
  PreviewMediaKind,
  TextPart,
} from '@/types/message-preview'

const PLACEHOLDER_SPLIT = /(\{\{\s*[\w.-]+\s*\}\})/
const PLACEHOLDER_ONLY = /^\{\{\s*[\w.-]+\s*\}\}$/

export function splitVariables(text: string): TextPart[] {
  return text
    .split(PLACEHOLDER_SPLIT)
    .filter((part) => part !== '')
    .map((part) => ({
      kind: PLACEHOLDER_ONLY.test(part) ? 'variable' : 'text',
      value: part,
    }))
}

export function bubbleTone(
  message: Pick<MessagePreviewModel, 'channel' | 'variant' | 'direction'>
): BubbleTone {
  if (message.direction === 'inbound') return 'inbound'
  if (message.variant === 'template' && message.channel === 'whatsapp') {
    return 'whatsapp'
  }
  return 'outbound'
}

export const BUTTON_GLYPH: Record<PreviewButtonKind, string> = {
  quick_reply: '↩',
  url: '↗',
  phone: '☎',
  copy_code: '⧉',
  list: '☰',
}

export const MEDIA_LABEL_KEY = {
  image: 'template_types.image',
  video: 'template_types.video',
  document: 'template_types.document',
  unknown: 'message_preview.media.unknown',
} as const satisfies Record<PreviewMediaKind, string>

function isRenderableUrl(url?: string): url is string {
  if (!url) return false
  try {
    return ['http:', 'https:'].includes(new URL(url).protocol)
  } catch {
    return false
  }
}

function fileExtension(name?: string) {
  const ext = name?.split('?')[0].split('.').pop()
  return ext && ext !== name ? ext.toUpperCase() : undefined
}

export function describeMedia(media: PreviewMedia): MediaDisplay {
  if (media.kind === 'image' && isRenderableUrl(media.url)) {
    return { as: 'image', url: media.url }
  }
  if (media.kind === 'video' && isRenderableUrl(media.url)) {
    return { as: 'video', url: media.url }
  }
  if (media.kind === 'document') {
    const name = media.name ?? media.url?.split('/').pop()
    return {
      as: 'document',
      name,
      ext: fileExtension(name),
      sizeLabel: media.sizeLabel,
    }
  }
  return { as: 'placeholder', ext: fileExtension(media.url) }
}

export function hasContent(message: MessagePreviewModel) {
  return Boolean(
    message.media ||
    message.title ||
    message.body ||
    message.footer ||
    message.listItems?.length ||
    message.buttons.length ||
    message.cards.length
  )
}
