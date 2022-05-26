import { Card, Col, Text, Link, Spacer, Loading } from '@nextui-org/react'
import { useAtomValue } from 'jotai'
import React from 'react'

import { endpoint } from '../const'

import { accessTokenAtom } from './../atom'
import { useGetIssueCommentsQuery } from './../generated/graphql'
import type { IssueComment } from './../generated/graphql'

interface Props {
  user: string
}

const IssueCommentsTimeline: React.FC<Props> = ({ user }) => {
  const accessToken = useAtomValue(accessTokenAtom)

  const { status, data, error, isFetching } = useGetIssueCommentsQuery(
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

  if (status === 'loading' || isFetching) return <Loading size="md" />

  if (error) return <h1>Error</h1>
  if (data === []) return <h1>User Doesn't Exist</h1>

  if (status === 'success' && data.length > 0)
    return (
      <Col as="article">
        {data.reverse().map(({ node }, i: number) => (
          <Card
            as="section"
            bordered
            key={i}
            shadow
            css={{
              borderBottomColor: 'rgba(77, 77, 77, 0.7)',
              borderBottomWidth: '1px',
              borderTopColor:
                i === 1 ? 'rgb(77, 77, 77)' : 'rgba(77, 77, 77, 0.7)',
              borderTopWidth: '1px',
            }}
          >
            <Text color="primary" h5>
              {node.repository.nameWithOwner}
            </Text>
            <Link underline href={node.url} target="_blank">
              <Text h4>{node.issue.title}</Text>
            </Link>
            {'  '}
            <Text small>{node.issue.author!.login}</Text>
            <Text small>{new Date(node.createdAt).toLocaleString()}</Text>
            <Spacer />
            <Card>
              <Text
                size={20}
                dangerouslySetInnerHTML={{ __html: node.bodyHTML }}
              />
            </Card>
          </Card>
        ))}
      </Col>
    )

  return <></>
}

export default IssueCommentsTimeline
