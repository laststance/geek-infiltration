import LaunchIcon from '@mui/icons-material/Launch'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material'
import { memo, type ComponentPropsWithoutRef, useId, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { fDateTime, fToNow } from '@/utils/formatTime'

import {
  RELEASE_FEED_AVATAR_SIZE_PX,
  RELEASE_FEED_BODY_PREVIEW_MAX_CHARACTERS,
  RELEASE_FEED_CARD_BORDER_RADIUS_PX,
  RELEASE_FEED_MARKDOWN_COLLAPSED_MAX_HEIGHT,
} from './constants'
import type { ReleaseFeedItem } from './normalizeReleaseFeedItems'

interface ReleaseFeedCardProps {
  item: ReleaseFeedItem
}

/**
 * Opens Markdown links safely because release notes come from GitHub repository authors.
 * @param children - Rendered Markdown link label.
 * @param href - URL parsed from the Markdown link destination.
 * @returns A safe external MUI link.
 * @example
 * <ReleaseMarkdownLink href="https://github.com">GitHub</ReleaseMarkdownLink>
 */
function ReleaseMarkdownLink({
  children,
  href,
}: ComponentPropsWithoutRef<'a'>) {
  return (
    <MuiLink href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </MuiLink>
  )
}

const RELEASE_FEED_MARKDOWN_COMPONENTS: Components = {
  a: ReleaseMarkdownLink,
}

/**
 * Preserves GitHub release Markdown while dropping empty descriptions before rendering a card preview.
 * @param body - GitHub release description text from the normalized feed item.
 * @returns Trimmed Markdown, or null when the release has no meaningful body.
 * @example
 * normalizeReleaseMarkdown('## Fixed bugs') // => "## Fixed bugs"
 */
function normalizeReleaseMarkdown(body: string | null): string | null {
  const normalizedBody = body?.trim()

  if (!normalizedBody) {
    return null
  }

  return normalizedBody
}

/**
 * Detects release notes that need an expand/collapse affordance instead of always showing the full Markdown.
 * @param body - Trimmed GitHub release Markdown.
 * @returns True when the body is long enough to collapse by default.
 * @example
 * shouldCollapseReleaseMarkdown('one\\ntwo\\nthree\\nfour') // => true
 */
function shouldCollapseReleaseMarkdown(body: string): boolean {
  const meaningfulLineCount = body
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0).length

  return (
    meaningfulLineCount > 3 ||
    body.length > RELEASE_FEED_BODY_PREVIEW_MAX_CHARACTERS
  )
}

/**
 * Renders release notes as safe Markdown with optional height-based collapse behavior.
 * @param body - Trimmed GitHub release Markdown body.
 * @param id - Stable DOM id used by the expand/collapse control.
 * @param isExpanded - Whether the full Markdown body is currently visible.
 * @returns Styled Markdown preview content.
 * @example
 * <ReleaseMarkdownBody body="## Notes" id="notes" isExpanded={false} />
 */
function ReleaseMarkdownBody({
  body,
  id,
  isExpanded,
}: {
  body: string
  id: string
  isExpanded: boolean
}) {
  const isCollapsed = !isExpanded

  return (
    <Box
      color="text.secondary"
      id={id}
      sx={(theme) => ({
        '& > :first-of-type': { mt: 0 },
        '& > :last-of-type': { mb: 0 },
        '&::after': isCollapsed
          ? {
              background: `linear-gradient(to bottom, transparent, ${theme.palette.background.paper})`,
              bottom: 0,
              content: '""',
              height: '1.75rem',
              left: 0,
              pointerEvents: 'none',
              position: 'absolute',
              right: 0,
            }
          : { content: 'none' },
        '& a': { overflowWrap: 'anywhere' },
        '& blockquote': {
          borderLeft: 2,
          borderColor: 'divider',
          m: 0,
          pl: 1.5,
        },
        '& code': {
          bgcolor: 'action.hover',
          borderRadius: 0.5,
          fontFamily: 'monospace',
          px: 0.5,
        },
        '& ol, & ul': { my: 0.75, pl: 2.5 },
        '& p': { my: 0.75 },
        '& pre': {
          bgcolor: 'action.hover',
          borderRadius: 1,
          overflowX: 'auto',
          p: 1,
        },
        '& table': {
          borderCollapse: 'collapse',
          display: 'block',
          overflowX: 'auto',
          width: '100%',
        },
        '& td, & th': {
          border: 1,
          borderColor: 'divider',
          p: 0.75,
        },
        fontSize: '0.875rem',
        lineHeight: 1.55,
        maxHeight: isCollapsed
          ? RELEASE_FEED_MARKDOWN_COLLAPSED_MAX_HEIGHT
          : 'none',
        overflow: isCollapsed ? 'hidden' : 'visible',
        position: 'relative',
      })}
    >
      <ReactMarkdown
        components={RELEASE_FEED_MARKDOWN_COMPONENTS}
        remarkPlugins={[remarkGfm]}
        skipHtml
      >
        {body}
      </ReactMarkdown>
    </Box>
  )
}

