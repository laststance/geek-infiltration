import { Grid } from '@mui/material'
import React, { memo } from 'react'

import type { SerchQuery, Subscribed } from '../atom'
import DiscussionCommentsTimeline from '../components/Timeline/DiscussionCommentsTimeline'
import PullRequestAndIssueCommentsTimeline from '../components/Timeline/PullRequestAndIssueCommentsTimeline'

interface Props {
  subscribed: [] | Subscribed
}

const TimelineContainer: React.FC<Props> = memo(({ subscribed }) => {
  return (
    <Grid container spacing={2} gap={0.6}>
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
    </Grid>
  )
})
TimelineContainer.displayName = 'TimelineContainer'

export default TimelineContainer
