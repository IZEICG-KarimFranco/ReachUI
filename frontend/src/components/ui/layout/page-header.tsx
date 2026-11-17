import { useId, type ComponentProps, type ReactNode } from 'react'

import { StatusLabel } from '@/components/ui/feedback/status-label'
import { cn } from '@/lib/utils'

type StatusLabelTone = NonNullable<ComponentProps<typeof StatusLabel>['tone']>

type PageHeaderProps = Omit<ComponentProps<'div'>, 'title'> & {
  title: string
  description?: string
  status?: { label: string; tone?: StatusLabelTone; pulse?: boolean }
  actions?: ReactNode
}

function PageHeader({
  className,
  title,
  description,
  status,
  actions,
  ...props
}: PageHeaderProps) {
  const descriptionId = useId()

  return (
    <div
      data-slot="page-header"
      className={cn(
        'flex flex-col gap-4 tablet:flex-row tablet:items-start tablet:justify-between tablet:gap-6 desktop:items-end',
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        <h1
          aria-describedby={description ? descriptionId : undefined}
          className="text-[length:clamp(28px,3vw,38px)] leading-[1.15] font-bold tracking-[-0.04em] break-words text-ink"
        >
          {title}
        </h1>
        {(description || status) && (
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {description && (
              <p
                id={descriptionId}
                className="max-w-prose text-sm text-ink-secondary"
              >
                {description}
              </p>
            )}
            {status && (
              <StatusLabel tone={status.tone} pulse={status.pulse}>
                {status.label}
              </StatusLabel>
            )}
          </div>
        )}
      </div>
      {actions && (
        <div
          data-slot="page-header-actions"
          className="flex flex-wrap gap-2 *:flex-auto tablet:flex-none tablet:flex-col tablet:flex-nowrap tablet:items-stretch tablet:*:flex-none desktop:flex-row desktop:items-center"
        >
          {actions}
        </div>
      )}
    </div>
  )
}

type SectionHeadingProps = Omit<ComponentProps<'div'>, 'title'> & {
  title: string
  level?: 2 | 3 | 4
  description?: string
  meta?: string
  actions?: ReactNode
  bordered?: boolean
}

function SectionHeading({
  className,
  title,
  level = 2,
  description,
  meta,
  actions,
  bordered = false,
  ...props
}: SectionHeadingProps) {
  const descriptionId = useId()
  const Heading = `h${level}` as 'h2' | 'h3' | 'h4'

  return (
    <div
      data-slot="section-heading"
      data-bordered={bordered}
      className={cn(
        'flex flex-wrap items-baseline gap-x-3 gap-y-1',
        bordered && 'border-b border-line pb-3',
        className
      )}
      {...props}
    >
      <div className="min-w-0 flex-1 basis-48">
        <Heading
          aria-describedby={description ? descriptionId : undefined}
          className="text-base font-semibold tracking-tight break-words text-ink"
        >
          {title}
        </Heading>
        {description && (
          <p
            id={descriptionId}
            className="mt-1 max-w-prose text-sm text-ink-secondary"
          >
            {description}
          </p>
        )}
      </div>
      {(meta || actions) && (
        <div
          data-slot="section-heading-aside"
          className="ms-auto flex flex-wrap items-baseline justify-end gap-x-3 gap-y-1"
        >
          {meta && <span className="text-xs text-muted">{meta}</span>}
          {actions}
        </div>
      )}
    </div>
  )
}

export { PageHeader, SectionHeading }
