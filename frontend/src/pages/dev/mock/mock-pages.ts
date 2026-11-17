import { useEffect, useState } from 'react'

export const MOCK_TICKET_GROUPS = [
  'Catálogo combinado',
  'T02 · Controles y formularios',
  'T03 · Shell y superficies',
  'T04 · Feedback y overlays',
  'T05 · Colecciones y datos',
  'T06 · Gráficas y previews',
] as const

export type MockTicketGroup = (typeof MOCK_TICKET_GROUPS)[number]

export interface MockPageItem {
  path: string
  label: string
  ticket: MockTicketGroup
  title: string
  description: string
}

export const MOCK_PAGES: readonly MockPageItem[] = [
  {
    path: '/dev/mock/all',
    label: 'Catálogo',
    ticket: 'Catálogo combinado',
    title: 'Catálogo en contexto',
    description:
      'Comparativa combinada de Badge, StatusLabel, StatusDot, IconLabel, Toast, Alert, Dialog, Skeleton, Card, Separator y Sheet en superficies reales.',
  },
  {
    path: '/dev/mock/button',
    label: 'Button',
    ticket: 'T02 · Controles y formularios',
    title: 'Button e IconButton',
    description:
      'Variantes del contrato (primary, secondary, quiet, danger), compact, loading, disabled, asChild y alias legacy.',
  },
  {
    path: '/dev/mock/badge',
    label: 'Badge',
    ticket: 'T04 · Feedback y overlays',
    title: 'Badge',
    description:
      'Variantes funcionales (outline, default, info, signal, success, warning, error) y comparativa con legacy.',
  },
  {
    path: '/dev/mock/status-label',
    label: 'StatusLabel',
    ticket: 'T04 · Feedback y overlays',
    title: 'StatusLabel y StatusDot',
    description:
      'Estados con LED (default e inline), posición del punto, animación pulse y listas con textos largos.',
  },
  {
    path: '/dev/mock/alert',
    label: 'Alert',
    ticket: 'T04 · Feedback y overlays',
    title: 'Alert',
    description:
      'Tonos warning, info, success, error y signal con acción opcional, envoltura multilínea y variantes legacy.',
  },
  {
    path: '/dev/mock/toast',
    label: 'Toast',
    ticket: 'T04 · Feedback y overlays',
    title: 'Toast (Sonner)',
    description:
      'Pruebas interactivas por tipo, duración, posición, apilado y cambio entre modo escritorio y móvil.',
  },
  {
    path: '/dev/mock/dialog',
    label: 'Dialog',
    ticket: 'T04 · Feedback y overlays',
    title: 'Dialog',
    description:
      'Interacciones manuales de la primitiva base: trampa y restauración de foco, Escape, clic en scrim, botón X y pending.',
  },
  {
    path: '/dev/mock/confirm-dialog',
    label: 'ConfirmDialog',
    ticket: 'T04 · Feedback y overlays',
    title: 'ConfirmDialog',
    description:
      'Confirmación sobre Dialog: tone por defecto y danger, helper, pending automático y controlado, fallo de onConfirm y bottom sheet en móvil.',
  },
  {
    path: '/dev/mock/app-shell',
    label: 'AppShell',
    ticket: 'T03 · Shell y superficies',
    title: 'AppShell · rail, topbar y tabbar',
    description:
      'Pantalla completa con el shell real: roles del seed y permisos sueltos, iframe, rings, rail mini, drawer móvil y menús de organización, presencia, usuario y tema.',
  },
  {
    path: '/dev/mock/icon-label',
    label: 'IconLabel',
    ticket: 'T03 · Shell y superficies',
    title: 'IconLabel',
    description:
      'Rail, presencia, nav de Configuración, tabbar, metadato inline, multilínea y adjunto truncado; asChild, tone e iconPosition.',
  },
  {
    path: '/dev/mock/avatar',
    label: 'Avatar',
    ticket: 'T03 · Shell y superficies',
    title: 'Avatar',
    description:
      'Tamaños, formas y tonos; imagen, imagen rota, iniciales, fallback, decorative y legacy; en contexto: rail, miembros, contactos y fichas.',
  },
  {
    path: '/dev/mock/page-header',
    label: 'PageHeader',
    ticket: 'T03 · Shell y superficies',
    title: 'PageHeader y SectionHeading',
    description:
      'Shot page-header del mock, con y sin descripción, 0 a 3 acciones, estado con pulse, títulos largos y SectionHeading (home, analítica, admin y level).',
  },
  {
    path: '/dev/mock/skeleton',
    label: 'Skeleton',
    ticket: 'T04 · Feedback y overlays',
    title: 'Skeleton',
    description:
      'Shot loading-skeleton (filas con shimmer y pie con Spinner) y formas de los consumidores vía className.',
  },
  {
    path: '/dev/mock/empty',
    label: 'EmptyState',
    ticket: 'T04 · Feedback y overlays',
    title: 'EmptyState',
    description:
      'Shot empty-state (Card divided con cabecera y pie), caja bordered, icono con acción, texto largo y el compuesto Empty legacy.',
  },
  {
    path: '/dev/mock/spinner',
    label: 'Spinner',
    ticket: 'T04 · Feedback y overlays',
    title: 'Spinner',
    description:
      'Tamaños, color por className, texto con aria-hidden o aria-label y uso dentro de Button loading; con reduced motion queda quieto.',
  },
  {
    path: '/dev/mock/field',
    label: 'Field',
    ticket: 'T02 · Controles y formularios',
    title: 'Field, Input, Textarea y Select',
    description:
      'Estados dentro de Field (descripción, requerido, error, deshabilitado, solo lectura) y comparativa del foco entre campos y botones.',
  },
  {
    path: '/dev/mock/label',
    label: 'Label',
    ticket: 'T02 · Controles y formularios',
    title: 'Label',
    description:
      'Variantes form y legacy, índice step (número, cadena, 0 y vacío), required, deshabilitado por peer y group, texto largo y asociación con htmlFor.',
  },
  {
    path: '/dev/mock/surface',
    label: 'Surface',
    ticket: 'T04 · Feedback y overlays',
    title: 'Surface',
    description:
      'Plate desnudo: fondo, borde y radio, con padding y ancho puestos por el consumidor.',
  },
  {
    path: '/dev/mock/card',
    label: 'Card',
    ticket: 'T04 · Feedback y overlays',
    title: 'Card',
    description:
      'Card sobre Surface con CardHeader, CardItem, CardContent y CardFooter; líneas automáticas entre hijos, divided={false} y tres ejemplos en contexto.',
  },
  {
    path: '/dev/mock/separator',
    label: 'Separator',
    ticket: 'T04 · Feedback y overlays',
    title: 'Separator',
    description:
      'Variantes full (borde a borde) e inset (con margen de 16 px), horizontal y vertical, y modo no decorativo con rol separator.',
  },
  {
    path: '/dev/mock/sheet',
    label: 'Sheet',
    ticket: 'T04 · Feedback y overlays',
    title: 'Sheet',
    description:
      'side="responsive" (drawer de 440/560 px) y side="center" (modal de 620 px) desde 981 px, bottom sheet por debajo; shots sheet-detail, sheet-form-error e importar contactos, cuerpo largo, pending y los lados legacy.',
  },
  {
    path: '/dev/mock/table',
    label: 'Table',
    ticket: 'T05 · Colecciones y datos',
    title: 'Table (estado actual)',
    description:
      'Fila de la pantalla de plantillas armada con el Table actual, sin refactor, dentro de Card con y sin cabecera.',
  },
  {
    path: '/dev/mock/quick-filters',
    label: 'QuickFilters',
    ticket: 'T05 · Colecciones y datos',
    title: 'QuickFilters',
    description:
      'Filtro de selección única: scroll, wrap, puntos de estado y opción deshabilitada; teclado de radiogroup.',
  },
  {
    path: '/dev/mock/record-list',
    label: 'RecordList',
    ticket: 'T05 · Colecciones y datos',
    title: 'RecordList y RecordRow',
    description:
      'Lista interactiva con selected, contador y acción de pie, leading, tonos de estado, filas disabled/loading/error, lista loading, error y vacía.',
  },
  {
    path: '/dev/mock/pagination',
    label: 'Pagination',
    ticket: 'T05 · Colecciones y datos',
    title: 'Pagination (numérica)',
    description:
      'Pie de tabla en contexto y casos: primera, intermedia, última, pocas páginas, una sola página y visiblePagesCount.',
  },
  {
    path: '/dev/mock/cursor-pagination',
    label: 'CursorPagination',
    ticket: 'T05 · Colecciones y datos',
    title: 'CursorPagination',
    description:
      'Navegación por cursor con carga simulada y estados fijos: inicio, intermedio, final y cargando.',
  },
  {
    path: '/dev/mock/mode-switch',
    label: 'ModeSwitch',
    ticket: 'T05 · Colecciones y datos',
    title: 'ModeSwitch',
    description:
      'Píldoras con selección, opción deshabilitada, control deshabilitado y layout wrap en contenedor estrecho.',
  },
  {
    path: '/dev/mock/steps',
    label: 'Steps',
    ticket: 'T05 · Colecciones y datos',
    title: 'Steps',
    description:
      'Asistente interactivo, primer paso, último paso, paso deshabilitado y variante de tres pasos.',
  },
  {
    path: '/dev/mock/key-value-list',
    label: 'KeyValueList',
    ticket: 'T05 · Colecciones y datos',
    title: 'KeyValueList',
    description:
      'Detalle con valores mono, textos largos y URL, vacío por defecto y con emptyState.',
  },
  {
    path: '/dev/mock/tooltip',
    label: 'Tooltip',
    ticket: 'T05 · Colecciones y datos',
    title: 'Tooltip',
    description:
      'Los cuatro lados, sobre IconButton, texto largo y un tooltip abierto fijo para medir colores.',
  },
  {
    path: '/dev/mock/stat-strip',
    label: 'StatStrip',
    ticket: 'T05 · Colecciones y datos',
    title: 'StatStrip',
    description:
      'Franja de métricas con 1 a 4 ítems, delta up/neutral/warn, statusTone, unidad, textos largos, loading y vacío.',
  },
  {
    path: '/dev/mock/chip-group',
    label: 'ChipGroup',
    ticket: 'T02 · Controles y formularios',
    title: 'ChipGroup',
    description:
      'Selección múltiple con chips: hoja de scopes de Crear llave, ninguno seleccionado, opción deshabilitada y layout scroll; teclado con flechas y Espacio/Enter.',
  },
  {
    path: '/dev/mock/meter',
    label: 'Meter',
    ticket: 'T06 · Gráficas y previews',
    title: 'Meter',
    description:
      'Barra apilada: shots chart-meter y chart-meter-empty, base mayor que la suma, compact, decorativo, loading y error.',
  },
  {
    path: '/dev/mock/bar-chart',
    label: 'BarChart',
    ticket: 'T06 · Gráficas y previews',
    title: 'BarChart',
    description:
      'Shot chart-bars con base, sin base ni porcentaje, etiqueta oculta, vacío, loading y error.',
  },
  {
    path: '/dev/mock/donut-chart',
    label: 'DonutChart',
    ticket: 'T06 · Gráficas y previews',
    title: 'DonutChart',
    description:
      'Donut con icono, valor central y leyenda; teclado (Tab, Enter/Espacio, Escape); un segmento, compact, decorativo, vacío, loading y error.',
  },
  {
    path: '/dev/mock/chart-legend',
    label: 'ChartLegend',
    ticket: 'T06 · Gráficas y previews',
    title: 'ChartLegend',
    description:
      'Leyenda compartida: todos los tonos, marker dot y square, wrap estrecho y oculta (sr-only).',
  },
  {
    path: '/dev/mock/message-preview',
    label: 'MessagePreview',
    ticket: 'T06 · Gráficas y previews',
    title: 'MessagePreview y MessageBubble',
    description:
      'Shots preview-* del mock: SMS, quick reply, CTA, media, documento, carrusel, RCS y texto largo; lista, burbujas de conversación y vacío.',
  },
  {
    path: '/dev/mock/password-input',
    label: 'PasswordInput',
    ticket: 'T02 · Controles y formularios',
    title: 'PasswordInput y medidor de fuerza',
    description:
      'Estados dentro de Field (vacío, requerido, error, deshabilitado) y los cinco niveles del medidor de fuerza del mock.',
  },
  {
    path: '/dev/mock/select',
    label: 'Select',
    ticket: 'T02 · Controles y formularios',
    title: 'Select',
    description:
      'Modo simple con descripción, tag y opción deshabilitada; searchable con 23 opciones; placeholder, error, deshabilitado y loading.',
  },
  {
    path: '/dev/mock/command',
    label: 'Command',
    ticket: 'T02 · Controles y formularios',
    title: 'Command',
    description:
      'Lista con búsqueda de cmdk: select-search-open con 22 segmentos, vacío, grupos con separador y shortcut, deshabilitado, Combobox en contexto y CommandDialog.',
  },
  {
    path: '/dev/mock/date-picker',
    label: 'DatePicker',
    ticket: 'T02 · Controles y formularios',
    title: 'DatePicker / TimePicker',
    description:
      'Inputs nativos date, time y datetime-local; rango con dos instancias y min/max cruzados; requerido, error, deshabilitado y solo lectura.',
  },
  {
    path: '/dev/mock/selection-controls',
    label: 'Radio · Switch · Checkbox',
    ticket: 'T02 · Controles y formularios',
    title: 'RadioGroup, Switch y Checkbox',
    description:
      'Radio-cards y radios simples, switch-toggle (default y signal, deshabilitado, en Field) y el Checkbox actual sin refactorizar.',
  },
  {
    path: '/dev/mock/dropdown-menu',
    label: 'DropdownMenu',
    ticket: 'T04 · Feedback y overlays',
    title: 'DropdownMenu (Menu)',
    description:
      'Estado actual sin refactorizar: acciones de fila con destructiva y deshabilitada, checkbox, radio, submenú y un menú abierto fijo.',
  },
]

export function useViewportWidth(): number {
  const [width, setWidth] = useState(() => window.innerWidth)

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return width
}
