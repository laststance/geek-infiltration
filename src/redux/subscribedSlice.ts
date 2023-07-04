import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { SearchQuery } from '../App/Sidebar/SubscribeFormModal'

export interface SubscribedState {
  subscribed: SearchQuery[]
}

const initialState: SubscribedState = {
  subscribed: [],
}

export const subscribedSlice = createSlice({
  initialState,
  name: 'subscribed',
  reducers: {
    subscribe: (state, action: PayloadAction<SearchQuery>) => {
      state.subscribed.push(action.payload)
    },
    unsubscribe: (state, action: PayloadAction<ArrayMapIndex>) => {
      state.subscribed.splice(action.payload, 1)
    },
  },
})

export const { subscribe, unsubscribe } = subscribedSlice.actions

export default subscribedSlice.reducer
