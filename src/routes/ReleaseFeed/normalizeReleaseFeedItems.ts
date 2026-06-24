import type {
  GetRepositoryReleaseCandidatesQuery,
  GetViewerStarredRepositoryReleasesQuery,
} from '@/generated/graphql'

export const RELEASE_FEED_RATE_LIMIT_ERROR_MESSAGE =
  'GitHub is taking a breather before it can load more releases. Please wait a few minutes, then try again.'
export const RELEASE_FEED_GENERIC_ERROR_MESSAGE =
  'Release Feed could not load releases. Please try again.'

export interface ReleaseFeedItem {
  repository: {
    avatarUrl: string
    nameWithOwner: string
    ownerLogin: string
    url: string
  }
  release: {
    body: string | null
    isPrerelease: boolean
    publishedAt: string
    tagName: string
    title: string
    url: string
  }
  id: string
}

export interface ReleaseFeedPageInfo {
  endCursor: string | null
  hasNextPage: boolean
}

export interface ReleaseFeedRepositoryPageInfo extends ReleaseFeedPageInfo {
  nameWithOwner: string
  repositoryId: string
}

export interface NormalizedViewerStarredRepositoryReleases {
  items: ReleaseFeedItem[]
  repositoryReleasePageInfos: ReleaseFeedRepositoryPageInfo[]
  starredRepositoriesPageInfo: ReleaseFeedPageInfo
  totalStarredRepositories: number
}

export interface NormalizedRepositoryReleaseCandidates {
  items: ReleaseFeedItem[]
  repositoryReleasePageInfo: ReleaseFeedRepositoryPageInfo | null
}

type StarredRepositoryNode = NonNullable<
  NonNullable<
    GetViewerStarredRepositoryReleasesQuery['viewer']['starredRepositories']['nodes']
  >[number]
>
type ReleaseRepositoryNode = Pick<
  StarredRepositoryNode,
  'id' | 'nameWithOwner' | 'owner' | 'releases' | 'url'
>
type ReleaseNode = NonNullable<
  NonNullable<StarredRepositoryNode['releases']['nodes']>[number]
>

/**
 * Flattens the initial starred-repository query when the Release Feed first loads its RTK Query data.
 * @param data - Generated GraphQL response from `useGetViewerStarredRepositoryReleasesQuery`.
 * @returns Sorted feed items plus starred-repository and per-repository pagination metadata.
 * @example
 * normalizeViewerStarredRepositoryReleases(data).items[0].release.title // => "v1.0.0"
 */
export function normalizeViewerStarredRepositoryReleases(
  data: GetViewerStarredRepositoryReleasesQuery | undefined,
): NormalizedViewerStarredRepositoryReleases {
  const starredRepositories = data?.viewer.starredRepositories

  if (!starredRepositories) {
    return {
      items: [],
      repositoryReleasePageInfos: [],
      starredRepositoriesPageInfo: { endCursor: null, hasNextPage: false },
      totalStarredRepositories: 0,
    }
  }

  const repositories = (starredRepositories.nodes ?? []).filter(
    (repositoryNode): repositoryNode is StarredRepositoryNode =>
      repositoryNode !== null,
  )

  const repositoryReleasePageInfos = repositories.map(
    createRepositoryReleasePageInfo,
  )

  return {
    items: mergeReleaseFeedItems(
      ...repositories.map((repository) =>
        normalizeRepositoryReleases(repository),
      ),
    ),
    repositoryReleasePageInfos,
    starredRepositoriesPageInfo: starredRepositories.pageInfo,
    totalStarredRepositories: starredRepositories.totalCount,
  }
}

/**
 * Flattens one repository continuation page when infinite scroll asks GitHub for more release candidates.
 * @param data - Generated GraphQL response from `useGetRepositoryReleaseCandidatesQuery`.
 * @returns Sorted feed items plus that repository's release pagination metadata, or null when missing.
 * @example
 * normalizeRepositoryReleaseCandidates(data).repositoryReleasePageInfo?.hasNextPage // => true
 */
