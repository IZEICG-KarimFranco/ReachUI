export type ChartTone =
  | 'neutral'
  | 'live'
  | 'info'
  | 'success'
  | 'error'
  | 'signal'

export interface ChartSegment {
  key: string
  label: string
  value: number
  tone: ChartTone
}

export type ChartStatus = 'ready' | 'loading' | 'error'

export interface ChartShare extends ChartSegment {
  share: number
}

export type ChartValueFormatter = (value: number) => string

export interface LegendEntry {
  key: string
  label: string
  tone: ChartTone
  detail?: string
}

export interface DonutArc {
  key: string
  tone: ChartTone
  full: boolean
  d: string
  dx: number
  dy: number
}

export interface DonutReadout {
  value: string
  caption?: string
}

export interface DonutSlice extends DonutArc {
  label: string
  pinned: boolean
  dimmed: boolean
  transform?: string
}
