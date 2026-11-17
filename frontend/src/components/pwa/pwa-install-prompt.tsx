import { useEffect, useState } from 'react'
import { Download, Share, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/actions/button'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const INSTALL_DISMISSED_KEY = 'reach:pwa-install-dismissed'
const MOBILE_QUERY = '(max-width: 767px) and (pointer: coarse)'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  )
}

function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
    (window.navigator.platform === 'MacIntel' &&
      window.navigator.maxTouchPoints > 1)
  )
}

export function PwaInstallPrompt() {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isIOSDevice, setIsIOSDevice] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches
    if (!isMobile || isStandalone()) return

    if (sessionStorage.getItem(INSTALL_DISMISSED_KEY) === 'true') return

    const ios = isIOS()
    setIsIOSDevice(ios)
    if (ios) setIsVisible(true)

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setIsVisible(true)
    }
    const handleAppInstalled = () => setIsVisible(false)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  if (!isVisible) return null

  const dismiss = () => {
    sessionStorage.setItem(INSTALL_DISMISSED_KEY, 'true')
    setIsVisible(false)
  }

  const install = async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setIsInstalling(false)
    setIsVisible(false)
  }

  return (
    <aside
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-lg items-start gap-3 rounded-xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur"
      role="status"
      aria-live="polite"
    >
      {isIOSDevice ? (
        <Share
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary"
        />
      ) : (
        <Download
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary"
        />
      )}
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-semibold text-foreground">
          {t('pwa.install_title', { defaultValue: 'Instala Reach' })}
        </h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {isIOSDevice
            ? t('pwa.install_ios_description', {
                defaultValue:
                  'Abre Compartir y selecciona “Añadir a pantalla de inicio”.',
              })
            : t('pwa.install_android_description', {
                defaultValue:
                  'Accede más rápido a Reach desde tu pantalla de inicio.',
              })}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {deferredPrompt && (
          <Button
            type="button"
            size="sm"
            onClick={install}
            disabled={isInstalling}
          >
            {t('pwa.install_button', { defaultValue: 'Instalar' })}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t('pwa.install_dismiss', { defaultValue: 'Ahora no' })}
          onClick={dismiss}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
    </aside>
  )
}
