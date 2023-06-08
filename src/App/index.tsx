import { Container } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useAtomDevtools } from 'jotai-devtools'
import React, { memo } from 'react'

import { subscribedAtom } from '../atom'

import Sidebar from './Sidebar'
import TimelineContainer from './TimelineViewer'

const App: React.FC = memo(
  () => {
    const subscribed = useAtomValue(subscribedAtom)
    useAtomDevtools(subscribedAtom)
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
        <TimelineContainer subscribed={subscribed} />
      </Container>
    )
  },
  () => true
)
App.displayName = 'App'

export default App
