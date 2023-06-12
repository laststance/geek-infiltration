import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthenticationSlice {
  accessToken: string | null
}

const initialState: AuthenticationSlice = {
  accessToken: null,
}

export const authenticationSlice = createSlice({
  initialState,
  name: 'authentication',
  reducers: {
    login: (
      state,
      action: PayloadAction<AuthenticationSlice['accessToken']>
    ) => {
      state.accessToken = action.payload
    },
    logout: (state) => {
      state.accessToken = null
    },
  },
})

export const { login, logout } = authenticationSlice.actions

export default authenticationSlice.reducer
