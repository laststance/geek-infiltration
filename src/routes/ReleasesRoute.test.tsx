import { ThemeProvider, createTheme } from '@mui/material'
import { render, screen, within } from '@testing-library/react'
import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  GetViewerStarredRepositoryReleasesQuery,
  GetViewerStarredRepositoryReleasesQueryVariables,
} from '@/generated/graphql'

import { Component } from './ReleasesRoute'

const mockUseGetViewerStarredRepositoryReleasesQuery = vi.fn()

vi.mock('@/generated/graphql', () => ({
  useGetViewerStarredRepositoryReleasesQuery: (
    variables: GetViewerStarredRepositoryReleasesQueryVariables,
  ) => mockUseGetViewerStarredRepositoryReleasesQuery(variables),
}))

const theme = createTheme()

type StarredRepositoryNode = NonNullable<
  NonNullable<
    GetViewerStarredRepositoryReleasesQuery['viewer']['starredRepositories']['nodes']
  >[number]
>
type ReleaseNode = NonNullable<
  NonNullable<StarredRepositoryNode['releases']['nodes']>[number]
>

/**
 * Renders route-level Release Feed UI with the same MUI theme wrapper as other component tests.
 * @param ui - Route component tree under test.
 * @returns Testing Library render result.
 * @example
 * renderWithTheme(<Component />)
 */
function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

/**
 * Creates generated release nodes for route rendering tests without hiding GitHub field names.
 * @param release - Release fields that differ from the default fixture.
 * @returns A generated release node compatible with the initial Release Feed query.
 * @example
 * createReleaseNode({ id: 'release-1', tagName: 'v1.0.0' })
 */
function createReleaseNode(release: Partial<ReleaseNode>): ReleaseNode {
  return {
    createdAt: '2026-03-01T00:00:00Z',
    description: 'Release notes',
    id: 'release-default',
    isDraft: false,
    isPrerelease: false,
    name: 'Default Release',
    publishedAt: '2026-03-02T00:00:00Z',
    tagName: 'v0.0.0',
    url: 'https://github.com/example/repo/releases/tag/v0.0.0',
    ...release,
  }
}

/**
 * Creates generated starred repositories with release nodes for Release Feed route tests.
 * @param repository - Repository identity and release list used by the query fixture.
 * @returns A generated starred repository node.
 * @example
 * createRepositoryNode({ id: 'repo-1', nameWithOwner: 'owner/repo', releases: [] })
 */
function createRepositoryNode(repository: {
  id: string
  nameWithOwner: string
  releases: ReleaseNode[]
}): StarredRepositoryNode {
  const [ownerLogin, repositoryName] = repository.nameWithOwner.split('/')

  return {
    id: repository.id,
    name: repositoryName ?? repository.nameWithOwner,
    nameWithOwner: repository.nameWithOwner,
    owner: {
      avatarUrl: `https://avatars.githubusercontent.com/${repository.id}`,
      login: ownerLogin ?? repository.nameWithOwner,
    },
    releases: {
      nodes: repository.releases,
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
      },
    },
    url: `https://github.com/${repository.nameWithOwner}`,
  }
}

/**
 * Wraps starred repositories in the generated query envelope used by the route hook.
 * @param repositories - Starred repository nodes returned by GitHub.
 * @returns A generated Release Feed query response.
 * @example
 * createViewerQuery([repository]).viewer.starredRepositories.totalCount // => 1
 */
function createViewerQuery(
  repositories: StarredRepositoryNode[],
): GetViewerStarredRepositoryReleasesQuery {
  return {
    viewer: {
      starredRepositories: {
        nodes: repositories,
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
        },
        totalCount: repositories.length,
      },
    },
  }
}

