const BORDER_CLASSES = {
  base: {
    right: 'border-r',
    noRight: 'border-r-0',
    bottom: 'border-b',
    noBottom: 'border-b-0',
  },
  sm: {
    right: 'sm:border-r',
    noRight: 'sm:border-r-0',
    bottom: 'sm:border-b',
    noBottom: 'sm:border-b-0',
  },
  lg: {
    right: 'lg:border-r',
    noRight: 'lg:border-r-0',
    bottom: 'lg:border-b',
    noBottom: 'lg:border-b-0',
  },
} as const

export function getStatStripColumns(count: number) {
  const sm = count === 1 ? 1 : count === 3 ? 3 : 2
  const lg = count >= 4 ? 4 : sm
  return { sm, lg }
}

function breakpointBorders(
  breakpoint: 'sm' | 'lg',
  cols: number,
  index: number,
  count: number
) {
  const classes = BORDER_CLASSES[breakpoint]
  const hasRight = index % cols !== cols - 1 && index !== count - 1
  const hasBottom = Math.floor(index / cols) < Math.floor((count - 1) / cols)
  return [
    hasRight ? classes.right : classes.noRight,
    hasBottom ? classes.bottom : classes.noBottom,
  ]
}

export function getStatCellBorders(index: number, count: number): string[] {
  const { sm, lg } = getStatStripColumns(count)
  const isLast = index === count - 1

  return [
    isLast ? BORDER_CLASSES.base.noBottom : BORDER_CLASSES.base.bottom,
    ...breakpointBorders('sm', sm, index, count),
    ...breakpointBorders('lg', lg, index, count),
  ]
}
