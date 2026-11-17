export interface UserProfile {
  id: string
  default_organization_id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  preferences?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type AppRoleName =
  | 'Owner'
  | 'Admin'
  | 'Marketing'
  | 'Conversation'
  | 'Viewer'
  | 'Agent'
  | string

export type AppPermissionCode =
  | 'api_keys.manage'
  | 'router.manage'
  | 'campaigns.create'
  | 'campaigns.delete'
  | 'campaigns.execute'
  | 'campaigns.read'
  | 'campaigns.reports.view'
  | 'campaigns.update'
  | 'contacts.create'
  | 'contacts.delete'
  | 'contacts.read'
  | 'contacts.update'
  | 'conversations.create'
  | 'conversations.delete'
  | 'conversations.read'
  | 'conversations.reports.view'
  | 'conversations.update'
  | 'org.read'
  | 'org.update'
  | 'org.create'
  | 'org.members.manage'
  | 'twilio.read'
  | 'twilio.manage'
  | 'templates.read'
  | 'reporting.all'

export type MemberStatus = 'active' | 'invited' | 'inactive' | 'expired'

export type OrgFeatureFlag =
  | 'rcs_channel'
  | 'contact_comments'
  | 'contact_tasks'

export interface AppRole {
  id: string
  name: AppRoleName
  description: string
  is_system: boolean
  created_at: string
  updated_at: string
}

export interface AppPermission {
  code: AppPermissionCode
  name: string
  description: string
  resource: string
  created_at: string
}

export interface AppRolePermissions {
  role_id: string
  permissions_code: string
  created_at: string
}
export interface Organization {
  id: string
  name: string
  slug: string
  settings: Record<string, unknown>
  timezone: string
  locale: string
  max_users: number
  max_campaigns_per_month: number
  is_active: boolean
  owner_id: string | null
  created_at: string
  updated_at: string
  features?: OrgFeatureFlag[]
}

export interface OrganizationSettings {
  name: string
  slug: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role_id: string
  status: MemberStatus
  created_at: string
  updated_at: string
}

export interface UserOrganization {
  id: string
  organization_id: string
  user_id: string
  status: MemberStatus
  role: {
    name: AppRoleName
    is_system: boolean
  }
  permissions: {
    code: AppPermissionCode
    resource: string
  }[]
  created_at: string
  updated_at: string
}

export const IframeMessageEvent = {
  FlexAuth: 'FLEX_AUTH',
  FlexAuthRefresh: 'FLEX_AUTH_REFRESH',
  RequestTokenRefresh: 'REQUEST_TOKEN_REFRESH',
  FlexAuthError: 'FLEX_AUTH_ERROR',
} as const

export type IframeMessageEvent =
  (typeof IframeMessageEvent)[keyof typeof IframeMessageEvent]
