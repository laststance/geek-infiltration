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
    reorder: (state, action: PayloadAction<[number, number]>) => {
      const [oldIndex, newIndex] = action.payload
      const [moved] = state.subscribed.splice(oldIndex, 1)
      if (moved === undefined) {
        return
      }
      state.subscribed.splice(newIndex, 0, moved)
    },
  },
})

export const { subscribe, unsubscribe, reorder } = subscribedSlice.actions

export default subscribedSlice.reducer
