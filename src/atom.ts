import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type SearchQuery = {
  username: string
  selectedTimeline: 'PullRequest_Issue_Comments' | 'discussionComments'
}
export type Subscribed = SearchQuery[]

export const searchQueryAtom = atom<SearchQuery | null>(null)

export const subscribedAtom = atomWithStorage<Subscribed | []>(
  'GI_subscribed',
  []
)
