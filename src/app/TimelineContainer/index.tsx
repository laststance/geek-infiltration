import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { Grid } from '@mui/material'
import React, { memo } from 'react'

import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { swap } from '@/redux/subscribedSlice'

import TimeLine from './Timeline'

const TimelineContainer: React.FC = memo(() => {
  const dispatch = useAppDispatch()
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
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return

          const { source } = event.operation
          if (!isSortable(source)) return
          if (source.initialIndex === source.index) return
          dispatch(swap([source.initialIndex, source.index]))
        }}
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
      </DragDropProvider>
    </Grid>
  )
})
TimelineContainer.displayName = 'TimelineContainer'

export default TimelineContainer
