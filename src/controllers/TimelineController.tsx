import { Grid } from '@nextui-org/react'
import React, { memo } from 'react'

import type { SerchQuery, Subscribed } from '../atom'
import DiscussionCommentsTimeline from '../components/Timeline/DiscussionCommentsTimeline'
import PullRequestAndIssueCommentsTimeline from '../components/Timeline/PullRequestAndIssueCommentsTimeline'

interface Props {
  subscribed: [] | Subscribed
}

const TimelineController: React.FC<Props> = memo(({ subscribed }) => {
  return (
    <Grid.Container gap={0.6} as="main" wrap="nowrap" css={{ h: '100%' }}>
      {subscribed.length
        ? subscribed.map(({ username, selectedTimeline }: SerchQuery, i) => {
            return (
              <Grid xs={2.5} key={i}>
                {selectedTimeline === 'PullRequestAndIssueComments' && (
                  <PullRequestAndIssueCommentsTimeline user={username} />
                )}
                {selectedTimeline === 'discussionComments' && (
                  <DiscussionCommentsTimeline user={username} />
                )}
              </Grid>
            )
          })
        : null}
    </Grid.Container>
  )
})
TimelineController.displayName = 'TimelineController'

export default TimelineController
