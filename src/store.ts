import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import type { PersistedState, WebStorage } from 'redux-persist/es/types'
import webStorage from 'redux-persist/lib/storage'

import { api } from './constants/api'
import subscribedReducer from './redux/subscribedSlice'
import userInterfaceReducer from './redux/userInterfaceSlice'

/**
 * Checks redux-persist storage shape when Vite/ESM interop returns either direct storage or a wrapped module.
 * @param candidate - Imported storage-like value to inspect.
 * @returns True when getItem, setItem, and removeItem are callable.
 * @example
 * isWebStorage({ getItem() {}, setItem() {}, removeItem() {} }) // => true
 */
function isWebStorage(candidate: unknown): candidate is WebStorage {
  // Primitive and null module values cannot implement the storage contract.
  if (candidate === null || typeof candidate !== 'object') return false

  return (
    'getItem' in candidate &&
    'setItem' in candidate &&
    'removeItem' in candidate &&
    typeof candidate.getItem === 'function' &&
    typeof candidate.setItem === 'function' &&
    typeof candidate.removeItem === 'function'
  )
}

/**
 * Resolves redux-persist storage so persistReducer receives the actual localStorage adapter after dependency upgrades.
 * @param storageModule - Value imported from redux-persist/lib/storage.
 * @returns The concrete WebStorage adapter accepted by redux-persist.
 * @example
 * resolvePersistStorage({ default: { getItem() {}, setItem() {}, removeItem() {} } }) // => default storage
 */
function resolvePersistStorage(storageModule: unknown): WebStorage {
  // Native ESM resolution can expose the adapter directly.
  if (isWebStorage(storageModule)) return storageModule

  // Vite can expose the CJS default export one level deeper.
  if (
    storageModule !== null &&
    typeof storageModule === 'object' &&
    'default' in storageModule &&
    isWebStorage(storageModule.default)
  ) {
    return storageModule.default
  }

  throw new Error('redux-persist storage adapter is missing WebStorage methods')
}

const storage = resolvePersistStorage(webStorage)

/**
 * Deletes legacy browser-persisted GitHub tokens during Redux Persist rehydration after the BFF migration.
 * @param persistedState - Previously stored root state, possibly containing the removed authenticator slice.
 * @returns Persisted state without browser-readable authentication credentials.
 * @example
 * await removeLegacyAuthenticatorState({ _persist, authenticator: { accessToken: 'token' } })
 */
async function removeLegacyAuthenticatorState(persistedState: PersistedState) {
  // New or already-migrated stores have no browser credential to remove.
  if (persistedState === undefined || !('authenticator' in persistedState)) {
    return persistedState
  }

  const { authenticator: legacyAuthenticator, ...safePersistedState } =
    persistedState
  void legacyAuthenticator
  return safePersistedState
}

const persistConfig = {
  key: 'Geek-Infiltration',
  migrate: removeLegacyAuthenticatorState,
  storage,
  version: 1,
  whitelist: ['subscribed'],
}

const reducers = combineReducers({
  subscribed: subscribedReducer,
  userInterface: userInterfaceReducer,
  [api.reducerPath]: api.reducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)
export const store = configureStore({
  devTools: Boolean(import.meta.env.DEV),
  middleware: (getDefaultMiddleware) =>
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
  reducer: persistedReducer,
})
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
