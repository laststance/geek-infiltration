import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../store'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export interface UserInterfaceSlice {
  timeline: {
    current: Size
    width: { [key in Size]?: number }
  }
}

const initialState: UserInterfaceSlice = {
  timeline: {
    current: 'md',
    width: { md: 344 },
  },
}

export const userInterfaceSlice = createSlice({
  name: 'userInterface',
  initialState,
  reducers: {
    resizeTimeline: (state, action: PayloadAction<Size>) => {
      state.timeline.current = action.payload
    },
  },
})

export const { resizeTimeline } = userInterfaceSlice.actions

export const selectTimelineWidth = (state: RootState) =>
  state.userInterface.timeline.width[state.userInterface.timeline.current]

export default userInterfaceSlice.reducer
