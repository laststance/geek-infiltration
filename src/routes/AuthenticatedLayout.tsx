import { Suspense } from 'react'
import { Outlet, redirect } from 'react-router'

import AppShell from '@/app/AppShell'
import { readAuthSession } from '@/auth/readAuthSession'
import { FullScreenSpinner } from '@/components/FullScreenSpinner'

/**
 * Rejects protected-route navigation unless the BFF validates the HttpOnly session.
 * @returns No loader data for authenticated users, otherwise a landing redirect.
 * @example
 * await loader() // => null or redirect('/')
 */
export async function loader() {
  // Signed-out visitors return to the public entry point before app components render.
  if (!(await readAuthSession())) return redirect('/')

  return null
}

/**
 * Protects authenticated routes and keeps the shared app shell outside route content.
 * @returns Redirects signed-out users, otherwise renders the authenticated shell outlet.
 * @example
 * <Route Component={Component} />
 */
export function Component() {
  return (
    <AppShell>
      <Suspense fallback={<FullScreenSpinner />}>
        <Outlet />
      </Suspense>
    </AppShell>
  )
}
