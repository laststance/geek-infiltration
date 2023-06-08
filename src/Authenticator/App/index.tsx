import { useAtomValue } from 'jotai'
import { useAtomDevtools } from 'jotai-devtools'
import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'

import { subscribedAtom } from '../../atom'

import Sidebar from './Sidebar'
import TimelineContainer from './TimelineViewer'

const RootContainer: React.FC<PropsWithChildren> = memo(({ children }) => (
  <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
    {children}
  </div>
))
RootContainer.displayName = 'RootContainer'

const App: React.FC = memo(() => {
  const subscribed = useAtomValue(subscribedAtom)
  useAtomDevtools(subscribedAtom)
  return (
    <RootContainer>
      <Sidebar />
      <TimelineContainer subscribed={subscribed} />
    </RootContainer>
  )
})
App.displayName = 'App'

export default App
