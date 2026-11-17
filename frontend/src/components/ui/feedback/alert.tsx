import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  OctagonXIcon,
  CircleCheck,
  Info,
  Lightbulb,
  TriangleAlert,
} from 'lucide-react'
import { Link } from 'wouter'

import { cn } from '@/lib/utils'

const halt =
  'flex items-start gap-2.5 rounded-control border-[color-mix(in_srgb,var(--alert-tone)_45%,var(--line))] bg-[color-mix(in_srgb,var(--alert-tone)_7%,var(--card))] px-[13px] py-[11px] leading-normal max-[560px]:grid max-[560px]:grid-cols-[15px_minmax(0,1fr)]'

const haltTones = {
  info: { Icon: Info, accent: 'text-info' },
  success: { Icon: CircleCheck, accent: 'text-success' },
  warning: { Icon: TriangleAlert, accent: 'text-live' },
  error: { Icon: OctagonXIcon, accent: 'text-error' },
  signal: { Icon: Lightbulb, accent: 'text-signal-contrast' },
} as const

const toneRole = {
  info: 'status',
  success: 'status',
  warning: 'status',
  error: 'alert',
  signal: 'status',
} as const

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
const legacyLayout =
  'relative rounded-surface px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current'

const alertVariants = cva(
  'w-full border text-xs leading-normal text-ink-secondary',
  {
    variants: {
      tone: {
        info: `[--alert-tone:var(--info)] ${halt}`,
        success: `[--alert-tone:var(--success)] ${halt}`,
        warning: `[--alert-tone:var(--live)] ${halt}`,
        error: `[--alert-tone:var(--error)] ${halt}`,
        signal: `[--alert-tone:var(--signal)] ${halt}`,
      },
      // LEGACY: borrar al terminar la migración del rediseño (T02–T06); se sustituye por `tone`
      variant: {
        default: `${legacyLayout} bg-card text-ink`,
        destructive: `${legacyLayout} border-error/30 bg-error/10 text-error [&>svg]:text-current *:data-[slot=alert-description]:text-error/90`,
        warning: `${legacyLayout} border-live/30 bg-live/10 text-live [&>svg]:text-current`,
        info: `${legacyLayout} border-info/30 bg-info/10 text-info [&>svg]:text-current`,
        success: `${legacyLayout} border-success/30 bg-success/10 text-success [&>svg]:text-current`,
        primary: `${legacyLayout} border-signal/20 bg-signal/10 text-signal-contrast [&>svg]:text-signal-contrast *:data-[slot=alert-description]:text-signal-contrast`,
      },
    },
  }
)

type AlertBaseProps = Omit<React.ComponentProps<'div'>, 'title'>

type ToneAlertProps = AlertBaseProps & {
  tone: NonNullable<VariantProps<typeof alertVariants>['tone']>
  title?: string
  description?: string
  action?: { label: string; href: string }
  children?: React.ReactNode
  variant?: never
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
type LegacyAlertProps = AlertBaseProps &
  Pick<VariantProps<typeof alertVariants>, 'variant'> & {
    title?: React.ReactNode
    children?: React.ReactNode
    tone?: never
    description?: never
    action?: never
  }

type AlertProps = ToneAlertProps | LegacyAlertProps

function ToneAlert({
  className,
  tone,
  title,
  description,
  action,
  children,
  ...props
}: ToneAlertProps) {
  const { Icon, accent } = haltTones[tone]

  return (
    <div
      data-slot="alert"
      data-tone={tone}
      role={toneRole[tone]}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      <Icon
        aria-hidden="true"
        className={cn('mt-0.5 size-[15px] shrink-0', accent)}
      />
      <div data-slot="alert-body" className="min-w-0">
        {title && (
          <span
            data-slot="alert-title"
            className={cn(
              'mb-[3px] block text-xs leading-normal font-bold',
              accent
            )}
          >
            {title}
          </span>
        )}
        {description && (
          <span data-slot="alert-description" className="block">
            {description}
          </span>
        )}
        {children}
      </div>
      {action && (
        <div
          data-slot="alert-action"
          className="ml-auto shrink-0 max-[560px]:col-start-2 max-[560px]:mt-1 max-[560px]:ml-0 max-[560px]:w-max"
        >
          <AlertActionLink {...action} />
        </div>
      )}
    </div>
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06)
function LegacyAlert({
  className,
  variant,
  title,
  children,
  ...props
}: LegacyAlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      // los consumidores antiguos pasan `title` como atributo HTML
      title={typeof title === 'string' ? title : undefined}
      className={cn(
        alertVariants({ variant: variant ?? 'default' }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function Alert(props: AlertProps) {
  return props.tone ? <ToneAlert {...props} /> : <LegacyAlert {...props} />
}

// Rutas internas ("/x"): navegan con wouter y no recargan la página.
function isInternalHref(href: string) {
  return href[0] === '/' && href[1] !== '/'
}

function AlertActionLink({ label, href }: { label: string; href: string }) {
  const props = {
    'data-slot': 'alert-action-link',
    href,
    className:
      'inline-block border-b border-b-[color-mix(in_srgb,var(--alert-tone)_55%,transparent)] text-xs leading-normal font-semibold whitespace-nowrap text-ink focus-ring-inline [--focus-tone:var(--alert-tone)]',
    children: label,
  }

  return isInternalHref(href) ? <Link {...props} /> : <a {...props} />
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06); solo los usa la rama `variant`
function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className
      )}
      {...props}
    />
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06); solo los usa la rama `variant`
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-ink-secondary col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
