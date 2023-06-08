import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type AccessToken = string
export type SerchQuery = {
  username: string
  selectedTimeline: 'PullRequest_Issue_Comments' | 'discussionComments'
}
export type Subscribed = SerchQuery[]

export const accessTokenAtom = atomWithStorage<AccessToken | null>(
  'GI_accessToken',
  null
)

export const searchQueryAtom = atom<SerchQuery | null>(null)

export const subscribedAtom = atomWithStorage<Subscribed | []>(
  'GI_subscribed',
  []
)
