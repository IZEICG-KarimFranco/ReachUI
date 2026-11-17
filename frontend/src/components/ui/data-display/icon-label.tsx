import * as React from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import {
  hasLabelText,
  isIconComponent,
  replaceChildContent,
  type IconSource,
} from '@/components/ui/lib/icon-label'
import { cn } from '@/lib/utils'

const iconLabelVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'gap-1.5 text-xs',
      md: 'gap-2 text-sm',
      lg: 'gap-3 text-sm',
    },
    layout: {
      inline: '',
      stacked: 'flex-col gap-1 text-center',
    },
    multiline: {
      true: 'items-start',
      false: '',
    },
    truncate: {
      true: 'min-w-0 max-w-full',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    layout: 'inline',
    multiline: false,
    truncate: false,
  },
})

const iconSlotVariants = cva('inline-flex shrink-0 items-center', {
  variants: {
    tone: {
      default: '',
      muted: 'text-muted',
    },
    multiline: {
      true: 'h-lh',
      false: '',
    },
  },
  defaultVariants: {
    tone: 'default',
    multiline: false,
  },
})

const iconSizes = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-4.5',
} as const

function renderIcon(icon: IconSource, className: string) {
  if (!isIconComponent(icon)) return icon
  const Icon = icon
  return <Icon className={className} />
}

type IconLabelProps = React.ComponentProps<'span'> &
  VariantProps<typeof iconLabelVariants> &
  VariantProps<typeof iconSlotVariants> & {
    icon: IconSource
    iconClassName?: string
    iconPosition?: 'start' | 'end'
    trailing?: React.ReactNode
    asChild?: boolean
  }

function IconLabel({
  className,
  icon,
  iconClassName,
  iconPosition = 'start',
  tone,
  size,
  layout,
  multiline,
  truncate,
  trailing,
  asChild = false,
  children,
  ...props
}: IconLabelProps) {
  const resolvedSize = size ?? 'md'
  const isNamed =
    !asChild && !hasLabelText(children) && Boolean(props['aria-label'])

  const iconSlot = (
    <span
      data-slot="icon-label-icon"
      aria-hidden="true"
      className={cn(iconSlotVariants({ tone, multiline }), iconClassName)}
    >
      {renderIcon(icon, iconSizes[resolvedSize])}
    </span>
  )

  const renderText = (text: React.ReactNode) =>
    hasLabelText(text) ? (
      <span
        data-slot="icon-label-text"
        className={cn(truncate && 'min-w-0 truncate')}
      >
        {text}
      </span>
    ) : null

  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="icon-label"
      data-size={resolvedSize}
      data-layout={layout ?? 'inline'}
      role={isNamed ? 'img' : undefined}
      className={cn(
        iconLabelVariants({ size, layout, multiline, truncate }),
        className
      )}
      {...props}
    >
      {iconPosition === 'start' && iconSlot}
      {asChild ? (
        <Slottable>{replaceChildContent(children, renderText)}</Slottable>
      ) : (
        renderText(children)
      )}
      {iconPosition === 'end' && iconSlot}
      {hasLabelText(trailing) && (
        <span
          data-slot="icon-label-trailing"
          className="ms-auto inline-flex shrink-0 items-center"
        >
          {trailing}
        </span>
      )}
    </Comp>
  )
}

export { IconLabel }
export type { IconLabelProps }
