import { cva, type VariantProps } from 'class-variance-authority'
import { useTranslation } from 'react-i18next'

import {
  BUTTON_GLYPH,
  describeMedia,
  MEDIA_LABEL_KEY,
} from '@/components/ui/lib/message-preview'
import { cn } from '@/lib/utils'
import type {
  PreviewButton,
  PreviewListItem,
  PreviewMedia,
  TextPart,
} from '@/types/message-preview'

const mediaRatioVariants = cva('', {
  variants: {
    ratio: {
      wide: 'aspect-video',
      card: 'aspect-[4/3]',
    },
  },
  defaultVariants: {
    ratio: 'wide',
  },
})

const previewButtonVariants = cva(
  'block border-line text-center font-semibold text-info not-first:border-t',
  {
    variants: {
      size: {
        default: 'px-3 py-2 text-sm',
        compact: 'px-2 py-1.5 text-xs',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

function PreviewText({
  parts,
  className,
}: {
  parts: TextPart[]
  className?: string
}) {
  return (
    <p className={cn('break-words whitespace-pre-wrap', className)}>
      {parts.map((part, index) =>
        part.kind === 'variable' ? (
          <span key={index} className="font-semibold text-signal-contrast">
            {part.value}
          </span>
        ) : (
          part.value
        )
      )}
    </p>
  )
}

function PreviewMediaBlock({
  media,
  ratio,
}: VariantProps<typeof mediaRatioVariants> & { media: PreviewMedia }) {
  const { t } = useTranslation()
  const kindLabel = t(MEDIA_LABEL_KEY[media.kind])
  const display = describeMedia(media)
  const ratioClass = mediaRatioVariants({ ratio })

  if (display.as === 'image') {
    return (
      <img
        src={display.url}
        alt={t('message_preview.media_alt')}
        loading="lazy"
        className={cn('w-full bg-selection object-cover', ratioClass)}
      />
    )
  }
  if (display.as === 'video') {
    return (
      <video
        src={display.url}
        controls
        preload="metadata"
        aria-label={kindLabel}
        className={cn('w-full bg-selection', ratioClass)}
      />
    )
  }
  if (display.as === 'document') {
    return (
      <div className="flex items-center gap-2 rounded-control border border-line bg-selection px-2.5 py-2 text-xs">
        <span className="flex-none rounded-[4px] bg-signal px-1.5 py-0.5 font-mono tracking-wider text-on-signal">
          {display.ext ?? kindLabel}
        </span>
        <span className="min-w-0 truncate">{display.name ?? kindLabel}</span>
        {display.sizeLabel && (
          <span className="ml-auto flex-none font-mono text-muted">
            {display.sizeLabel}
          </span>
        )}
      </div>
    )
  }
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1 border border-dashed border-line-strong bg-selection font-mono text-xs tracking-widest text-muted uppercase',
        ratioClass
      )}
    >
      <span aria-hidden="true" className="text-sm">
        ◫
      </span>
      <span>{display.ext ? `${kindLabel} · ${display.ext}` : kindLabel}</span>
    </div>
  )
}

function PreviewList({ items }: { items: PreviewListItem[] }) {
  const { t } = useTranslation()
  return (
    <ul
      aria-label={t('message_preview.list_options')}
      className="mt-2 overflow-hidden rounded-control border border-line bg-card"
    >
      {items.map((item, index) => (
        <li
          key={`${item.title}-${index}`}
          className="border-line px-2.5 py-1.5 text-xs not-first:border-t"
        >
          <span className="block font-semibold">{item.title}</span>
          {item.description && (
            <span className="block text-muted">{item.description}</span>
          )}
        </li>
      ))}
    </ul>
  )
}

function PreviewButtons({
  buttons,
  className,
  size,
}: VariantProps<typeof previewButtonVariants> & {
  buttons: PreviewButton[]
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <ul
      aria-label={t('message_preview.buttons')}
      className={cn('border-t border-line', className)}
    >
      {buttons.map((button, index) => (
        <li
          key={`${button.kind}-${index}`}
          className={previewButtonVariants({ size })}
        >
          <span aria-hidden="true" className="mr-1.5 font-mono text-xs">
            {BUTTON_GLYPH[button.kind]}
          </span>
          {button.label}
        </li>
      ))}
    </ul>
  )
}

export { PreviewButtons, PreviewList, PreviewMediaBlock, PreviewText }
