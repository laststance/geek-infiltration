import { Grid } from '@nextui-org/react'
import React, { memo } from 'react'

import type { ValidSerchQuery, Subscribed } from '../atom'
import DiscussionCommentsTimeline from '../components/DiscussionCommentsTimeline'
import IssueCommentsTimeline from '../components/IssueCommentsTimeline'

interface Props {
  subscribed: [] | Subscribed
}

const TimelineRenderController: React.FC<Props> = memo(({ subscribed }) => {
  return (
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
  )
})
TimelineRenderController.displayName = 'TimelineRenderController'

export default TimelineRenderController
