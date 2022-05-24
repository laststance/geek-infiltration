import { atomWithStorage } from 'jotai/utils'

type AccessToken = string
type AddedUserName = string[]

export const accessTokenAtom = atomWithStorage<AccessToken | null>(
  'accessToken',
  null
)
export const addedUserAtom = atomWithStorage<AddedUserName | []>(
  'addedUserName',
  []
)
