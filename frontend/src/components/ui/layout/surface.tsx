import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const surfaceVariants = cva('text-ink overflow-hidden rounded-surface border', {
  variants: {
    variant: {
      plate: 'border-line bg-card',
      pane: 'dark border-panel-separator bg-panel [--ink-secondary:var(--on-panel-secondary)]! [--ink:var(--on-panel)]! [--line:var(--panel-separator)]! [--muted:var(--on-panel-muted)]! [--signal-contrast:var(--on-panel-accent)]!',
    },
  },
  defaultVariants: {
    variant: 'plate',
  },
})

function Surface({
  className,
  variant = 'plate',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof surfaceVariants>) {
  return (
    <div
      data-slot="surface"
      data-variant={variant}
      className={cn(surfaceVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Surface }
