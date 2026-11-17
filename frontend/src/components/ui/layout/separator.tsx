import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { cn } from '@/lib/utils'

const insetClasses =
  'data-[orientation=horizontal]:mx-4 data-[orientation=horizontal]:w-auto data-[orientation=vertical]:my-2 data-[orientation=vertical]:h-auto data-[orientation=vertical]:self-stretch'

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  variant = 'full',
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  variant?: 'full' | 'inset'
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      data-variant={variant}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-line shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        variant === 'inset' && insetClasses,
        className
      )}
      {...props}
    />
  )
}

export { Separator }
