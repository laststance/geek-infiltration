import { useSortable } from '@dnd-kit/react/sortable'
import { Box, Grid } from '@mui/material'
import React, { memo } from 'react'

import { useAppSelector } from '@/hooks/useAppSelector'
import { selectTimelineWidth } from '@/redux/userInterfaceSlice'

import Toolbar from '../Toolbar'

import DiscussionComments from './DiscussionComments'
import PullRequest_Issue_Comments from './PullRequest_Issue_Comments'

interface Props {
  id: TimelineProperty['id']
  timelimeIndex: ArrayMapIndex
  target: TimelineProperty['aim']
  information: TimelineProperty['information']
}

const TimeLine: React.FC<Props> = memo(
  ({ id, timelimeIndex, information, target }) => {
    const { ref } = useSortable({ id, index: timelimeIndex })
    const timelineWidth = useAppSelector(selectTimelineWidth)
    return (
      <Grid
        ref={ref}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100vh',
          maxWidth: timelineWidth,
          minHeight: '100vh',
          minWidth: timelineWidth,
          overflow: 'hidden',
        }}
      >
        <Toolbar id={id} information={information} aim={target} />

        <Box
          data-testid="timeline-comments"
          sx={{
            flex: 1,
            minHeight: 0,
            // Column overflow is hidden so this pane is the only vertical scroller.
            overflow: 'auto',
          }}
        >
          {target.user && information === 'PR_Issues' && (
            <PullRequest_Issue_Comments user={target.user} />
          )}
          {target.user && information === 'Discussion' && (
            <DiscussionComments user={target.user} />
          )}
        </Box>
      </Grid>
    )
  },
)
TimeLine.displayName = 'TimeLine'

export default TimeLine
