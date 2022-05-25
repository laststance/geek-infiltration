import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

type AccessToken = string
type AddedUserName = string[]
type SearchQuery = string

export const accessTokenAtom = atomWithStorage<AccessToken | null>(
  'accessToken',
  null
)

export const searchQueryAtom = atom<SearchQuery>('')

export const addedUserAtom = atomWithStorage<AddedUserName | []>(
  'addedUserName',
  []
)
