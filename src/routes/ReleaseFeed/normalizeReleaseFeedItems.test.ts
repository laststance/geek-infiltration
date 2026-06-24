import { describe, expect, it } from 'vitest'

import type {
  GetRepositoryReleaseCandidatesQuery,
  GetViewerStarredRepositoryReleasesQuery,
} from '@/generated/graphql'

import {
  RELEASE_FEED_GENERIC_ERROR_MESSAGE,
  RELEASE_FEED_RATE_LIMIT_ERROR_MESSAGE,
  formatReleaseFeedErrorMessage,
  mergeReleaseFeedItems,
  normalizeRepositoryReleaseCandidates,
  normalizeViewerStarredRepositoryReleases,
  type ReleaseFeedItem,
} from './normalizeReleaseFeedItems'

type StarredRepositoryNode = NonNullable<
  NonNullable<
    GetViewerStarredRepositoryReleasesQuery['viewer']['starredRepositories']['nodes']
  >[number]
>
type ReleaseNode = NonNullable<
  NonNullable<StarredRepositoryNode['releases']['nodes']>[number]
>

const DEFAULT_RELEASE_NODE: ReleaseNode = {
  createdAt: '2026-03-01T00:00:00Z',
  description: 'Release notes',
  id: 'release-default',
  isDraft: false,
  isPrerelease: false,
  name: 'Default Release',
  publishedAt: '2026-03-02T00:00:00Z',
  tagName: 'v0.0.0',
  url: 'https://github.com/example/repo/releases/tag/v0.0.0',
}

/**
 * Creates generated release nodes so tests can focus on Release Feed behavior instead of GraphQL shape noise.
 * @param release - Release fields to override for this test case.
 * @returns A generated release node compatible with the starred-repository and continuation queries.
 * @example
 * createReleaseNode({ id: 'release-1', tagName: 'v1.0.0' })
 */
function createReleaseNode(release: Partial<ReleaseNode>): ReleaseNode {
  return { ...DEFAULT_RELEASE_NODE, ...release }
}

/**
 * Creates generated starred repository nodes when normalizer tests need different release lists.
 * @param repository - Repository identity and release overrides for this test case.
 * @returns A generated repository node compatible with the initial starred-repository query.
 * @example
 * createRepositoryNode({ id: 'repo-1', nameWithOwner: 'owner/repo', releases: [] })
 */
function createRepositoryNode(repository: {
  id: string
  nameWithOwner: string
  releases: Array<ReleaseNode | null>
  avatarUrl?: string
  endCursor?: string | null
  hasNextPage?: boolean
  ownerLogin?: string
  url?: string
}): StarredRepositoryNode {
  return {
    id: repository.id,
    name: repository.nameWithOwner.split('/').at(1) ?? repository.nameWithOwner,
    nameWithOwner: repository.nameWithOwner,
    owner: {
      avatarUrl:
        repository.avatarUrl ??
        `https://avatars.githubusercontent.com/${repository.id}`,
      login: repository.ownerLogin ?? repository.nameWithOwner.split('/')[0],
    },
    releases: {
      nodes: repository.releases,
      pageInfo: {
        endCursor: repository.endCursor ?? null,
        hasNextPage: repository.hasNextPage ?? false,
      },
    },
    url: repository.url ?? `https://github.com/${repository.nameWithOwner}`,
  }
}

/**
 * Wraps repository nodes with the generated initial query envelope used by the Release Feed route.
 * @param repositories - Repository nodes returned by GitHub's starred repositories connection.
 * @returns A generated initial query response.
 * @example
 * createViewerQuery([repository]).viewer.starredRepositories.totalCount // => 1
 */
function createViewerQuery(
  repositories: Array<StarredRepositoryNode | null>,
): GetViewerStarredRepositoryReleasesQuery {
  return {
    viewer: {
      starredRepositories: {
        nodes: repositories,
        pageInfo: {
          endCursor: 'starred-cursor-1',
          hasNextPage: true,
        },
        totalCount: repositories.length,
      },
    },
  }
}

