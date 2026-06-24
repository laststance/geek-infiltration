import { Navigate } from 'react-router'

import { useAppSelector } from '@/hooks/useAppSelector'
import LandingPage from '@/LandingPage'

/**
 * Renders the signed-out landing route and sends signed-in users to the timeline.
 * @returns Landing page for signed-out users, or a redirect to the authenticated app.
 * @example
 * <Route path="/" Component={Component} />
 */
export function Component() {
  const accessToken = useAppSelector((state) => state.authenticator.accessToken)

  // Once authenticated, "/" is only an entry point; the timeline lives at "/app".
  if (accessToken !== null) {
    return <Navigate to="/app" replace />
  }

  return <LandingPage />
}
