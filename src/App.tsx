import {
  Card,
  Container,
  Row,
  Col,
  Text,
  Link,
  Spacer,
} from '@nextui-org/react'
import { useAtomValue } from 'jotai'
import React from 'react'

import { accessTokenAtom } from './atom'
import { useGetIssueCommentsQuery } from './generated/graphql'
import Loading from './Loading'

const endpoint = 'https://api.github.com/graphql'

function App() {
  const accessToken = useAtomValue(accessTokenAtom)

  const { status, data, error, isFetching } = useGetIssueCommentsQuery(
    {
      endpoint: endpoint,
      fetchParams: { headers: { authorization: `Bearer ${accessToken}` } },
    },
    { query: 'markerikson' },

    {
      // @ts-ignore
      select: (data) => data!.search!.edges![0]!.node!.issueComments!.edges,
    }
  )

  if (!status || status === 'loading' || isFetching)
    <Container>
      {' '}
      <Loading />
    </Container>

  if (error) <h1>Error</h1>

  return (
    status === 'success' && (
      <Container css={{ padding: '40px' }}>
        {data.reverse().map(({ node }, i) => (
          <Col
            key={i}
            css={{ display: 'flex', justifyContent: 'center', mb: '2px' }}
          >
            <Card bordered shadow={false} css={{ mw: '400px' }}>
              <Text color="primary">{node.repository.nameWithOwner}</Text>
              <Link underline href={node.issue.url} target="_blank">
                {node.issue.title} <Text small>{node.issue.author.login}</Text>
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

export default App
