import { describe, it, expect } from 'vitest'
import { isInaccessible, render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/ui/feedback/skeleton'

function renderSkeleton(props: React.ComponentProps<typeof Skeleton> = {}) {
  const { container } = render(<Skeleton {...props} />)
  const skeleton = container.querySelector('[data-slot="skeleton"]')
  if (!(skeleton instanceof HTMLDivElement)) {
    throw new Error('Skeleton not rendered')
  }
  return skeleton
}

describe('Skeleton component contract', () => {
  it('is decorative by default and hidden from the accessibility tree', () => {
    const skeleton = renderSkeleton()
    expect(skeleton.getAttribute('aria-hidden')).toBe('true')
    expect(skeleton.childElementCount).toBe(0)
    expect(isInaccessible(skeleton)).toBe(true)
  })

  it('lets consumers expose it to assistive tech explicitly', () => {
    const skeleton = renderSkeleton({ 'aria-hidden': false })
    expect(skeleton.getAttribute('aria-hidden')).toBe('false')
    expect(isInaccessible(skeleton)).toBe(false)
  })

  it('replaces the default height and keeps the shimmer when height and width are overridden', () => {
    const skeleton = renderSkeleton({ className: 'h-6 w-3/4' })
    expect(skeleton.classList.contains('h-6')).toBe(true)
    expect(skeleton.classList.contains('w-3/4')).toBe(true)
    expect(skeleton.classList.contains('h-3')).toBe(false)
    expect(skeleton.classList.contains('animate-skeleton')).toBe(true)
  })

  it('replaces the default height and radius when a consumer passes a circle shape', () => {
    const skeleton = renderSkeleton({ className: 'size-15 rounded-full' })
    expect(skeleton.classList.contains('size-15')).toBe(true)
    expect(skeleton.classList.contains('rounded-full')).toBe(true)
    expect(skeleton.classList.contains('h-3')).toBe(false)
    expect(
      [...skeleton.classList].filter((name) => name.startsWith('rounded-'))
    ).toEqual(['rounded-full'])
  })

  it('forwards attributes, data-slot and inline style', () => {
    render(
      <Skeleton id="row-skeleton" data-testid="row" style={{ width: 180 }} />
    )
    const skeleton = screen.getByTestId('row')
    expect(skeleton.id).toBe('row-skeleton')
    expect(skeleton.getAttribute('data-slot')).toBe('skeleton')
    expect(skeleton.style.width).toBe('180px')
  })
})
