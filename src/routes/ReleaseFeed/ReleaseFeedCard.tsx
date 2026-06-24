import LaunchIcon from '@mui/icons-material/Launch'
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { memo } from 'react'

import { fDateTime, fToNow } from '@/utils/formatTime'

import {
  RELEASE_FEED_AVATAR_SIZE_PX,
  RELEASE_FEED_BODY_PREVIEW_MAX_CHARACTERS,
  RELEASE_FEED_CARD_BORDER_RADIUS_PX,
} from './constants'
import type { ReleaseFeedItem } from './normalizeReleaseFeedItems'

interface ReleaseFeedCardProps {
  item: ReleaseFeedItem
}

/**
 * Trims release notes when a Release Feed card has optional body text to preview.
 * @param body - GitHub release description text from the normalized feed item.
 * @returns A single-line preview, or null when the release has no meaningful body.
 * @example
 * formatReleaseBodyPreview('Fixed bugs and shipped docs') // => "Fixed bugs and shipped docs"
 */
function formatReleaseBodyPreview(body: string | null): string | null {
  const normalizedBody = body?.replace(/\s+/g, ' ').trim()

  if (!normalizedBody) {
    return null
  }

  if (normalizedBody.length <= RELEASE_FEED_BODY_PREVIEW_MAX_CHARACTERS) {
    return normalizedBody
  }

  return `${normalizedBody.slice(0, RELEASE_FEED_BODY_PREVIEW_MAX_CHARACTERS).trimEnd()}...`
}

/**
 * Shows one GitHub release with repository context and opens the release URL from the card.
 * @param item - Normalized release item produced from starred repository GraphQL data.
 * @returns A responsive MUI card that links to the GitHub release in a new tab.
 * @example
 * <ReleaseFeedCard item={releaseFeedItem} />
 */
export const ReleaseFeedCard = memo(({ item }: ReleaseFeedCardProps) => {
  const releasePreview = formatReleaseBodyPreview(item.release.body)
  const absolutePublishedAt = fDateTime(item.release.publishedAt)
  const relativePublishedAt = fToNow(item.release.publishedAt)

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
      <CardActionArea
        aria-label={`Open ${item.repository.nameWithOwner} ${item.release.title} release on GitHub`}
        component="a"
        href={item.release.url}
        rel="noopener noreferrer"
        target="_blank"
        sx={{
          alignItems: 'stretch',
          display: 'flex',
          textAlign: 'left',
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
                  <Typography
                    component="h2"
                    sx={{ overflowWrap: 'anywhere' }}
                    variant="h6"
                  >
                    {item.release.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    title={absolutePublishedAt}
                    variant="caption"
                  >
                    {relativePublishedAt} | {absolutePublishedAt}
                  </Typography>
                </Box>
                <LaunchIcon
                  aria-hidden="true"
                  color="action"
                  fontSize="small"
                  sx={{ flexShrink: 0, mt: 0.5 }}
                />
              </Stack>

              {releasePreview ? (
                <Typography
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                  }}
                  variant="body2"
                >
                  {releasePreview}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
})
ReleaseFeedCard.displayName = 'ReleaseFeedCard'
