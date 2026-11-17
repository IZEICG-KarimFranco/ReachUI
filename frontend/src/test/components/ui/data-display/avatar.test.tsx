import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { Phone } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/data-display/avatar'

class StubImage extends EventTarget {
  static instances: StubImage[] = []
  src = ''
  complete = false
  naturalWidth = 0
  referrerPolicy = ''
  crossOrigin: string | null = null

  constructor() {
    super()
    StubImage.instances.push(this)
  }
}

const settleImage = (type: 'load' | 'error') => {
  const image = StubImage.instances[StubImage.instances.length - 1]
  act(() => {
    image.dispatchEvent(new Event(type))
  })
}

describe('Avatar', () => {
  beforeEach(() => {
    StubImage.instances = []
    vi.stubGlobal('Image', StubImage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the initials while the image is loading', () => {
    render(<Avatar name="Ana Martínez" src="/ana.png" />)
    const avatar = screen.getByRole('img', { name: 'Ana Martínez' })
    expect(avatar).toHaveTextContent('AM')
    expect(avatar.tagName).not.toBe('IMG')
  })

  it('swaps the initials for the image once it has loaded', () => {
    render(<Avatar name="Ana Martínez" src="/ana.png" />)
    settleImage('load')
    const image = screen.getByRole('img', { name: 'Ana Martínez' })
    expect(image.tagName).toBe('IMG')
    expect(image).toHaveAttribute('src', '/ana.png')
    expect(screen.queryByText('AM')).toBeNull()
  })

  it('falls back to the initials when the image is broken', () => {
    render(<Avatar name="Ana Martínez" src="/missing.png" />)
    settleImage('error')
    const avatar = screen.getByRole('img', { name: 'Ana Martínez' })
    expect(avatar.tagName).not.toBe('IMG')
    expect(avatar).toHaveTextContent('AM')
  })

  it('shows the initials when there is no image', () => {
    render(<Avatar name="Ana Martínez" />)
    expect(screen.getByRole('img', { name: 'Ana Martínez' })).toHaveTextContent(
      'AM'
    )
    expect(StubImage.instances).toHaveLength(0)
  })

  it('uses one letter for a one-word name and two for a three-word name', () => {
    const { rerender } = render(<Avatar name="Ana" />)
    expect(screen.getByRole('img', { name: 'Ana' })).toHaveTextContent(/^A$/)

    rerender(<Avatar name="Luis Fernando Torres" />)
    expect(
      screen.getByRole('img', { name: 'Luis Fernando Torres' })
    ).toHaveTextContent(/^LF$/)
  })

  it('shows a question mark and hides an avatar without a name from assistive tech', () => {
    const { container } = render(<Avatar name="  " />)
    expect(container).toHaveTextContent('?')
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('names the avatar after the name prop', () => {
    render(<Avatar name="Ana Martínez" />)
    expect(
      screen.getByRole('img', { name: 'Ana Martínez' })
    ).toBeInTheDocument()
  })

  it('hides a decorative avatar from assistive tech', () => {
    const { container } = render(<Avatar name="Ana Martínez" decorative />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('does not hide an avatar that is not decorative', () => {
    const { container } = render(<Avatar name="Ana Martínez" />)
    expect(container.firstElementChild).not.toHaveAttribute('aria-hidden')
  })

  it('renders a custom fallback in place of the initials', () => {
    render(
      <Avatar name="Canal WhatsApp" fallback={<Phone data-testid="icon" />} />
    )
    const avatar = screen.getByRole('img', { name: 'Canal WhatsApp' })
    expect(avatar).toContainElement(screen.getByTestId('icon'))
    expect(avatar).not.toHaveTextContent('CW')
  })

  it('exposes the default size, shape and tone', () => {
    const { container } = render(<Avatar name="Ana Martínez" />)
    expect(container.firstElementChild).toHaveAttribute('data-size', 'sm')
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'square')
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'signal')
  })

  it('exposes the size, shape and tone it is given', () => {
    const { container } = render(
      <Avatar name="Luis Fernando" size="md" shape="circle" tone="success" />
    )
    expect(container.firstElementChild).toHaveAttribute('data-size', 'md')
    expect(container.firstElementChild).toHaveAttribute('data-shape', 'circle')
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'success')
  })

  it('keeps rendering the legacy composition', () => {
    const { container } = render(
      <Avatar className="h-8 w-8">
        <AvatarImage src="/ana.png" alt="Ana" />
        <AvatarFallback>AN</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText('AN')).toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('data-slot', 'avatar')
    expect(container.firstElementChild).not.toHaveAttribute('data-tone')
    settleImage('load')
    expect(screen.getByRole('img', { name: 'Ana' })).toHaveAttribute(
      'src',
      '/ana.png'
    )
    expect(screen.queryByText('AN')).toBeNull()
  })
})
