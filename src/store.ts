import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import subscribedReducer from './App/Sidebar/subscribedSlice'
import authenticatorReducer from './Authenticator/authenticatorSlice'

const persistConfig = {
  key: 'Geek-Infiltration',
  storage,
  whitelist: ['authenticator'],
}

const reducers = combineReducers({
  authenticator: authenticatorReducer,
  subscribed: subscribedReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)
export const store = configureStore({
  devTools: import.meta.env.DEV ? true : false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  reducer: persistedReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
