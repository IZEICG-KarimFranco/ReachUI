import { MessagePreview } from '@/components/ui/data-display/message-preview'
import type { PreviewChannel } from '@/types/message-preview'
import { useTwilioMessagePreview } from '@/hooks/use-twilio-message-preview'
import type { PreviewTemplateSource } from '@/lib/twilio-message-preview'

export function TemplateMessagePreview({
  templateData,
  variables,
  channel,
  category,
  className,
}: {
  templateData: PreviewTemplateSource | null | undefined
  variables?: Record<string, string>
  channel?: PreviewChannel
  category?: string
  className?: string
}) {
  const { message, caption, meta } = useTwilioMessagePreview(templateData, {
    variables,
    channel,
    category,
  })

  return (
    <MessagePreview
      message={message}
      caption={caption}
      meta={meta}
      className={className}
    />
  )
}
