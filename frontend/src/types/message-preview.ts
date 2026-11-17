export type PreviewChannel = 'sms' | 'whatsapp' | 'rcs'

export type PreviewDirection = 'outbound' | 'inbound'

export type PreviewVariant = 'template' | 'conversation'

export type PreviewMediaKind = 'image' | 'video' | 'document' | 'unknown'

export interface PreviewMedia {
  kind: PreviewMediaKind
  url?: string
  name?: string
  sizeLabel?: string
}

export type PreviewButtonKind =
  | 'quick_reply'
  | 'url'
  | 'phone'
  | 'copy_code'
  | 'list'

export interface PreviewButton {
  kind: PreviewButtonKind
  label: string
}

export interface PreviewCard {
  media?: PreviewMedia
  title?: string
  body?: string
  buttons: PreviewButton[]
}

export interface PreviewListItem {
  title: string
  description?: string
}

export interface MessagePreviewModel {
  channel?: PreviewChannel
  variant: PreviewVariant
  direction: PreviewDirection
  media?: PreviewMedia
  title?: string
  body?: string
  footer?: string
  listItems?: PreviewListItem[]
  buttons: PreviewButton[]
  cards: PreviewCard[]
}

export interface TextPart {
  kind: 'text' | 'variable'
  value: string
}

export type BubbleTone = 'whatsapp' | 'outbound' | 'inbound'

export type MediaDisplay =
  | { as: 'image'; url: string }
  | { as: 'video'; url: string }
  | { as: 'document'; name?: string; ext?: string; sizeLabel?: string }
  | { as: 'placeholder'; ext?: string }

export interface MessagePreviewView {
  tone: BubbleTone
  hasContent: boolean
  title?: TextPart[]
  body?: TextPart[]
  footer?: TextPart[]
  media?: PreviewMedia
  listItems: PreviewListItem[]
  buttons: PreviewButton[]
  cards: (Omit<PreviewCard, 'body'> & { body?: TextPart[] })[]
}
