import React, { useState, useMemo } from 'react'
import { TwilioTemplatePreview } from './TwilioTemplatePreview'
import type { TwilioContentTemplate } from '../../types/content-twilio'
import { Input } from '@/components/ui/inputs/input'
import { Label } from '@/components/ui/inputs/label'
import { Textarea } from '@/components/ui/inputs/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/selection/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card'
import { Tabs, TabsContent } from '@/components/ui/navigation/tabs'
import { Button } from '@/components/ui/actions/button'
import { X, Plus, ChevronDown, Copy, Check } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/layout/collapsible'

interface AdvancedTemplateBuilderProps {
  onTemplateChange?: (template: TwilioContentTemplate) => void
  variables?: Record<string, string>
  className?: string
}

type TemplateType = 'text' | 'media' | 'quick-reply' | 'list-picker' | 'cta'
type ButtonType = 'visit-website' | 'coupon-code' | 'phone-number'

interface QuickReplyButton {
  id: string
  text: string
}

interface ListPickerItem {
  id: string
  title: string
}

export const AdvancedTemplateBuilder: React.FC<
  AdvancedTemplateBuilderProps
> = ({
  onTemplateChange,
  variables = { name: 'USER', phone: '+1234567890' },
  className,
}) => {
  const [templateType, setTemplateType] = useState<TemplateType>('text')
  const [showJson, setShowJson] = useState(false)
  const [jsonCopied, setJsonCopied] = useState(false)

  // TEXT
  const [textBody, setTextBody] = useState('Hola {{name}}, ¿cómo estás?')

  // MEDIA
  const [mediaText, setMediaText] = useState('Hola {{name}}, ¿cómo estás?')
  const [mediaUrl, setMediaUrl] = useState(
    'https://via.placeholder.com/300x100'
  )

  // QUICK REPLY
  const [quickReplyText, setQuickReplyText] = useState('Elige una opción:')
  const [quickReplyButtons, setQuickReplyButtons] = useState<
    QuickReplyButton[]
  >([{ id: '1', text: 'Opción A' }])

  // CALL TO ACTION
  const [ctaText, setCtaText] = useState('Visita nuestro sitio web')
  const [buttonType, setButtonType] = useState<ButtonType>('visit-website')
  const [buttonText, setButtonText] = useState('Entrar')
  const [websiteUrl, setWebsiteUrl] = useState('https://example.com')
  const [couponCode, setCouponCode] = useState('CODE2025')
  const [phoneNumber, setPhoneNumber] = useState('+1234567890')

  // LIST PICKER
  const [listPickerText, setListPickerText] = useState(
    'Selecciona un producto:'
  )
  const [listPickerTitle, setListPickerTitle] = useState('Ver productos')
  const [listPickerItems, setListPickerItems] = useState<ListPickerItem[]>([
    { id: '1', title: 'Opción 1' },
  ])

  // Helpers
  const addQuickReplyButton = () => {
    if (quickReplyButtons.length < 10) {
      setQuickReplyButtons([
        ...quickReplyButtons,
        {
          id: Date.now().toString(),
          text: `Opción ${quickReplyButtons.length + 1}`,
        },
      ])
    }
  }

  const removeQuickReplyButton = (id: string) => {
    if (quickReplyButtons.length > 1) {
      setQuickReplyButtons(quickReplyButtons.filter((b) => b.id !== id))
    }
  }

  const updateQuickReplyButton = (id: string, text: string) => {
    setQuickReplyButtons(
      quickReplyButtons.map((b) => (b.id === id ? { ...b, text } : b))
    )
  }

  const addListPickerItem = () => {
    if (listPickerItems.length < 10) {
      setListPickerItems([
        ...listPickerItems,
        {
          id: Date.now().toString(),
          title: `Opción ${listPickerItems.length + 1}`,
        },
      ])
    }
  }

  const removeListPickerItem = (id: string) => {
    if (listPickerItems.length > 1) {
      setListPickerItems(listPickerItems.filter((item) => item.id !== id))
    }
  }

  const updateListPickerItem = (id: string, title: string) => {
    setListPickerItems(
      listPickerItems.map((item) =>
        item.id === id ? { ...item, title } : item
      )
    )
  }

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(template, null, 2))
    setJsonCopied(true)
    setTimeout(() => setJsonCopied(false), 2000)
  }

  // Construir template dinámicamente
  const template: TwilioContentTemplate = useMemo(() => {
    if (templateType === 'text') {
      return {
        body: { text: textBody },
      }
    }

    if (templateType === 'media') {
      return {
        body: { text: mediaText },
        header: {
          type: 'twilio/media',
          media_url: mediaUrl,
        },
      }
    }

    if (templateType === 'quick-reply') {
      return {
        body: { text: quickReplyText },
        buttons: {
          quick_replies: quickReplyButtons.map((b) => ({
            type: 'quick_reply' as const,
            text: b.text,
          })),
        },
      }
    }

    if (templateType === 'cta') {
      const ctaButton =
        buttonType === 'visit-website'
          ? { type: 'url' as const, text: buttonText, url: websiteUrl }
          : buttonType === 'coupon-code'
            ? {
                type: 'coupon_code' as const,
                text: buttonText,
                code: couponCode,
              }
            : {
                type: 'phone_number' as const,
                text: buttonText,
                phone_number: phoneNumber,
              }

      return {
        body: { text: ctaText },
        buttons: {
          call_to_actions: [ctaButton],
        },
      }
    }

    if (templateType === 'list-picker') {
      return {
        body: { text: listPickerText },
        buttons: {
          list_picker: {
            button_text: listPickerTitle,
            sections: [
              {
                title: 'Opciones',
                rows: listPickerItems.map((item) => ({
                  title: item.title,
                })),
              },
            ],
          },
        },
      }
    }

    return { body: { text: 'Template' } }
  }, [
    templateType,
    textBody,
    mediaText,
    mediaUrl,
    quickReplyText,
    quickReplyButtons,
    ctaText,
    buttonType,
    buttonText,
    websiteUrl,
    couponCode,
    phoneNumber,
    listPickerText,
    listPickerTitle,
    listPickerItems,
  ])

  React.useEffect(() => {
    onTemplateChange?.(template)
  }, [template, onTemplateChange])

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL DE EDICIÓN */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Template</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={templateType}
                onValueChange={(val) => setTemplateType(val as TemplateType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">📝 Text</SelectItem>
                  <SelectItem value="media">🖼️ Media</SelectItem>
                  <SelectItem value="quick-reply">⚡ Quick Reply</SelectItem>
                  <SelectItem value="cta">🔗 Call to Action</SelectItem>
                  <SelectItem value="list-picker">📋 List Picker</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* INPUTS DINÁMICOS POR TIPO */}
          <Tabs value={templateType} className="w-full">
            {/* TEXT */}
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>Mensaje</Label>
                  <Textarea
                    value={textBody}
                    onChange={(e) => setTextBody(e.target.value)}
                    placeholder="Escribe tu mensaje (usa {{variable}} para variables)"
                    className="mt-2"
                  />
                </div>
              </div>
            </TabsContent>

            {/* MEDIA */}
            <TabsContent value="media" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>Mensaje</Label>
                  <Textarea
                    value={mediaText}
                    onChange={(e) => setMediaText(e.target.value)}
                    placeholder="Escribe tu mensaje"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>URL de la Imagen</Label>
                  <Input
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-2"
                  />
                </div>
              </div>
            </TabsContent>

            {/* QUICK REPLY */}
            <TabsContent value="quick-reply" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>Mensaje</Label>
                  <Textarea
                    value={quickReplyText}
                    onChange={(e) => setQuickReplyText(e.target.value)}
                    placeholder="Pregunta o instrucción"
                    className="mt-2"
                  />
                </div>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    Botones Rápidos ({quickReplyButtons.length}/10)
                  </CardTitle>
                  {quickReplyButtons.length < 10 && (
                    <Button
                      onClick={addQuickReplyButton}
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" /> Agregar
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickReplyButtons.map((btn, idx) => (
                    <div key={btn.id} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label className="text-xs">Botón {idx + 1}</Label>
                        <Input
                          value={btn.text}
                          onChange={(e) =>
                            updateQuickReplyButton(btn.id, e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      {quickReplyButtons.length > 1 && (
                        <Button
                          onClick={() => removeQuickReplyButton(btn.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* CALL TO ACTION */}
            <TabsContent value="cta" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>Mensaje</Label>
                  <Textarea
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Tu mensaje"
                    className="mt-2"
                  />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Botón</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Tipo de Botón</Label>
                    <Select
                      value={buttonType}
                      onValueChange={(val) => setButtonType(val as ButtonType)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visit-website">
                          Visitar Sitio Web
                        </SelectItem>
                        <SelectItem value="coupon-code">
                          Código de Cupón
                        </SelectItem>
                        <SelectItem value="phone-number">
                          Número Telefónico
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Texto del Botón</Label>
                    <Input
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  {buttonType === 'visit-website' && (
                    <div>
                      <Label>URL del Sitio Web</Label>
                      <Input
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://..."
                        className="mt-2"
                      />
                    </div>
                  )}

                  {buttonType === 'coupon-code' && (
                    <div>
                      <Label>Código de Cupón</Label>
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="CODE2025"
                        className="mt-2"
                      />
                    </div>
                  )}

                  {buttonType === 'phone-number' && (
                    <div>
                      <Label>Número Telefónico</Label>
                      <Input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1234567890"
                        className="mt-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* LIST PICKER */}
            <TabsContent value="list-picker" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>Mensaje</Label>
                  <Textarea
                    value={listPickerText}
                    onChange={(e) => setListPickerText(e.target.value)}
                    placeholder="Tu mensaje"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Título del Botón</Label>
                  <Input
                    value={listPickerTitle}
                    onChange={(e) => setListPickerTitle(e.target.value)}
                    placeholder="Ver productos"
                    className="mt-2"
                  />
                </div>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    Opciones de Lista ({listPickerItems.length}/10)
                  </CardTitle>
                  {listPickerItems.length < 10 && (
                    <Button
                      onClick={addListPickerItem}
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <Plus className="h-4 w-4" /> Agregar
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {listPickerItems.map((item, idx) => (
                    <div key={item.id} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label className="text-xs">Opción {idx + 1}</Label>
                        <Input
                          value={item.title}
                          onChange={(e) =>
                            updateListPickerItem(item.id, e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      {listPickerItems.length > 1 && (
                        <Button
                          onClick={() => removeListPickerItem(item.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* PREVIEW EN VIVO */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <TwilioTemplatePreview
                templateData={template}
                variables={variables}
                mode="builder"
                className="w-full max-w-sm"
              />
            </CardContent>
          </Card>

          {/* JSON COLLAPSIBLE */}
          <Collapsible open={showJson} onOpenChange={setShowJson}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-sm">JSON</CardTitle>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${showJson ? 'rotate-180' : ''}`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-3">
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={copyJsonToClipboard}
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      {jsonCopied ? (
                        <>
                          <Check className="h-4 w-4" /> Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" /> Copiar
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                    {JSON.stringify(template, null, 2)}
                  </pre>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}
