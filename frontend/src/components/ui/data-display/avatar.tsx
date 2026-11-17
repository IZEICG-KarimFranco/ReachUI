import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cva, type VariantProps } from 'class-variance-authority'

import { getInitials } from '@/components/ui/lib/avatar'
import { cn } from '@/lib/utils'

const avatarVariants = cva(
  'relative inline-flex shrink-0 overflow-hidden font-bold select-none',
  {
    variants: {
      size: {
        sm: 'size-8.5 text-xs',
        md: 'size-11 text-sm',
      },
      shape: {
        square: 'rounded-control',
        circle: 'rounded-port',
      },
      tone: {
        signal: 'bg-selection text-signal-contrast',
        success: 'bg-success/15 text-success',
        panel: 'bg-panel text-on-panel',
      },
    },
    defaultVariants: {
      size: 'sm',
      shape: 'square',
      tone: 'signal',
    },
  }
)

type AvatarProps = Omit<React.ComponentProps<'span'>, 'children'> &
  VariantProps<typeof avatarVariants> & {
    name: string
    src?: string
    decorative?: boolean
    fallback?: React.ReactNode
    children?: undefined
  }

type LegacyAvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  children: Exclude<React.ReactNode, undefined>
  name?: undefined
}

function Avatar(props: AvatarProps | LegacyAvatarProps) {
  if (props.children !== undefined) return <LegacyAvatar {...props} />
  return <PropsAvatar {...props} />
}

function PropsAvatar({
  className,
  name,
  src,
  size,
  shape,
  tone,
  decorative = false,
  fallback,
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      {...props}
      data-slot="avatar"
      data-size={size ?? 'sm'}
      data-shape={shape ?? 'square'}
      data-tone={tone ?? 'signal'}
      aria-hidden={decorative || name.trim() === '' || undefined}
      className={cn(avatarVariants({ size, shape, tone }), className)}
    >
      {src && (
        <AvatarPrimitive.Image
          data-slot="avatar-image"
          src={src}
          alt={name}
          className="aspect-square size-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        role="img"
        aria-label={name}
        className="flex size-full items-center justify-center"
      >
        {fallback ?? getInitials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06); se sustituye por `Avatar` con `name`
function LegacyAvatar({ className, ...props }: LegacyAvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    />
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
