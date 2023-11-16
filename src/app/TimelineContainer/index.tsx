import Grid from '@mui/material/Unstable_Grid2'
import React, { memo } from 'react'

import { useAppSelector } from '@/hooks/useAppSelector'

import TimeLine from './Timeline'

const TimelineContainer: React.FC = memo(() => {
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
        ? subscribed.map(({ information, target }, i) => {
            return (
              <TimeLine
                key={i}
                timelimeIndex={i}
                information={information}
                target={target}
              />
            )
          })
        : null}
    </Grid>
  )
})
TimelineContainer.displayName = 'TimelineContainer'

export default TimelineContainer
