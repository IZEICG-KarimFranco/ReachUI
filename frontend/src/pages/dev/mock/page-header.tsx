import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/actions/button'
import { PageHeader, SectionHeading } from '@/components/ui/layout/page-header'
import { MockNav } from '@/pages/dev/mock/mock-nav'

function Shot({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div data-shot={id} className="w-full min-w-0">
      {children}
    </div>
  )
}

function Case({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="min-w-0">
      <h2 className="mb-2 font-mono text-label uppercase text-muted">
        {title}
      </h2>
      <div className="rounded-surface border border-line bg-card p-4">
        {children}
      </div>
    </section>
  )
}

const description =
  'Administra las plantillas aprobadas por Meta para WhatsApp.'

const importLink = (
  <Button variant="secondary" asChild>
    <a href="#">Importar</a>
  </Button>
)

const createLink = (
  <Button variant="primary" asChild>
    <a href="#">
      <Plus />
      Nueva plantilla
    </a>
  </Button>
)

export function PageHeaderMockShot() {
  return (
    <Shot id="page-header">
      <div style={{ width: 'min(760px, 92vw)' }}>
        <PageHeader
          title="Plantillas"
          description={description}
          actions={
            <>
              {importLink}
              {createLink}
            </>
          }
        />
      </div>
    </Shot>
  )
}

export function PageHeaderStatesShot() {
  return (
    <Shot id="page-header-states">
      <div className="grid gap-6">
        <Case title="Solo título, sin acciones">
          <PageHeader title="Plantillas" />
        </Case>
        <Case title="Con descripción, sin acciones">
          <PageHeader title="Plantillas" description={description} />
        </Case>
        <Case title="Una acción">
          <PageHeader
            title="Plantillas"
            description={description}
            actions={createLink}
          />
        </Case>
        <Case title="Dos acciones">
          <PageHeader
            title="Plantillas"
            description={description}
            actions={
              <>
                {importLink}
                {createLink}
              </>
            }
          />
        </Case>
        <Case title="Tres acciones · calendario (calendar-switchboard.html:68)">
          <PageHeader
            title="Calendario"
            description="Campañas programadas y borradores. Reprograma con cuidado; los días pasados no aceptan envíos."
            actions={
              <>
                <Button variant="quiet" size="compact">
                  Hoy
                </Button>
                <Button variant="secondary" size="compact">
                  Actualizar
                </Button>
                <Button variant="secondary" size="compact">
                  Filtros
                </Button>
              </>
            }
          />
        </Case>
        <Case title="Con estado y descripción">
          <PageHeader
            title="Izei Consulting Group"
            description="slug: izei-consulting · Creada 12 ene 2024"
            status={{ label: 'Activa', tone: 'success' }}
          />
        </Case>
        <Case title="Con estado, sin descripción, pulse">
          <PageHeader
            title="Supervisión"
            status={{ label: 'En vivo', tone: 'live', pulse: true }}
            actions={importLink}
          />
        </Case>
        <Case title="Título y descripción muy largos">
          <PageHeader
            title="Plantillas aprobadas por Meta para campañas de WhatsApp de todas las organizaciones del portal administrativo"
            description="Administra las plantillas aprobadas por Meta para WhatsApp, revisa su categoría, idioma y estado de aprobación, y crea nuevas versiones cuando una plantilla sea rechazada o quede pausada por calidad baja."
            status={{ label: 'Sincronizando con Twilio', tone: 'info' }}
            actions={
              <>
                {importLink}
                {createLink}
              </>
            }
          />
        </Case>
        <Case title="Título sin espacios y acciones largas">
          <PageHeader
            title="PlantillasAprobadasPorMetaParaWhatsAppDeTodasLasOrganizaciones"
            actions={
              <>
                <Button variant="secondary" asChild>
                  <a href="#">Importar desde otra organización</a>
                </Button>
                <Button variant="primary" asChild>
                  <a href="#">Crear plantilla de WhatsApp nueva</a>
                </Button>
              </>
            }
          />
        </Case>
      </div>
    </Shot>
  )
}

export function SectionHeadingShot() {
  return (
    <Shot id="section-heading">
      <div className="grid gap-8">
        <Case title="Home · .overview-head (meta a la derecha, sin línea)">
          <SectionHeading
            title="Rendimiento de campañas"
            meta="Datos de ejemplo · últimos 14 días"
          />
        </Case>
        <Case title="Home · .sec-h (línea inferior)">
          <SectionHeading title="Atajos del equipo" bordered />
        </Case>
        <Case title="Analítica · .secttl (meta y acción)">
          <SectionHeading
            title="Campañas"
            meta="9 campañas"
            actions={
              <Button variant="secondary" size="compact">
                Seleccionar
              </Button>
            }
          />
        </Case>
        <Case title="Admin · descripción y controles">
          <SectionHeading
            title="Organizaciones"
            description="Busca y abre una organización para revisar su uso."
            actions={
              <Button variant="secondary" size="compact">
                Exportar
              </Button>
            }
            bordered
          />
        </Case>
        <Case title="level={3}">
          <SectionHeading title="Detalle de la campaña" level={3} />
        </Case>
        <Case title="Título largo, meta y acción">
          <SectionHeading
            title="Campañas recientes de todas las organizaciones con envíos programados durante el último trimestre"
            meta="Datos de ejemplo · últimos 14 días"
            actions={
              <Button variant="secondary" size="compact">
                Seleccionar
              </Button>
            }
            bordered
          />
        </Case>
      </div>
    </Shot>
  )
}

const shots = [
  { title: 'Shot page-header (t03-shell)', Shot: PageHeaderMockShot },
  { title: 'Estados de PageHeader', Shot: PageHeaderStatesShot },
  {
    title: 'SectionHeading (home, analítica y admin)',
    Shot: SectionHeadingShot,
  },
] as const

export function PageHeaderShots() {
  return (
    <div className="grid w-full min-w-0 gap-8">
      {shots.map(({ title, Shot: ShotComponent }) => (
        <section key={title} className="min-w-0">
          <h2 className="mb-2 font-mono text-label uppercase text-muted">
            {title}
          </h2>
          <ShotComponent />
        </section>
      ))}
    </div>
  )
}

export default function PageHeaderMockPage() {
  return (
    <div className="min-h-screen w-full bg-paper text-ink">
      <MockNav />
      <main className="mx-auto w-full max-w-6xl p-6">
        <h1 className="mb-6 text-lg font-semibold">
          PageHeader y SectionHeading · casos
        </h1>
        <PageHeaderShots />
      </main>
    </div>
  )
}
