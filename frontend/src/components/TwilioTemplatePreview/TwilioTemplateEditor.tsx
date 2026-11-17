/**
 * TwilioTemplateEditor
 *
 * Componente editor interactivo para TwilioTemplatePreview.
 * Proporciona un selector de plantillas, textarea editable y preview en vivo.
 *
 */

import React, { useMemo, useState } from 'react'
import { TwilioTemplatePreview } from './TwilioTemplatePreview'
import type { TwilioContentTemplate } from '../../types/content-twilio'

interface TwilioTemplateEditorProps {
  templates?: TwilioContentTemplate[]
  onTemplateChange?: (template: TwilioContentTemplate | null) => void
  variables?: Record<string, string>
  className?: string
}

export const TwilioTemplateEditor: React.FC<TwilioTemplateEditorProps> = ({
  templates = [
    { body: { text: 'Hola {{name}}, este es un texto simple.' } },
    {
      header: {
        type: 'twilio/media',
        media_url: 'https://via.placeholder.com/300x100',
      },
      body: { text: 'Elige una opción:' },
      buttons: {
        quick_replies: [
          { type: 'quick_reply', text: 'Opción A' },
          { type: 'quick_reply', text: 'Opción B' },
        ],
      },
    },
    {
      body: { text: 'Visita nuestro sitio web:' },
      buttons: {
        call_to_actions: [
          { type: 'url', text: 'Entrar', url: 'https://example.com' },
        ],
      },
      footer: { text: '¡Gracias por tu interés!' },
    },
  ],
  onTemplateChange,
  variables = { name: 'Carlos' },
  className,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [jsonText, setJsonText] = useState(
    JSON.stringify(templates[0], null, 2)
  )

  const currentTemplate = useMemo(() => {
    try {
      return JSON.parse(jsonText) as TwilioContentTemplate
    } catch {
      return templates[selectedIndex] || {}
    }
  }, [jsonText, selectedIndex, templates])

  const handleSelectChange = (idx: number) => {
    setSelectedIndex(idx)
    setJsonText(JSON.stringify(templates[idx], null, 2))
  }

  const handleJsonChange = (text: string) => {
    setJsonText(text)
    try {
      onTemplateChange?.(JSON.parse(text))
    } catch {
      // Invalid JSON, keep showing the preview of last valid parse
    }
  }

  return (
    <div className={className}>
      {/* Controls */}
      <div className="space-y-3 mb-4">
        <label className="block text-sm font-medium">
          Selecciona una plantilla:
        </label>
        <select
          value={selectedIndex}
          onChange={(e) => handleSelectChange(Number(e.target.value))}
          className="border border-border px-3 py-2 rounded-md w-full bg-card text-card-foreground"
        >
          {templates.map((_, idx) => (
            <option key={idx} value={idx}>
              Plantilla {idx + 1}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium">Edita el JSON:</label>
        <textarea
          value={jsonText}
          onChange={(e) => handleJsonChange(e.target.value)}
          className="w-full h-40 border border-border p-3 rounded-md font-mono text-xs bg-card text-card-foreground"
          placeholder="Edita el JSON de la plantilla aquí..."
        />
      </div>

      {/* Live Preview */}
      <div className="p-4 bg-card/60 rounded-md shadow-sm">
        <p className="text-xs text-muted-foreground mb-2">
          Vista previa en vivo:
        </p>
        <TwilioTemplatePreview
          templateData={currentTemplate}
          variables={variables}
          mode="builder"
          className="max-w-md mx-auto"
        />
      </div>
    </div>
  )
}

export default TwilioTemplateEditor
