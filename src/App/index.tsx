import { Container } from '@mui/material'
import React, { memo } from 'react'

import Sidebar from './Sidebar'
import TimelineViewer from './TimelineViewer'

const App: React.FC = memo(() => {
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
        overflowY: 'hidden',
      }}
    >
      <Sidebar />
      <TimelineViewer />
    </Container>
  )
})
App.displayName = 'App'

export default App
