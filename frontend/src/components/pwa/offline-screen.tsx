import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { RefreshCw, WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/actions/button'
import { Spinner } from '@/components/ui/feedback/spinner'

const CONNECTIVITY_CHECK_URL = '/robots.txt'

type ConnectionState = 'loading' | 'offline' | 'online'

async function checkConnection() {
  if (!navigator.onLine) return false

  try {
    const response = await fetch(
      `${CONNECTIVITY_CHECK_URL}?connectivity-check=${Date.now()}`,
      { cache: 'no-store' }
    )
    return response.ok
  } catch {
    return false
  }
}

type OfflineScreenProps = {
  isChecking?: boolean
  onRetry: () => void
}

type ReachMarkProps = {
  label: string
  className?: string
}

function ReachMark({ label, className }: ReachMarkProps) {
  return (
    <svg
      aria-label={label}
      className={className}
      height="96"
      role="img"
      viewBox="0 0 100 100"
      width="96"
    >
      <path fill="#E5E5E5" d="M0 0h33v33H0z" />
      <path fill="#5b2eed" d="M33 0h67v33H33zM0 33h33v67H0z" />
    </svg>
  )
}

export function LoadingScreen() {
  const { t } = useTranslation()

  return (
    <main
      className="flex min-h-svh w-full flex-col items-center justify-center gap-5 px-6 py-12"
      role="status"
      aria-live="polite"
    >
      <ReachMark
        label={t('name')}
        className="size-24 rounded-2xl shadow-lg shadow-primary/20"
      />
      <Spinner
        className="size-6 text-primary motion-reduce:animate-none"
        aria-label={t('pwa.loading', { defaultValue: 'Cargando Reach…' })}
      />
      <p className="text-sm text-muted-foreground">
        {t('pwa.loading', { defaultValue: 'Cargando Reach…' })}
      </p>
    </main>
  )
}

export function OfflineScreen({
  isChecking = false,
  onRetry,
}: OfflineScreenProps) {
  const { t } = useTranslation()

  return (
    <main
      className="flex min-h-svh w-full items-center justify-center px-6 py-12"
      aria-live="assertive"
    >
      <section
        className="flex w-full max-w-md flex-col items-center gap-6 text-center"
        aria-labelledby="offline-title"
        aria-describedby="offline-description"
      >
        <ReachMark
          label={t('name')}
          className="size-24 rounded-2xl shadow-lg shadow-primary/20"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <WifiOff aria-hidden="true" className="size-5" />
            <span className="text-sm font-medium">
              {isChecking
                ? t('offline.checking', {
                    defaultValue: 'Comprobando conexión...',
                  })
                : t('offline.status', { defaultValue: 'Sin conexión' })}
            </span>
          </div>
          <h1
            id="offline-title"
            className="text-2xl font-semibold tracking-tight"
          >
            {isChecking
              ? t('offline.checking_title', {
                  defaultValue: 'Verificando conexión',
                })
              : t('offline.title', { defaultValue: 'Reach está offline' })}
          </h1>
          <p
            id="offline-description"
            className="text-pretty text-sm leading-6 text-muted-foreground"
          >
            {isChecking
              ? t('offline.checking_description', {
                  defaultValue:
                    'Reach se mostrará cuando la conexión esté disponible.',
                })
              : t('offline.description', {
                  defaultValue:
                    'Necesitas conexión a internet para usar Reach. Conéctate y vuelve a intentarlo.',
                })}
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className="min-h-11 min-w-36"
          onClick={onRetry}
          disabled={isChecking}
        >
          <RefreshCw
            aria-hidden="true"
            className={isChecking ? 'size-4 animate-spin' : 'size-4'}
          />
          {isChecking
            ? t('offline.checking_button', {
                defaultValue: 'Comprobando...',
              })
            : t('offline.retry', { defaultValue: 'Reintentar' })}
        </Button>
      </section>
    </main>
  )
}

export function OfflineGuard({ children }: { children: ReactNode }) {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('loading')
  const checkIdRef = useRef(0)

  const verifyConnection = useCallback(async () => {
    const checkId = ++checkIdRef.current
    setConnectionState('loading')

    const isConnected = await checkConnection()
    if (checkId !== checkIdRef.current) return

    setConnectionState(isConnected ? 'online' : 'offline')
  }, [])

  useEffect(() => {
    void verifyConnection()

    const handleOnline = () => void verifyConnection()
    const handleOffline = () => {
      checkIdRef.current += 1
      setConnectionState('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      checkIdRef.current += 1
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [verifyConnection])

  if (connectionState === 'online') return children
  if (connectionState === 'loading') return <LoadingScreen />

  return <OfflineScreen onRetry={() => void verifyConnection()} />
}