describe('normalizeViewerStarredRepositoryReleases', () => {
  it('renders newest published releases first and ignores drafts or null nodes', () => {
    // Arrange
    const reactRepository = createRepositoryNode({
      id: 'repo-react',
      nameWithOwner: 'facebook/react',
      releases: [
        createReleaseNode({
          createdAt: '2026-01-01T00:00:00Z',
          description: 'React older-created but later-published notes',
          id: 'release-react-latest-published',
          name: 'React 20',
          publishedAt: '2026-04-01T00:00:00Z',
          tagName: 'v20.0.0',
          url: 'https://github.com/facebook/react/releases/tag/v20.0.0',
        }),
        createReleaseNode({
          id: 'release-react-draft',
          isDraft: true,
          name: 'Draft React',
          publishedAt: '2026-05-01T00:00:00Z',
          tagName: 'v21.0.0',
        }),
        null,
      ],
      hasNextPage: true,
      endCursor: 'react-release-cursor',
    })
    const viteRepository = createRepositoryNode({
      id: 'repo-vite',
      nameWithOwner: 'vitejs/vite',
      releases: [
        createReleaseNode({
          createdAt: '2026-05-01T00:00:00Z',
          id: 'release-vite-earlier-published',
          name: null,
          publishedAt: '2026-03-01T00:00:00Z',
          tagName: 'v8.0.0',
          url: 'https://github.com/vitejs/vite/releases/tag/v8.0.0',
        }),
      ],
    })
    const data = createViewerQuery([reactRepository, null, viteRepository])

    // Act
    const result = normalizeViewerStarredRepositoryReleases(data)

    // Assert
    expect(result.items).toHaveLength(2)
    expect(result.items.map((item) => item.id)).toEqual([
      'release-react-latest-published',
      'release-vite-earlier-published',
    ])
    expect(result.items[0]).toMatchObject({
      release: {
        body: 'React older-created but later-published notes',
        publishedAt: '2026-04-01T00:00:00Z',
        tagName: 'v20.0.0',
        title: 'React 20',
        url: 'https://github.com/facebook/react/releases/tag/v20.0.0',
      },
      repository: {
        avatarUrl: 'https://avatars.githubusercontent.com/repo-react',
        nameWithOwner: 'facebook/react',
        ownerLogin: 'facebook',
        url: 'https://github.com/facebook/react',
      },
    })
    expect(result.items[1].release.title).toBe('v8.0.0')
    expect(result.starredRepositoriesPageInfo).toEqual({
      endCursor: 'starred-cursor-1',
      hasNextPage: true,
    })
    expect(result.repositoryReleasePageInfos).toEqual([
      {
        endCursor: 'react-release-cursor',
        hasNextPage: true,
        nameWithOwner: 'facebook/react',
        repositoryId: 'repo-react',
      },
      {
        endCursor: null,
        hasNextPage: false,
        nameWithOwner: 'vitejs/vite',
        repositoryId: 'repo-vite',
      },
    ])
    expect(result.totalStarredRepositories).toBe(3)
  })

  it('uses created time when published time is unavailable', () => {
    // Arrange
    const repository = createRepositoryNode({
      id: 'repo-beta',
      nameWithOwner: 'example/beta',
      releases: [
        createReleaseNode({
          createdAt: '2026-02-10T00:00:00Z',
          id: 'release-created-only',
          name: 'Created Only',
          publishedAt: null,
          tagName: 'v1.0.0',
        }),
      ],
    })

    // Act
    const result = normalizeViewerStarredRepositoryReleases(
      createViewerQuery([repository]),
    )

    // Assert
    expect(result.items[0].release.publishedAt).toBe('2026-02-10T00:00:00Z')
  })

  it('returns empty page metadata when the initial query has not loaded', () => {
    // Arrange
    const data = undefined

    // Act
    const result = normalizeViewerStarredRepositoryReleases(data)

    // Assert
    expect(result).toEqual({
      items: [],
      repositoryReleasePageInfos: [],
      starredRepositoriesPageInfo: {
        endCursor: null,
        hasNextPage: false,
      },
      totalStarredRepositories: 0,
    })
  })
})

