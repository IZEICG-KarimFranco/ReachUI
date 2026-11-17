import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/actions/button'
import { Ellipsis } from 'lucide-react'
import {
  getPageNumbers,
  type PageNumberItem,
} from '@/components/ui/lib/pagination-utils'
import { cn } from '@/lib/utils'

export type { PageNumberItem }

export interface PaginationProps {
  currentPage: number
  totalPages: number
  pageNumbers?: PageNumberItem[]
  canGoNext?: boolean
  canGoPrev?: boolean
  onPageChange: (page: number) => void
  onNext?: () => void
  onPrev?: () => void
  visiblePagesCount?: number
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  pageNumbers: propPageNumbers,
  canGoNext: propCanGoNext,
  canGoPrev: propCanGoPrev,
  onPageChange,
  onNext,
  onPrev,
  visiblePagesCount = 3,
  className,
}: PaginationProps) {
  const { t } = useTranslation()
  const canGoPrev = propCanGoPrev ?? (totalPages > 1 && currentPage > 1)
  const canGoNext =
    propCanGoNext ?? (totalPages > 1 && currentPage < totalPages)

  const handlePrev = () => {
    if (!canGoPrev) return
    if (onPrev) onPrev()
    else onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (!canGoNext) return
    if (onNext) onNext()
    else onPageChange(currentPage + 1)
  }

  const derivedPageNumbers = React.useMemo<PageNumberItem[]>(() => {
    if (propPageNumbers) return propPageNumbers
    return getPageNumbers(currentPage, totalPages, visiblePagesCount)
  }, [propPageNumbers, totalPages, currentPage, visiblePagesCount])

  return (
    <nav
      aria-label={t('common.pagination')}
      className={cn('flex items-center gap-1.5 select-none', className)}
    >
      <Button
        variant="secondary"
        disabled={!canGoPrev}
        onClick={handlePrev}
        aria-label={t('common.previous_page')}
        className="h-10 w-10 min-w-10 p-0 rounded-control border-control text-xs font-normal text-muted hover:text-ink leading-none shrink-0"
      >
        ‹
      </Button>

      <span className="sm:hidden px-2 text-xs font-medium text-muted tabular-nums whitespace-nowrap">
        {totalPages > 0 ? `${currentPage} / ${totalPages}` : '0 / 0'}
      </span>

      <div className="hidden sm:flex items-center gap-1.5">
        {derivedPageNumbers.map((item, idx) => {
          if (item === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${idx}`}
                aria-hidden="true"
                className="flex h-10 w-10 min-w-10 items-center justify-center text-muted select-none shrink-0"
              >
                <Ellipsis className="size-4" />
              </span>
            )
          }

          const isSelected = item === currentPage
          return (
            <Button
              key={item}
              variant="secondary"
              disabled={isSelected}
              aria-current={isSelected ? 'page' : undefined}
              onClick={() => {
                if (!isSelected) onPageChange(item)
              }}
              className={cn(
                'h-10 w-10 min-w-10 p-0 text-xs tabular-nums rounded-control transition-colors shrink-0',
                isSelected
                  ? 'border-2 border-signal-contrast text-signal-contrast font-bold disabled:opacity-100 bg-card cursor-default'
                  : 'text-ink font-semibold border-control hover:border-line-strong'
              )}
            >
              {item}
            </Button>
          )
        })}
      </div>

      <Button
        variant="secondary"
        disabled={!canGoNext}
        onClick={handleNext}
        aria-label={t('common.next_page')}
        className="h-10 w-10 min-w-10 p-0 rounded-control border-control text-xs font-normal text-muted hover:text-ink leading-none shrink-0"
      >
        ›
      </Button>
    </nav>
  )
}
