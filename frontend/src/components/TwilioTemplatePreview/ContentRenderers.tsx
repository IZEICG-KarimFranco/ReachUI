import React from 'react'
import { Button } from '@/components/ui/actions/button'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import type {
  Header,
  Body,
  QuickReplyButton,
  CTAButton,
  ListPickerItem,
  ListPickerSection,
  PreviewMode,
} from '../../types/content-twilio'
import {
  getPlaceholder,
  isValidMediaUrl,
  detectMediaType,
  replaceVariables,
} from '../../lib/content-twilio'

interface RendererProps<T> {
  item?: T
  mode: PreviewMode
  variables?: Record<string, string>
}

export const TextHeaderRenderer: React.FC<RendererProps<Header>> = ({
  item: header,
  mode,
  variables,
}) => {
  const { t } = useTranslation()
  const text = replaceVariables(
    header?.text,
    variables,
    getPlaceholder(mode, 'header', {
      header: t('twilio.template_preview.placeholders.header'),
      body: t('twilio.template_preview.placeholders.body'),
      footer: t('twilio.template_preview.placeholders.footer'),
      button: t('twilio.template_preview.placeholders.button'),
      default: t('twilio.template_preview.placeholders.default'),
      media: t('twilio.template_preview.placeholders.media'),
    })
  )
  const isPlaceholder = !header?.text && mode === 'builder'
  return (
    <div
      className={cn(
        'px-4 py-2 bg-card/60 text-card-foreground text-center font-semibold text-sm',
        isPlaceholder &&
          'border-b border-dashed border-warning/60 text-muted-foreground italic'
      )}
    >
      {text}
    </div>
  )
}

export const MediaHeaderRenderer: React.FC<RendererProps<Header>> = ({
  item: header,
  mode,
}) => {
  const { t } = useTranslation()
  const url = header?.media_url
  if (!url || !isValidMediaUrl(url)) {
    return (
      <div
        className={cn(
          'px-4 py-8 bg-muted text-muted-foreground text-center text-sm border-b',
          mode === 'builder' && 'border-dashed border-warning/60'
        )}
      >
        {mode === 'builder'
          ? getPlaceholder(mode, 'media', {
              header: t('twilio.template_preview.placeholders.header'),
              body: t('twilio.template_preview.placeholders.body'),
              footer: t('twilio.template_preview.placeholders.footer'),
              button: t('twilio.template_preview.placeholders.button'),
              default: t('twilio.template_preview.placeholders.default'),
              media: t('twilio.template_preview.placeholders.media'),
            })
          : ''}
      </div>
    )
  }
  const type = detectMediaType(url)
  if (type === 'image') {
    return (
      <img
        src={url}
        alt={t('twilio.template_preview.media_alt')}
        className="w-full object-cover"
      />
    )
  }
  if (type === 'video') {
    return <video src={url} controls className="w-full" />
  }
  return (
    <div className="px-4 py-2 bg-muted text-muted-foreground text-center text-sm">
      {t('twilio.template_preview.document_attachment')}
    </div>
  )
}

export const BodyRenderer: React.FC<RendererProps<Body>> = ({
  item: body,
  mode,
  variables,
}) => {
  const { t } = useTranslation()
  const text = replaceVariables(
    body?.text,
    variables,
    getPlaceholder(mode, 'body', {
      header: t('twilio.template_preview.placeholders.header'),
      body: t('twilio.template_preview.placeholders.body'),
      footer: t('twilio.template_preview.placeholders.footer'),
      button: t('twilio.template_preview.placeholders.button'),
      default: t('twilio.template_preview.placeholders.default'),
      media: t('twilio.template_preview.placeholders.media'),
    })
  )
  const isPlaceholder = !body?.text && mode === 'builder'
  return (
    <div
      className={cn(
        'px-2 py-1 border-t border-border text-foreground text-sm whitespace-pre-wrap',
        isPlaceholder &&
          'border-dashed border-warning/60 text-muted-foreground italic'
      )}
    >
      {text}
    </div>
  )
}

export const QuickReplyRenderer: React.FC<{
  button?: QuickReplyButton
  mode: PreviewMode
}> = ({ button, mode }) => {
  const { t } = useTranslation()
  const text =
    button?.text ||
    getPlaceholder(mode, 'button', {
      header: t('twilio.template_preview.placeholders.header'),
      body: t('twilio.template_preview.placeholders.body'),
      footer: t('twilio.template_preview.placeholders.footer'),
      button: t('twilio.template_preview.placeholders.button'),
      default: t('twilio.template_preview.placeholders.default'),
      media: t('twilio.template_preview.placeholders.media'),
    })
  const isPlaceholder = !button?.text && mode === 'builder'
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        'rounded-full flex-1',
        isPlaceholder && 'italic border-dashed'
      )}
      title={t('twilio.template_preview.button_preview')}
      onClick={(e) => e.preventDefault()}
    >
      {text}
    </Button>
  )
}

