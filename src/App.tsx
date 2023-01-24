import { Grid } from '@nextui-org/react'
import { useAtomValue } from 'jotai'
import React, { memo } from 'react'

import type { ValidSerchQuery } from './atom'
import { subscribedAtom } from './atom'
import DiscussionCommentsTimeline from './components/DiscussionCommentsTimeline'
import IssueCommentsTimeline from './components/IssueCommentsTimeline'
import RootContainer from './components/RootContainer'
import Sidebar from './components/Sidebar'

const App: React.FC = memo(() => {
  const subscribed = useAtomValue(subscribedAtom)

  return (
    <RootContainer>
      <section style={{ height: '100%', width: '60px' }}>
        <Sidebar />
      </section>
      <Grid.Container gap={0.6} as="main" wrap="nowrap" css={{ h: '100%' }}>
        {subscribed.length ? (
          subscribed.map(
            (
              { username, issueComments, discussionComments }: ValidSerchQuery,
              i
            ) => {
              return (
                <Grid xs={2.5} key={i}>
                  {issueComments && !discussionComments && (
                    <IssueCommentsTimeline user={username} />
                  )}
                  {!issueComments && discussionComments && (
                    <DiscussionCommentsTimeline user={username} />
                  )}
                </Grid>
              )
            }
          )
        ) : (
          <></>
        )}
      </Grid.Container>
    </RootContainer>
  )
})
App.displayName = 'App'

export default App
