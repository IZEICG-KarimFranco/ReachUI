import { describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

import { useConfirmAction } from '@/components/ui/hooks/use-confirm-action'

function deferred() {
  let resolve!: () => void
  let reject!: (reason: Error) => void
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('useConfirmAction', () => {
  it('waits for onConfirm, reports pending meanwhile, and closes when it resolves', async () => {
    const task = deferred()
    const onConfirm = vi.fn(() => task.promise)
    const onOpenChange = vi.fn()
    const { result } = renderHook(() =>
      useConfirmAction({ onConfirm, onOpenChange })
    )

    let confirmation!: Promise<void>
    act(() => {
      confirmation = result.current.confirm()
    })

    expect(result.current.isPending).toBe(true)
    expect(onOpenChange).not.toHaveBeenCalled()

    await act(async () => {
      task.resolve()
      await confirmation
    })

    expect(result.current.isPending).toBe(false)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('stays open and stops being pending when onConfirm rejects', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onOpenChange = vi.fn()
    const onConfirm = vi.fn().mockRejectedValue(new Error('fallo'))
    const { result } = renderHook(() =>
      useConfirmAction({ onConfirm, onOpenChange })
    )

    await act(async () => {
      await result.current.confirm()
    })

    expect(result.current.isPending).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it('ignores a second confirmation and any close request while pending', async () => {
    const task = deferred()
    const onConfirm = vi.fn(() => task.promise)
    const onOpenChange = vi.fn()
    const { result } = renderHook(() =>
      useConfirmAction({ onConfirm, onOpenChange })
    )

    act(() => {
      void result.current.confirm()
    })
    act(() => {
      void result.current.confirm()
      result.current.handleOpenChange(false)
    })

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onOpenChange).not.toHaveBeenCalled()

    await act(async () => {
      task.resolve()
      await task.promise
    })
  })

  it('blocks a second confirmation while onConfirm runs, even with pending={false}', async () => {
    const task = deferred()
    const onConfirm = vi.fn(() => task.promise)
    const onOpenChange = vi.fn()
    const { result } = renderHook(() =>
      useConfirmAction({ onConfirm, onOpenChange, pending: false })
    )

    act(() => {
      void result.current.confirm()
    })
    expect(result.current.isPending).toBe(true)

    act(() => {
      void result.current.confirm()
      result.current.handleOpenChange(false)
    })
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onOpenChange).not.toHaveBeenCalled()

    await act(async () => {
      task.resolve()
      await task.promise
    })
    expect(result.current.isPending).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('lets the consumer own pending: it does not close on its own', async () => {
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()
    const { result, rerender } = renderHook(
      ({ pending }) => useConfirmAction({ onConfirm, onOpenChange, pending }),
      { initialProps: { pending: false } }
    )

    await act(async () => {
      await result.current.confirm()
    })

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(result.current.isPending).toBe(false)

    rerender({ pending: true })
    expect(result.current.isPending).toBe(true)

    act(() => {
      result.current.handleOpenChange(false)
    })
    expect(onOpenChange).not.toHaveBeenCalled()

    rerender({ pending: false })
    act(() => {
      result.current.handleOpenChange(false)
    })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