export const CTARenderer: React.FC<{
  button?: CTAButton
  mode: PreviewMode
}> = ({ button, mode }) => {
  const { t } = useTranslation()
  const text =
    button?.text ||
    getPlaceholder(mode, 'button', {
      header: t('twilio.template_preview.placeholders.header'),
      body: t('twilio.template_preview.placeholders.body'),
      footer: t('twilio.template_preview.placeholders.footer'),
      button: t('twilio.template_preview.placeholders.button'),
      default: t('twilio.template_preview.placeholders.default'),
      media: t('twilio.template_preview.placeholders.media'),
    })
  const isPlaceholder = !button?.text && mode === 'builder'
  return (
    <Button
      variant="default"
      className={cn('w-full', isPlaceholder && 'italic')}
      title={t('twilio.template_preview.button_preview')}
      onClick={(e) => e.preventDefault()}
    >
      {text}
    </Button>
  )
}

export const ListPickerItemRenderer: React.FC<{
  item: ListPickerItem
  mode: PreviewMode
  selected?: boolean
}> = ({ item, mode, selected = false }) => {
  const { t } = useTranslation()
  const title =
    item.title ||
    getPlaceholder(mode, 'default', {
      header: t('twilio.template_preview.placeholders.header'),
      body: t('twilio.template_preview.placeholders.body'),
      footer: t('twilio.template_preview.placeholders.footer'),
      button: t('twilio.template_preview.placeholders.button'),
      default: t('twilio.template_preview.placeholders.default'),
      media: t('twilio.template_preview.placeholders.media'),
    })
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2 rounded-lg border',
        selected ? 'bg-muted/40 border-primary' : 'bg-card border-border'
      )}
    >
      {item.image_url && isValidMediaUrl(item.image_url) && (
        <img
          src={item.image_url}
          alt={item.title}
          className="h-10 w-10 rounded object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            'text-sm font-medium truncate',
            selected ? 'text-card-foreground' : 'text-foreground'
          )}
        >
          {title}
        </div>
        {item.description && (
          <div className="text-xs text-muted-foreground truncate">
            {item.description}
          </div>
        )}
      </div>
    </div>
  )
}

export const ListPickerSectionRenderer: React.FC<{
  section: ListPickerSection
  mode: PreviewMode
}> = ({ section, mode }) => {
  const { t } = useTranslation()
  const rows = section.rows ?? []
  return (
    <div className="space-y-1">
      {section.title && (
        <div className="text-xs font-semibold text-muted-foreground">
          {section.title}
        </div>
      )}
      <div className="space-y-1 divide-y divide-border">
        {rows.length > 0 ? (
          rows.map((row, idx) => (
            <ListPickerItemRenderer key={idx} item={row} mode={mode} />
          ))
        ) : mode === 'builder' ? (
          <div className="py-2 text-xs text-muted-foreground italic">
            {getPlaceholder(mode, 'default', {
              header: t('twilio.template_preview.placeholders.header'),
              body: t('twilio.template_preview.placeholders.body'),
              footer: t('twilio.template_preview.placeholders.footer'),
              button: t('twilio.template_preview.placeholders.button'),
              default: t('twilio.template_preview.placeholders.default'),
              media: t('twilio.template_preview.placeholders.media'),
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export const ListPickerRenderer: React.FC<{
  sections?: ListPickerSection[]
  buttonText?: string
  mode: PreviewMode
}> = ({ sections, buttonText, mode }) => {
  const { t } = useTranslation()
  return (
    <div className="space-y-3">
      {sections && (
        <div className="p-2 flex flex-col gap-3 bg-muted rounded-lg border border-border">
          {sections.length > 0 ? (
            sections.map((sec, idx) => (
              <ListPickerSectionRenderer key={idx} section={sec} mode={mode} />
            ))
          ) : mode === 'builder' ? (
            <div className="text-xs text-muted-foreground italic">
              {getPlaceholder(mode, 'default', {
                header: t('twilio.template_preview.placeholders.header'),
                body: t('twilio.template_preview.placeholders.body'),
                footer: t('twilio.template_preview.placeholders.footer'),
                button: t('twilio.template_preview.placeholders.button'),
                default: t('twilio.template_preview.placeholders.default'),
                media: t('twilio.template_preview.placeholders.media'),
              })}
            </div>
          ) : null}
        </div>
      )}
      {buttonText && (
        <Button
          variant="default"
          size="sm"
          className={cn(
            'w-full',
            !buttonText && mode === 'builder' && 'italic'
          )}
        >
          {buttonText ||
            getPlaceholder(mode, 'button', {
              header: t('twilio.template_preview.placeholders.header'),
              body: t('twilio.template_preview.placeholders.body'),
              footer: t('twilio.template_preview.placeholders.footer'),
              button: t('twilio.template_preview.placeholders.button'),
              default: t('twilio.template_preview.placeholders.default'),
              media: t('twilio.template_preview.placeholders.media'),
            })}
        </Button>
      )}
    </div>
  )
}
