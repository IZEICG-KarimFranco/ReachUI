import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        'h-3 rounded-[6px] bg-linear-to-r/srgb from-inset via-line to-inset bg-size-[200%_100%] animate-skeleton motion-reduce:animate-none',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
