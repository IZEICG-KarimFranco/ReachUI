import { useId, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTranslation } from 'react-i18next'

import { ChartError, ChartLoading } from '@/components/ui/charts/chart-feedback'
import { ChartLegend } from '@/components/ui/charts/chart-legend'
import { useDonutChart } from '@/components/ui/hooks/use-donut-chart'
import {
  chartSvgFillVariants,
  chartSvgStrokeVariants,
  DONUT_CENTER,
  DONUT_VIEWBOX,
} from '@/components/ui/lib/charts'
import { cn } from '@/lib/utils'
import type {
  ChartSegment,
  ChartStatus,
  ChartValueFormatter,
} from '@/types/charts'

const donutVariants = cva('flex flex-col items-center', {
  variants: {
    size: {
      default: 'w-full gap-2.5',
      compact: 'gap-0',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const donutBoxVariants = cva('relative block', {
  variants: {
    size: {
      default: 'w-full max-w-59',
      compact: 'size-15',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const donutValueVariants = cva('font-mono font-extrabold text-ink', {
  variants: {
    size: {
      default: 'text-lg',
      compact: 'text-xs',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

type DonutChartProps = VariantProps<typeof donutVariants> & {
  label: string
  labelHidden?: boolean
  icon?: ReactNode
  segments: ChartSegment[]
  status?: ChartStatus
  centerValue?: string
  centerLabel?: string
  showLegend?: boolean
  decorative?: boolean
  emptyLabel?: string
  errorLabel?: string
  formatValue?: ChartValueFormatter
  className?: string
}

function DonutChart({
  label,
  labelHidden = false,
  icon,
  segments,
  status = 'ready',
  size,
  centerValue,
  centerLabel,
  showLegend = false,
  decorative = false,
  emptyLabel,
  errorLabel,
  formatValue,
  className,
}: DonutChartProps) {
  const { t } = useTranslation()
  const captionId = useId()
  const resolvedSize = size ?? 'default'
  const compact = resolvedSize === 'compact'
  const {
    slices,
    isEmpty,
    legend,
    readout,
    selection,
    interactive,
    ringLabel,
    ring,
  } = useDonutChart({
    segments,
    size: resolvedSize,
    decorative,
    formatValue,
    emptyLabel: emptyLabel ?? t('contacts.panel.no_data'),
    centerValue,
    centerLabel,
  })
  const Root = decorative ? 'span' : 'figure'

  return (
    <Root
      data-slot="donut-chart"
      data-size={resolvedSize}
      aria-hidden={decorative || undefined}
      aria-labelledby={decorative ? undefined : captionId}
      className={cn(donutVariants({ size }), className)}
    >
      {!decorative && (
        <figcaption
          id={captionId}
          className={cn(
            labelHidden || compact
              ? 'sr-only'
              : 'flex items-center gap-1.5 self-start text-xs font-bold tracking-[0.14em] text-muted uppercase'
          )}
        >
          {icon && !compact && (
            <span aria-hidden="true" className="flex size-3.5 flex-none">
              {icon}
            </span>
          )}
          {label}
        </figcaption>
      )}
      {status === 'loading' ? (
        <ChartLoading shape={compact ? 'ring' : 'donut'} />
      ) : status === 'error' ? (
        <ChartError label={errorLabel} />
      ) : (
        <>
          <span
            role={ringLabel ? 'img' : undefined}
            aria-label={ringLabel}
            className={donutBoxVariants({ size })}
          >
            <svg
              viewBox={`0 0 ${DONUT_VIEWBOX} ${DONUT_VIEWBOX}`}
              className="block h-auto w-full overflow-visible"
              role={interactive ? 'group' : undefined}
              aria-label={interactive ? label : undefined}
              aria-hidden={interactive ? undefined : true}
              onPointerLeave={selection.clearPreview}
            >
              {(isEmpty || compact) && (
                <circle
                  cx={DONUT_CENTER}
                  cy={DONUT_CENTER}
                  r={ring.radius}
                  fill="none"
                  strokeWidth={ring.width}
                  className={isEmpty ? 'stroke-line-strong' : 'stroke-inset'}
                />
              )}
              {slices.map((slice) => {
                const sliceClass = cn(
                  'outline-none [transform-box:view-box] [transform-origin:center] motion-safe:transition-[opacity,transform] motion-safe:duration-200',
                  interactive &&
                    'cursor-pointer focus-visible:stroke-signal-contrast focus-visible:stroke-3',
                  slice.dimmed && 'opacity-45'
                )
                const sliceProps = {
                  style: slice.transform
                    ? { transform: slice.transform }
                    : undefined,
                  ...(interactive && {
                    role: 'button',
                    tabIndex: 0,
                    'aria-pressed': slice.pinned,
                    'aria-label': slice.label,
                    onClick: () => selection.toggle(slice.key),
                    onKeyDown: selection.onKeyDown(slice.key),
                    onPointerEnter: () => selection.preview(slice.key),
                    onFocus: () => selection.preview(slice.key),
                    onBlur: selection.clearPreview,
                  }),
                }
                return slice.full ? (
                  <circle
                    key={slice.key}
                    cx={DONUT_CENTER}
                    cy={DONUT_CENTER}
                    r={ring.radius}
                    fill="none"
                    strokeWidth={ring.width}
                    {...sliceProps}
                    className={cn(
                      chartSvgStrokeVariants({ tone: slice.tone }),
                      sliceClass
                    )}
                  />
                ) : (
                  <path
                    key={slice.key}
                    d={slice.d}
                    strokeLinejoin="round"
                    {...sliceProps}
                    className={cn(
                      chartSvgFillVariants({ tone: slice.tone }),
                      sliceClass
                    )}
                  />
                )
              })}
            </svg>
            {readout && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-px text-center"
              >
                <b className={donutValueVariants({ size })}>{readout.value}</b>
                {readout.caption && !compact && (
                  <span className="max-w-24 text-xs font-semibold tracking-wide text-muted uppercase">
                    {readout.caption}
                  </span>
                )}
              </span>
            )}
          </span>
          {!decorative && !ringLabel && (
            <ChartLegend items={legend} hidden={!showLegend} />
          )}
        </>
      )}
    </Root>
  )
}

export { DonutChart }
