import { Col, Loading, Container } from '@nextui-org/react'
import { useAtomValue } from 'jotai'
import React, { memo } from 'react'

import { accessTokenAtom } from '../../atom'
import { endpoint } from '../../constants'
import { useGetIssueCommentsQuery } from '../../generated/graphql'
import type { IssueComment, Actor } from '../../generated/graphql'

import CommentCard from './CommentCard'

interface Props {
  user: string
}

const IssueCommentsTimeline: React.FC<Props> = memo(({ user }) => {
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
      <Container display="flex" justify="center" css={{ paddingTop: '20px' }}>
        <Loading size="md" />
      </Container>
    )

  if (status === 'success' && data.length > 0)
    return (
      <Col as="article">
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
      </Col>
    )

  return <div>Faild data loding.</div>
})
IssueCommentsTimeline.displayName = 'IssueCommentsTimeline'

export default IssueCommentsTimeline