/**
 * Shows one GitHub release with repository context and opens the release URL from the card.
 * @param item - Normalized release item produced from starred repository GraphQL data.
 * @returns A responsive MUI card that links to the GitHub release in a new tab.
 * @example
 * <ReleaseFeedCard item={releaseFeedItem} />
 */
export const ReleaseFeedCard = memo(({ item }: ReleaseFeedCardProps) => {
  const releaseMarkdown = normalizeReleaseMarkdown(item.release.body)
  const shouldCollapseMarkdown =
    releaseMarkdown !== null && shouldCollapseReleaseMarkdown(releaseMarkdown)
  const [isMarkdownExpanded, setIsMarkdownExpanded] = useState(false)
  const markdownPreviewId = useId()
  const absolutePublishedAt = fDateTime(item.release.publishedAt)
  const relativePublishedAt = fToNow(item.release.publishedAt)
  const releaseAccessibleName = `${item.repository.nameWithOwner} ${item.release.title}`

  return (
    <Card
      component="article"
      data-testid="release-feed-card"
      variant="outlined"
      sx={{
        bgcolor: 'background.paper',
        borderRadius: `${RELEASE_FEED_CARD_BORDER_RADIUS_PX}px`,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ width: '100%' }}>
        <Stack direction="row" spacing={2}>
          <Avatar
            alt={`${item.repository.ownerLogin} avatar`}
            src={item.repository.avatarUrl}
            sx={{
              height: RELEASE_FEED_AVATAR_SIZE_PX,
              width: RELEASE_FEED_AVATAR_SIZE_PX,
            }}
          />
          <Stack spacing={1} sx={{ minWidth: 0, width: '100%' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{
                alignItems: { xs: 'flex-start', sm: 'center' },
                minWidth: 0,
              }}
            >
              <Typography
                color="primary"
                sx={{ overflowWrap: 'anywhere' }}
                variant="subtitle2"
              >
                {item.repository.nameWithOwner}
              </Typography>
              <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
                <Chip
                  component="span"
                  label={item.release.tagName}
                  size="small"
                  variant="outlined"
                />
                {item.release.isPrerelease ? (
                  <Chip
                    color="warning"
                    component="span"
                    label="Pre-release"
                    size="small"
                    variant="outlined"
                  />
                ) : null}
              </Stack>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'flex-start', minWidth: 0 }}
            >
              <Box sx={{ minWidth: 0, width: '100%' }}>
                <MuiLink
                  aria-label={`Open ${releaseAccessibleName} release on GitHub`}
                  href={item.release.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  underline="hover"
                  sx={{ color: 'text.primary' }}
                >
                  <Typography
                    component="h2"
                    sx={{ overflowWrap: 'anywhere' }}
                    variant="h6"
                  >
                    {item.release.title}
                  </Typography>
                </MuiLink>
                <Typography
                  color="text.secondary"
                  title={absolutePublishedAt}
                  variant="caption"
                >
                  {relativePublishedAt}
                  <Box
                    component="span"
                    sx={{ display: { xs: 'none', sm: 'inline' } }}
                  >
                    {' | '}
                    {absolutePublishedAt}
                  </Box>
                </Typography>
              </Box>
              <LaunchIcon
                aria-hidden="true"
                color="action"
                fontSize="small"
                sx={{ flexShrink: 0, mt: 0.5 }}
              />
            </Stack>

            {releaseMarkdown ? (
              <Stack spacing={0.75}>
                <ReleaseMarkdownBody
                  body={releaseMarkdown}
                  id={markdownPreviewId}
                  isExpanded={!shouldCollapseMarkdown || isMarkdownExpanded}
                />
                {shouldCollapseMarkdown ? (
                  <Box>
                    <Button
                      aria-controls={markdownPreviewId}
                      aria-expanded={isMarkdownExpanded}
                      aria-label={`${isMarkdownExpanded ? 'Collapse' : 'Expand'} release notes for ${releaseAccessibleName}`}
                      onClick={() => {
                        setIsMarkdownExpanded(
                          (currentIsExpanded) => !currentIsExpanded,
                        )
                      }}
                      size="small"
                      variant="text"
                    >
                      {isMarkdownExpanded ? 'Show less' : 'Show more'}
                    </Button>
                  </Box>
                ) : null}
              </Stack>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
})
ReleaseFeedCard.displayName = 'ReleaseFeedCard'
