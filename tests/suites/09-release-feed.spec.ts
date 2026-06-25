import { test, expect } from '../fixtures/auth'

const GITHUB_GRAPHQL_API_URL = 'https://api.github.com/graphql'

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
type ReleaseFeedResponseOptions = {
  endCursor?: string | null
  hasNextPage?: boolean
  totalCount?: number
}

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
  options: ReleaseFeedResponseOptions = {},
): ReleaseFeedResponse {
  const pageInfo = {
    endCursor: options.endCursor ?? null,
    hasNextPage: options.hasNextPage ?? false,
  }

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
        pageInfo,
        totalCount: options.totalCount ?? repositories.length,
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

/**
 * Detects Release Feed GraphQL requests so tests can override the shared default mock safely.
 * @param postData - Raw GraphQL request body from Playwright's route handler.
 * @returns Parsed operation details when the request is a Release Feed operation, otherwise null.
 * @example
 * parseReleaseFeedOperation('{"operationName":"getViewerStarredRepositoryReleases"}')
 */
function parseReleaseFeedOperation(postData: string | null) {
  if (!postData) {
    return null
  }

  try {
    const operation = JSON.parse(postData) as {
      operationName?: string
      query?: string
      variables?: Record<string, unknown>
    }
    const isReleaseFeedOperation =
      operation.operationName === 'getViewerStarredRepositoryReleases' ||
      operation.query?.includes('query getViewerStarredRepositoryReleases') ===
        true

    return isReleaseFeedOperation ? operation : null
  } catch {
    return null
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

  test('shows an initial network error and retries the failed release query', async ({
    page,
    appPage,
  }) => {
    // Arrange
    let releaseFeedRequestCount = 0
    await page.route(GITHUB_GRAPHQL_API_URL, async (route) => {
      const operation = parseReleaseFeedOperation(route.request().postData())

      if (!operation) {
        await route.fallback()
        return
      }

      releaseFeedRequestCount += 1

      if (releaseFeedRequestCount === 1) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: 'Network request failed' }],
          }),
        })
        return
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: createReleaseFeedResponse([
            {
              id: 'repo-retry',
              nameWithOwner: 'example/retry',
              ownerLogin: 'example',
              releases: [
                createReleaseNode({
                  id: 'release-retry',
                  name: 'Retry Works',
                  tagName: 'v1.0.0',
                  url: 'https://github.com/example/retry/releases/tag/v1.0.0',
                }),
              ],
            },
          ]),
        }),
      })
    })

    // Act
    await appPage.gotoReleases()

    // Assert
    await expect(
      page.getByText('Release Feed could not load releases. Please try again.'),
    ).toBeVisible()

    // Act
    await page.getByRole('button', { name: 'Retry' }).click()

    // Assert
    await expect(page.getByText('Retry Works')).toBeVisible()
    expect(releaseFeedRequestCount).toBe(2)
  })

  test('loads the next starred repository page when the bottom sentinel enters view', async ({
    page,
    appPage,
    graphqlMocker,
  }) => {
    // Arrange
    const deferredNextPage = createDeferred<ReleaseFeedResponse>()
    graphqlMocker.mockOperation(
      'getViewerStarredRepositoryReleases',
      (operation) => {
        if (operation.variables?.starredAfter === 'starred-cursor-1') {
          return deferredNextPage.promise
        }

        return createReleaseFeedResponse(
          [
            {
              id: 'repo-first-page',
              nameWithOwner: 'example/first-page',
              ownerLogin: 'example',
              releases: [
                createReleaseNode({
                  id: 'release-first-page',
                  name: 'First Page Release',
                  publishedAt: '2026-06-22T00:00:00Z',
                  tagName: 'v1.0.0',
                  url: 'https://github.com/example/first-page/releases/tag/v1.0.0',
                }),
              ],
            },
          ],
          {
            endCursor: 'starred-cursor-1',
            hasNextPage: true,
            totalCount: 2,
          },
        )
      },
    )

    // Act
    await appPage.gotoReleases()
    await expect(page.getByText('First Page Release')).toBeVisible()
    await page
      .getByTestId('release-feed-pagination-sentinel')
      .scrollIntoViewIfNeeded()

    // Assert
    await expect(
      page.getByRole('status', { name: 'Loading more releases' }),
    ).toBeVisible()

    // Act
    deferredNextPage.resolve(
      createReleaseFeedResponse(
        [
          {
            id: 'repo-second-page',
            nameWithOwner: 'example/second-page',
            ownerLogin: 'example',
            releases: [
              createReleaseNode({
                id: 'release-second-page',
                name: 'Second Page Release',
                publishedAt: '2026-06-23T00:00:00Z',
                tagName: 'v2.0.0',
                url: 'https://github.com/example/second-page/releases/tag/v2.0.0',
              }),
            ],
          },
        ],
        { totalCount: 2 },
      ),
    )

    // Assert
    const releaseCards = page.getByTestId('release-feed-card')
    await expect(releaseCards).toHaveCount(2)
    await expect(releaseCards.nth(0)).toContainText('Second Page Release')
    await expect(releaseCards.nth(1)).toContainText('First Page Release')
  })

  test('keeps loaded releases visible when pagination fails and retry loads the next page', async ({
    page,
    appPage,
  }) => {
    // Arrange
    let releaseFeedRequestCount = 0
    await page.route(GITHUB_GRAPHQL_API_URL, async (route) => {
      const operation = parseReleaseFeedOperation(route.request().postData())

      if (!operation) {
        await route.fallback()
        return
      }

      releaseFeedRequestCount += 1

      if (!operation.variables?.starredAfter) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: createReleaseFeedResponse(
              [
                {
                  id: 'repo-cached',
                  nameWithOwner: 'example/cached',
                  ownerLogin: 'example',
                  releases: [
                    createReleaseNode({
                      id: 'release-cached',
                      name: 'Cached Release',
                      tagName: 'v1.0.0',
                      url: 'https://github.com/example/cached/releases/tag/v1.0.0',
                    }),
                  ],
                },
              ],
              {
                endCursor: 'starred-cursor-1',
                hasNextPage: true,
                totalCount: 2,
              },
            ),
          }),
        })
        return
      }

      if (releaseFeedRequestCount === 2) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: 'Network request failed' }],
          }),
        })
        return
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: createReleaseFeedResponse(
            [
              {
                id: 'repo-recovered',
                nameWithOwner: 'example/recovered',
                ownerLogin: 'example',
                releases: [
                  createReleaseNode({
                    id: 'release-recovered',
                    name: 'Recovered Release',
                    tagName: 'v2.0.0',
                    url: 'https://github.com/example/recovered/releases/tag/v2.0.0',
                  }),
                ],
              },
            ],
            { totalCount: 2 },
          ),
        }),
      })
    })

    // Act
    await appPage.gotoReleases()
    await expect(page.getByText('Cached Release')).toBeVisible()
    const paginationSentinel = page.getByTestId(
      'release-feed-pagination-sentinel',
    )
    const shouldScrollSentinel = await paginationSentinel
      .waitFor({ state: 'visible', timeout: 1000 })
      .then(() => true)
      .catch(() => false)

    if (shouldScrollSentinel) {
      await paginationSentinel.scrollIntoViewIfNeeded()
    }

    // Assert
    await expect(
      page.getByText('Release Feed could not load releases. Please try again.'),
    ).toBeVisible()
    await expect(page.getByText('Cached Release')).toBeVisible()

    // Act
    await page.getByRole('button', { name: 'Retry next page' }).click()

    // Assert
    await expect(page.getByText('Recovered Release')).toBeVisible()
    expect(releaseFeedRequestCount).toBe(3)
  })
})
