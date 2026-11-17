import { cva, type VariantProps } from 'class-variance-authority'
import { useTranslation } from 'react-i18next'

import { Alert } from '@/components/ui/feedback/alert'
import { Skeleton } from '@/components/ui/feedback/skeleton'
import { cn } from '@/lib/utils'

const chartSkeletonVariants = cva('', {
  variants: {
    shape: {
      meter: 'h-3.5 w-full rounded-pill',
      bars: 'h-24 w-full rounded-control',
      donut: 'aspect-square h-auto w-full max-w-59 rounded-full',
      ring: 'size-15 rounded-full',
    },
  },
})

function ChartLoading({
  shape,
  label,
}: NonNullable<VariantProps<typeof chartSkeletonVariants>> & {
  label?: string
}) {
  const { t } = useTranslation()
  return (
    <div data-slot="chart-loading" role="status" className="w-full">
      <Skeleton className={cn(chartSkeletonVariants({ shape }))} />
      <span className="sr-only">{label ?? t('common.loading')}</span>
    </div>
  )
}

function ChartError({ label }: { label?: string }) {
  const { t } = useTranslation()
  return <Alert tone="error" description={label ?? t('charts.error')} />
}

export { ChartError, ChartLoading }
