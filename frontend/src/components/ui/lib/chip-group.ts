/** Removes `value` if present, otherwise appends it. Returns a new array. */
export function toggleValue(
  values: readonly string[],
  value: string
): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}
