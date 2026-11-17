import * as React from 'react'
import { ChevronDown, Ellipsis } from 'lucide-react'
import { Link } from 'wouter'

import { Avatar } from '@/components/ui/data-display/avatar'
import { IconLabel } from '@/components/ui/data-display/icon-label'
import { StatusDot } from '@/components/ui/feedback/status-dot'
import {
  useActiveItemInView,
  useAppShell,
} from '@/components/ui/hooks/use-app-shell'
import type {
  AppShellNavGroup,
  AppShellNavItem,
} from '@/components/ui/lib/app-shell'
import { Menu, type MenuProps } from '@/components/ui/overlays/menu'
import { cn } from '@/lib/utils'

type AppShellRailProps = {
  /** Accessible name of the `<nav>`. */
  label: string
  groups: AppShellNavGroup[]
  activeHref: string | null
  /** Top slot: organization selector (`AppShellRailBay`). */
  header?: React.ReactNode
  /** Bottom slot: presence and user rows. */
  footer?: React.ReactNode
  className?: string
}

/** Desktop rail (248 px, 64 px mini) and drawer below 981 px. */
function AppShellRail({
  label,
  groups,
  activeHref,
  header,
  footer,
  className,
}: AppShellRailProps) {
  const { collapsed, mobileOpen, closeMobile, railId, railRef } = useAppShell()
  const navRef = React.useRef<HTMLElement>(null)
  const entriesKey = groups
    .flatMap((group) => group.items.map((item) => item.href))
    .join('|')
  useActiveItemInView(navRef, activeHref, entriesKey)
  const onNavigate = () => {
    if (mobileOpen) closeMobile()
  }

  return (
    <div
      ref={railRef}
      id={railId}
      data-slot="app-shell-rail"
      data-collapsed={collapsed}
      data-open={mobileOpen}
      className={cn(
        'flex w-(--rail-w) shrink-0 flex-col overflow-hidden border-e border-line bg-paper-secondary text-ink transition-[translate,width,visibility] duration-300 ease-out motion-reduce:transition-none desktop:data-[collapsed=true]:w-16 max-desktop:invisible max-desktop:absolute max-desktop:inset-y-0 max-desktop:start-0 max-desktop:z-rail max-desktop:-translate-x-full max-desktop:data-[open=true]:visible max-desktop:data-[open=true]:motion-safe:transition-[translate,width] max-desktop:data-[open=true]:translate-x-0 max-desktop:data-[open=true]:shadow-lift',
        className
      )}
    >
      {header}
      <nav
        ref={navRef}
        aria-label={label}
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pt-3.5 pb-4.5"
      >
        {groups.map((group) => (
          <AppShellRailGroup
            key={group.id}
            group={group}
            activeHref={activeHref}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      {footer && (
        <div data-slot="app-shell-rail-footer" className="border-t border-line">
          {footer}
        </div>
      )}
    </div>
  )
}

function AppShellRailGroup({
  group,
  activeHref,
  onNavigate,
}: {
  group: AppShellNavGroup
  activeHref: string | null
  onNavigate?: () => void
}) {
  const labelId = React.useId()
  if (group.items.length === 0) return null

  return (
    <div
      data-slot="app-shell-rail-group"
      className="mb-3.5 desktop:in-data-[collapsed=true]:mb-0 desktop:in-data-[collapsed=true]:border-t desktop:in-data-[collapsed=true]:border-line desktop:in-data-[collapsed=true]:py-2 desktop:in-data-[collapsed=true]:first:border-t-0 desktop:in-data-[collapsed=true]:first:pt-0"
    >
      {group.label && (
        <div
          id={labelId}
          className="px-4.5 pt-2.5 pb-1.5 text-xs font-semibold text-muted desktop:in-data-[collapsed=true]:sr-only"
        >
          {group.label}
        </div>
      )}
      <ul role="list" aria-labelledby={group.label ? labelId : undefined}>
        {group.items.map((item) => (
          <li key={item.href}>
            <AppShellRailItem
              item={item}
              active={item.href === activeHref}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

const countTones = {
  signal: 'bg-selection text-signal-contrast',
  live: 'bg-live/15 text-live',
} as const

function AppShellRailItem({
  item,
  active,
  onNavigate,
}: {
  item: AppShellNavItem
  active: boolean
  onNavigate?: () => void
}) {
  const count =
    item.count !== undefined && item.count > 0 ? (
      <span
        data-slot="app-shell-rail-count"
        className={cn(
          'rounded-pill px-2 py-0.5 text-xs font-semibold desktop:in-data-[collapsed=true]:px-1 desktop:in-data-[collapsed=true]:py-0 desktop:in-data-[collapsed=true]:text-[8px]',
          countTones[item.countTone ?? 'signal']
        )}
      >
        {item.count}
      </span>
    ) : undefined

  return (
    <IconLabel
      asChild
      size="lg"
      truncate
      icon={item.icon}
      iconClassName={cn(!active && 'opacity-80')}
      trailing={count}
      className="relative mx-2.5 my-0.5 flex rounded-control px-3 py-2.5 text-[13px] font-medium text-ink-secondary transition-colors hover:bg-inset hover:text-ink aria-[current=page]:bg-selection aria-[current=page]:font-semibold aria-[current=page]:text-signal-contrast motion-reduce:transition-none desktop:in-data-[collapsed=true]:mx-2 desktop:in-data-[collapsed=true]:justify-center desktop:in-data-[collapsed=true]:px-0 desktop:in-data-[collapsed=true]:py-2.75 desktop:in-data-[collapsed=true]:[&>[data-slot=icon-label-text]]:sr-only desktop:in-data-[collapsed=true]:[&>[data-slot=icon-label-trailing]]:absolute desktop:in-data-[collapsed=true]:[&>[data-slot=icon-label-trailing]]:top-1.25 desktop:in-data-[collapsed=true]:[&>[data-slot=icon-label-trailing]]:right-1.75"
    >
      <Link
        href={item.href}
        aria-current={active ? 'page' : undefined}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    </IconLabel>
  )
}

const rowClassName =
  'flex w-full cursor-pointer items-center text-start transition-colors hover:bg-inset focus-visible:-outline-offset-3 data-[state=open]:bg-inset motion-reduce:transition-none desktop:in-data-[collapsed=true]:justify-center desktop:in-data-[collapsed=true]:px-0 desktop:in-data-[collapsed=true]:[&>[data-slot=icon-label-text]]:sr-only desktop:in-data-[collapsed=true]:[&>[data-slot=icon-label-trailing]]:hidden'

type AppShellRailBayProps = React.ComponentProps<'button'> & {
  brand: string
  organization: string
}

/** Organization selector row; meant as a `Menu` trigger. */
function AppShellRailBay({
  brand,
  organization,
  className,
  ...props
}: AppShellRailBayProps) {
  return (
    <button
      type="button"
      data-slot="app-shell-rail-bay"
      className={cn(
        rowClassName,
        'shrink-0 gap-2.5 border-b border-line p-4.5 desktop:in-data-[collapsed=true]:py-3.5',
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="grid shrink-0 grid-cols-[repeat(2,7px)] gap-0.5"
      >
        <span className="size-1.75 bg-ink" />
        <span className="size-1.75 bg-ink" />
        <span className="size-1.75 bg-signal" />
        <span className="size-1.75 bg-ink" />
      </span>
      <span className="flex min-w-0 flex-col desktop:in-data-[collapsed=true]:sr-only">
        <span className="truncate text-body leading-tight font-bold tracking-[-0.02em]">
          {brand}
        </span>
        <span className="truncate text-xs text-muted">{organization}</span>
      </span>
      <ChevronDown
        aria-hidden="true"
        className="ms-auto size-3.5 shrink-0 text-muted desktop:in-data-[collapsed=true]:hidden"
      />
    </button>
  )
}

type AppShellRailPresenceProps = React.ComponentProps<'button'> & {
  label: string
  tone: NonNullable<React.ComponentProps<typeof StatusDot>['tone']>
}

/** Agent status row; meant as a `Menu` trigger. */
function AppShellRailPresence({
  label,
  tone,
  className,
  ...props
}: AppShellRailPresenceProps) {
  return (
    <IconLabel
      asChild
      truncate
      icon={<StatusDot tone={tone} />}
      trailing={
        <ChevronDown aria-hidden="true" className="size-3 text-muted" />
      }
      className={cn(
        rowClassName,
        'gap-2.5 px-4 py-3 text-xs text-ink-secondary desktop:in-data-[collapsed=true]:gap-2 desktop:in-data-[collapsed=true]:py-2.75',
        className
      )}
    >
      <button type="button" data-slot="app-shell-rail-presence" {...props}>
        {label}
      </button>
    </IconLabel>
  )
}

type AppShellRailUserProps = React.ComponentProps<'button'> & {
  name: string
  detail: string
  src?: string
}

/** Signed-in user row; meant as a `Menu` trigger. */
function AppShellRailUser({
  name,
  detail,
  src,
  className,
  ...props
}: AppShellRailUserProps) {
  return (
    <IconLabel
      asChild
      truncate
      icon={<Avatar name={name} src={src} decorative />}
      trailing={<Ellipsis aria-hidden="true" className="size-4 text-muted" />}
      className={cn(
        rowClassName,
        'gap-2.5 border-t border-line px-4 py-3.25 first:border-t-0 desktop:in-data-[collapsed=true]:py-2.75',
        className
      )}
    >
      <button type="button" data-slot="app-shell-rail-user" {...props}>
        <span className="block truncate text-[13px] font-semibold text-ink">
          {name}
        </span>
        <span className="block truncate text-xs text-muted">{detail}</span>
      </button>
    </IconLabel>
  )
}

type AppShellRailMenuProps = Omit<
  MenuProps,
  | 'side'
  | 'align'
  | 'sideOffset'
  | 'matchTriggerWidth'
  | 'inset'
  | 'collisionPadding'
> & {
  /** Row position in the rail: `header` (organization) or `footer` (presence, user). */
  placement: 'header' | 'footer'
}

/**
 * `Menu` for the rail rows. Expanded rail and mobile drawer: below the header
 * row or above a footer row, 12 px in from each side. Desktop mini rail: to the
 * right of the rail, kept 8 px away from the window edges.
 */
function AppShellRailMenu({
  placement,
  density,
  ...props
}: AppShellRailMenuProps) {
  const { isDesktop, collapsed } = useAppShell()
  // `compact` (32 px items) is desktop only; the touch drawer keeps 44 px (MN-14).
  const resolvedDensity = isDesktop ? density : 'default'

  if (isDesktop && collapsed) {
    return (
      <Menu
        {...props}
        density={resolvedDensity}
        side="right"
        align={placement === 'header' ? 'start' : 'end'}
        sideOffset={8}
        collisionPadding={8}
      />
    )
  }

  return (
    <Menu
      {...props}
      density={resolvedDensity}
      side={placement === 'header' ? 'bottom' : 'top'}
      sideOffset={4}
      inset={12}
      collisionPadding={8}
    />
  )
}

export {
  AppShellRail,
  AppShellRailBay,
  AppShellRailMenu,
  AppShellRailGroup,
  AppShellRailItem,
  AppShellRailPresence,
  AppShellRailUser,
}
export type {
  AppShellRailBayProps,
  AppShellRailMenuProps,
  AppShellRailPresenceProps,
  AppShellRailProps,
  AppShellRailUserProps,
}
