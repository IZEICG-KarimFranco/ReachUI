import { cva, type VariantProps } from 'class-variance-authority'

import { chartFillVariants } from '@/components/ui/lib/charts'
import { cn } from '@/lib/utils'
import type { LegendEntry } from '@/types/charts'

const legendMarkerVariants = cva('flex-none', {
  variants: {
    marker: {
      dot: 'size-2 rounded-full',
      square: 'size-1.75 rounded-[2px]',
    },
  },
  defaultVariants: {
    marker: 'dot',
  },
})

type ChartLegendProps = VariantProps<typeof legendMarkerVariants> & {
  items: LegendEntry[]
  hidden?: boolean
}

function ChartLegend({ items, hidden = false, marker }: ChartLegendProps) {
  return (
    <ul
      data-slot="chart-legend"
      data-marker={marker ?? 'dot'}
      className={cn(hidden ? 'sr-only' : 'flex flex-wrap gap-x-4 gap-y-1.5')}
    >
      {items.map((item) => (
        <li
          key={item.key}
          className="flex flex-none items-center gap-1.5 text-xs text-ink-secondary"
        >
          <span
            aria-hidden="true"
            className={cn(
              legendMarkerVariants({ marker }),
              chartFillVariants({ tone: item.tone })
            )}
          />
          <span>{item.label}</span>
          {item.detail && (
            <span className="font-mono text-ink">{item.detail}</span>
          )}
        </li>
      ))}
    </ul>
  )
}

export { ChartLegend }
