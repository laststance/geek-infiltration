import { useAtomValue } from 'jotai'
import { useAtomDevtools } from 'jotai-devtools'
import React, { memo } from 'react'

import { subscribedAtom } from '../atom'
import RootContainer from '../components/RootContainer'
import Sidebar from '../components/Sidebar'
import SidebarSection from '../components/SidebarSection'
import TimelineContainer from '../controllers/TimelineContainer'

const App: React.FC = memo(() => {
  const subscribed = useAtomValue(subscribedAtom)
  useAtomDevtools(subscribedAtom)
  return (
    <RootContainer>
      <SidebarSection>
        <Sidebar />
      </SidebarSection>
      <TimelineContainer subscribed={subscribed} />
    </RootContainer>
  )
})
App.displayName = 'App'

export default App
