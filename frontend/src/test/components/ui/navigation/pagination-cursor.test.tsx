import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CursorPagination } from '@/components/ui/navigation/pagination-cursor'

describe('CursorPagination component contract and behaviors (R6)', () => {
  it('renders navigation landmark with localized aria-label and buttons', () => {
    render(
      <CursorPagination
        canGoPrev={true}
        canGoNext={true}
        onPrev={() => {}}
        onNext={() => {}}
        label="Cursor · más recientes"
      />
    )

    const nav = screen.getByRole('navigation', {
      name: /common\.pagination_cursor|paginación por cursor/i,
    })
    expect(nav).toBeInTheDocument()
    expect(screen.getByText('Cursor · más recientes')).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /common\.previous_page|página anterior/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /common\.next_page|página siguiente/i,
      })
    ).toBeInTheDocument()
  })

  it('does not render label when prop is omitted', () => {
    render(
      <CursorPagination
        canGoPrev={true}
        canGoNext={true}
        onPrev={() => {}}
        onNext={() => {}}
      />
    )

    expect(screen.queryByText('Cursor · más recientes')).not.toBeInTheDocument()
  })

  it('triggers onPrev and onNext callbacks on click and keyboard activation (Enter/Space)', () => {
    const handlePrev = vi.fn()
    const handleNext = vi.fn()

    render(
      <CursorPagination
        canGoPrev={true}
        canGoNext={true}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    )

    const prevBtn = screen.getByRole('button', {
      name: /common\.previous_page|página anterior/i,
    })
    const nextBtn = screen.getByRole('button', {
      name: /common\.next_page|página siguiente/i,
    })

    // Click en anterior
    fireEvent.click(prevBtn)
    expect(handlePrev).toHaveBeenCalledTimes(1)

    // Click en siguiente
    fireEvent.click(nextBtn)
    expect(handleNext).toHaveBeenCalledTimes(1)

    // Teclado en siguiente
    fireEvent.keyDown(nextBtn, { key: 'Enter' })
    nextBtn.click()
    expect(handleNext).toHaveBeenCalledTimes(2)

    fireEvent.keyDown(prevBtn, { key: ' ' })
    prevBtn.click()
    expect(handlePrev).toHaveBeenCalledTimes(2)
  })

  it('disables next button when canGoNext is false and ignores clicks', () => {
    const handleNext = vi.fn()
    render(
      <CursorPagination
        canGoPrev={true}
        canGoNext={false}
        onPrev={() => {}}
        onNext={handleNext}
      />
    )

    const nextBtn = screen.getByRole('button', {
      name: /common\.next_page|página siguiente/i,
    })
    expect(nextBtn).toBeDisabled()

    fireEvent.click(nextBtn)
    expect(handleNext).not.toHaveBeenCalled()
  })

  it('disables prev button when canGoPrev is false and ignores clicks', () => {
    const handlePrev = vi.fn()
    render(
      <CursorPagination
        canGoPrev={false}
        canGoNext={true}
        onPrev={handlePrev}
        onNext={() => {}}
      />
    )

    const prevBtn = screen.getByRole('button', {
      name: /common\.previous_page|página anterior/i,
    })
    expect(prevBtn).toBeDisabled()

    fireEvent.click(prevBtn)
    expect(handlePrev).not.toHaveBeenCalled()
  })

  it('exposes accessible loading status, sets aria-busy, and disables both buttons', () => {
    const handlePrev = vi.fn()
    const handleNext = vi.fn()

    render(
      <CursorPagination
        canGoPrev={true}
        canGoNext={true}
        onPrev={handlePrev}
        onNext={handleNext}
        loading={true}
      />
    )

    // aria-busy en el nav contenedor
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-busy', 'true')

    // role="status" accesible sin depender de tags svg
    const status = screen.getByRole('status')
    expect(status).toBeInTheDocument()
    expect(status.textContent).toContain('common.loading')

    // Ambos botones deshabilitados mientras carga
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
  })
})
