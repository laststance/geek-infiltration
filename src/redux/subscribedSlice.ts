import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface SubscribedState {
  subscribed: TimelineProperty[]
}

const initialState: SubscribedState = {
  subscribed: [],
}

export const subscribedSlice = createSlice({
  name: 'subscribed',
  initialState,
  reducers: {
    subscribe: (state, action: PayloadAction<TimelineProperty>) => {
      state.subscribed.push(action.payload)
    },
    unsubscribe: (state, action: PayloadAction<ArrayMapIndex>) => {
      state.subscribed.splice(action.payload, 1)
    },
  },
})

export const { subscribe, unsubscribe } = subscribedSlice.actions

export default subscribedSlice.reducer
