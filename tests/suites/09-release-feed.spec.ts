import { test, expect } from '../fixtures/auth'

type ReleaseNode = {
  createdAt: string
  description: string | null
  id: string
  isDraft: boolean
  isPrerelease: boolean
  name: string | null
  publishedAt: string | null
  tagName: string
  url: string
}

type RepositoryNode = {
  id: string
  nameWithOwner: string
  ownerLogin: string
  releases: ReleaseNode[]
}

type ReleaseFeedResponse = Record<string, unknown>

/**
 * Creates a pending promise so a Playwright test can observe the route loading state before GraphQL resolves.
 * @returns Promise controls for resolving the mocked GraphQL operation from the test body.
 * @example
 * const deferred = createDeferred<ReleaseFeedResponse>()
 */
function createDeferred<T>() {
  let resolve: (value: T) => void = () => {}
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

/**
 * Builds the GitHub GraphQL response shape used by the Release Feed route E2E tests.
 * @param repositories - Starred repository fixtures returned from the mocked viewer query.
 * @returns A viewer.starredRepositories payload compatible with GraphQLMocker.
 * @example
 * createReleaseFeedResponse([{ id: 'repo-react', nameWithOwner: 'facebook/react', ownerLogin: 'facebook', releases: [] }])
 */
function createReleaseFeedResponse(
  repositories: RepositoryNode[],
): ReleaseFeedResponse {
  return {
    viewer: {
      starredRepositories: {
        nodes: repositories.map((repository) => ({
          id: repository.id,
          name: repository.nameWithOwner.split('/').at(1) ?? repository.id,
          nameWithOwner: repository.nameWithOwner,
          owner: {
            avatarUrl: `https://avatars.githubusercontent.com/${repository.id}`,
            login: repository.ownerLogin,
          },
          releases: {
            nodes: repository.releases,
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
            },
          },
          url: `https://github.com/${repository.nameWithOwner}`,
        })),
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
        },
        totalCount: repositories.length,
      },
    },
  }
}

/**
 * Creates a release node with explicit defaults so E2E scenarios can override only the behavior under test.
 * @param release - Release fields that differ from the default GitHub response fixture.
 * @returns A release node compatible with the generated release query shape.
 * @example
 * createReleaseNode({ id: 'release-react-20', tagName: 'v20.0.0' })
 */
function createReleaseNode(release: Partial<ReleaseNode>): ReleaseNode {
  return {
    createdAt: '2026-06-20T00:00:00Z',
    description: 'Release notes',
    id: 'release-default',
    isDraft: false,
    isPrerelease: false,
    name: 'Default Release',
    publishedAt: '2026-06-21T00:00:00Z',
    tagName: 'v0.0.0',
    url: 'https://github.com/example/repo/releases/tag/v0.0.0',
    ...release,
  }
}

