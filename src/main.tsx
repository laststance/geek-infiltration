import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

if (process.env.NODE_ENV === 'development') {
  import('../mocks/browser')
    .then(({ worker }) => {
      worker.start()
    })
    .then(() => {
      root.render(<App />)
    })
} else {
  root.render(<App />)
}
