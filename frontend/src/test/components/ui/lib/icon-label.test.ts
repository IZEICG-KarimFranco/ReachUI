import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { User } from 'lucide-react'

import {
  hasLabelText,
  isIconComponent,
  replaceChildContent,
} from '@/components/ui/lib/icon-label'

describe('isIconComponent', () => {
  it('accepts a lucide icon component', () => {
    expect(isIconComponent(User)).toBe(true)
  })

  it('rejects an element, a string and null', () => {
    expect(isIconComponent(React.createElement('span'))).toBe(false)
    expect(isIconComponent('•')).toBe(false)
    expect(isIconComponent(null)).toBe(false)
  })
})

describe('hasLabelText', () => {
  it('is false for empty children', () => {
    expect(hasLabelText(undefined)).toBe(false)
    expect(hasLabelText(null)).toBe(false)
    expect(hasLabelText(false)).toBe(false)
    expect(hasLabelText([])).toBe(false)
  })

  it('is true for text or an element', () => {
    expect(hasLabelText('Perfil')).toBe(true)
    expect(hasLabelText(0)).toBe(true)
    expect(hasLabelText(React.createElement('b', null, 'x'))).toBe(true)
  })
})

describe('replaceChildContent', () => {
  it('replaces the children of an element and keeps its props', () => {
    const child = React.createElement('a', { href: '/x' }, 'Inicio')
    const result = replaceChildContent(child, (content) =>
      React.createElement('span', null, content)
    )
    expect(React.isValidElement(result)).toBe(true)
    const element = result as React.ReactElement<{
      href: string
      children: React.ReactElement<{ children: string }>
    }>
    expect(element.props.href).toBe('/x')
    expect(element.props.children.type).toBe('span')
    expect(element.props.children.props.children).toBe('Inicio')
  })

  it('returns non-elements untouched', () => {
    expect(replaceChildContent('texto', () => null)).toBe('texto')
  })
})
