import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useRestoreFocus } from '@/components/ui/hooks/use-restore-focus'
import { cn } from '@/lib/utils'

/**
 * Raíz del modal (Radix). Controlado con `open`/`onOpenChange` o con `defaultOpen`.
 * Solo para confirmar o decidir una acción; formularios y contenido largo van en `Sheet` con `side="center"`.
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/** Abre el dialog. Con `asChild` se apoya en un `Button`. */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/** Cierra el dialog. Con `asChild` se apoya en un `Button` (Cancelar, Cerrar). */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none fixed inset-0 z-sheet bg-panel/50',
        className
      )}
      {...props}
    />
  )
}

/** Contenedor del modal: portal, overlay, foco (al cerrar lo devuelve a quien lo abrió, aunque no haya `DialogTrigger`) y botón de cerrar (`showCloseButton`). Va directo bajo `Dialog`. */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  onOpenAutoFocus,
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  const { t } = useTranslation()
  const restoreFocus = useRestoreFocus()

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'bg-card text-ink border-line rounded-surface shadow-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none motion-reduce:transition-none fixed top-[50%] left-[50%] z-sheet grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 duration-200 sm:max-w-lg',
          className
        )}
        onOpenAutoFocus={(event) => {
          restoreFocus.onOpenAutoFocus()
          onOpenAutoFocus?.(event)
        }}
        onCloseAutoFocus={(event) => {
          onCloseAutoFocus?.(event)
          if (!event.defaultPrevented) restoreFocus.onCloseAutoFocus(event)
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="text-muted hover:bg-selection hover:text-ink data-[state=open]:bg-selection data-[state=open]:text-ink-secondary focus-ring rounded-control absolute top-3 right-3 inline-flex size-11 min-h-44px min-w-44px cursor-pointer items-center justify-center transition-colors outline-none disabled:pointer-events-none motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon aria-hidden="true" />
            <span className="sr-only">{t('common.close')}</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

/** Cabecera del modal: agrupa `DialogTitle` y `DialogDescription`. */
function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

/** Pie con las acciones: columna invertida en móvil, fila a la derecha desde `sm`. */
function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  )
}

/** Título accesible del modal; Radix lo enlaza con `aria-labelledby`. */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        'text-ink text-lg leading-tight font-extrabold tracking-tight',
        className
      )}
      {...props}
    />
  )
}

/** Descripción accesible del modal; Radix la enlaza con `aria-describedby`. */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-ink-secondary text-sm leading-normal', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
