import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { OfflineGuard } from '@/components/pwa/offline-screen'

function setNavigatorOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value,
  })
}

describe('OfflineGuard', () => {
  beforeEach(() => {
    setNavigatorOnline(true)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows a loading screen while checking the initial connection', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}))

    render(
      <OfflineGuard>
        <div>private application</div>
      </OfflineGuard>
    )

    expect(screen.getByText('pwa.loading')).toBeVisible()
    expect(
      screen.queryByRole('heading', { name: 'offline.title' })
    ).not.toBeInTheDocument()
  })

  it('shows the offline screen when the browser reports no connection', async () => {
    setNavigatorOnline(false)

    render(
      <OfflineGuard>
        <div>private application</div>
      </OfflineGuard>
    )

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'offline.title' })
      ).toBeVisible()
    )
    expect(screen.getByRole('button', { name: 'offline.retry' })).toBeVisible()
    expect(screen.queryByText('private application')).not.toBeInTheDocument()
  })

  it('switches between the app and offline screen with browser events', async () => {
    render(
      <OfflineGuard>
        <div>private application</div>
      </OfflineGuard>
    )

    await waitFor(() =>
      expect(screen.getByText('private application')).toBeVisible()
    )

    fireEvent(window, new Event('offline'))
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'offline.title' })
      ).toBeVisible()
    )

    fireEvent(window, new Event('online'))
    await waitFor(() =>
      expect(screen.getByText('private application')).toBeVisible()
    )
  })

  it('keeps the offline screen when retry cannot reach the server', async () => {
    setNavigatorOnline(true)
    vi.mocked(fetch).mockRejectedValue(new Error('Network unavailable'))

    render(
      <OfflineGuard>
        <div>private application</div>
      </OfflineGuard>
    )

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'offline.title' })
      ).toBeVisible()
    )

    fireEvent.click(screen.getByRole('button', { name: 'offline.retry' }))

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'offline.title' })
      ).toBeVisible()
    )
    expect(screen.queryByText('private application')).not.toBeInTheDocument()
  })
})
