import Grid from '@mui/material/Unstable_Grid2'
import React, { memo } from 'react'

import { useAppSelector } from '../../hooks/useAppSelector'
import type { SearchQuery } from '../Sidebar/SubscribeFormModal'

import DiscussionComments from './TImeline/DiscussionComments'
import PullRequest_Issue_Comments from './TImeline/PullRequest_Issue_Comments'
import Toolbar from './Toolbar'

const TimelineViewer: React.FC = memo(() => {
  const subscribed = useAppSelector((state) => state.subscribed.subscribed)
  return (
    <Grid
      container
      wrap="nowrap"
      spacing={1}
      component="section"
      sx={{ overflowX: 'scroll' }}
    >
      {subscribed.length
        ? subscribed.map(({ username, selectedTimeline }: SearchQuery, i) => {
            return (
              <Grid
                sx={{
                  maxHeight: '100vh',
                  maxWidth: '344px',
                  minHeight: '100vh',
                  minWidth: '344px',
                  overflow: 'scroll',
                }}
                key={i}
              >
                <Toolbar timelimeIndex={i} />

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
