import { CircularProgress, Container, List } from '@mui/material'
import { useAtomValue } from 'jotai'
import React, { memo } from 'react'

import { accessTokenAtom } from '../../../atom'
import CommentCard from '../../../components/CommentCard'
import { endpoint } from '../../../constant'
import { useGetDiscussionCommentsQuery } from '../../../generated/graphql'
import type { DiscussionComment, Actor } from '../../../generated/graphql'

interface Props {
  user: string
}

const DiscussionComments: React.FC<Props> = memo(({ user }) => {
  const accessToken = useAtomValue(accessTokenAtom)

  const { status, data, isFetching } = useGetDiscussionCommentsQuery(
    {
      endpoint: endpoint,
      fetchParams: { headers: { authorization: `Bearer ${accessToken}` } },
    },
    { query: user },

    {
      select: (data): { node: DiscussionComment }[] => {
        if (data.search.edges!.length === 0) return []
        // @ts-ignore error TS2339: Property 'issueComments' does not exist on type '{ __typename?: "App" | undefined; } | { __typename?: "Discussion" | undefined; } | { __typename?: "Issue" | undefined; } | { __typename?: "MarketplaceListing" | undefined; } | { __typename?: "Organization" | undefined; } | { ...; } | { ...; } | { ...; }'.
        //   Property 'issueComments' does not exist on type '{ __typename?: "App" | undefined; }'.
        return data.search.edges[0].node.repositoryDiscussionComments
          .edges as Array<{
          node: DiscussionComment
        }>
      },
    }
  )

  if (status === 'loading' || isFetching)
    return (
      <Container sx={{ padfding: '20px' }}>
        <CircularProgress />
      </Container>
    )

  if (status === 'success' && data.length > 0)
    return (
      <List sx={{ bgcolor: 'background.paper', maxWidth: 360, width: '100%' }}>
        {data.map(
          (
            { node: { author, bodyHTML, publishedAt, url, discussion } },
            i: number
          ) => (
            <CommentCard
              key={i}
              author={author as Actor}
              repositoryName={discussion!.repository.nameWithOwner}
              bodyHTML={bodyHTML}
              commentLink={url}
              publishedAt={publishedAt}
              ticketAuthorName={discussion!.author!.login}
              ticketLink={discussion!.url}
              ticketTitle={discussion!.title}
            />
          )
        )}
      </List>
    )

  return <div>Faild data loading.</div>
})
DiscussionComments.displayName = 'DiscussionCommentsTimeline'

export default DiscussionComments
