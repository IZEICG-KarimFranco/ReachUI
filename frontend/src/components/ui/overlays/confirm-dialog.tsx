import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/actions/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlays/dialog'
import { useConfirmAction } from '@/components/ui/hooks/use-confirm-action'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  helper?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Texto de la acción mientras está en pending; si falta se mantiene `confirmLabel`. */
  pendingLabel?: string
  tone?: 'default' | 'danger'
  onConfirm: () => void | Promise<void>
  /** Sin él, espera la promesa de `onConfirm` y cierra al resolver. Con él, manda el consumidor. */
  pending?: boolean
}

/** Confirma o cancela una acción. Controlado con `open`/`onOpenChange`; ver DG-6 y CF-1…CF-6. */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  helper,
  confirmLabel,
  cancelLabel,
  pendingLabel,
  tone = 'default',
  onConfirm,
  pending,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  const { isPending, confirm, handleOpenChange } = useConfirmAction({
    onConfirm,
    onOpenChange,
    pending,
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="p-5 sm:max-w-[400px] max-[560px]:top-auto max-[560px]:bottom-0 max-[560px]:left-0 max-[560px]:max-w-none max-[560px]:translate-x-0 max-[560px]:translate-y-0 max-[560px]:rounded-t-[18px] max-[560px]:rounded-b-none max-[560px]:px-[18px] max-[560px]:pb-[calc(18px+env(safe-area-inset-bottom))]"
      >
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {helper && <p className="text-muted text-xs">{helper}</p>}
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="quiet"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            {cancelLabel ?? t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant={tone === 'danger' ? 'danger' : 'primary'}
            loading={isPending}
            onClick={confirm}
          >
            {isPending && pendingLabel
              ? pendingLabel
              : (confirmLabel ?? t('common.confirm'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmDialog }
export type { ConfirmDialogProps }
