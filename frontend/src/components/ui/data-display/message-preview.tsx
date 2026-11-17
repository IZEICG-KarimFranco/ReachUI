import type { ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import { useTranslation } from 'react-i18next'

import { EmptyState } from '@/components/ui/feedback/empty'
import { useMessagePreview } from '@/components/ui/hooks/use-message-preview'
import {
  PreviewButtons,
  PreviewList,
  PreviewMediaBlock,
  PreviewText,
} from '@/components/ui/data-display/message-preview-parts'
import { cn } from '@/lib/utils'
import type {
  MessagePreviewModel,
  MessagePreviewView,
} from '@/types/message-preview'

const bubbleVariants = cva(
  'max-w-[88%] overflow-hidden rounded-surface border px-3 py-2.5 text-sm leading-normal text-ink',
  {
    variants: {
      tone: {
        whatsapp: 'rounded-br-[4px] border-success/30 bg-success/10',
        outbound: 'self-end rounded-br-[4px] border-signal/40 bg-signal/15',
        inbound: 'self-start rounded-bl-[4px] border-line-strong bg-card',
      },
    },
  }
)

const bubbleMetaVariants = cva(
  'mt-1.5 text-right font-mono text-xs tracking-wider',
  {
    variants: {
      tone: {
        whatsapp: 'text-muted',
        outbound: 'text-signal-contrast',
        inbound: 'text-muted',
      },
    },
  }
)

type MessageBubbleProps = {
  message: MessagePreviewModel | null | undefined
  meta?: ReactNode
  className?: string
}

type MessagePreviewProps = MessageBubbleProps & {
  caption?: string
  emptyLabel?: string
}

function BubbleView({
  view,
  meta,
  className,
}: {
  view: MessagePreviewView
  meta?: ReactNode
  className?: string
}) {
  const { t } = useTranslation()

  return (
    <div
      data-slot="message-bubble"
      data-tone={view.tone}
      className={cn(bubbleVariants({ tone: view.tone }), className)}
    >
      {view.media && (
        <div className="-mx-3 -mt-2.5 mb-2 overflow-hidden">
          <PreviewMediaBlock media={view.media} />
        </div>
      )}
      {view.title && <PreviewText parts={view.title} className="font-bold" />}
      {view.body && <PreviewText parts={view.body} />}
      {view.footer && (
        <PreviewText parts={view.footer} className="mt-1 text-xs text-muted" />
      )}
      {view.listItems.length > 0 && <PreviewList items={view.listItems} />}
      {view.cards.length > 0 && (
        <div
          role="region"
          tabIndex={0}
          aria-label={t('message_preview.carousel')}
          className="-mx-3 mt-1.5 overflow-x-auto px-3 pb-1"
        >
          <ul className="flex gap-2">
            {view.cards.map((card, index) => (
              <li
                key={`card-${index}`}
                className="w-37 flex-none overflow-hidden rounded-control border border-line bg-card"
              >
                {card.media && (
                  <PreviewMediaBlock media={card.media} ratio="card" />
                )}
                {card.title && (
                  <p className="px-2.5 pt-2 text-xs font-bold">{card.title}</p>
                )}
                {card.body && (
                  <PreviewText
                    parts={card.body}
                    className="px-2.5 py-2 text-xs leading-snug"
                  />
                )}
                {card.buttons.length > 0 && (
                  <PreviewButtons buttons={card.buttons} size="compact" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {meta && (
        <div className={bubbleMetaVariants({ tone: view.tone })}>{meta}</div>
      )}
      {view.buttons.length > 0 && (
        <PreviewButtons
          buttons={view.buttons}
          className="-mx-3 mt-2.5 -mb-2.5"
        />
      )}
    </div>
  )
}

function MessageBubble({ message, meta, className }: MessageBubbleProps) {
  const view = useMessagePreview(message)
  return view && (view.hasContent || meta) ? (
    <BubbleView view={view} meta={meta} className={className} />
  ) : null
}

function MessagePreview({
  message,
  meta,
  caption,
  emptyLabel,
  className,
}: MessagePreviewProps) {
  const { t } = useTranslation()
  const view = useMessagePreview(message)

  return (
    <figure
      data-slot="message-preview"
      aria-label={t('message_preview.aria_label')}
      className={cn(
        'flex w-full max-w-90 flex-col gap-2 rounded-control border border-line bg-inset p-3.5',
        className
      )}
    >
      {caption && (
        <figcaption className="self-center text-center text-xs text-muted">
          {caption}
        </figcaption>
      )}
      {view?.hasContent ? (
        <BubbleView view={view} meta={meta} />
      ) : (
        <EmptyState title={emptyLabel ?? t('twilio.template_preview.empty')} />
      )}
    </figure>
  )
}

export { MessageBubble, MessagePreview }
