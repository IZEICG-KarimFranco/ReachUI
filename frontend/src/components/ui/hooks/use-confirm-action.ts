import { useCallback, useState } from 'react'

interface UseConfirmActionOptions {
  onConfirm: () => void | Promise<void>
  onOpenChange: (open: boolean) => void
  /** Si se pasa, el consumidor decide cuándo cerrar. La promesa de `onConfirm` se espera igual para bloquear la repetición. */
  pending?: boolean
}

export function useConfirmAction({
  onConfirm,
  onOpenChange,
  pending,
}: UseConfirmActionOptions) {
  const [running, setRunning] = useState(false)
  const isPending = Boolean(pending) || running

  const confirm = useCallback(async () => {
    if (isPending) return

    setRunning(true)
    try {
      await onConfirm()
      if (pending === undefined) onOpenChange(false)
    } catch (error) {
      console.error('Error durante la acción de confirmación:', error)
    } finally {
      setRunning(false)
    }
  }, [isPending, onConfirm, onOpenChange, pending])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && isPending) return
      onOpenChange(open)
    },
    [isPending, onOpenChange]
  )

  return { isPending, confirm, handleOpenChange }
}
