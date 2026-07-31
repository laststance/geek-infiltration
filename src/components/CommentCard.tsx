import {
  Card,
  Typography as Text,
  CardContent,
  Link,
  Box,
  Avatar,
  Grid,
} from '@mui/material'
import React, { memo } from 'react'

import type { Actor } from '../generated/graphql'

interface Props {
  /** GitHub account that wrote this comment; supplies the avatar, login, and profile URL. */
  author: Actor
  /** Comment body already rendered to HTML by GitHub's GraphQL API. */
  bodyHTML: string
  /** Permalink to the comment itself (the anchored `#issuecomment-…` URL). */
  commentLink: URL['href']
  /** ISO timestamp shown as a localized date; callers fall back to `createdAt` when GitHub returns null. */
  publishedAt: string
  /** Repository the comment belongs to, in `owner/name` form. */
  repositoryName: string
  /** Login of whoever opened the issue or discussion, not of the comment author. */
  ticketAuthorName: string
  /** Link to the parent issue or discussion. */
  ticketLink: URL['href']
  /** Title of the parent issue or discussion. */
  ticketTitle: string
}

/**
 * One GitHub comment rendered as a timeline card: repository line, parent ticket
 * title, author byline, and the comment body.
 *
 * Exists so the two timeline feeds share a single presentation. GitHub's GraphQL
 * API models issue/PR comments and discussion comments as different types, so
 * {@link PullRequest_Issue_Comments} and {@link DiscussionComments} each flatten
 * their own node shape into these props and hand it here. It renders once per
 * comment while a subscribed timeline column is on screen, and is memoized
 * because a feed re-render would otherwise re-parse every comment body.
 * @param author - Comment author as GitHub's {@link Actor}; drives avatar and profile link.
 * @param bodyHTML - GitHub-rendered comment HTML, injected verbatim (see the body comment below).
 * @param commentLink - Permalink to the comment.
 * @param publishedAt - ISO timestamp displayed via `toLocaleString()`.
 * @param repositoryName - `owner/name` label linking to the parent ticket.
 * @param ticketAuthorName - Login of the person who opened the parent ticket.
 * @param ticketLink - URL of the parent issue or discussion.
 * @param ticketTitle - Headline of the parent issue or discussion.
 * @returns An `<article>` card for a single comment, sized to fill its list row.
 * @example
 * <CommentCard
 *   author={author}
 *   repositoryName={repository.nameWithOwner}
 *   bodyHTML={bodyHTML}
 *   commentLink={url}
 *   publishedAt={publishedAt ?? createdAt}
 *   ticketAuthorName={issue.author!.login}
 *   ticketLink={issue.url}
 *   ticketTitle={issue.title}
 * />
 */
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
            {/* The repository label points at the parent ticket, not the repo root, so both
                top lines lead somewhere readable rather than to a bare repository page. */}
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
              <Grid>
                <Avatar src={author.avatarUrl} alt={author.login} />
              </Grid>
              <Grid>
                <Link href={author.url} target="_blank">
                  @{author.login}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Box>
            {/* GitHub returns the comment body as already-sanitized HTML (bodyHTML), so it is
                injected as-is; rendering the raw Markdown source would lose code blocks,
                mentions, and images. Never pass unsanitized text through this prop. */}
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
