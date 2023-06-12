import { Grid } from '@mui/material'
import React, { memo } from 'react'

import type { SearchQuery, Subscribed } from '../../atom'

import DiscussionComments from './TImeline/DiscussionComments'
import PullRequest_Issue_Comments from './TImeline/PullRequest_Issue_Comments'

interface Props {
  subscribed: [] | Subscribed
}

const TimelineViewer: React.FC<Props> = memo(({ subscribed }) => {
  return (
    <Grid container component="section" sx={{ overflowX: 'scroll' }}>
      {subscribed.length
        ? subscribed.map(({ username, selectedTimeline }: SearchQuery, i) => {
            return (
              <Grid
                style={{
                  maxHeight: '100vh',
                  maxWidth: '344px',
                  minHeight: '100vh',
                  minWidth: '344px',
                  overflow: 'scroll',
                }}
                item
                key={i}
              >
                {selectedTimeline === 'PullRequest_Issue_Comments' && (
                  <PullRequest_Issue_Comments username={username} />
                )}
                {selectedTimeline === 'discussionComments' && (
                  <DiscussionComments username={username} />
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