describe('normalizeRepositoryReleaseCandidates', () => {
  it('normalizes one repository continuation page with repository pagination metadata', () => {
    // Arrange
    const repository = createRepositoryNode({
      id: 'repo-remix',
      nameWithOwner: 'remix-run/react-router',
      releases: [
        createReleaseNode({
          id: 'release-react-router',
          name: 'React Router 8',
          publishedAt: '2026-06-01T00:00:00Z',
          tagName: 'v8.0.0',
        }),
      ],
      endCursor: 'react-router-release-cursor',
      hasNextPage: true,
    })
    const data: GetRepositoryReleaseCandidatesQuery = {
      repository,
    }

    // Act
    const result = normalizeRepositoryReleaseCandidates(data)

    // Assert
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toMatchObject({
      id: 'release-react-router',
      repository: {
        nameWithOwner: 'remix-run/react-router',
        ownerLogin: 'remix-run',
      },
    })
    expect(result.repositoryReleasePageInfo).toEqual({
      endCursor: 'react-router-release-cursor',
      hasNextPage: true,
      nameWithOwner: 'remix-run/react-router',
      repositoryId: 'repo-remix',
    })
  })

  it('returns no continuation items when GitHub cannot resolve the repository', () => {
    // Arrange
    const data: GetRepositoryReleaseCandidatesQuery = {
      repository: null,
    }

    // Act
    const result = normalizeRepositoryReleaseCandidates(data)

    // Assert
    expect(result).toEqual({
      items: [],
      repositoryReleasePageInfo: null,
    })
  })
})

describe('mergeReleaseFeedItems', () => {
  it('keeps already loaded release data stable when a later page repeats a release id', () => {
    // Arrange
    const cachedRelease: ReleaseFeedItem = {
      id: 'release-duplicate',
      release: {
        body: 'Cached body',
        isPrerelease: false,
        publishedAt: '2026-04-01T00:00:00Z',
        tagName: 'v1.0.0',
        title: 'Cached title',
        url: 'https://github.com/example/repo/releases/tag/v1.0.0',
      },
      repository: {
        avatarUrl: 'https://avatars.githubusercontent.com/example',
        nameWithOwner: 'example/repo',
        ownerLogin: 'example',
        url: 'https://github.com/example/repo',
      },
    }
    const repeatedRelease: ReleaseFeedItem = {
      ...cachedRelease,
      release: {
        ...cachedRelease.release,
        body: 'New body should not replace cached body',
        title: 'New title should not replace cached title',
      },
    }
    const newerRelease: ReleaseFeedItem = {
      ...cachedRelease,
      id: 'release-newer',
      release: {
        ...cachedRelease.release,
        publishedAt: '2026-05-01T00:00:00Z',
        title: 'Newer title',
      },
    }

    // Act
    const result = mergeReleaseFeedItems(
      [cachedRelease],
      [repeatedRelease, newerRelease],
    )

    // Assert
    expect(result.map((item) => item.id)).toEqual([
      'release-newer',
      'release-duplicate',
    ])
    expect(result[1].release.body).toBe('Cached body')
    expect(result[1].release.title).toBe('Cached title')
  })
})

describe('formatReleaseFeedErrorMessage', () => {
  it('shows friendly retry copy when GitHub rate limits the Release Feed', () => {
    // Arrange
    const error = {
      errors: [{ message: 'API rate limit exceeded for user ID 1.' }],
    }

    // Act
    const message = formatReleaseFeedErrorMessage(error)

    // Assert
    expect(message).toBe(RELEASE_FEED_RATE_LIMIT_ERROR_MESSAGE)
  })

  it('shows generic retry copy for non-rate-limit Release Feed errors', () => {
    // Arrange
    const error = new Error('Network request failed')

    // Act
    const message = formatReleaseFeedErrorMessage(error)

    // Assert
    expect(message).toBe(RELEASE_FEED_GENERIC_ERROR_MESSAGE)
  })
})
