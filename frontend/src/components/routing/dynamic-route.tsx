import { useEffect, type ComponentType, type ReactNode } from 'react'
import type { AppPermissionCode, OrgFeatureFlag } from '@/types/app'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Redirect, Route, type RouteProps } from 'wouter'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useFeatureFlag } from '@/features/auth/hooks/useFeatureFlag'
import { usePermission } from '@/features/auth/hooks/usePermission'
import { useAuthStore } from '@/features/auth/store/auth'
import { Spinner } from '@/components/ui/feedback/spinner'

interface DynamicRouteProps {
  authenticatedComponent: ComponentType<unknown>
  unauthenticatedComponent: ComponentType<unknown>
  authenticatedLayout: ComponentType<{ children: ReactNode }>
  unauthenticatedLayout: ComponentType<{ children: ReactNode }>
}

/**
 * Dynamic route component that renders different components AND layouts based on authentication state
 * This allows the same URL to show different content for authenticated vs unauthenticated users
 * Similar to Vercel's approach where "/" shows the app for authenticated users and landing for others
 */
export function DynamicRoute({
  authenticatedComponent: AuthenticatedComponent,
  unauthenticatedComponent: UnauthenticatedComponent,
  authenticatedLayout: AuthenticatedLayout,
  unauthenticatedLayout: UnauthenticatedLayout,
}: DynamicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <AuthenticatedLayout>
        <AuthenticatedComponent />
      </AuthenticatedLayout>
    )
  }

  return (
    <UnauthenticatedLayout>
      <UnauthenticatedComponent />
    </UnauthenticatedLayout>
  )
}

interface RouteWithLayoutProps extends Omit<RouteProps, 'component'> {
  layout: ComponentType<{ children: ReactNode }>
  component: ComponentType<unknown>
  requiredPermission?: AppPermissionCode | AppPermissionCode[]
  requiredFeature?: OrgFeatureFlag
}

function AccessDeniedRedirect() {
  const { t } = useTranslation()

  useEffect(() => {
    toast.warning(t('auth.access_denied'), { id: 'access-denied' })
  }, [t])

  return <Redirect to="/" replace />
}

export function RouteWithLayout({
  layout: Layout,
  component: Component,
  requiredPermission,
  requiredFeature,
  ...props
}: RouteWithLayoutProps) {
  const { hasPermission, isReady } = usePermission()
  const { hasFeature } = useFeatureFlag()
  const { isAuthenticated, isLoading } = useAuth()
  const isWithoutOrganization = useAuthStore(
    (state) => state.authStatus === 'no_organization'
  )

  const isGated = Boolean(requiredPermission || requiredFeature)

  // Evitamos flasheos de contenido mientras se carga la sesión o permisos
  if (isLoading || (isAuthenticated && isGated && !isReady)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }

  const isDenied =
    (requiredPermission && !hasPermission(requiredPermission)) ||
    (requiredFeature && !hasFeature(requiredFeature))

  if (isAuthenticated && isDenied) {
    // MainApp ya redirige a /no-organization
    return isWithoutOrganization ? null : <AccessDeniedRedirect />
  }

  return (
    <Route {...props}>
      <Layout>
        <Component />
      </Layout>
    </Route>
  )
}
