import { Card, Text, Link, Spacer, User } from '@nextui-org/react'
import React, { memo } from 'react'

import type { Actor } from '../generated/graphql'

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

const CommentCard: React.FC<Props> = ({
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
      bordered
      shadow
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
      <Link underline href={commentLink} target="_blank">
        <Text h4>{ticketTitle}</Text>
      </Link>
      {'  '}
      <Text small>{ticketAuthorName}</Text>
      <Text small>{new Date(publishedAt).toLocaleString()}</Text>
      <User src={author.avatarUrl} name={author.login}>
        <User.Link href={author.url} target="_blank">
          @{author.login}
        </User.Link>
      </User>
      <Spacer />
      <Card>
        <Text size={20} dangerouslySetInnerHTML={{ __html: bodyHTML }} />
      </Card>
    </Card>
  )
}

export default memo(CommentCard)
