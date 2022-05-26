import { Grid, Col, Row, Container } from '@nextui-org/react'
import { useAtomValue } from 'jotai'
import React, { memo } from 'react'

import { subscribedUserAtom } from './atom'
import IssueCommentsTimeline from './components/IssueCommentsTimeline'
import Sidebar from './components/Sidebar'

function App() {
  const subscribedUser = useAtomValue(subscribedUserAtom)

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <section style={{ height: '100%', width: '60px' }}>
        <Sidebar />
      </section>
      <Grid.Container gap={1} as="main" wrap="nowrap" css={{ h: '100%' }}>
        {subscribedUser.length ? (
          subscribedUser.map((user, i) => {
            return (
              <Grid xs={2.5} key={i}>
                <IssueCommentsTimeline user={user} />
              </Grid>
            )
          })
        ) : (
          <></>
        )}
      </Grid.Container>
    </div>
  )
}

export default memo(App)
