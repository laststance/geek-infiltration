import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthenticationState {
  accessToken: string | null
}

const initialState: AuthenticationState = {
  accessToken: null,
}

export const AuthenticationSlice = createSlice({
  initialState,
  name: 'authentication',
  reducers: {
    login: (
      state,
      action: PayloadAction<AuthenticationState['accessToken']>
    ) => {
      state.accessToken = action.payload
    },
    logout: (state) => {
      state.accessToken = null
    },
  },
})

export const { login, logout } = AuthenticationSlice.actions

export default AuthenticationSlice.reducer
