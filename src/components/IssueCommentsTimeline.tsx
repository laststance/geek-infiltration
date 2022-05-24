import { Card, Container, Col, Text, Link, Spacer } from '@nextui-org/react'
import { useAtomValue } from 'jotai'
import React from 'react'

import { endpoint } from '../const'

import { accessTokenAtom } from './../atom'
import { useGetIssueCommentsQuery } from './../generated/graphql'
import type { IssueComment } from './../generated/graphql'
import Loading from './Loading'

function IssueCommentsTimeline() {
  const accessToken = useAtomValue(accessTokenAtom)

  const { status, data, error, isFetching } = useGetIssueCommentsQuery(
    {
      endpoint: endpoint,
      fetchParams: { headers: { authorization: `Bearer ${accessToken}` } },
    },
    { query: 'markerikson' },

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

  if (status === 'loading' || isFetching) return <Loading />

  if (error)
    return (
      <Container>
        <h1>Error</h1>
      </Container>
    )
  if (data === [])
    return (
      <Container>
        <h1>User Doesn't Exist</h1>
      </Container>
    )

  return (
    status === 'success' && (
      <Container css={{ padding: '40px' }}>
        {data.reverse().map(({ node }, i: number) => (
          <Col
            key={i}
            css={{ display: 'flex', justifyContent: 'center', mb: '2px' }}
          >
            <Card bordered shadow={false} css={{ mw: '400px' }}>
              <Text color="primary">{node.repository.nameWithOwner}</Text>
              <Link underline href={node.issue.url} target="_blank">
                {node.issue.title} <Text small>{node.issue.author!.login}</Text>
                <Text small>{new Date(node.createdAt).toLocaleString()}</Text>
                <Spacer />
              </Link>
              <Card>
                <Text
                  size={16}
                  dangerouslySetInnerHTML={{ __html: node.bodyHTML }}
                />
              </Card>
            </Card>
          </Col>
        ))}
      </Container>
    )
  )
}

export default IssueCommentsTimeline
