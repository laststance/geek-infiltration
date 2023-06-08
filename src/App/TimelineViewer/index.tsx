import { Grid } from '@mui/material'
import React, { memo } from 'react'

import type { SerchQuery, Subscribed } from '../../atom'

import Timeline from './TImeline'

interface Props {
  subscribed: [] | Subscribed
}

const TimelineViewer: React.FC<Props> = memo(({ subscribed }) => {
  return (
    <Grid
      container
      sx={{
        maxHeight: '100vh',
        minHeight: '100vh',
        minWidth: '100%',
        overflow: 'scroll',
      }}
      component="section"
    >
      {subscribed.length
        ? subscribed.map(({ username, selectedTimeline }: SerchQuery, i) => {
            return (
              <Grid xs={2.5} key={i}>
                {selectedTimeline === 'PullRequest_Issue_Comments' && (
                  <Timeline.PullRequest_Issue_Comments user={username} />
                )}
                {selectedTimeline === 'discussionComments' && (
                  <Timeline.DiscussionComments user={username} />
                )}
              </Grid>
            )
          })
        : null}
    </Grid>
  )
})
TimelineViewer.displayName = 'TimelineViewer'

export default TimelineViewer
