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
        ? subscribed.map(({ id, information, aim }, i) => {
            return (
              <TimeLine
                key={id}
                id={id}
                timelimeIndex={i}
                information={information}
                target={aim}
              />
            )
          })
        : null}
    </Grid>
  )
})
TimelineContainer.displayName = 'TimelineContainer'

export default TimelineContainer
