import Grid from '@mui/material/Unstable_Grid2'
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
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ id, timelimeIndex, information, target }) => {
    const timelineWidth = useAppSelector(selectTimelineWidth)
    return (
      <Grid
        sx={{
          maxHeight: '100vh',
          maxWidth: timelineWidth,
          minHeight: '100vh',
          minWidth: timelineWidth,
          overflow: 'scroll',
        }}
      >
        <Toolbar id={id} information={information} aim={target} />

        {target.user && information === 'PR_Issues' && (
          <PullRequest_Issue_Comments user={target.user} />
        )}
        {target.user && information === 'Discussion' && (
          <DiscussionComments user={target.user} />
        )}
      </Grid>
    )
  },
)
TimeLine.displayName = 'TimeLine'

export default TimeLine
