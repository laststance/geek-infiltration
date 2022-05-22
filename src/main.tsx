import { NextUIProvider } from '@nextui-org/react'
import { Provider as JotaiProvider } from 'jotai'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider, QueryClient } from 'react-query'

import './index.css'
import Controller from './Controller'

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <JotaiProvider>
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <Controller />
      </NextUIProvider>
    </QueryClientProvider>
  </JotaiProvider>
)
