import * as React from 'react'
import type { LucideIcon } from 'lucide-react'

type IconSource = LucideIcon | React.ReactNode

function isIconComponent(icon: IconSource): icon is LucideIcon {
  if (typeof icon === 'function') return true
  return (
    typeof icon === 'object' &&
    icon !== null &&
    !React.isValidElement(icon) &&
    'render' in icon
  )
}

function hasLabelText(children: React.ReactNode): boolean {
  return React.Children.toArray(children).length > 0
}

function replaceChildContent(
  child: React.ReactNode,
  render: (content: React.ReactNode) => React.ReactNode
): React.ReactNode {
  if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
    return child
  }
  return React.cloneElement(child, undefined, render(child.props.children))
}

export { hasLabelText, isIconComponent, replaceChildContent }
export type { IconSource }
