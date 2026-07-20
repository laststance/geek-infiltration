import { redirect } from 'react-router'

import { readAuthSession } from '@/auth/readAuthSession'
import LandingPage from '@/LandingPage'

/**
 * Keeps authenticated visitors out of the public landing page whenever React Router loads it.
 * @returns Redirect to the app for a valid session, otherwise no loader data.
 * @example
 * await loader() // => redirect('/app') or null
 */
export async function loader() {
  // Existing server sessions skip the public marketing page.
  if (await readAuthSession()) return redirect('/app')

  return null
}

/**
 * Renders the signed-out landing route and sends signed-in users to the timeline.
 * @returns Landing page for signed-out users, or a redirect to the authenticated app.
 * @example
 * <Route path="/" Component={Component} />
 */
export function Component() {
  return <LandingPage />
}
