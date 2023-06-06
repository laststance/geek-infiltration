import { ThemeProvider } from '@mui/material/styles'
import { Provider as JotaiProvider } from 'jotai'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider, QueryClient } from 'react-query'

import './index.css'
import AuthController from './controllers/AuthController'
import { theme } from './theme'

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

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <ThemeProvider theme={theme}>
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AuthController />
      </QueryClientProvider>
    </JotaiProvider>
  </ThemeProvider>
)
