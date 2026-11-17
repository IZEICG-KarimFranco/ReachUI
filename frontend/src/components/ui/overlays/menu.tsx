import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckIcon } from 'lucide-react'

import { IconLabel } from '@/components/ui/data-display/icon-label'
import { useInputModality } from '@/components/ui/hooks/use-input-modality'
import { Card, CardHeader } from '@/components/ui/layout/card'
import { Separator } from '@/components/ui/layout/separator'
import {
  getCheckedId,
  isCheckable,
  isMenuSeparator,
  type MenuAction,
  type MenuEntry,
} from '@/components/ui/lib/menu'
import { cn } from '@/lib/utils'

const menuItemVariants = cva(
  'relative mx-1.5 flex cursor-pointer items-center gap-2 rounded-control px-3 text-xs text-ink-secondary outline-none select-none group-data-[input=keyboard]/menu:focus-ring data-highlighted:bg-inset data-highlighted:text-ink data-[state=checked]:bg-selection data-[state=checked]:font-semibold data-[state=checked]:text-ink data-highlighted:data-[state=checked]:bg-selection data-disabled:pointer-events-none data-disabled:opacity-50',
  {
    variants: {
      danger: {
        true: 'text-error [--focus-tone:var(--error)] data-highlighted:text-error',
        false: '',
      },
      density: {
        default: 'my-0.5 min-h-11 py-2',
        compact: 'my-px min-h-8 py-1.5',
      },
    },
    defaultVariants: { danger: false, density: 'default' },
  }
)

type MenuDensity = NonNullable<VariantProps<typeof menuItemVariants>['density']>

function MenuItemContent({
  item,
  labelId,
  descriptionId,
}: {
  item: MenuAction
  labelId: string
  descriptionId: string
}) {
  const text = (
    <span className="flex min-w-0 flex-col">
      <span id={labelId}>{item.label}</span>
      {item.description && (
        <span id={descriptionId} className="font-normal text-muted">
          {item.description}
        </span>
      )}
    </span>
  )

  if (item.icon === undefined) return text

  return (
    <IconLabel
      icon={item.icon}
      multiline={Boolean(item.description)}
      className="min-w-0 text-xs"
    >
      {text}
    </IconLabel>
  )
}

function MenuItem({
  item,
  checkable,
  density,
}: {
  item: MenuAction
  checkable: boolean
  density: MenuDensity
}) {
  const id = React.useId()
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`
  const shared = {
    'data-slot': 'menu-item',
    'data-danger': item.danger || undefined,
    disabled: item.disabled,
    onSelect: (event: Event) => item.onSelect(event),
    'aria-labelledby': labelId,
    'aria-describedby': item.description ? descriptionId : undefined,
    className: cn(menuItemVariants({ danger: item.danger ?? false, density })),
  }
  const content = (
    <MenuItemContent
      item={item}
      labelId={labelId}
      descriptionId={descriptionId}
    />
  )

  if (!checkable) {
    return (
      <DropdownMenuPrimitive.Item {...shared}>
        {content}
      </DropdownMenuPrimitive.Item>
    )
  }

  return (
    <DropdownMenuPrimitive.RadioItem value={item.id} {...shared}>
      {content}
      <DropdownMenuPrimitive.ItemIndicator className="ms-auto inline-flex shrink-0">
        <CheckIcon aria-hidden="true" className="size-4 text-signal-contrast" />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.RadioItem>
  )
}

type MenuProps = Pick<
  React.ComponentProps<typeof DropdownMenuPrimitive.Root>,
  'open' | 'onOpenChange'
> &
  Pick<
    React.ComponentProps<typeof DropdownMenuPrimitive.Content>,
    'side' | 'align' | 'sideOffset' | 'collisionPadding'
  > & {
    /** Interactive element with an accessible name; receives the trigger props (`asChild`). */
    trigger: React.ReactNode
    items: MenuEntry[]
    /** Panel header; also names the menu. */
    label?: string
    /** The panel takes the trigger width. */
    matchTriggerWidth?: boolean
    /**
     * Px kept free on each side of the trigger: the panel is as wide as the
     * trigger minus twice this value and starts this far in (`align` start).
     * For full-width rows, such as the app shell rail. Overrides `matchTriggerWidth`.
     */
    inset?: number
    /** `default`: 44 px items. `compact`: 32 px items for dense desktop menus. */
    density?: MenuDensity
  }

/** Props-based action menu on top of Radix DropdownMenu ("Menu / Tooltip" contract). */
function Menu({
  trigger,
  items,
  label,
  side,
  align = 'start',
  sideOffset = 8,
  open,
  onOpenChange,
  matchTriggerWidth = false,
  inset,
  collisionPadding,
  density = 'default',
}: MenuProps) {
  const labelId = React.useId()
  const { modality, onPointer, onKeyboard } = useInputModality()
  const checkedId = getCheckedId(items)
  const entries = items.map((entry) =>
    isMenuSeparator(entry) ? (
      <DropdownMenuPrimitive.Separator key={entry.id} asChild>
        <Separator decorative={false} className="my-1" />
      </DropdownMenuPrimitive.Separator>
    ) : (
      <MenuItem
        key={entry.id}
        item={entry}
        checkable={isCheckable(entry)}
        density={density}
      />
    )
  )
  const listClassName = 'flex min-h-0 flex-col overflow-y-auto py-1'

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenuPrimitive.Trigger
        asChild
        onPointerDown={onPointer}
        onKeyDown={onKeyboard}
      >
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          asChild
          side={side}
          align={inset === undefined ? align : 'start'}
          alignOffset={inset}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          aria-labelledby={label ? labelId : undefined}
          onPointerMove={onPointer}
          onKeyDown={onKeyboard}
        >
          <Card
            divided
            data-slot="menu"
            data-input={modality}
            data-density={density}
            style={
              inset === undefined
                ? undefined
                : ({ '--menu-inset': `${inset}px` } as React.CSSProperties)
            }
            className={cn(
              'group/menu z-pop max-h-(--radix-dropdown-menu-content-available-height) min-w-48 origin-(--radix-dropdown-menu-content-transform-origin) shadow-pop data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none',
              inset !== undefined
                ? 'w-[calc(var(--radix-dropdown-menu-trigger-width)-2*var(--menu-inset))]'
                : matchTriggerWidth
                  ? 'w-(--radix-dropdown-menu-trigger-width)'
                  : 'max-w-80'
            )}
          >
            {label && (
              <CardHeader className="px-3.5 pt-3 pb-2">
                <DropdownMenuPrimitive.Label
                  id={labelId}
                  data-slot="menu-label"
                  className="text-xs text-muted"
                >
                  {label}
                </DropdownMenuPrimitive.Label>
              </CardHeader>
            )}
            {checkedId === null ? (
              <div className={listClassName}>{entries}</div>
            ) : (
              <DropdownMenuPrimitive.RadioGroup
                value={checkedId}
                className={listClassName}
              >
                {entries}
              </DropdownMenuPrimitive.RadioGroup>
            )}
          </Card>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}

export { Menu }
export type { MenuDensity, MenuProps }
export type { MenuAction, MenuEntry } from '@/components/ui/lib/menu'
