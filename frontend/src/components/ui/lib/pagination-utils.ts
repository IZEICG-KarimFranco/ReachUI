export type PageNumberItem = number | 'ellipsis'

export function getPageNumbers(
  current: number,
  total: number,
  visiblePagesCount?: number
): PageNumberItem[] {
  if (total <= 0) return []

  if (visiblePagesCount && visiblePagesCount < total) {
    let start = current
    if (start + visiblePagesCount - 1 > total) {
      start = Math.max(1, total - visiblePagesCount + 1)
    }
    return Array.from({ length: visiblePagesCount }, (_, i) => start + i).filter(
      (p) => p <= total
    )
  }

  const pages: PageNumberItem[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, 'ellipsis', total)
    } else if (current > total - 4) {
      pages.push(
        1,
        'ellipsis',
        total - 4,
        total - 3,
        total - 2,
        total - 1,
        total
      )
    } else {
      pages.push(
        1,
        'ellipsis',
        current - 1,
        current,
        current + 1,
        'ellipsis',
        total
      )
    }
  }
  return pages
}
