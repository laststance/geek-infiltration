import { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router'

import AppShell from '@/app/AppShell'
import { FullScreenSpinner } from '@/components/FullScreenSpinner'
import { useAppSelector } from '@/hooks/useAppSelector'

/**
 * Protects authenticated routes and keeps the shared app shell outside route content.
 * @returns Redirects signed-out users, otherwise renders the authenticated shell outlet.
 * @example
 * <Route Component={Component} />
 */
export function Component() {
  const accessToken = useAppSelector((state) => state.authenticator.accessToken)

  // Authenticated routes should never render private UI without a persisted token.
  if (accessToken === null) {
    return <Navigate to="/" replace />
  }

  return (
    <AppShell>
      <Suspense fallback={<FullScreenSpinner />}>
        <Outlet />
      </Suspense>
    </AppShell>
  )
}
