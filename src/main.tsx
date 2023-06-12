import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import * as Sentry from '@sentry/react'
import { Provider as JotaiProvider } from 'jotai'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider, QueryClient } from 'react-query'

import './global.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import Authenticator from './Authenticator'
import ErrorBoundary from './components/ErrorBoundary'
import { theme } from './variables/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retryOnMount: false,
    },
  },
})

// @ts-expect-error Property 'displayName' does not exist on type '({ children, initialValues, scope, unstable_createStore, unstable_enableVersionedWrite, }: PropsWithChildren<{ initialValues?: Iterable<readonly [Atom<unknown>, unknown]> | undefined; scope?: Scope | undefined; unstable_createStore?: ((initialValues?: Iterable<readonly [AnyAtom, unknown]> | undefined) => { ...; }) |...'.Property 'displayName' does not exist on type '({ children, initialValues, scope, unstable_createStore, unstable_enableVersionedWrite, }: PropsWithChildren<{ initialValues?: Iterable<readonly [Atom<unknown>, unknown]> | undefined; scope?: Scope | undefined; unstable_createStore?: ((initialValues?: Iterable<readonly [AnyAtom, unknown]> | undefined) => { ...; }) |...'.
JotaiProvider.displayName = 'JotaiProvider'
// @ts-expect-error Property 'displayName' does not exist on type '({ client, children, context, contextSharing, }: QueryClientProviderProps) => Element'.
QueryClientProvider.displayName = 'QueryClientProvider'

if (import.meta.env.PROD === true) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DNS,
    integrations: [
      new Sentry.BrowserTracing({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: [
          'localhost',
          /^https:\/\/yourserver\.io\/api/,
        ],
      }),
      new Sentry.Replay(),
    ],

    // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0,

    // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1,
    // Performance Monitoring
    tracesSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <Authenticator />
        </QueryClientProvider>
      </JotaiProvider>
    </ThemeProvider>
  </ErrorBoundary>
)
