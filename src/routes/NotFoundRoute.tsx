import { redirect } from 'react-router'

import { readAuthSession } from '@/auth/readAuthSession'
import { FullScreenSpinner } from '@/components/FullScreenSpinner'

/**
 * Resolves unknown URLs to the correct entry point after validating the server session.
 * @returns Redirect to the authenticated app or public landing route.
 * @example
 * await loader() // => redirect('/app') or redirect('/')
 */
export async function loader() {
  // Unknown URLs preserve the user's authenticated or public application boundary.
  return redirect((await readAuthSession()) ? '/app' : '/')
}

/**
 * Routes unknown URLs back to the correct public or authenticated entry point.
 * @returns Redirect to the authenticated timeline or the signed-out landing page.
 * @example
 * <Route path="*" Component={Component} />
 */
export function Component() {
  return <FullScreenSpinner />
}