describe('ReleasesRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows release cards newest first with repository, tag, title, avatar, and external link', () => {
    // Arrange
    const reactRepository = createRepositoryNode({
      id: 'repo-react',
      nameWithOwner: 'facebook/react',
      releases: [
        createReleaseNode({
          description: 'React 20 release notes',
          id: 'release-react-20',
          isPrerelease: true,
          name: 'React 20',
          publishedAt: '2026-04-01T00:00:00Z',
          tagName: 'v20.0.0',
          url: 'https://github.com/facebook/react/releases/tag/v20.0.0',
        }),
      ],
    })
    const viteRepository = createRepositoryNode({
      id: 'repo-vite',
      nameWithOwner: 'vitejs/vite',
      releases: [
        createReleaseNode({
          id: 'release-vite-8',
          name: 'Vite 8',
          publishedAt: '2026-03-01T00:00:00Z',
          tagName: 'v8.0.0',
          url: 'https://github.com/vitejs/vite/releases/tag/v8.0.0',
        }),
      ],
    })
    mockUseGetViewerStarredRepositoryReleasesQuery.mockReturnValue({
      data: createViewerQuery([viteRepository, reactRepository]),
      error: undefined,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    })

    // Act
    renderWithTheme(<Component />)

    // Assert
    expect(screen.getByRole('heading', { name: 'Release Feed' })).toBeVisible()
    expect(mockUseGetViewerStarredRepositoryReleasesQuery).toHaveBeenCalledWith(
      {
        releaseCandidateFirst: 5,
        starredFirst: 50,
      },
    )
    const releaseCards = screen.getAllByTestId('release-feed-card')
    expect(releaseCards).toHaveLength(2)
    expect(within(releaseCards[0]).getByText('facebook/react')).toBeVisible()
    expect(within(releaseCards[0]).getByText('React 20')).toBeVisible()
    expect(within(releaseCards[0]).getByText('v20.0.0')).toBeVisible()
    expect(within(releaseCards[0]).getByText('Pre-release')).toBeVisible()
    expect(
      within(releaseCards[0]).getByText('React 20 release notes'),
    ).toBeVisible()
    expect(
      within(releaseCards[0]).getByAltText('facebook avatar'),
    ).toHaveAttribute('src', 'https://avatars.githubusercontent.com/repo-react')
    expect(
      within(releaseCards[0]).getByRole('link', {
        name: 'Open facebook/react React 20 release on GitHub',
      }),
    ).toHaveAttribute(
      'href',
      'https://github.com/facebook/react/releases/tag/v20.0.0',
    )
    expect(within(releaseCards[0]).getByRole('link')).toHaveAttribute(
      'target',
      '_blank',
    )
    expect(within(releaseCards[1]).getByText('vitejs/vite')).toBeVisible()
  })

  it('uses the tag name as the visible title when GitHub returns no release name', () => {
    // Arrange
    const repository = createRepositoryNode({
      id: 'repo-tanstack',
      nameWithOwner: 'tanstack/query',
      releases: [
        createReleaseNode({
          id: 'release-tag-title',
          name: '',
          tagName: 'v6.0.0',
          url: 'https://github.com/tanstack/query/releases/tag/v6.0.0',
        }),
      ],
    })
    mockUseGetViewerStarredRepositoryReleasesQuery.mockReturnValue({
      data: createViewerQuery([repository]),
      error: undefined,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    })

    // Act
    renderWithTheme(<Component />)

    // Assert
    const releaseCard = screen.getByTestId('release-feed-card')
    expect(
      within(releaseCard).getByRole('heading', { name: 'v6.0.0' }),
    ).toBeVisible()
  })

  it('shows a no starred repositories state after an empty query succeeds', () => {
    // Arrange
    mockUseGetViewerStarredRepositoryReleasesQuery.mockReturnValue({
      data: createViewerQuery([]),
      error: undefined,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    })

    // Act
    renderWithTheme(<Component />)

    // Assert
    expect(
      screen.getByText(
        'Star repositories on GitHub to start building your release feed.',
      ),
    ).toBeVisible()
  })
})
