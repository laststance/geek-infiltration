import {
  Card,
  Typography as Text,
  CardContent,
  Link,
  Box,
  Grid,
  Avatar,
} from '@mui/material'
import React, { memo } from 'react'

import type { Actor } from '../generated/graphql'

interface Props {
  author: Actor
  bodyHTML: string
  commentLink: URL['href']
  publishedAt: string
  repositoryName: string
  ticketAuthorName: string
  ticketLink: URL['href']
  ticketTitle: string
}

const CommentCard: React.FC<Props> = memo(
  ({
    author,
    bodyHTML,
    commentLink,
    publishedAt,
    repositoryName,
    ticketAuthorName,
    ticketLink,
    ticketTitle,
  }) => {
    return (
      <Card
        sx={{ borderRadius: '20px', padding: '0 20px', width: '100%' }}
        component="article"
      >
        <CardContent sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <Box>
            <Link variant="subtitle2" target="_blank" href={ticketLink}>
              {repositoryName}
            </Link>
          </Box>
          <Box>
            <Link
              variant="h6"
              href={commentLink}
              target="_blank"
              sx={{ color: 'text.primary' }}
            >
              {ticketTitle}
            </Link>
          </Box>
          <Box>
            <Text variant="caption">
              {ticketAuthorName} {new Date(publishedAt).toLocaleString()}
            </Text>
          </Box>
          <Box style={{ marginTop: '20px' }}>
            <Grid container spacing={1}>
              <Grid item>
                <Avatar src={author.avatarUrl} alt={author.login} />
              </Grid>
              <Grid item>
                <Link href={author.url} target="_blank">
                  @{author.login}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Text
              variant="body1"
              className="comment-card-comment-body"
              dangerouslySetInnerHTML={{ __html: bodyHTML }}
            />
          </Box>
        </CardContent>
      </Card>
    )
  },
)
CommentCard.displayName = 'CommentCard'
export default CommentCard
