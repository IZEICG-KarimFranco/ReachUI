import { useState } from 'react'
import { CircleAlert, SearchX, Users } from 'lucide-react'
import { Button } from '@/components/ui/actions/button'
import {
  RecordList,
  RecordRow,
  type RecordStatusTone,
} from '@/components/ui/data-display/record-list'
import {
  MockSection,
  MockShell,
  ValueReadout,
} from '@/pages/dev/mock/mock-shell'

const contacts: {
  id: string
  name: string
  status: string
  tone: RecordStatusTone
  phone: string
  when: string
}[] = [
  {
    id: 'adrian',
    name: 'Adrián Martínez — nombre largo que demuestra truncado con ellipsis',
    status: 'Activo',
    tone: 'ok',
    phone: '+52 55 1234 5678',
    when: 'hace 2 h',
  },
  {
    id: 'lucia',
    name: 'Lucía Fernández',
    status: 'En conversación',
    tone: 'live',
    phone: '+52 55 8765 4321',
    when: 'hace 5 h',
  },
  {
    id: 'marco',
    name: 'Marco Tulio Vega Ruiz',
    status: 'Sin asignar',
    tone: 'idle',
    phone: '+1 415 555 0132',
    when: 'ayer',
  },
]

const tones: RecordStatusTone[] = [
  'ok',
  'success',
  'live',
  'info',
  'error',
  'idle',
  'neutral',
]

export default function RecordListMockPage() {
  const [selected, setSelected] = useState('adrian')
  const [showRows, setShowRows] = useState(false)

  return (
    <MockShell
      title="RecordList y RecordRow"
      description="Estado como texto de color + LED (StatusLabel), contador y acción del pie a la derecha. Filas clicables con Enter/Espacio y foco focus-row."
    >
      <MockSection title="Interactiva · selected, contador y acción de pie">
        <RecordList
          title="Contactos recientes"
          action={<a href="#">Ver todos</a>}
          footerCount="3 de 4,820"
          footerAction={<a href="#">Ver todos →</a>}
        >
          {contacts.map((contact) => (
            <RecordRow
              key={contact.id}
              title={contact.name}
              status={contact.status}
              statusTone={contact.tone}
              meta={`${contact.phone} · ${contact.when}`}
              selected={selected === contact.id}
              onClick={() => setSelected(contact.id)}
            />
          ))}
        </RecordList>
        <ValueReadout>selected: {selected}</ValueReadout>
      </MockSection>

      <MockSection title="Leading (icono)">
        <RecordList title="Contactos">
          <RecordRow
            leading={<Users className="size-4 text-muted" aria-hidden="true" />}
            title="Adrián Martínez"
            status="Activo"
            statusTone="ok"
            meta="hace 2 h"
            onClick={() => undefined}
          />
          <RecordRow
            leading={<Users className="size-4 text-muted" aria-hidden="true" />}
            title="Lucía Fernández con un nombre muy largo que se trunca con puntos suspensivos"
            status="En conversación"
            statusTone="live"
          />
        </RecordList>
      </MockSection>

      <MockSection title="Tonos de estado">
        <RecordList title="Tonos">
          {tones.map((tone) => (
            <RecordRow
              key={tone}
              title={`statusTone="${tone}"`}
              status={tone}
              statusTone={tone}
            />
          ))}
        </RecordList>
      </MockSection>

      <MockSection title="Estados de fila · disabled, loading y error">
        <RecordList title="Plantillas">
          <RecordRow
            title="recordatorio_cita"
            status="Aprobada"
            statusTone="ok"
            onClick={() => undefined}
          />
          <RecordRow
            title="bienvenida_v1 (deshabilitada)"
            status="Aprobada"
            statusTone="ok"
            disabled
            onClick={() => undefined}
          />
          <RecordRow title="" loading />
          <RecordRow
            title="winback_90d"
            status="Rechazada"
            statusTone="error"
            error="Incorrect_category: el contenido es promocional pero se envió como UTILITY."
            onClick={() => undefined}
          />
        </RecordList>
      </MockSection>

      <MockSection title="Lista · loading y error">
        <div className="flex flex-col gap-4">
          <RecordList title="Contactos" loading />
          <RecordList
            title="Contactos"
            error={{
              title: 'No se pudo cargar la lista',
              description: 'Reintenta en unos segundos.',
              icon: CircleAlert,
              action: (
                <Button variant="secondary" size="compact">
                  Reintentar
                </Button>
              ),
            }}
          />
        </div>
      </MockSection>

      <MockSection title="Lista · vacía (con y sin emptyState)">
        <div className="flex flex-col gap-4">
          <RecordList
            title="Contactos"
            emptyState={{
              title: 'Sin resultados',
              description: 'Ajusta los filtros o crea una nueva audiencia.',
              icon: SearchX,
            }}
          />
          <RecordList title="Contactos" />
        </div>
      </MockSection>

      <MockSection title="Hijos condicionales">
        <Button
          variant="secondary"
          size="compact"
          className="mb-3"
          onClick={() => setShowRows((value) => !value)}
        >
          {showRows ? 'Ocultar filas' : 'Mostrar filas'}
        </Button>
        <RecordList title="Contactos" emptyState={{ title: 'Sin contactos' }}>
          {showRows && <RecordRow title="Ada Lovelace" status="Activo" />}
        </RecordList>
      </MockSection>
    </MockShell>
  )
}
