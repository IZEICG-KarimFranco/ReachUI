/**
 * Index of the first enabled item starting at `from` and moving by `step`,
 * wrapping around the ends. Returns -1 when every item is disabled.
 */
export function findEnabledIndex(
  items: ReadonlyArray<{ disabled?: boolean }>,
  from: number,
  step: 1 | -1
): number {
  const total = items.length
  for (let i = 0; i < total; i++) {
    const candidate = (((from + step * i) % total) + total) % total
    if (!items[candidate]?.disabled) return candidate
  }
  return -1
}

/**
 * Index of the single item that gets `tabIndex=0` in a roving-focus group:
 * the last focused enabled item, else the active one, else the first enabled.
 */
export function resolveTabStop(
  items: ReadonlyArray<{ disabled?: boolean }>,
  focusIndex: number | null,
  activeIndex: number
): number {
  if (
    focusIndex !== null &&
    focusIndex >= 0 &&
    focusIndex < items.length &&
    !items[focusIndex].disabled
  )
    return focusIndex
  if (
    activeIndex >= 0 &&
    activeIndex < items.length &&
    !items[activeIndex].disabled
  )
    return activeIndex
  return findEnabledIndex(items, 0, 1)
}
