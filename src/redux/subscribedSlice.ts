import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid/non-secure'

import { swap as swapArrayItems } from '@/utils/swap'

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
    swap: (state, action: PayloadAction<[number, number]>) => {
      const [fromIndex, toIndex] = action.payload
      state.subscribed = swapArrayItems(
        state.subscribed,
        state.subscribed[fromIndex],
        state.subscribed[toIndex],
      )
    },
  },
})

export const { subscribe, unsubscribe, swap } = subscribedSlice.actions

export default subscribedSlice.reducer