export function normalizeRepositoryReleaseCandidates(
  data: GetRepositoryReleaseCandidatesQuery | undefined,
): NormalizedRepositoryReleaseCandidates {
  if (!data?.repository) {
    return { items: [], repositoryReleasePageInfo: null }
  }

  return {
    items: mergeReleaseFeedItems(normalizeRepositoryReleases(data.repository)),
    repositoryReleasePageInfo: createRepositoryReleasePageInfo(data.repository),
  }
}

/**
 * Merges cached and newly loaded pages when Release Feed pagination appends data from RTK Query.
 * @param itemGroups - One or more already-normalized feed item arrays.
 * @returns A newest-first array with duplicate release IDs removed.
 * @example
 * mergeReleaseFeedItems([existingRelease], [sameRelease]).length // => 1
 */
export function mergeReleaseFeedItems(
  ...itemGroups: ReadonlyArray<readonly ReleaseFeedItem[]>
): ReleaseFeedItem[] {
  const releasesById = new Map<string, ReleaseFeedItem>()

  for (const itemGroup of itemGroups) {
    for (const item of itemGroup) {
      // Keep the earliest cached copy so already-rendered release data remains stable.
      if (!releasesById.has(item.id)) {
        releasesById.set(item.id, item)
      }
    }
  }

  return sortReleaseFeedItemsNewestFirst([...releasesById.values()])
}

/**
 * Converts GitHub/RTK Query errors into user-facing Release Feed copy when the route renders an error state.
 * @param error - RTK Query error payload, Error instance, string, or nested GraphQL error response.
 * @returns Friendly copy for rate-limit failures, otherwise a generic retryable failure message.
 * @example
 * formatReleaseFeedErrorMessage({ message: 'API rate limit exceeded' }) // => RELEASE_FEED_RATE_LIMIT_ERROR_MESSAGE
 */
export function formatReleaseFeedErrorMessage(error: unknown): string {
  if (/rate[\s-]?limit|secondary rate/i.test(collectErrorText(error))) {
    return RELEASE_FEED_RATE_LIMIT_ERROR_MESSAGE
  }

  return RELEASE_FEED_GENERIC_ERROR_MESSAGE
}

/**
 * Sorts a normalized feed page after callers flatten repository release candidates.
 * @param items - Normalized release feed items.
 * @returns A copy sorted by publish timestamp descending.
 * @example
 * sortReleaseFeedItemsNewestFirst([older, newer])[0] // => newer
 */
function sortReleaseFeedItemsNewestFirst(
  items: readonly ReleaseFeedItem[],
): ReleaseFeedItem[] {
  return [...items].sort(
    (leftItem, rightItem) =>
      getSortableTimestampMs(rightItem.release.publishedAt) -
      getSortableTimestampMs(leftItem.release.publishedAt),
  )
}

/**
 * Flattens the releases for one repository when either initial or continuation query data arrives.
 * @param repository - A generated repository node that includes owner metadata and releases.
 * @returns Non-draft release feed items for that repository.
 * @example
 * normalizeRepositoryReleases(repository).every((item) => item.release.title)
 */
function normalizeRepositoryReleases(
  repository: ReleaseRepositoryNode,
): ReleaseFeedItem[] {
  return (repository.releases.nodes ?? []).flatMap((releaseNode) => {
    if (releaseNode === null || releaseNode.isDraft) {
      return []
    }

    return [
      {
        id: releaseNode.id,
        release: {
          body: releaseNode.description,
          isPrerelease: releaseNode.isPrerelease,
          publishedAt: getReleasePublishedTimestamp(releaseNode),
          tagName: releaseNode.tagName,
          title: releaseNode.name?.trim() || releaseNode.tagName,
          url: stringifyGitHubScalar(releaseNode.url),
        },
        repository: {
          avatarUrl: stringifyGitHubScalar(repository.owner.avatarUrl),
          nameWithOwner: repository.nameWithOwner,
          ownerLogin: repository.owner.login,
          url: stringifyGitHubScalar(repository.url),
        },
      },
    ]
  })
}

