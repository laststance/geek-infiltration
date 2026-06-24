import { Navigate } from 'react-router'

import { useAppSelector } from '@/hooks/useAppSelector'

/**
 * Routes unknown URLs back to the correct public or authenticated entry point.
 * @returns Redirect to the authenticated timeline or the signed-out landing page.
 * @example
 * <Route path="*" Component={Component} />
 */
export function Component() {
  const accessToken = useAppSelector((state) => state.authenticator.accessToken)

  if (accessToken !== null) {
    return <Navigate to="/app" replace />
  }

  return <Navigate to="/" replace />
}
