/**
 * COMPONENTE PRINCIPAL: TwilioTemplatePreview
 *
 * Motor de previsualización de plantillas de Twilio
 * - Renderiza templates guardados (JSON completo desde API)
 * - Renderiza live preview mientras se edita (JSON incompleto/draft)
 *
 * CARACTERÍSTICAS:
 * ✅ Puramente presentacional (Dumb Component)
 * ✅ Reactividad en tiempo real (Live Preview)
 * ✅ Tolerancia a fallos (Valores undefined/incompletos)
 * ✅ Parseo memoizado de variables {{...}}
 * ✅ Soporte para múltiples tipos de content
 * ✅ Modo builder con placeholders visuales
 *
 * DOCUMENTACIÓN:
 * https://www.twilio.com/docs/content/content-types-overview
 */

import { cn } from '@/lib/utils'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BodyRenderer,
  CTARenderer,
  MediaHeaderRenderer,
  TextHeaderRenderer,
  ListPickerRenderer,
  QuickReplyRenderer,
} from './ContentRenderers'
import type {
  TwilioContentType,
  TwilioTemplatePreviewProps,
} from '@/types/content-twilio'
import {
  analyzeTemplate,
  normalizeTemplateData,
  replaceVariables,
} from '@/lib/content-twilio'
import {
  AlertCircle,
  Check,
  MessageCircle,
  MessageCircleHeart,
  SendHorizonal,
} from 'lucide-react'
import { RcsIcon } from '@/components/icons/rcs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/overlays/tooltip'
import {
  CHANNEL_SUPPORT,
  type ContentTemplateApproval,
} from '@/features/twilio/types'
import { WhatsAppIcon } from '@/components/icons/whatsapp'
import { MessengerIcon } from '@/components/icons/messenger'
import { Badge } from '@/components/ui/feedback/badge'

/**
 * TwilioTemplatePreview
 *
 * Componente de previsualización para plantillas de Twilio
 *
 * @example
 * // Previsualizar template guardado (API)
 * <TwilioTemplatePreview
 *   templateData={twilioApiTemplate}
 *   variables={{ name: "Juan", company: "Acme" }}
 *   mode="static"
 * />
 *
 * @example
 * // Live preview mientras se edita
 * <TwilioTemplatePreview
 *   templateData={draftFormData}
 *   variables={formVariables}
 *   mode="builder"
 * />
 */
