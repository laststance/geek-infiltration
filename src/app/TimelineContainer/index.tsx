import { Grid } from '@mui/material'
import React, { memo } from 'react'

import { useAppSelector } from '@/hooks/useAppSelector'

import TimeLine from './Timeline'

const TimelineContainer: React.FC = memo(() => {
  const subscribed = useAppSelector((state) => state.subscribed.subscribed)
  // Older persisted sessions can miss the nested list while Redux rehydrates.
  const timelines = Array.isArray(subscribed) ? subscribed : []

  return (
    <Grid
      container
      wrap="nowrap"
      spacing={1}
      component="section"
      data-testid="timeline-container"
      sx={{ flex: 1, minWidth: 0, overflowX: 'scroll' }}
    >
      {timelines.length
        ? timelines.map(({ id, information, aim }, i) => {
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
