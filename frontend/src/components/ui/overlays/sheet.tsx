import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@/components/ui/actions/button'
import {
  SheetContext,
  useSheetLayout,
  type SheetSide,
} from '@/components/ui/hooks/use-sheet'
import { cn } from '@/lib/utils'

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none fixed inset-0 z-sheet bg-panel/45',
        className
      )}
      {...props}
    />
  )
}

function SheetCloseButton({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <SheetPrimitive.Close asChild>
      <IconButton
        variant="quiet"
        aria-label={t('common.close')}
        className={cn('text-muted hover:text-ink', className)}
      >
        <XIcon aria-hidden="true" />
      </IconButton>
    </SheetPrimitive.Close>
  )
}

const sideClasses: Record<SheetSide, string> = {
  responsive:
    'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 max-h-[88dvh] w-full overflow-hidden rounded-t-[16px] border desktop:data-[state=closed]:slide-out-to-bottom-0 desktop:data-[state=open]:slide-in-from-bottom-0 desktop:data-[state=closed]:slide-out-to-right desktop:data-[state=open]:slide-in-from-right desktop:inset-y-0 desktop:right-0 desktop:left-auto desktop:h-dvh desktop:max-h-none desktop:w-[440px] desktop:rounded-none desktop:border-y-0 desktop:border-r-0',
  center:
    'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 max-h-[92dvh] w-full overflow-hidden rounded-t-[16px] border desktop:data-[state=closed]:slide-out-to-bottom-0 desktop:data-[state=open]:slide-in-from-bottom-0 desktop:data-[state=closed]:fade-out-0 desktop:data-[state=open]:fade-in-0 desktop:data-[state=closed]:zoom-out-95 desktop:data-[state=open]:zoom-in-95 desktop:inset-0 desktop:m-auto desktop:h-fit desktop:max-h-[84dvh] desktop:w-[min(620px,92vw)] desktop:rounded-[16px]',
  // LEGACY: borrar al terminar la migración del rediseño (T02–T06)
  right:
    'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
  left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
}

function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: SheetSide
  showCloseButton?: boolean
}) {
  const context = React.useMemo(
    () => ({ side, showCloseButton }),
    [side, showCloseButton]
  )

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetContext.Provider value={context}>
        <SheetPrimitive.Content
          data-slot="sheet-content"
          data-side={side}
          className={cn(
            'bg-paper text-ink border-line data-[state=open]:animate-in data-[state=closed]:animate-out motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none motion-reduce:transition-none fixed z-sheet flex flex-col transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
            sideClasses[side],
            className
          )}
          {...props}
        >
          {children}
          {showCloseButton && (side === 'right' || side === 'left') && (
            <SheetCloseButton className="absolute top-3 right-3" />
          )}
        </SheetPrimitive.Content>
      </SheetContext.Provider>
    </SheetPortal>
  )
}

function SheetHeader({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const { slotted, showCloseButton } = useSheetLayout()

  return (
    <div
      data-slot="sheet-header"
      className={cn(
        slotted
          ? 'border-line bg-card flex flex-none items-center gap-3 border-b px-4 py-3'
          : 'flex flex-col gap-1.5 p-4',
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <SheetCloseButton className="border-line hover:border-line-strong ml-auto border" />
      )}
    </div>
  )
}

function SheetBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 *:flex-none',
        className
      )}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  const { slotted } = useSheetLayout()

  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        slotted
          ? 'border-line bg-card flex flex-none items-center gap-2 border-t px-4 pt-3 pb-[calc(--spacing(3)+env(safe-area-inset-bottom))]'
          : 'mt-auto flex flex-col gap-2 p-4',
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  const { slotted } = useSheetLayout()

  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        'text-ink font-semibold',
        slotted &&
          'min-w-0 truncate text-lg leading-tight font-extrabold tracking-tight',
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  const { slotted } = useSheetLayout()

  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn(
        'text-muted',
        slotted ? 'shrink-0 text-xs whitespace-nowrap' : 'text-sm',
        className
      )}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