export const TwilioTemplatePreview: React.FC<TwilioTemplatePreviewProps> = ({
  templateData,
  variables,
  mode,
  className,
}) => {
  const { t } = useTranslation()
  const normalizedTemplate = useMemo(
    () => normalizeTemplateData(templateData),
    [templateData]
  )

  const templateAnalysis = useMemo(
    () => analyzeTemplate(normalizedTemplate),
    [normalizedTemplate]
  )

  // Si no hay data en absoluto (o el análisis indica que no se pudo interpretar), mostrar mensaje de preview no disponible
  if (!templateData) {
    return (
      <div
        className={cn(
          'max-w-sm p-8 flex flex-col items-center justify-center text-center text-muted-foreground border border-dashed rounded-xl bg-card/50',
          className
        )}
      >
        <p className="text-sm font-medium">
          {t('twilio.template_preview.not_available')}
        </p>
        <p className="text-xs mt-1">
          {t('twilio.template_preview.select_prompt')}
        </p>
      </div>
    )
  }

  const templateType = normalizedTemplate?.type
  const hasHeaderMedia =
    normalizedTemplate?.header?.type === 'twilio/media' ||
    !!normalizedTemplate?.header?.media_url
  const quickReplies = normalizedTemplate?.buttons?.quick_replies ?? []
  const ctas = normalizedTemplate?.buttons?.call_to_actions ?? []
  const listPicker = normalizedTemplate?.buttons?.list_picker

  // Si es modo builder y el análisis indica que no hay campos visibles, mostrar mensaje específico
  if (mode === 'static' && templateAnalysis.isEmpty) {
    return (
      <div className={cn('p-6 text-center text-muted-foreground', className)}>
        <p className="text-sm">{t('twilio.template_preview.empty')}</p>
      </div>
    )
  }

  // Evita renderizar el badge de soporte si el tipo no es reconocido o no tiene soporte definido
  const templateRequest = (templateData as ContentTemplateApproval)
    ?.approval_requests

  // Se usa el ? para evitar errores si templateRequest es undefined o no tiene status, lo que puede ocurrir en drafts o templates con estructura incompleta
  const templateApprovalStatus = templateRequest?.status?.toLowerCase()

  return (
    <div
      className={cn(
        'relative overflow-hidden max-w-2xl w-full py-2 sm:py-4 space-y-4 rounded-xl border-border border bg-logo backdrop-blur-md',
        className
      )}
    >
      <div className="absolute -z-10 top-0 left-0 right-0 h-12 bg-linear-to-b from-primary/30 to-transparent" />
      <div className="px-2 sm:px-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-xl font-semibold whitespace-nowrap">
          <SendHorizonal className="inline w-6 h-6 text-primary" />
          {templateType
            ? t(
                `twilio.content_types.${templateType?.split('/')?.[1] ?? 'unknown'}`,
                { defaultValue: templateType }
              )
            : t('twilio.content_types.unknown')}
        </h3>
        {templateType && <RenderChannelSupportBadge type={templateType} />}
      </div>
      <div className="px-4 sm:px-8 max-w-sm mx-auto">
        <div
          className="border border-border rounded-xl overflow-hidden bg-card text-card-foreground shadow-sm"
          role="region"
          aria-label={t('twilio.template_preview.aria_label')}
        >
          {/* HEADER */}
          {(normalizedTemplate?.header || mode === 'builder') &&
            (hasHeaderMedia ? (
              <MediaHeaderRenderer
                item={normalizedTemplate?.header}
                mode={mode}
              />
            ) : (
              <TextHeaderRenderer
                item={normalizedTemplate?.header}
                variables={variables}
                mode={mode}
              />
            ))}
          {/* BODY - Contenido principal */}
          {(normalizedTemplate?.body || mode === 'builder') && (
            <BodyRenderer
              item={normalizedTemplate?.body}
              variables={variables}
              mode={mode}
            />
          )}
          {normalizedTemplate?.footer?.text && (
            <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
              {replaceVariables(
                normalizedTemplate.footer.text,
                variables,
                mode
              )}
            </div>
          )}
          {/* FOOTER INFO (Builder Mode) */}
          {mode === 'builder' && templateAnalysis.isIncomplete && (
            <div
              className={cn(
                'px-4 py-3 text-xs',
                'bg-blue-50 border-t border-blue-200 text-blue-700'
              )}
            >
              <p className="font-semibold mb-1">
                {t('twilio.template_preview.incomplete_fields')}
              </p>
              <ul className="list-disc list-inside space-y-1">
                {templateAnalysis.missingFields.map((field) => (
                  <li key={field}>
                    {t(`twilio.template_preview.fields.${field}` as const, {
                      defaultValue: field,
                    })}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* BUTTONS SECTION */}
        {(normalizedTemplate?.buttons || mode === 'builder') && (
          <div className="mt-2">
            <div className="space-y-2">
              {/* Quick Replies */}
              {(quickReplies.length > 0 || mode === 'builder') && (
                <div className="flex flex-wrap gap-2">
                  {quickReplies.length > 0 ? (
                    quickReplies.map((button, idx) => (
                      <QuickReplyRenderer
                        key={`qr-${idx}`}
                        button={button}
                        mode={mode}
                      />
                    ))
                  ) : (
                    <QuickReplyRenderer key="qr-placeholder" mode={mode} />
                  )}
                </div>
              )}

              {/* Call-To-Action Buttons */}
              {(ctas.length > 0 || mode === 'builder') && (
                <div className="flex flex-wrap gap-2">
                  {ctas.length > 0 ? (
                    ctas.map((button, idx) => (
                      <CTARenderer
                        key={`cta-${idx}`}
                        button={button}
                        mode={mode}
                      />
                    ))
                  ) : (
                    <CTARenderer key="cta-placeholder" mode={mode} />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {/* LIST PICKER */}
        {(listPicker?.sections ||
          listPicker?.button_text ||
          mode === 'builder') && (
          <div className="mt-2">
            <ListPickerRenderer
              sections={listPicker?.sections}
              mode={mode}
              buttonText={listPicker?.button_text}
            />
          </div>
        )}
      </div>

      {/* Validacion de estado de aprobación de template */}
      {templateRequest && templateApprovalStatus && (
        <div className="flex items-center px-4 gap-2">
          <Badge
            variant={
              templateApprovalStatus === 'approved' ? 'success' : 'warning'
            }
            className="uppercase gap-1"
          >
            {templateApprovalStatus === 'approved' ? (
              <Check className="size-4" />
            ) : (
              <AlertCircle className="size-4" />
            )}
            {t(`twilio.template_preview.status.${templateApprovalStatus}`, {
              defaultValue: templateApprovalStatus,
            })}
          </Badge>

          {templateRequest?.category && (
            <Badge variant="default" className="uppercase">
              {t(
                `twilio.template_preview.category.${templateRequest.category.toLowerCase()}`,
                { defaultValue: templateRequest.category }
              )}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

// Componente separado para renderizar los badges de soporte por canal, con validación defensiva para evitar errores si el tipo no es reconocido o no tiene soporte definido
export function RenderChannelSupportBadge({
  type,
}: {
  type: TwilioContentType
}) {
  const supportInfo = CHANNEL_SUPPORT[type]
  if (!supportInfo) return null

  const channels = {
    sms: { icon: MessageCircle, label: 'SMS' },
    mms: { icon: MessageCircleHeart, label: 'MMS' },
    rcs: { icon: RcsIcon, label: 'RCS' },
    whatsapp: { icon: WhatsAppIcon, label: 'WhatsApp' },
    messenger: { icon: MessengerIcon, label: 'Messenger' },
  }

  return (
    <div className="flex items-center gap-3">
      {Object.entries(supportInfo).map(([channel, isSupported]) => {
        const channelInfo = channels[channel as keyof typeof channels]

        if (!channelInfo) return null

        return (
          <Tooltip key={channel}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'flex items-center cursor-default',
                  isSupported ? 'text-primary' : 'text-muted-foreground/30'
                )}
              >
                <channelInfo.icon className="h-6 w-6" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{channelInfo.label}</p>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

TwilioTemplatePreview.displayName = 'TwilioTemplatePreview'

export default TwilioTemplatePreview
