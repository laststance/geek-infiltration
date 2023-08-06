import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthenticatorSlice {
  accessToken: string | null
}

const initialState: AuthenticatorSlice = {
  accessToken: null,
}

export const authenticatorSlice = createSlice({
  initialState,
  name: 'authenticator',
  reducers: {
    login: (
      state,
      action: PayloadAction<AuthenticatorSlice['accessToken']>,
    ) => {
      state.accessToken = action.payload
    },
    logout: (state) => {
      state.accessToken = null
    },
  },
})

export const { login, logout } = authenticatorSlice.actions

export default authenticatorSlice.reducer
