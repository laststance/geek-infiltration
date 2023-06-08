import { CircularProgress, Container, List } from '@mui/material'
import { useAtomValue } from 'jotai'
import React, { memo } from 'react'

import { accessTokenAtom } from '../../../atom'
import CommentCard from '../../../components/CommentCard'
import { useGetIssueCommentsQuery } from '../../../generated/graphql'
import type { IssueComment, Actor } from '../../../generated/graphql'
import { endpoint } from '../../../variables/endpoint'

interface Props {
  user: string
}

/**
 * I initially wanted to get PR and Issue comments separately,
 * But the Github API spec does not distinguish between them.
 * So currently I can only view them at the same time.
 */
const PullRequest_Issue_Comments: React.FC<Props> = memo(({ user }) => {
  const accessToken = useAtomValue(accessTokenAtom)
  const { status, data, isFetching } = useGetIssueCommentsQuery(
    {
      endpoint: endpoint,
      fetchParams: { headers: { authorization: `Bearer ${accessToken}` } },
    },
    { query: user },

    {
      select: (data): { node: IssueComment }[] => {
        if (data.search.edges!.length === 0) return []
        // @ts-ignore error TS2339: Property 'issueComments' does not exist on type '{ __typename?: "App" | undefined; } | { __typename?: "Discussion" | undefined; } | { __typename?: "Issue" | undefined; } | { __typename?: "MarketplaceListing" | undefined; } | { __typename?: "Organization" | undefined; } | { ...; } | { ...; } | { ...; }'.
        //   Property 'issueComments' does not exist on type '{ __typename?: "App" | undefined; }'.
        return data.search.edges[0].node.issueComments.edges as Array<{
          node: IssueComment
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
        {data
          .reverse()
          .map(
            (
              {
                node: { author, bodyHTML, publishedAt, url, repository, issue },
              },
              i: number
            ) => (
              <CommentCard
                key={i}
                author={author as Actor}
                repositoryName={repository.nameWithOwner}
                bodyHTML={bodyHTML}
                commentLink={url}
                publishedAt={publishedAt}
                ticketAuthorName={issue.author!.login}
                ticketLink={issue.url}
                ticketTitle={issue.title}
              />
            )
          )}
      </List>
    )

  return <div>Faild data loding.</div>
})
PullRequest_Issue_Comments.displayName = 'RullRequest_Issue_Comments'

export default PullRequest_Issue_Comments
