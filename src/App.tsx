import { Grid } from '@nextui-org/react'
import { useAtomValue } from 'jotai'
import React from 'react'

import { subscribedUserAtom } from './atom'
import IssueCommentsTimeline from './components/IssueCommentsTimeline'
import Sidebar from './components/Sidebar'

function App() {
  const subscribedUser = useAtomValue(subscribedUserAtom)

  return (
    <Grid.Container as="main" wrap="nowrap" css={{ h: '100%' }}>
      <Grid css={{ h: '100%', w: '60px' }}>
        <Sidebar />
      </Grid>
      {subscribedUser.length ? (
        subscribedUser.map((user, i) => {
          return (
            <Grid xs key={i}>
              <IssueCommentsTimeline user={user} />
            </Grid>
          )
        })
      ) : (
        <></>
      )}
    </Grid.Container>
  )
}

export default App
