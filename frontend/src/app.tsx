import { Suspense } from 'react'
import { Redirect, Route, Switch } from 'wouter'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/feedback/sonner'
import { MOCK_INDEX_PATH, MOCK_ROUTES } from '@/routes'

export function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Suspense fallback={null}>
        <Switch>
          {MOCK_ROUTES.map(({ path, Component, nest }) => (
            <Route key={path} path={path} nest={nest}>
              <Component />
            </Route>
          ))}
          <Route>
            <Redirect to={MOCK_INDEX_PATH} replace />
          </Route>
        </Switch>
      </Suspense>
      <Toaster />
    </ThemeProvider>
  )
}
