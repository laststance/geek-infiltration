import { Card, Text, Row, Link, Spacer, User } from '@nextui-org/react'
import React, { memo } from 'react'

import type { Actor } from '../../generated/graphql'

interface Props {
  author: Actor
  repositoryName: string
  ticketLink: URL['href']
  ticketTitle: string
  ticketAuthorName: string
  commentLink: URL['href']
  publishedAt: string
  bodyHTML: string
}

const CommentCard: React.FC<Props> = memo(
  ({
    author,
    repositoryName,
    ticketLink,
    ticketTitle,
    ticketAuthorName,
    commentLink,
    publishedAt,
    bodyHTML,
  }) => {
    return (
      <Card
        as="section"
        variant="bordered"
        css={{
          borderBottomColor: 'rgba(77, 77, 77, 0.7)',
          borderBottomWidth: '1px',
          borderTopColor: 'rgba(77, 77, 77, 0.7)',
          borderTopWidth: '1px',
        }}
      >
        <Text color="primary" h5>
          <Link target="_blank" href={ticketLink}>
            {repositoryName}
          </Link>
        </Text>
        <Row as="section">
          <Link underline href={commentLink} target="_blank">
            <Text h4>{ticketTitle}</Text>
          </Link>
        </Row>
        <Row>
          <Text small>{ticketAuthorName}</Text>
          <Spacer x={0.4} />
          <Text small>{new Date(publishedAt).toLocaleString()}</Text>
        </Row>
        <Spacer />
        <Row>
          <User src={author.avatarUrl} name={author.login} css={{ p: 0 }}>
            <User.Link href={author.url} target="_blank">
              @{author.login}
            </User.Link>
          </User>
        </Row>
        <Row as="section">
          <div
            dangerouslySetInnerHTML={{ __html: bodyHTML }}
            style={{
              maxWidth: '100%',
              overflowWrap: 'break-word',
            }}
          />
        </Row>
      </Card>
    )
  }
)
CommentCard.displayName = 'CommentCard'
export default CommentCard
