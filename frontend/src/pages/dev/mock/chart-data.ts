import type { ChartSegment } from '@/types/charts'

export const deliverySegments: ChartSegment[] = [
  { key: 'delivered', label: 'Entregados', value: 4240, tone: 'success' },
  { key: 'failed', label: 'Fallidos', value: 145, tone: 'error' },
  { key: 'processing', label: 'En proceso', value: 241, tone: 'live' },
  { key: 'pending', label: 'Pendientes', value: 194, tone: 'neutral' },
]

export const funnelRows: ChartSegment[] = [
  { key: 'sent', label: 'Enviados', value: 4723, tone: 'signal' },
  { key: 'delivered', label: 'Entregados', value: 4611, tone: 'success' },
  { key: 'read', label: 'Leídos', value: 3415, tone: 'info' },
  { key: 'processing', label: 'En proceso', value: 241, tone: 'live' },
  { key: 'failed', label: 'Fallidos', value: 97, tone: 'error' },
]

export const channelSegments: ChartSegment[] = [
  { key: 'wa', label: 'WhatsApp', value: 3120, tone: 'success' },
  { key: 'sms', label: 'SMS', value: 1460, tone: 'info' },
  { key: 'rcs', label: 'RCS', value: 240, tone: 'signal' },
]

export const emptySegments: ChartSegment[] = deliverySegments.map((s) => ({
  ...s,
  value: 0,
}))

export const formatThousands = (value: number) =>
  new Intl.NumberFormat('es-MX').format(value)
