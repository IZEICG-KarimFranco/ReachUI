import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '@/components/ui/navigation/pagination'

describe('Pagination component contract and behaviors', () => {
  it('renders navigation landmark and page buttons', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()

    const page1Btn = screen.getByRole('button', { name: '1' })
    expect(page1Btn).toHaveAttribute('aria-current', 'page')
    expect(page1Btn).toBeDisabled()

    const page2Btn = screen.getByRole('button', { name: '2' })
    expect(page2Btn).not.toHaveAttribute('aria-current')
  })

  it('triggers onPageChange when clicking an enabled page button', () => {
    const handlePageChange = vi.fn()
    render(
      <Pagination
        currentPage={3}
        totalPages={241}
        onPageChange={handlePageChange}
      />
    )

    const page4Btn = screen.getByRole('button', { name: '4' })
    fireEvent.click(page4Btn)
    expect(handlePageChange).toHaveBeenCalledWith(4)
  })

  it('adjusts window to end and disables next button on final page', () => {
    const handlePageChange = vi.fn()
    render(
      <Pagination
        currentPage={241}
        totalPages={241}
        onPageChange={handlePageChange}
      />
    )

    expect(screen.getByRole('button', { name: '239' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '240' })).toBeInTheDocument()
    const lastPageBtn = screen.getByRole('button', { name: '241' })
    expect(lastPageBtn).toBeInTheDocument()
    expect(lastPageBtn).toHaveAttribute('aria-current', 'page')
    expect(lastPageBtn).toBeDisabled()

    const nextBtn = screen.getByRole('button', {
      name: /common\.next_page|página siguiente/i,
    })
    expect(nextBtn).toBeDisabled()
    fireEvent.click(nextBtn)
    expect(handlePageChange).not.toHaveBeenCalled()
  })

  it('does not trigger callback when clicking disabled prev or next buttons', () => {
    const handlePageChange = vi.fn()
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    )

    const prevBtn = screen.getByRole('button', {
      name: /common\.previous_page|página anterior/i,
    })
    expect(prevBtn).toBeDisabled()
    fireEvent.click(prevBtn)
    expect(handlePageChange).not.toHaveBeenCalled()
  })

  it('allows prop overrides for canGoNext, canGoPrev, and pageNumbers', () => {
    const handleNext = vi.fn()
    const handlePrev = vi.fn()

    render(
      <Pagination
        currentPage={2}
        totalPages={10}
        canGoPrev={false}
        canGoNext={false}
        pageNumbers={[2, 3, 4]}
        onPageChange={() => {}}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    )

    const prevBtn = screen.getByRole('button', {
      name: /common\.previous_page|página anterior/i,
    })
    const nextBtn = screen.getByRole('button', {
      name: /common\.next_page|página siguiente/i,
    })

    expect(prevBtn).toBeDisabled()
    expect(nextBtn).toBeDisabled()
    fireEvent.click(prevBtn)
    fireEvent.click(nextBtn)
    expect(handlePrev).not.toHaveBeenCalled()
    expect(handleNext).not.toHaveBeenCalled()

    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument()
  })

  it('renders ellipsis as non-interactive element when provided in pageNumbers', () => {
    const handlePageChange = vi.fn()
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        pageNumbers={[1, 2, 'ellipsis', 10]}
        onPageChange={handlePageChange}
      />
    )

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: /ellipsis/i })).toBeNull()
  })

  it('prevents keyboard activation on the currently active page', () => {
    const handlePageChange = vi.fn()
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    )

    const activeBtn = screen.getByRole('button', { name: '1' })
    expect(activeBtn).toBeDisabled()

    fireEvent.keyDown(activeBtn, { key: 'Enter' })
    fireEvent.keyDown(activeBtn, { key: ' ' })
    expect(handlePageChange).not.toHaveBeenCalled()
  })

  it('handles edge cases with 0 and 1 total pages correctly', () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    )

    let prevBtn = screen.getByRole('button', {
      name: /common\.previous_page|página anterior/i,
    })
    let nextBtn = screen.getByRole('button', {
      name: /common\.next_page|página siguiente/i,
    })
    expect(prevBtn).toBeDisabled()
    expect(nextBtn).toBeDisabled()
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()

    rerender(
      <Pagination currentPage={1} totalPages={0} onPageChange={() => {}} />
    )
    prevBtn = screen.getByRole('button', {
      name: /common\.previous_page|página anterior/i,
    })
    nextBtn = screen.getByRole('button', {
      name: /common\.next_page|página siguiente/i,
    })
    expect(prevBtn).toBeDisabled()
    expect(nextBtn).toBeDisabled()
    expect(screen.queryByRole('button', { name: '1' })).toBeNull()
  })
})
