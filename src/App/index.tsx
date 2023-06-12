import { Container } from '@mui/material'
import { useAtomValue } from 'jotai'
import React, { memo } from 'react'

import { subscribedAtom } from '../atom'

import Sidebar from './Sidebar'
import TimelineViewer from './TimelineViewer'

const App: React.FC = memo(() => {
  const subscribed = useAtomValue(subscribedAtom)

  return (
    <Container
      fixed
      disableGutters
      component="main"
      sx={{
        display: 'flex',
        maxHeight: '100vh',
        minHeight: '100vh',
        minWidth: '100%',
      }}
    >
      <Sidebar />
      <TimelineViewer subscribed={subscribed} />
    </Container>
  )
})
App.displayName = 'App'

export default App
