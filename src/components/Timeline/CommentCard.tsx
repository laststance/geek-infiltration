import {
  Card,
  Typography as Text,
  CardContent,
  Link,
  Box,
  Divider,
  Avatar,
} from '@mui/material'
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
        sx={{
          borderBottomColor: 'rgba(77, 77, 77, 0.7)',
          borderBottomWidth: '1px',
          borderTopColor: 'rgba(77, 77, 77, 0.7)',
          borderTopWidth: '1px',
        }}
      >
        <CardContent>
          <Text>
            <Link target="_blank" href={ticketLink}>
              {repositoryName}
            </Link>
          </Text>
          <Box>
            <Link href={commentLink} target="_blank">
              <Text>{ticketTitle}</Text>
            </Link>
          </Box>
          <Box>
            <Text>{ticketAuthorName}</Text>
            <Divider />
            <Text>{new Date(publishedAt).toLocaleString()}</Text>
          </Box>
          <Divider />
          <Box>
            <Avatar src={author.avatarUrl} alt={author.login}>
              <Link href={author.url} target="_blank">
                @{author.login}
              </Link>
            </Avatar>
          </Box>
          <Box>
            <div
              dangerouslySetInnerHTML={{ __html: bodyHTML }}
              style={{
                maxWidth: '100%',
                overflowWrap: 'break-word',
              }}
            />
          </Box>
        </CardContent>
      </Card>
    )
  }
)
CommentCard.displayName = 'CommentCard'
export default CommentCard
