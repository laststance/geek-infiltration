import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { FullScreenSpinner } from '@/components/FullScreenSpinner'

export const router = createBrowserRouter([
  {
    path: '/',
    HydrateFallback: FullScreenSpinner,
    lazy: async () => import('@/routes/LandingRoute'),
  },
  {
    HydrateFallback: FullScreenSpinner,
    lazy: async () => import('@/routes/AuthenticatedLayout'),
    children: [
      {
        path: '/app',
        HydrateFallback: FullScreenSpinner,
        lazy: async () => import('@/routes/TimelineRoute'),
      },
      {
        path: '/releases',
        HydrateFallback: FullScreenSpinner,
        lazy: async () => import('@/routes/ReleasesRoute'),
      },
    ],
  },
  {
    path: '*',
    HydrateFallback: FullScreenSpinner,
    lazy: async () => import('@/routes/NotFoundRoute'),
  },
])

/**
 * Mounts the React Router data router after Redux Persist has restored auth state.
 * @returns RouterProvider with a visible loading state for lazy route modules.
 * @example
 * <AppRouter />
 */
export function AppRouter() {
  return <RouterProvider router={router} />
}
