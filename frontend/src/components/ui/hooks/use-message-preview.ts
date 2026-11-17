import { useMemo } from 'react'
import type {
  MessagePreviewModel,
  MessagePreviewView,
} from '@/types/message-preview'
import {
  bubbleTone,
  hasContent,
  splitVariables,
} from '@/components/ui/lib/message-preview'

export function useMessagePreview(
  message: MessagePreviewModel | null | undefined
): MessagePreviewView | null {
  return useMemo(() => {
    if (!message) return null
    const split = (text?: string) => (text ? splitVariables(text) : undefined)
    return {
      tone: bubbleTone(message),
      hasContent: hasContent(message),
      title: split(message.title),
      body: split(message.body),
      footer: split(message.footer),
      media: message.media,
      listItems: message.listItems ?? [],
      buttons: message.buttons,
      cards: message.cards.map((card) => ({ ...card, body: split(card.body) })),
    }
  }, [message])
}
