import { NextUIProvider } from '@nextui-org/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider, QueryClient } from 'react-query'
const queryClient = new QueryClient()
import './index.css'

import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
