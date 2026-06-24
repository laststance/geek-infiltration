import React, { memo } from 'react'

import AppShell from './AppShell'
import TimelineContainer from './TimelineContainer'

const App: React.FC = memo(() => {
  return (
    <AppShell>
      <TimelineContainer />
    </AppShell>
  )
})
App.displayName = 'App'

export default App
