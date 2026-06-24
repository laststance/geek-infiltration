import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  useGetViewerStarredRepositoryReleasesQuery,
  useLazyGetViewerStarredRepositoryReleasesQuery,
} from '@/generated/graphql'

import {
  RELEASE_FEED_LOADING_SKELETON_COUNT,
  RELEASE_FEED_LOADING_SKELETON_HEIGHT_PX,
  RELEASE_FEED_RELEASE_CANDIDATE_PAGE_SIZE,
  RELEASE_FEED_STARRED_REPOSITORY_PAGE_SIZE,
} from './ReleaseFeed/constants'
import {
  formatReleaseFeedErrorMessage,
  mergeNormalizedViewerStarredRepositoryReleasePages,
  normalizeViewerStarredRepositoryReleases,
  type ReleaseFeedPageInfo,
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

type NormalizedReleaseFeedPage = ReturnType<
  typeof normalizeViewerStarredRepositoryReleases
>

type PaginatedReleaseFeedPageState = {
  initialData: unknown
  page: NormalizedReleaseFeedPage
}

type ReleaseFeedPaginationErrorState = {
  error: unknown
  initialData: unknown
}

/**
 * Keeps pagination requests scoped to the next starred-repository cursor.
 * @param pageInfo - Latest starredRepositories pageInfo from the normalized feed.
 * @returns Query variables for the next Release Feed page, or null when no cursor exists.
 * @example
 * createNextReleaseFeedPageVariables({ hasNextPage: true, endCursor: 'cursor' })?.starredAfter // => "cursor"
 */
function createNextReleaseFeedPageVariables(pageInfo: ReleaseFeedPageInfo) {
  if (!pageInfo.hasNextPage || !pageInfo.endCursor) {
    return null
  }

  return {
    ...RELEASE_FEED_INITIAL_QUERY_VARIABLES,
    starredAfter: pageInfo.endCursor,
  }
}

/**
 * Renders the retryable error alert used by initial, partial, and pagination failures.
 * @param actionLabel - Visible and accessible label for the retry button.
 * @param error - RTK Query or GraphQL error payload to format for users.
 * @param onRetry - Callback that retries the failed release feed request.
 * @returns A MUI error alert with a compact retry action.
 * @example
 * <ReleaseFeedErrorAlert actionLabel="Retry" error={error} onRetry={refetch} />
 */
function ReleaseFeedErrorAlert({
  actionLabel,
  error,
  onRetry,
}: {
  actionLabel: string
  error: unknown
  onRetry: () => void
}) {
  return (
    <Alert
      action={
        <Button color="inherit" onClick={onRetry} size="small">
          {actionLabel}
        </Button>
      }
      severity="error"
      variant="outlined"
    >
      {formatReleaseFeedErrorMessage(error)}
    </Alert>
  )
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
 * Renders bottom-of-feed loading and retry affordances while infinite scroll requests another page.
 * @param error - Pagination failure, if the most recent next-page request failed.
 * @param isLoading - True while a next starred-repository page is being requested.
 * @param onRetry - Callback that retries the failed next-page request.
 * @returns Bottom pagination status UI, or null when the list is idle.
 * @example
 * <ReleaseFeedPaginationStatus isLoading={true} error={null} onRetry={loadMore} />
 */
function ReleaseFeedPaginationStatus({
  error,
  isLoading,
  onRetry,
}: {
  error: unknown
  isLoading: boolean
  onRetry: () => void
}) {
  if (isLoading) {
    return (
      <Stack
        aria-label="Loading more releases"
        direction="row"
        role="status"
        spacing={1}
        sx={{ alignItems: 'center', color: 'text.secondary', py: 1 }}
      >
        <CircularProgress color="inherit" size={16} />
        <Typography variant="caption">Loading more releases...</Typography>
      </Stack>
    )
  }

  if (error) {
    return (
      <ReleaseFeedErrorAlert
        actionLabel="Retry next page"
        error={error}
        onRetry={onRetry}
      />
    )
  }

  return null
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
  const [loadMoreStarredRepositories] =
    useLazyGetViewerStarredRepositoryReleasesQuery()
  const [additionalReleaseFeedPageStates, setAdditionalReleaseFeedPageStates] =
    useState<PaginatedReleaseFeedPageState[]>([])
  const [paginationErrorState, setPaginationErrorState] =
    useState<ReleaseFeedPaginationErrorState | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const isLoadingMoreRef = useRef(false)
  const paginationSentinelRef = useRef<HTMLDivElement | null>(null)
  const normalizedInitialFeed = useMemo(
    () => normalizeViewerStarredRepositoryReleases(data),
    [data],
  )
  const additionalReleaseFeedPages = useMemo(
    () =>
      additionalReleaseFeedPageStates
        // Ignore old next-page results after the first page retries or refetches.
        .filter((pageState) => pageState.initialData === data)
        .map((pageState) => pageState.page),
    [additionalReleaseFeedPageStates, data],
  )
  const paginationError =
    paginationErrorState !== null && paginationErrorState.initialData === data
      ? paginationErrorState.error
      : null
  const normalizedFeed = useMemo(
    () =>
      mergeNormalizedViewerStarredRepositoryReleasePages(
        ...(data ? [normalizedInitialFeed] : []),
        ...additionalReleaseFeedPages,
      ),
    [additionalReleaseFeedPages, data, normalizedInitialFeed],
  )
  const shouldShowInitialLoading = isLoading && !data
  const shouldShowInitialError = Boolean(error) && !data
  const shouldShowPartialError = Boolean(error) && Boolean(data)
  const nextReleaseFeedPageVariables = createNextReleaseFeedPageVariables(
    normalizedFeed.starredRepositoriesPageInfo,
  )
  const hasMoreReleasePages = nextReleaseFeedPageVariables !== null
  const canLoadMoreReleasePages =
    hasMoreReleasePages && !shouldShowInitialError && !paginationError
  const shouldShowEmptyState =
    !shouldShowInitialLoading &&
    !shouldShowInitialError &&
    !hasMoreReleasePages &&
    !isLoadingMore &&
    !paginationError &&
    normalizedFeed.items.length === 0
  const loadMoreReleasePages = useCallback(async () => {
    const variables = createNextReleaseFeedPageVariables(
      normalizedFeed.starredRepositoriesPageInfo,
    )

    if (!variables || isLoadingMoreRef.current) {
      return
    }

    isLoadingMoreRef.current = true
    setIsLoadingMore(true)
    setPaginationErrorState(null)

    try {
      const nextPage = await loadMoreStarredRepositories(variables).unwrap()
      const normalizedNextPage =
        normalizeViewerStarredRepositoryReleases(nextPage)

      setAdditionalReleaseFeedPageStates((currentPages) => [
        ...currentPages,
        {
          initialData: data,
          page: normalizedNextPage,
        },
      ])
    } catch (nextPageError) {
      setPaginationErrorState({
        error: nextPageError,
        initialData: data,
      })
    } finally {
      isLoadingMoreRef.current = false
      setIsLoadingMore(false)
    }
  }, [
    data,
    loadMoreStarredRepositories,
    normalizedFeed.starredRepositoriesPageInfo,
  ])

  useEffect(() => {
    if (
      !canLoadMoreReleasePages ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return undefined
    }

    const paginationSentinel = paginationSentinelRef.current

    if (!paginationSentinel) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadMoreReleasePages()
        }
      },
      {
        root: null,
        rootMargin: '320px 0px',
      },
    )

    observer.observe(paginationSentinel)

    return () => {
      observer.disconnect()
    }
  }, [canLoadMoreReleasePages, loadMoreReleasePages])

  return (
    <Stack
      aria-busy={shouldShowInitialLoading || isLoadingMore ? true : undefined}
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
          <ReleaseFeedErrorAlert
            actionLabel="Retry"
            error={error}
            onRetry={() => {
              void refetch()
            }}
          />
        ) : null}

        {shouldShowPartialError ? (
          <ReleaseFeedErrorAlert
            actionLabel="Retry all releases"
            error={error}
            onRetry={() => {
              void refetch()
            }}
          />
        ) : null}

        {normalizedFeed.items.length > 0 ? (
          <ReleaseFeedList items={normalizedFeed.items} />
        ) : null}

        {canLoadMoreReleasePages ? (
          <Box
            aria-hidden="true"
            data-testid="release-feed-pagination-sentinel"
            ref={paginationSentinelRef}
            sx={{ height: 1 }}
          />
        ) : null}

        <ReleaseFeedPaginationStatus
          error={paginationError}
          isLoading={isLoadingMore}
          onRetry={() => {
            void loadMoreReleasePages()
          }}
        />

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
