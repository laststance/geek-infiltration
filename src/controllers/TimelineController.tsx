import { Grid } from '@nextui-org/react'
import React, { memo } from 'react'

import type { SerchQuery, Subscribed } from '../atom'
import DiscussionCommentsTimeline from '../components/Timeline/DiscussionCommentsTimeline'
import IssueCommentsTimeline from '../components/Timeline/IssueCommentsTimeline'

interface Props {
  subscribed: [] | Subscribed
}

const TimelineController: React.FC<Props> = memo(({ subscribed }) => {
  return (
    <Grid.Container gap={0.6} as="main" wrap="nowrap" css={{ h: '100%' }}>
      {subscribed.length ? (
        subscribed.map(({ username, selectedTimeline }: SerchQuery, i) => {
          return (
            <Grid xs={2.5} key={i}>
              {selectedTimeline === 'issueComments' && (
                <IssueCommentsTimeline user={username} />
              )}
              {selectedTimeline === 'discussionComments' && (
                <DiscussionCommentsTimeline user={username} />
              )}
            </Grid>
          )
        })
      ) : (
        <></>
      )}
    </Grid.Container>
  )
})
TimelineController.displayName = 'TimelineRenderController'

export default TimelineController
