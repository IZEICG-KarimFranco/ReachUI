import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Reach scales (global.css) so `text-label` is not merged away as a color.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['display', 'headline', 'title', 'body', 'label', 'data'],
      radius: ['control', 'surface', 'pill', 'port'],
      shadow: ['1', '2', 'pop', 'lift'],
    },
  },
})

export { getPageNumbers, type PageNumberItem } from '@/components/ui/lib/pagination-utils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocaleDate(date: Date | string) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(date).toLocaleString(navigator.language, options)
}

export const generateSlug = (text: string) => {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
}

export function getPaginationMetadata(
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const startRange = total === 0 ? 0 : (page - 1) * limit + 1
  const endRange = Math.min(page * limit, total)
  return { totalPages, startRange, endRange }
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== 'object' || typeof b !== 'object') return false
  if (a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((val, i) => deepEqual(val, b[i]))
  }

  const aObj = a as Record<string, unknown>
  const bObj = b as Record<string, unknown>
  const aKeys = Object.keys(aObj).sort()
  const bKeys = Object.keys(bObj).sort()

  if (aKeys.length !== bKeys.length) return false
  if (aKeys.join(',') !== bKeys.join(',')) return false

  return aKeys.every((key) => deepEqual(aObj[key], bObj[key]))
}

export function mergeCustomFields(
  existingCustomFields: Record<string, unknown> | undefined | null,
  formData: Record<string, unknown>,
  excludeKeys: string[] = ['name', 'phone']
): Record<string, string> {
  const custom_fields: Record<string, string> = {}

  const existing = existingCustomFields || {}
  for (const key in existing) {
    const val = existing[key]
    if (val !== null && val !== undefined) {
      custom_fields[key] = String(val)
    }
  }

  for (const key in formData) {
    if (excludeKeys.includes(key)) continue

    const val = formData[key]
    if (val === null || val === undefined || val === '') {
      custom_fields[key] = ''
    } else if (val instanceof Date) {
      custom_fields[key] = val.toISOString()
    } else {
      custom_fields[key] = String(val)
    }
  }

  return custom_fields
}

export function formatCustomFieldValue(
  value: unknown,
  dataType: string,
  options?: {
    language?: string
    yesLabel?: string
    noLabel?: string
  }
): string {
  if (value === undefined || value === null || value === '') {
    return '-'
  }

  if (dataType === 'boolean') {
    const isTrue = value === true || value === 'true'
    return isTrue ? (options?.yesLabel ?? 'Yes') : (options?.noLabel ?? 'No')
  }

  if (dataType === 'date') {
    try {
      return new Intl.DateTimeFormat(options?.language, {
        dateStyle: 'medium',
      }).format(new Date(value as string))
    } catch {
      return '-'
    }
  }

  return String(value)
}

export function parseCustomFieldValue(
  value: unknown,
  dataType: string
): string | number | boolean | Date | null {
  if (value !== undefined && value !== null && value !== '') {
    switch (dataType) {
      case 'date':
        return new Date(value as string)
      case 'number':
        return Number(value)
      case 'boolean':
        return (
          value === true || value === 'true' || value === 1 || value === '1'
        )
      default:
        return String(value)
    }
  } else if (dataType === 'boolean') {
    return false
  }

  return null
}

export const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return ''

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))

  return String.fromCodePoint(...codePoints)
}

export function toUtcStartOfDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  )
}

export function toUtcEndOfDay(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999
    )
  )
}

export function formatDurationSeconds(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s'
  if (seconds < 60) return `${Math.round(seconds)}s`

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.round(seconds % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  }
  return `${minutes}m ${remainingSeconds}s`
}