/**
 * Creates release pagination metadata for the route state when a repository has another release page.
 * @param repository - Repository node from either initial or continuation query.
 * @returns Metadata the infinite-scroll controller can use for the next query.
 * @example
 * createRepositoryReleasePageInfo(repository).endCursor // => "cursor"
 */
function createRepositoryReleasePageInfo(
  repository: ReleaseRepositoryNode,
): ReleaseFeedRepositoryPageInfo {
  return {
    endCursor: repository.releases.pageInfo.endCursor,
    hasNextPage: repository.releases.pageInfo.hasNextPage,
    nameWithOwner: repository.nameWithOwner,
    repositoryId: repository.id,
  }
}

/**
 * Chooses GitHub's publish timestamp, falling back to creation time for unpublished-looking API payloads.
 * @param release - Release node from the generated GraphQL response.
 * @returns The timestamp string used for display and newest-first sorting.
 * @example
 * getReleasePublishedTimestamp({ publishedAt: null, createdAt: '2026-01-01T00:00:00Z' }) // => "2026-01-01T00:00:00Z"
 */
function getReleasePublishedTimestamp(release: ReleaseNode): string {
  return (
    stringifyGitHubScalar(release.publishedAt) ||
    stringifyGitHubScalar(release.createdAt)
  )
}

/**
 * Normalizes GitHub scalar values before display so future schema drift cannot leak non-strings into the route.
 * @param value - GitHub scalar value returned by GraphQL Codegen.
 * @returns A string when the value is string-like, otherwise an empty fallback.
 * @example
 * stringifyGitHubScalar('https://github.com') // => "https://github.com"
 */
function stringifyGitHubScalar(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (value instanceof String) {
    return value.toString()
  }

  return ''
}

/**
 * Parses timestamps for sorting while keeping malformed dates at the bottom of the feed.
 * @param timestamp - Display timestamp copied to `ReleaseFeedItem.release.publishedAt`.
 * @returns Milliseconds since epoch, or negative infinity for invalid timestamps.
 * @example
 * getSortableTimestampMs('2026-01-01T00:00:00Z') > getSortableTimestampMs('')
 */
function getSortableTimestampMs(timestamp: string): number {
  const parsedTimestampMs = Date.parse(timestamp)

  if (Number.isNaN(parsedTimestampMs)) {
    return Number.NEGATIVE_INFINITY
  }

  return parsedTimestampMs
}

/**
 * Walks an unknown error payload so nested GraphQL/RTK messages can trigger friendly rate-limit copy.
 * @param value - Unknown error payload.
 * @param visitedObjects - Object references already visited during this recursive walk.
 * @returns Concatenated message-like text from strings, Error objects, arrays, and plain records.
 * @example
 * collectErrorText({ errors: [{ message: 'API rate limit exceeded' }] }) // => "API rate limit exceeded"
 */
function collectErrorText(
  value: unknown,
  visitedObjects = new WeakSet<object>(),
): string {
  if (typeof value === 'string') {
    return value
  }

  if (value instanceof Error) {
    return value.message
  }

  if (Array.isArray(value)) {
    if (visitedObjects.has(value)) {
      return ''
    }

    visitedObjects.add(value)
    return value.map((item) => collectErrorText(item, visitedObjects)).join(' ')
  }

  if (isPlainRecord(value)) {
    if (visitedObjects.has(value)) {
      return ''
    }

    visitedObjects.add(value)
    return Object.values(value)
      .map((item) => collectErrorText(item, visitedObjects))
      .join(' ')
  }

  return ''
}

/**
 * Narrows recursive error payloads before `collectErrorText` reads nested object values.
 * @param value - Unknown candidate value.
 * @returns True when the value is a non-null object record.
 * @example
 * isPlainRecord({ message: 'x' }) // => true
 */
function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
