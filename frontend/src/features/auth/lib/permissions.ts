import type { AppPermissionCode, UserOrganization } from '@/types/app'

export const CONVERSATIONS_PERMISSIONS = [
  'conversations.read',
  'conversations.create',
  'conversations.update',
  'conversations.delete',
] as const satisfies readonly AppPermissionCode[]

export function extractPermissionCodes(
  userOrganization: UserOrganization | null
): AppPermissionCode[] {
  return userOrganization?.permissions?.map((p) => p.code) ?? []
}

export function hasAnyPermission(
  granted: readonly AppPermissionCode[],
  required?: AppPermissionCode | readonly AppPermissionCode[]
): boolean {
  if (!required || required.length === 0) return true

  const codes = typeof required === 'string' ? [required] : required

  return codes.some((code) => granted.includes(code))
}

export function hasAllPermissions(
  granted: readonly AppPermissionCode[],
  required: readonly AppPermissionCode[]
): boolean {
  return required.every((code) => granted.includes(code))
}
