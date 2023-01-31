import { useAtomValue } from 'jotai'
import { useAtomDevtools } from 'jotai-devtools'
import React, { memo } from 'react'

import { subscribedAtom } from '../atom'
import RootContainer from '../components/layouts/RootContainer'
import SidebarSection from '../components/layouts/SidebarSection'
import Sidebar from '../components/Sidebar'
import TimelineRenderController from '../controllers/TimelineRenderController'

const App: React.FC = memo(() => {
  const subscribed = useAtomValue(subscribedAtom)
  useAtomDevtools(subscribedAtom)
  return (
    <RootContainer>
      <SidebarSection>
        <Sidebar />
      </SidebarSection>
      <TimelineRenderController subscribed={subscribed} />
    </RootContainer>
  )
})
App.displayName = 'App'

export default App
