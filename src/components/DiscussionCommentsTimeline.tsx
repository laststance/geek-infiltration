import { Col, Loading } from '@nextui-org/react'
import { useAtomValue } from 'jotai'
import React from 'react'

import { endpoint } from '../const'

import { accessTokenAtom } from './../atom'
import { useGetDiscussionCommentsQuery } from './../generated/graphql'
import type { DiscussionComment, Actor } from './../generated/graphql'
import CommentCard from './CommentCard'

interface Props {
  user: string
}

const DiscussionCommentsTimeline: React.FC<Props> = ({ user }) => {
  const accessToken = useAtomValue(accessTokenAtom)

  const { status, data, error, isFetching } = useGetDiscussionCommentsQuery(
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

  if (status === 'loading' || isFetching) return <Loading size="md" />

  if (error) return <h1>Error</h1>
  if (data === []) return <h1>User Doesn't Exist</h1>

  if (status === 'success' && data.length > 0)
    return (
      <Col as="article">
        {data.map(
          (
            {
              node: {
                author,
                body,
                bodyHTML,
                bodyText,
                publishedAt,
                url,
                discussion,
              },
            },
            i: number
          ) => (
            <CommentCard
              key={i}
              author={author as Actor}
              repositoryName={discussion!.repository.nameWithOwner}
              bodyHTML={bodyHTML}
              bodyL={body}
              bodyText={bodyText}
              commentLink={url}
              publishedAt={publishedAt}
              ticketAuthorName={discussion!.author!.login}
              ticketLink={discussion!.url}
              ticketTitle={discussion!.title}
            />
          )
        )}
      </Col>
    )

  return <></>
}

export default DiscussionCommentsTimeline
