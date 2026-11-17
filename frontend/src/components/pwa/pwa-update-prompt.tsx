import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/actions/button'

const UPDATE_AVAILABLE_EVENT = 'reach:pwa-update-available'

export function PwaUpdatePrompt() {
  const { t } = useTranslation()
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const handleUpdateAvailable = () => setIsUpdateAvailable(true)

    window.addEventListener(UPDATE_AVAILABLE_EVENT, handleUpdateAvailable)
    return () =>
      window.removeEventListener(UPDATE_AVAILABLE_EVENT, handleUpdateAvailable)
  }, [])

  if (!isUpdateAvailable) return null

  const updateApp = async () => {
    setIsUpdating(true)

    if (!('serviceWorker' in navigator)) {
      window.location.reload()
      return
    }

    const registration = await navigator.serviceWorker.getRegistration()
    const waitingWorker = registration?.waiting

    if (!waitingWorker) {
      window.location.reload()
      return
    }

    const handleControllerChange = () => window.location.reload()
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      handleControllerChange,
      { once: true }
    )
    waitingWorker.postMessage({ type: 'SKIP_WAITING' })
  }

  return (
    <aside
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-lg items-center justify-between gap-4 rounded-xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm text-foreground">
        {t('pwa.update_available', {
          defaultValue: 'Hay una nueva versión de Reach disponible.',
        })}
      </p>
      <Button
        type="button"
        size="sm"
        className="shrink-0"
        onClick={updateApp}
        disabled={isUpdating}
      >
        <RefreshCw aria-hidden="true" className="size-4" />
        {t('pwa.update', { defaultValue: 'Actualizar' })}
      </Button>
    </aside>
  )
}
