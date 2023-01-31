import { useAtomValue } from 'jotai'
import { useAtomDevtools } from 'jotai-devtools'
import React, { memo } from 'react'

import { subscribedAtom } from '../atom'
import RootContainer from '../components/layouts/RootContainer'
import SidebarSection from '../components/layouts/SidebarSection'
import Sidebar from '../components/Sidebar'
import TimelineController from '../controllers/TimelineController'

const App: React.FC = memo(() => {
  const subscribed = useAtomValue(subscribedAtom)
  useAtomDevtools(subscribedAtom)
  return (
    <RootContainer>
      <SidebarSection>
        <Sidebar />
      </SidebarSection>
      <TimelineController subscribed={subscribed} />
    </RootContainer>
  )
})
App.displayName = 'App'

export default App
