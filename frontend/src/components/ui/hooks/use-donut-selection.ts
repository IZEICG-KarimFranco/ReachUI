import { useCallback, useState, type KeyboardEvent } from 'react'

export function useDonutSelection() {
  const [selected, setSelected] = useState<string | null>(null)
  const [previewed, setPreviewed] = useState<string | null>(null)

  const toggle = useCallback(
    (key: string) => setSelected((current) => (current === key ? null : key)),
    []
  )

  const preview = useCallback((key: string) => setPreviewed(key), [])
  const clearPreview = useCallback(() => setPreviewed(null), [])

  const onKeyDown = useCallback(
    (key: string) => (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggle(key)
      } else if (event.key === 'Escape') {
        setSelected(null)
      }
    },
    [toggle]
  )

  return {
    selected,
    active: previewed ?? selected,
    isPreviewing: previewed !== null,
    toggle,
    preview,
    clearPreview,
    onKeyDown,
  }
}