test.describe('Release Feed route', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // All Release Feed route tests require the authenticated shell.
  })

  test('renders release cards newest first with repository, metadata, avatar, and safe GitHub links', async ({
    page,
    appPage,
    graphqlMocker,
  }) => {
    // Arrange
    graphqlMocker.mockOperation('getViewerStarredRepositoryReleases', () =>
      createReleaseFeedResponse([
        {
          id: 'repo-vite',
          nameWithOwner: 'vitejs/vite',
          ownerLogin: 'vitejs',
          releases: [
            createReleaseNode({
              id: 'release-vite-8',
              name: 'Vite 8',
              publishedAt: '2026-06-10T12:00:00Z',
              tagName: 'v8.0.0',
              url: 'https://github.com/vitejs/vite/releases/tag/v8.0.0',
            }),
          ],
        },
        {
          id: 'repo-react',
          nameWithOwner: 'facebook/react',
          ownerLogin: 'facebook',
          releases: [
            createReleaseNode({
              description: 'React 20 release notes',
              id: 'release-react-20',
              isPrerelease: true,
              name: 'React 20',
              publishedAt: '2026-06-23T12:00:00Z',
              tagName: 'v20.0.0',
              url: 'https://github.com/facebook/react/releases/tag/v20.0.0',
            }),
          ],
        },
      ]),
    )

    // Act
    await appPage.gotoReleases()

    // Assert
    await expect(
      page.getByRole('heading', { name: 'Release Feed' }),
    ).toBeVisible()
    const releaseCards = page.getByTestId('release-feed-card')
    await expect(releaseCards).toHaveCount(2)
    await expect(releaseCards.nth(0)).toContainText('facebook/react')
    await expect(releaseCards.nth(0)).toContainText('React 20')
    await expect(releaseCards.nth(0)).toContainText('v20.0.0')
    await expect(releaseCards.nth(0)).toContainText('Pre-release')
    await expect(releaseCards.nth(0)).toContainText('23 Jun 2026')
    await expect(releaseCards.nth(0)).toContainText('React 20 release notes')
    await expect(
      releaseCards.nth(0).getByAltText('facebook avatar'),
    ).toHaveAttribute('src', 'https://avatars.githubusercontent.com/repo-react')
    await expect(
      releaseCards.nth(0).getByRole('link', {
        name: 'Open facebook/react React 20 release on GitHub',
      }),
    ).toHaveAttribute(
      'href',
      'https://github.com/facebook/react/releases/tag/v20.0.0',
    )
    await expect(releaseCards.nth(0).getByRole('link')).toHaveAttribute(
      'target',
      '_blank',
    )
    await expect(releaseCards.nth(0).getByRole('link')).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
    await expect(releaseCards.nth(1)).toContainText('vitejs/vite')
  })

  test('uses the tag name as a visible release title when GitHub returns no name', async ({
    page,
    appPage,
    graphqlMocker,
  }) => {
    // Arrange
    graphqlMocker.mockOperation('getViewerStarredRepositoryReleases', () =>
      createReleaseFeedResponse([
        {
          id: 'repo-tanstack',
          nameWithOwner: 'tanstack/query',
          ownerLogin: 'tanstack',
          releases: [
            createReleaseNode({
              id: 'release-tag-title',
              name: '',
              tagName: 'v6.0.0',
              url: 'https://github.com/tanstack/query/releases/tag/v6.0.0',
            }),
          ],
        },
      ]),
    )

    // Act
    await appPage.gotoReleases()

    // Assert
    await expect(page.getByRole('heading', { name: 'v6.0.0' })).toBeVisible()
  })

  test('shows the no starred repositories empty state after an empty query succeeds', async ({
    page,
    appPage,
    graphqlMocker,
  }) => {
    // Arrange
    graphqlMocker.mockOperation('getViewerStarredRepositoryReleases', () =>
      createReleaseFeedResponse([]),
    )

    // Act
    await appPage.gotoReleases()

    // Assert
    await expect(
      page.getByText(
        'Star repositories on GitHub to start building your release feed.',
      ),
    ).toBeVisible()
  })

  test('shows the no releases found empty state when starred repositories have no release candidates', async ({
    page,
    appPage,
    graphqlMocker,
  }) => {
    // Arrange
    graphqlMocker.mockOperation('getViewerStarredRepositoryReleases', () =>
      createReleaseFeedResponse([
        {
          id: 'repo-empty',
          nameWithOwner: 'example/empty',
          ownerLogin: 'example',
          releases: [],
        },
      ]),
    )

    // Act
    await appPage.gotoReleases()

    // Assert
    await expect(
      page.getByText(
        'No releases were found in your starred repositories yet.',
      ),
    ).toBeVisible()
  })

  test('shows loading skeletons while the initial release query is pending', async ({
    page,
    appPage,
    graphqlMocker,
  }) => {
    // Arrange
    const deferredReleaseFeed = createDeferred<ReleaseFeedResponse>()
    graphqlMocker.mockOperation(
      'getViewerStarredRepositoryReleases',
      () => deferredReleaseFeed.promise,
    )

    // Act
    await appPage.gotoReleases()

    // Assert
    await expect(page.getByLabel('Loading releases')).toBeVisible()
    deferredReleaseFeed.resolve(createReleaseFeedResponse([]))
    await expect(
      page.getByText(
        'Star repositories on GitHub to start building your release feed.',
      ),
    ).toBeVisible()
  })
})
