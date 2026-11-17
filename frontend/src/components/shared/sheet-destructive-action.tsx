import { Trash2, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/actions/button'
import { Spinner } from '@/components/ui/feedback/spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/overlays/alert-dialog'
import { cn } from '@/lib/utils'

interface SheetDestructiveActionProps {
  title: string
  description: string
  buttonLabel: string
  confirmLabel: string
  isLoading?: boolean
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  className?: string
}

export function SheetDestructiveAction({
  title,
  description,
  buttonLabel,
  confirmLabel,
  isLoading,
  isOpen,
  onOpenChange,
  onConfirm,
  className,
}: SheetDestructiveActionProps) {
  const { t } = useTranslation()

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className={cn('gap-2', className)}
        onClick={() => onOpenChange(true)}
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : <Trash2 className="h-4 w-4" />}
        {buttonLabel}
      </Button>

      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive border border-destructive/20 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </AlertDialogMedia>
            <AlertDialogTitle className="text-xl font-bold">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={onConfirm}>
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
