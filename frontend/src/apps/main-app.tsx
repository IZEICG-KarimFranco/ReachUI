'use client'

import { lazy, Suspense, useEffect } from 'react'
import { Route, Switch } from 'wouter'

import { RootLayout } from '@/layouts/root-layout'
import HomePage from '@/pages/home'
import LandingPage from '@/pages/landing-page'
import AnalyticsConversationsPage from '@/pages/analytics/conversations'
import InboxPage from '@/pages/inbox'

import SignIn from '@/pages/auth/sign-in'
import SignUp from '@/pages/auth/sign-up'
import ForgotPassword from '@/pages/auth/forgot-password'
import ResetPassword from '@/pages/auth/reset-password'
import AcceptInvitation from '@/pages/auth/accept-invitation'
import AuthCallback from '@/pages/auth/auth-callback'
import NoOrganization from '@/pages/no-organization'
import CreateOrganization from '@/pages/create-organization'
import TwilioPage from '@/pages/twilio'
import CampaignId from '@/pages/campaign/id'
import CampaignEditPage from '@/pages/campaign/edit'
import CalendarRoute from '@/pages/calendar'
import TemplatesPage from '@/pages/templates'

import { useAuthStore } from '@/features/auth/store/auth'
import AuthLayout from '@/layouts/auth-layout'
import AppLayout from '@/layouts/app-layout'
import PublicLayout from '@/layouts/public-layout'
import SupervisionPage from '@/pages/supervision'
import {
  DynamicRoute,
  RouteWithLayout,
} from '@/components/routing/dynamic-route'
import ConfigurationPage from '@/pages/configuration'
import { useLocation } from 'wouter'
import AnalyticsListPage from '@/pages/analytics/list'
import AnalyticsCampaignsPage from '@/pages/analytics/campaigns'
import ListsContactsPage from '@/pages/contacts/contacts-list'
import ContactListDetailPage from '@/pages/contacts/list-detail'
import ContactsPage from '@/pages/contacts/contacts-page'
import ContactDetailPage from '@/pages/contacts/contact-detail'
import SegmentContactsPage from '@/pages/contacts/contacts-segment'
import CampaignPage from '@/pages/campaign'
import ChangelogPage from '@/pages/changelog'
import NotFound from '@/pages/not-found'
import { useIframeAuth } from '@/hooks/use-flex-auth'
import { T05PreviewPage } from '@/pages/dev/t05-preview'

const DevMockIndexPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/index'))
  : null
const BadgeMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/badge'))
  : null
const StatusLabelMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/status-label'))
  : null
const AlertMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/alert'))
  : null
const ToastMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/toast'))
  : null
const ButtonMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/button'))
  : null
const DialogMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/dialog'))
  : null
const ConfirmDialogMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/confirm-dialog'))
  : null
const AppShellMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/app-shell'))
  : null
const IconLabelMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/icon-label'))
  : null
const AvatarMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/avatar'))
  : null
const PageHeaderMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/page-header'))
  : null
const SkeletonMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/skeleton'))
  : null
const EmptyMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/empty'))
  : null
const SpinnerMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/spinner'))
  : null
const FieldMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/field'))
  : null
const LabelMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/label'))
  : null
const SurfaceMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/surface'))
  : null
const CardMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/card'))
  : null
const SeparatorMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/separator'))
  : null
const SheetMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/sheet'))
  : null
const TableMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/table'))
  : null
const QuickFiltersMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/quick-filters'))
  : null
const RecordListMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/record-list'))
  : null
const PaginationMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/pagination'))
  : null
const CursorPaginationMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/cursor-pagination'))
  : null
const ModeSwitchMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/mode-switch'))
  : null
const StepsMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/steps'))
  : null
const KeyValueListMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/key-value-list'))
  : null
const TooltipMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/tooltip'))
  : null
const StatStripMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/stat-strip'))
  : null
const ChipGroupMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/chip-group'))
  : null
const MeterMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/meter'))
  : null
const BarChartMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/bar-chart'))
  : null
const DonutChartMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/donut-chart'))
  : null
const ChartLegendMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/chart-legend'))
  : null
const MessagePreviewMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/message-preview'))
  : null
const PasswordInputMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/password-input'))
  : null
const SelectMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/select'))
  : null
const CommandMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/command'))
  : null
const DatePickerMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/date-picker'))
  : null
const SelectionControlsMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/selection-controls'))
  : null
const DropdownMenuMockPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/dropdown-menu'))
  : null
const MockAllPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/dev/mock/all'))
  : null

