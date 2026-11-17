import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/actions/button'
import { Spinner } from '@/components/ui/feedback/spinner'
import { cn } from '@/lib/utils'

export interface CursorPaginationProps {
  canGoNext: boolean
  canGoPrev: boolean
  onNext: () => void
  onPrev: () => void
  loading?: boolean
  label?: string
  className?: string
}

export function CursorPagination({
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
  loading = false,
  label,
  className,
}: CursorPaginationProps) {
  const { t } = useTranslation()

  const handlePrev = () => {
    if (canGoPrev && !loading) {
      onPrev()
    }
  }

  const handleNext = () => {
    if (canGoNext && !loading) {
      onNext()
    }
  }

  return (
    <nav
      aria-label={t('common.pagination_cursor')}
      aria-busy={loading}
      className={cn('flex items-center gap-1.5 select-none', className)}
    >
      {label && (
        <span className="text-xs text-muted font-medium mr-1.5 hidden sm:inline-block">
          {label}
        </span>
      )}

      {loading && (
        <div role="status" className="flex items-center justify-center mx-1">
          <Spinner className="size-4 text-signal shrink-0" aria-hidden="true" />
          <span className="sr-only">{t('common.loading')}</span>
        </div>
      )}

      <Button
        variant="secondary"
        disabled={!canGoPrev || loading}
        onClick={handlePrev}
        aria-label={t('common.previous_page')}
        className="h-11 w-11 min-w-11 p-0 rounded-control border-control text-sm font-normal text-muted hover:text-ink leading-none shrink-0"
      >
        ‹
      </Button>

      <Button
        variant="secondary"
        disabled={!canGoNext || loading}
        onClick={handleNext}
        aria-label={t('common.next_page')}
        className="h-11 w-11 min-w-11 p-0 rounded-control border-control text-sm font-normal text-muted hover:text-ink leading-none shrink-0"
      >
        ›
      </Button>
    </nav>
  )
}
