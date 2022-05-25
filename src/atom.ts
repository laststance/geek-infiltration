import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

type AccessToken = string
type SubscribedUser = string[]
type SearchQuery = string

export const accessTokenAtom = atomWithStorage<AccessToken | null>(
  'accessToken',
  null
)

export const searchQueryAtom = atom<SearchQuery>('')

export const subscribedUserAtom = atomWithStorage<SubscribedUser | []>(
  'subscribedUser',
  []
)
