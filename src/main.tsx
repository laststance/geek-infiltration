import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { Provider as JotaiProvider } from 'jotai'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider, QueryClient } from 'react-query'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import './index.css'
import Auth from './Auth'
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
    <CssBaseline />
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <Auth />
      </QueryClientProvider>
    </JotaiProvider>
  </ThemeProvider>
)