export function MainApp() {
  const initializeAuth = useAuthStore((state) => state.initialize)
  const authStatus = useAuthStore((state) => state.authStatus)
  const [location, setLocation] = useLocation()

  const {
    isReady: isIframeAuthResolved,
    session: iframeSession,
    organizationSlug: iframeOrganizationSlug,
  } = useIframeAuth()

  useEffect(() => {
    if (!isIframeAuthResolved) return
    initializeAuth(iframeSession, iframeOrganizationSlug)
  }, [
    initializeAuth,
    isIframeAuthResolved,
    iframeSession,
    iframeOrganizationSlug,
  ])

  useEffect(() => {
    if (
      authStatus === 'no_organization' &&
      location !== '/no-organization' &&
      location !== '/create-organization'
    ) {
      setLocation('/no-organization')
    }

    if (
      authStatus === 'ready' &&
      (location === '/no-organization' || location === '/create-organization')
    ) {
      setLocation('/')
    }
  }, [authStatus, location, setLocation])

  return (
    <RootLayout>
      <Switch>
        <RouteWithLayout
          path="/no-organization"
          component={NoOrganization}
          layout={PublicLayout}
        />
        <RouteWithLayout
          path="/create-organization"
          component={CreateOrganization}
          layout={PublicLayout}
        />
        <RouteWithLayout
          path="/sign-in"
          component={SignIn}
          layout={AuthLayout}
        />
        <RouteWithLayout
          path="/sign-up"
          component={SignUp}
          layout={AuthLayout}
        />
        <RouteWithLayout
          path="/forgot-password"
          component={ForgotPassword}
          layout={AuthLayout}
        />
        <RouteWithLayout
          path="/reset-password"
          component={ResetPassword}
          layout={AuthLayout}
        />
        <RouteWithLayout
          path="/accept-invitation"
          component={AcceptInvitation}
          layout={AuthLayout}
        />
        <RouteWithLayout
          path="/auth/callback"
          component={AuthCallback}
          layout={AuthLayout}
        />

        {/* Dynamic route: Shows app for authenticated, landing for unauthenticated */}
        <Route path="/">
          <DynamicRoute
            authenticatedComponent={HomePage}
            unauthenticatedComponent={LandingPage}
            authenticatedLayout={AppLayout}
            unauthenticatedLayout={PublicLayout}
          />
        </Route>

        {/* Landing page route: Always shows landing for all users */}
        <Route path="/home">
          <DynamicRoute
            authenticatedComponent={LandingPage}
            unauthenticatedComponent={LandingPage}
            authenticatedLayout={PublicLayout}
            unauthenticatedLayout={PublicLayout}
          />
        </Route>
        {/* Changelog route: Public page */}
        <RouteWithLayout
          path="/changelog"
          component={ChangelogPage}
          layout={PublicLayout}
        />

        <RouteWithLayout
          path="/campaign"
          component={CampaignPage}
          layout={AppLayout}
          requiredPermission="campaigns.create"
        />
        <RouteWithLayout
          path="/inbox"
          component={InboxPage}
          layout={AppLayout}
          requiredPermission="conversations.read"
        />
        <RouteWithLayout
          path="/supervision"
          component={SupervisionPage}
          layout={AppLayout}
          requiredPermission="conversations.reports.view"
        />
        <RouteWithLayout
          path="/twilio"
          component={TwilioPage}
          layout={AppLayout}
          requiredPermission="twilio.read"
        />
        <RouteWithLayout
          path="/configuration"
          component={ConfigurationPage}
          layout={AppLayout}
        />
        <RouteWithLayout
          path="/templates"
          component={TemplatesPage}
          layout={AppLayout}
          requiredPermission="campaigns.read"
        />
        <RouteWithLayout
          path="/calendar"
          component={CalendarRoute}
          layout={AppLayout}
          requiredPermission="campaigns.read"
        />
        <RouteWithLayout
          path="/analytics/campaigns"
          component={AnalyticsCampaignsPage}
          layout={AppLayout}
          requiredPermission="campaigns.read"
        />
        <RouteWithLayout
          path="/analytics/campaigns/list"
          component={AnalyticsListPage}
          layout={AppLayout}
          requiredPermission="campaigns.read"
        />
        <RouteWithLayout
          path="/analytics/conversations"
          component={AnalyticsConversationsPage}
          layout={AppLayout}
          requiredPermission="conversations.reports.view"
        />
        <RouteWithLayout
          path="/campaign/:id/edit"
          component={CampaignEditPage}
          layout={AppLayout}
          requiredPermission="campaigns.update"
        />
        <RouteWithLayout
          path="/campaign/:id"
          component={CampaignId}
          layout={AppLayout}
          requiredPermission="campaigns.read"
        />
        <RouteWithLayout
          path="/contacts"
          component={ContactsPage}
          layout={AppLayout}
          requiredPermission="contacts.read"
        />
        <RouteWithLayout
          path="/contacts/lists"
          component={ListsContactsPage}
          layout={AppLayout}
          requiredPermission="contacts.read"
        />
        <RouteWithLayout
          path="/contacts/segments"
          component={SegmentContactsPage}
          layout={AppLayout}
          requiredPermission="contacts.read"
        />
        <RouteWithLayout
          path="/contacts/lists/:id"
          component={ContactListDetailPage}
          layout={AppLayout}
          requiredPermission="contacts.read"
        />
        <RouteWithLayout
          path="/contacts/:id"
          component={ContactDetailPage}
          layout={AppLayout}
          requiredPermission="contacts.read"
        />

        <Route path="/dev/t05" component={T05PreviewPage} />
        {DevMockIndexPage && (
          <Route path="/dev/mock">
            <Suspense fallback={null}>
              <DevMockIndexPage />
            </Suspense>
          </Route>
        )}

        {BadgeMockPage && (
          <Route path="/dev/mock/badge">
            <Suspense fallback={null}>
              <BadgeMockPage />
            </Suspense>
          </Route>
        )}

        {StatusLabelMockPage && (
          <Route path="/dev/mock/status-label">
            <Suspense fallback={null}>
              <StatusLabelMockPage />
            </Suspense>
          </Route>
        )}

        {AlertMockPage && (
          <Route path="/dev/mock/alert">
            <Suspense fallback={null}>
              <AlertMockPage />
            </Suspense>
          </Route>
        )}

        {ToastMockPage && (
          <Route path="/dev/mock/toast">
            <Suspense fallback={null}>
              <ToastMockPage />
            </Suspense>
          </Route>
        )}

        {ButtonMockPage && (
          <Route path="/dev/mock/button">
            <Suspense fallback={null}>
              <ButtonMockPage />
            </Suspense>
          </Route>
        )}

        {DialogMockPage && (
          <Route path="/dev/mock/dialog">
            <Suspense fallback={null}>
              <DialogMockPage />
            </Suspense>
          </Route>
        )}

        {ConfirmDialogMockPage && (
          <Route path="/dev/mock/confirm-dialog">
            <Suspense fallback={null}>
              <ConfirmDialogMockPage />
            </Suspense>
          </Route>
        )}

        {AppShellMockPage && (
          <Route path="/dev/mock/app-shell" nest>
            <Suspense fallback={null}>
              <AppShellMockPage />
            </Suspense>
          </Route>
        )}

        {IconLabelMockPage && (
          <Route path="/dev/mock/icon-label">
            <Suspense fallback={null}>
              <IconLabelMockPage />
            </Suspense>
          </Route>
        )}

        {AvatarMockPage && (
          <Route path="/dev/mock/avatar">
            <Suspense fallback={null}>
              <AvatarMockPage />
            </Suspense>
          </Route>
        )}

        {PageHeaderMockPage && (
          <Route path="/dev/mock/page-header">
            <Suspense fallback={null}>
              <PageHeaderMockPage />
            </Suspense>
          </Route>
        )}

        {SkeletonMockPage && (
          <Route path="/dev/mock/skeleton">
            <Suspense fallback={null}>
              <SkeletonMockPage />
            </Suspense>
          </Route>
        )}

        {EmptyMockPage && (
          <Route path="/dev/mock/empty">
            <Suspense fallback={null}>
              <EmptyMockPage />
            </Suspense>
          </Route>
        )}

        {SpinnerMockPage && (
          <Route path="/dev/mock/spinner">
            <Suspense fallback={null}>
              <SpinnerMockPage />
            </Suspense>
          </Route>
        )}

        {FieldMockPage && (
          <Route path="/dev/mock/field">
            <Suspense fallback={null}>
              <FieldMockPage />
            </Suspense>
          </Route>
        )}

        {LabelMockPage && (
          <Route path="/dev/mock/label">
            <Suspense fallback={null}>
              <LabelMockPage />
            </Suspense>
          </Route>
        )}

        {SurfaceMockPage && (
          <Route path="/dev/mock/surface">
            <Suspense fallback={null}>
              <SurfaceMockPage />
            </Suspense>
          </Route>
        )}

        {CardMockPage && (
          <Route path="/dev/mock/card">
            <Suspense fallback={null}>
              <CardMockPage />
            </Suspense>
          </Route>
        )}

        {SeparatorMockPage && (
          <Route path="/dev/mock/separator">
            <Suspense fallback={null}>
              <SeparatorMockPage />
            </Suspense>
          </Route>
        )}

        {SheetMockPage && (
          <Route path="/dev/mock/sheet">
            <Suspense fallback={null}>
              <SheetMockPage />
            </Suspense>
          </Route>
        )}

        {TableMockPage && (
          <Route path="/dev/mock/table">
            <Suspense fallback={null}>
              <TableMockPage />
            </Suspense>
          </Route>
        )}

        {QuickFiltersMockPage && (
          <Route path="/dev/mock/quick-filters">
            <Suspense fallback={null}>
              <QuickFiltersMockPage />
            </Suspense>
          </Route>
        )}

        {RecordListMockPage && (
          <Route path="/dev/mock/record-list">
            <Suspense fallback={null}>
              <RecordListMockPage />
            </Suspense>
          </Route>
        )}

        {PaginationMockPage && (
          <Route path="/dev/mock/pagination">
            <Suspense fallback={null}>
              <PaginationMockPage />
            </Suspense>
          </Route>
        )}

        {CursorPaginationMockPage && (
          <Route path="/dev/mock/cursor-pagination">
            <Suspense fallback={null}>
              <CursorPaginationMockPage />
            </Suspense>
          </Route>
        )}

        {ModeSwitchMockPage && (
          <Route path="/dev/mock/mode-switch">
            <Suspense fallback={null}>
              <ModeSwitchMockPage />
            </Suspense>
          </Route>
        )}

        {StepsMockPage && (
          <Route path="/dev/mock/steps">
            <Suspense fallback={null}>
              <StepsMockPage />
            </Suspense>
          </Route>
        )}

        {KeyValueListMockPage && (
          <Route path="/dev/mock/key-value-list">
            <Suspense fallback={null}>
              <KeyValueListMockPage />
            </Suspense>
          </Route>
        )}

        {TooltipMockPage && (
          <Route path="/dev/mock/tooltip">
            <Suspense fallback={null}>
              <TooltipMockPage />
            </Suspense>
          </Route>
        )}

        {StatStripMockPage && (
          <Route path="/dev/mock/stat-strip">
            <Suspense fallback={null}>
              <StatStripMockPage />
            </Suspense>
          </Route>
        )}

        {ChipGroupMockPage && (
          <Route path="/dev/mock/chip-group">
            <Suspense fallback={null}>
              <ChipGroupMockPage />
            </Suspense>
          </Route>
        )}

        {MeterMockPage && (
          <Route path="/dev/mock/meter">
            <Suspense fallback={null}>
              <MeterMockPage />
            </Suspense>
          </Route>
        )}

        {BarChartMockPage && (
          <Route path="/dev/mock/bar-chart">
            <Suspense fallback={null}>
              <BarChartMockPage />
            </Suspense>
          </Route>
        )}

        {DonutChartMockPage && (
          <Route path="/dev/mock/donut-chart">
            <Suspense fallback={null}>
              <DonutChartMockPage />
            </Suspense>
          </Route>
        )}

        {ChartLegendMockPage && (
          <Route path="/dev/mock/chart-legend">
            <Suspense fallback={null}>
              <ChartLegendMockPage />
            </Suspense>
          </Route>
        )}

        {MessagePreviewMockPage && (
          <Route path="/dev/mock/message-preview">
            <Suspense fallback={null}>
              <MessagePreviewMockPage />
            </Suspense>
          </Route>
        )}

        {PasswordInputMockPage && (
          <Route path="/dev/mock/password-input">
            <Suspense fallback={null}>
              <PasswordInputMockPage />
            </Suspense>
          </Route>
        )}

        {SelectMockPage && (
          <Route path="/dev/mock/select">
            <Suspense fallback={null}>
              <SelectMockPage />
            </Suspense>
          </Route>
        )}

        {CommandMockPage && (
          <Route path="/dev/mock/command">
            <Suspense fallback={null}>
              <CommandMockPage />
            </Suspense>
          </Route>
        )}

        {DatePickerMockPage && (
          <Route path="/dev/mock/date-picker">
            <Suspense fallback={null}>
              <DatePickerMockPage />
            </Suspense>
          </Route>
        )}

        {SelectionControlsMockPage && (
          <Route path="/dev/mock/selection-controls">
            <Suspense fallback={null}>
              <SelectionControlsMockPage />
            </Suspense>
          </Route>
        )}

        {DropdownMenuMockPage && (
          <Route path="/dev/mock/dropdown-menu">
            <Suspense fallback={null}>
              <DropdownMenuMockPage />
            </Suspense>
          </Route>
        )}

        {MockAllPage && (
          <Route path="/dev/mock/all">
            <Suspense fallback={null}>
              <MockAllPage />
            </Suspense>
          </Route>
        )}

        {/* Catch-all 404: any unrecognized path (including attempts to reach
            admin routes from the app subdomain) returns Not Found. */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </RootLayout>
  )
}
