import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type AccessToken = string
export type ValidSerchQuery = {
  username: string
  issueComments: boolean
  discussionComments: boolean
}
export type Subscribed = ValidSerchQuery[]

export const accessTokenAtom = atomWithStorage<AccessToken | null>(
  'accessToken',
  null
)

export const validSearchQueryAtom = atom<ValidSerchQuery | null>(null)

export const subscribedAtom = atomWithStorage<Subscribed | []>('subscribed', [])
