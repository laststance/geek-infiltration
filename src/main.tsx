import { NextUIProvider, createTheme } from '@nextui-org/react'
import { Provider as JotaiProvider } from 'jotai'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider, QueryClient } from 'react-query'

import './index.css'
import AuthController from './controllers/AuthController'

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

const darkTheme = createTheme({
  type: 'dark',
})

// @ts-expect-error Property 'displayName' does not exist on type '({ children, initialValues, scope, unstable_createStore, unstable_enableVersionedWrite, }: PropsWithChildren<{ initialValues?: Iterable<readonly [Atom<unknown>, unknown]> | undefined; scope?: Scope | undefined; unstable_createStore?: ((initialValues?: Iterable<readonly [AnyAtom, unknown]> | undefined) => { ...; }) |...'.Property 'displayName' does not exist on type '({ children, initialValues, scope, unstable_createStore, unstable_enableVersionedWrite, }: PropsWithChildren<{ initialValues?: Iterable<readonly [Atom<unknown>, unknown]> | undefined; scope?: Scope | undefined; unstable_createStore?: ((initialValues?: Iterable<readonly [AnyAtom, unknown]> | undefined) => { ...; }) |...'.
JotaiProvider.displayName = 'JotaiProvider'
// @ts-expect-error Property 'displayName' does not exist on type '({ client, children, context, contextSharing, }: QueryClientProviderProps) => Element'.
QueryClientProvider.displayName = 'QueryClientProvider'

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <NextUIProvider theme={darkTheme}>
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AuthController />
      </QueryClientProvider>
    </JotaiProvider>
  </NextUIProvider>
)
