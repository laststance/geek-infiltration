import { Card, Text, Link, Spacer } from '@nextui-org/react'
import React, { memo } from 'react'

interface Props {
  repositoryName: string
  ticketLink: URL['href']
  ticketTitle: string
  ticketAuthorName: string
  commentLink: URL['href']
  publishedAt: string
  bodyHTML: string
}

const CommentCard: React.FC<Props> = ({
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
      <Spacer />
      <Card>
        <Text size={20} dangerouslySetInnerHTML={{ __html: bodyHTML }} />
      </Card>
    </Card>
  )
}

export default memo(CommentCard, () => true)
