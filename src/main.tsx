import { NextUIProvider, createTheme } from '@nextui-org/react'
import { Provider as JotaiProvider } from 'jotai'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider, QueryClient } from 'react-query'

import './index.css'
import Controller from './Controller'

const queryClient = new QueryClient()

const darkTheme = createTheme({
  type: 'dark',
})

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <JotaiProvider>
    <QueryClientProvider client={queryClient}>
      <NextUIProvider theme={darkTheme}>
        <Controller />
      </NextUIProvider>
    </QueryClientProvider>
  </JotaiProvider>
)
