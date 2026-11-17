import {
  MessageBubble,
  MessagePreview,
} from '@/components/ui/data-display/message-preview'
import { MockSection, MockShell } from '@/pages/dev/mock/mock-shell'
import type { MessagePreviewModel } from '@/types/message-preview'

const base = { buttons: [], cards: [] }

const sms: MessagePreviewModel = {
  ...base,
  channel: 'sms',
  variant: 'conversation',
  direction: 'outbound',
  body: 'Hola {{nombre}}, tu pedido #4820 está listo para recoger. Responde SI para confirmar.',
}

const quickReply: MessagePreviewModel = {
  ...base,
  channel: 'whatsapp',
  variant: 'template',
  direction: 'outbound',
  title: 'Confirmación de cita',
  body: 'Hola {{nombre}}, ¿confirmas tu cita del {{fecha}} a las {{hora}}?',
  buttons: [
    { kind: 'quick_reply', label: 'Confirmar' },
    { kind: 'quick_reply', label: 'Reagendar' },
    { kind: 'quick_reply', label: 'Cancelar' },
  ],
}

const cta: MessagePreviewModel = {
  ...base,
  channel: 'whatsapp',
  variant: 'template',
  direction: 'outbound',
  title: 'Tu pedido llegó',
  body: 'Ya puedes recoger tu pedido en tienda o rastrearlo en línea.',
  buttons: [{ kind: 'url', label: 'Rastrear pedido' }],
}

const image: MessagePreviewModel = {
  ...base,
  channel: 'whatsapp',
  variant: 'template',
  direction: 'outbound',
  media: { kind: 'image', url: 'nueva-coleccion.jpg' },
  title: 'Nueva colección',
  body: 'Mira lo que llegó esta semana. Responde para apartar.',
}

const documentMsg: MessagePreviewModel = {
  ...base,
  channel: 'whatsapp',
  variant: 'template',
  direction: 'outbound',
  media: { kind: 'document', name: 'factura_marzo.pdf', sizeLabel: '240 KB' },
  body: 'Tu factura del mes está lista. Cualquier duda, responde aquí.',
}

const carousel: MessagePreviewModel = {
  channel: 'whatsapp',
  variant: 'template',
  direction: 'outbound',
  body: 'Estas son las novedades que pediste:',
  buttons: [],
  cards: [
    {
      media: { kind: 'image' },
      title: 'Chamarra denim',
      body: 'Talla M',
      buttons: [{ kind: 'url', label: 'Ver producto' }],
    },
    {
      media: { kind: 'image' },
      title: 'Sneakers blancos',
      body: 'Talla 27',
      buttons: [{ kind: 'url', label: 'Ver producto' }],
    },
    {
      media: { kind: 'image' },
      title: 'Gorra bordada',
      body: 'Unitalla',
      buttons: [{ kind: 'url', label: 'Ver producto' }],
    },
  ],
}

const rcs: MessagePreviewModel = {
  ...base,
  channel: 'rcs',
  variant: 'conversation',
  direction: 'outbound',
  media: { kind: 'image' },
  title: 'Reserva confirmada',
  body: 'Mesa para 2 · viernes 20:00',
  buttons: [{ kind: 'url', label: 'Ver reserva' }],
}

const longText: MessagePreviewModel = {
  ...base,
  channel: 'whatsapp',
  variant: 'template',
  direction: 'outbound',
  body: 'Hola {{nombre}}, te escribimos de {{empresa}} porque tu pedido #{{pedido}} quedó listo para recoger en sucursal {{sucursal}}. Horario: lunes a sábado de 9:00 a 18:00. Si necesitas facturación, responde FACTURA y te enviaremos el enlace para capturar tus datos fiscales.',
  footer: 'Responde STOP para dejar de recibir mensajes',
}

const list: MessagePreviewModel = {
  ...base,
  channel: 'whatsapp',
  variant: 'template',
  direction: 'outbound',
  body: 'Elige el horario que prefieras:',
  listItems: [
    { title: 'Mañana', description: '9:00 – 12:00' },
    { title: 'Tarde', description: '13:00 – 17:00' },
  ],
  buttons: [{ kind: 'list', label: 'Ver horarios' }],
}

const inbound: MessagePreviewModel = {
  ...base,
  channel: 'whatsapp',
  variant: 'conversation',
  direction: 'inbound',
  body: 'Sí, confirmo. ¿Puedo llegar 10 minutos antes?',
}

export default function MessagePreviewMockPage() {
  return (
    <MockShell
      title="MessagePreview y MessageBubble"
      description="Vista previa de solo lectura (shots preview-* de t06-charts.html). Variante template (tinte WhatsApp) y conversation (tono por dirección). Las variables sin resolver se resaltan; la media sin URL válida muestra un placeholder."
    >
      <MockSection title="preview-sms">
        <MessagePreview
          caption="SMS · vista del contacto"
          message={sms}
          meta="09:30 · ✓✓"
        />
      </MockSection>

      <MockSection title="preview-whatsapp-quickreply y preview-whatsapp-cta">
        <div className="grid gap-4 sm:grid-cols-2">
          <MessagePreview
            caption="Plantilla · MARKETING"
            message={quickReply}
          />
          <MessagePreview caption="Plantilla · UTILITY" message={cta} />
        </div>
      </MockSection>

      <MockSection title="preview-whatsapp-media y preview-whatsapp-doc">
        <div className="grid gap-4 sm:grid-cols-2">
          <MessagePreview caption="Plantilla · MARKETING" message={image} />
          <MessagePreview caption="Plantilla · UTILITY" message={documentMsg} />
        </div>
      </MockSection>

      <MockSection title="preview-whatsapp-carousel">
        <MessagePreview
          caption="Plantilla · MARKETING · carrusel"
          message={carousel}
        />
      </MockSection>

      <MockSection title="preview-rcs">
        <MessagePreview
          caption="RCS · rich card"
          message={rcs}
          meta="RCS · 09:30"
        />
      </MockSection>

      <MockSection title="preview-longtext · texto largo, variables y pie">
        <MessagePreview caption="Texto largo + variables" message={longText} />
      </MockSection>

      <MockSection title="Lista (sin shot en el mock)">
        <MessagePreview caption="WhatsApp · lista" message={list} />
      </MockSection>

      <MockSection title="MessageBubble suelto · conversación (inbox)">
        <div className="flex max-w-md flex-col gap-2 rounded-control border border-line bg-inset p-3.5">
          <MessageBubble message={inbound} meta="09:31" />
          <MessageBubble message={sms} meta="09:32 · ✓✓" />
        </div>
      </MockSection>

      <MockSection title="Vacío · message null">
        <MessagePreview message={null} emptyLabel="Elige una plantilla" />
      </MockSection>
    </MockShell>
  )
}
