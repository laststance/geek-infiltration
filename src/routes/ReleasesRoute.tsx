import { Alert, Button, Skeleton, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'

import { useGetViewerStarredRepositoryReleasesQuery } from '@/generated/graphql'

import {
  RELEASE_FEED_LOADING_SKELETON_COUNT,
  RELEASE_FEED_LOADING_SKELETON_HEIGHT_PX,
  RELEASE_FEED_RELEASE_CANDIDATE_PAGE_SIZE,
  RELEASE_FEED_STARRED_REPOSITORY_PAGE_SIZE,
} from './ReleaseFeed/constants'
import {
  formatReleaseFeedErrorMessage,
  normalizeViewerStarredRepositoryReleases,
} from './ReleaseFeed/normalizeReleaseFeedItems'
import { ReleaseFeedList } from './ReleaseFeed/ReleaseFeedList'

/**
 * Creates loading placeholders while the first Release Feed query is in flight.
 * @returns Skeleton cards matching the final release list shape.
 * @example
 * <ReleaseFeedLoading />
 */
function ReleaseFeedLoading() {
  return (
    <Stack aria-label="Loading releases" spacing={2}>
      {Array.from(
        { length: RELEASE_FEED_LOADING_SKELETON_COUNT },
        (_, index) => (
          <Skeleton
            animation="wave"
            height={RELEASE_FEED_LOADING_SKELETON_HEIGHT_PX}
            key={`release-feed-skeleton-${index}`}
            variant="rounded"
          />
        ),
      )}
    </Stack>
  )
}

const RELEASE_FEED_INITIAL_QUERY_VARIABLES = {
  releaseCandidateFirst: RELEASE_FEED_RELEASE_CANDIDATE_PAGE_SIZE,
  starredFirst: RELEASE_FEED_STARRED_REPOSITORY_PAGE_SIZE,
}

/**
 * Renders an empty Release Feed result after GitHub returns starred repository data.
 * @param totalStarredRepositories - Number of starred repositories in the initial query result.
 * @returns Contextual empty copy for no starred repositories or no release candidates.
 * @example
 * <ReleaseFeedEmptyState totalStarredRepositories={0} />
 */
function ReleaseFeedEmptyState({
  totalStarredRepositories,
}: {
  totalStarredRepositories: number
}) {
  const message =
    totalStarredRepositories === 0
      ? 'Star repositories on GitHub to start building your release feed.'
      : 'No releases were found in your starred repositories yet.'

  return (
    <Alert severity="info" variant="outlined">
      {message}
    </Alert>
  )
}

/**
 * Fetches and renders the authenticated Release Feed timeline at `/releases`.
 * @returns Release Feed route content with heading, query states, and release cards.
 * @example
 * <Route path="/releases" Component={Component} />
 */
export function Component() {
  const { data, error, isFetching, isLoading, refetch } =
    useGetViewerStarredRepositoryReleasesQuery(
      RELEASE_FEED_INITIAL_QUERY_VARIABLES,
    )
  const normalizedFeed = useMemo(
    () => normalizeViewerStarredRepositoryReleases(data),
    [data],
  )
  const shouldShowInitialLoading = isLoading && !data
  const shouldShowInitialError = Boolean(error) && !data
  const shouldShowEmptyState =
    !shouldShowInitialLoading &&
    !shouldShowInitialError &&
    normalizedFeed.items.length === 0

  return (
    <Stack
      component="section"
      data-testid="release-feed-route"
      sx={{
        flex: 1,
        minWidth: 0,
        overflow: 'auto',
        px: { xs: 2, md: 3 },
        py: 3,
      }}
    >
      <Stack spacing={3} sx={{ mx: 'auto', width: 'min(100%, 960px)' }}>
        <Stack spacing={0.5}>
          <Typography component="h1" variant="h4">
            Release Feed
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Recent GitHub releases from your starred repositories, newest first.
          </Typography>
        </Stack>

        {shouldShowInitialLoading ? <ReleaseFeedLoading /> : null}

        {shouldShowInitialError ? (
          <Alert
            action={
              <Button
                color="inherit"
                onClick={() => {
                  void refetch()
                }}
                size="small"
              >
                Retry
              </Button>
            }
            severity="error"
            variant="outlined"
          >
            {formatReleaseFeedErrorMessage(error)}
          </Alert>
        ) : null}

        {normalizedFeed.items.length > 0 ? (
          <ReleaseFeedList items={normalizedFeed.items} />
        ) : null}

        {shouldShowEmptyState ? (
          <ReleaseFeedEmptyState
            totalStarredRepositories={normalizedFeed.totalStarredRepositories}
          />
        ) : null}

        {isFetching && !shouldShowInitialLoading ? (
          <Typography color="text.secondary" variant="caption">
            Refreshing releases...
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  )
}
