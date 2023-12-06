import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid/non-secure'

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
    subscribe: (state, action: PayloadAction<Omit<TimelineProperty, 'id'>>) => {
      state.subscribed.push({ id: nanoid(), ...action.payload })
    },
    unsubscribe: (state, action: PayloadAction<TimelineProperty['id']>) => {
      state.subscribed = state.subscribed.filter((v) => v.id !== action.payload)
    },
  },
})

export const { subscribe, unsubscribe } = subscribedSlice.actions

export default subscribedSlice.reducer
