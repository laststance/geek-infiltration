import { test, expect } from '../fixtures/auth'
import { mockGraphQLError } from '../helpers/graphql-mock'
import { MOCK_ACCESS_TOKEN } from '../helpers/auth'
import { setReduxSlice } from '../helpers/storage'

type TimelineInformation = 'PR_Issues' | 'Discussion'

type TimelineSubscription = {
  information: TimelineInformation
  user: string
}

/**
 * Persists subscriptions so reload-driven tests exercise the same Redux state as the UI.
 * @param page - Playwright page whose Redux Persist state should receive timelines.
 * @param subscriptions - Timeline subscriptions to seed before navigating.
 * @returns Resolves after the subscribed slice is stored.
 * @example
 * await persistSubscriptions(page, [{ information: 'PR_Issues', user: 'octocat' }])
 */
async function persistSubscriptions(
  page: Parameters<typeof setReduxSlice>[0],
  subscriptions: TimelineSubscription[],
) {
  await setReduxSlice(page, 'subscribed', {
    subscribed: subscriptions.map(({ information, user }) => ({
      aim: { user },
      id: `timeline-${information}-${user}`,
      information,
    })),
  })
}

/**
 * Persists a PR/Issue timeline so the app triggers its real GraphQL query on load.
 * @param page - Playwright page whose Redux Persist state should receive a timeline.
 * @param user - GitHub username to render in the timeline.
 * @returns Resolves after the subscribed slice is stored.
 * @example
 * await persistIssueTimeline(page, 'octocat')
 */
async function persistIssueTimeline(
  page: Parameters<typeof setReduxSlice>[0],
  user = 'octocat',
) {
  await persistSubscriptions(page, [{ information: 'PR_Issues', user }])
}

/**
 * Persists a Discussion timeline so the app triggers its real GraphQL query on load.
 * @param page - Playwright page whose Redux Persist state should receive a timeline.
 * @param user - GitHub username to render in the timeline.
 * @returns Resolves after the subscribed slice is stored.
 * @example
 * await persistDiscussionTimeline(page, 'octocat')
 */
async function persistDiscussionTimeline(
  page: Parameters<typeof setReduxSlice>[0],
  user = 'octocat',
) {
  await persistSubscriptions(page, [{ information: 'Discussion', user }])
}

/**
 * Builds the GitHub following response consumed by the subscription autocomplete.
 * @returns Mock getViewerFollowing data.
 * @example
 * viewerFollowingResponse().viewer.following.nodes[0].login
 */
function viewerFollowingResponse() {
  return {
    viewer: {
      following: {
        totalCount: 2,
        nodes: [
          {
            avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
            login: 'octocat',
            name: 'The Octocat',
          },
          {
            avatarUrl: 'https://avatars.githubusercontent.com/u/810438?v=4',
            login: 'gaearon',
            name: null,
          },
        ],
      },
    },
  }
}

/**
 * Builds the GraphQL data shape consumed by the PR/Issue timeline component.
 * @param title - Issue title that should be rendered as a visible link.
 * @returns Mock getIssueComments data.
 * @example
 * issueCommentsResponse('Visible issue')
 */
function issueCommentsResponse(title: string) {
  return {
    search: {
      edges: [
        {
          node: {
            issueComments: {
              edges: [
                {
                  node: {
                    author: {
                      avatarUrl:
                        'https://avatars.githubusercontent.com/u/1?v=4',
                      login: 'octocat',
                      resourcePath: '/octocat',
                      url: 'https://github.com/octocat',
                    },
                    body: 'GraphQL mock body',
                    bodyHTML: '<p>GraphQL mock body</p>',
                    bodyText: 'GraphQL mock body',
                    createdAt: '2026-06-24T00:00:00Z',
                    issue: {
                      author: { login: 'octocat' },
                      title,
                      url: 'https://github.com/octocat/hello-world/issues/1',
                    },
                    publishedAt: '2026-06-24T00:00:00Z',
                    reactions: { totalCount: 0 },
                    repository: { nameWithOwner: 'octocat/hello-world' },
                    url: 'https://github.com/octocat/hello-world/issues/1#issuecomment-1',
                  },
                },
              ],
            },
          },
        },
      ],
    },
  }
}

/**
 * Builds multiple PR/Issue comments so the current one-shot batch renderer can be verified.
 * @param titles - Issue titles that should each render as visible links.
 * @returns Mock getIssueComments data.
 * @example
 * issueCommentsResponseWithTitles(['First', 'Second'])
 */
function issueCommentsResponseWithTitles(titles: string[]) {
  const [firstTitle, ...restTitles] = titles
  const response = issueCommentsResponse(firstTitle)
  const firstEdge = response.search.edges[0].node.issueComments.edges[0]

  response.search.edges[0].node.issueComments.edges = [
    firstEdge,
    ...restTitles.map((title, index) => ({
      node: {
        ...firstEdge.node,
        issue: {
          ...firstEdge.node.issue,
          title,
          url: `https://github.com/octocat/hello-world/issues/${index + 2}`,
        },
        url: `https://github.com/octocat/hello-world/issues/${index + 2}#issuecomment-${index + 2}`,
      },
    })),
  ]

  return response
}

/**
 * Builds the GraphQL data shape consumed by the Discussion timeline component.
 * @param title - Discussion title that should be rendered as a visible link.
 * @returns Mock getDiscussionComments data.
 * @example
 * discussionCommentsResponse('Visible discussion')
 */
function discussionCommentsResponse(title: string) {
  return {
    search: {
      edges: [
        {
          node: {
            repositoryDiscussionComments: {
              edges: [
                {
                  node: {
                    author: {
                      avatarUrl:
                        'https://avatars.githubusercontent.com/u/1?v=4',
                      login: 'octocat',
                      resourcePath: '/octocat',
                      url: 'https://github.com/octocat',
                    },
                    body: 'GraphQL discussion mock body',
                    bodyHTML: '<p>GraphQL discussion mock body</p>',
                    bodyText: 'GraphQL discussion mock body',
                    createdAt: '2026-06-24T00:00:00Z',
                    discussion: {
                      author: {
                        avatarUrl:
                          'https://avatars.githubusercontent.com/u/1?v=4',
                        login: 'octocat',
                        url: 'https://github.com/octocat',
                      },
                      repository: { nameWithOwner: 'octocat/hello-world' },
                      title,
                      url: 'https://github.com/octocat/hello-world/discussions/1',
                    },
                    publishedAt: '2026-06-24T00:00:00Z',
                    reactions: { totalCount: 0 },
                    url: 'https://github.com/octocat/hello-world/discussions/1#discussioncomment-1',
                  },
                },
              ],
            },
          },
        },
      ],
    },
  }
}

test.describe('GraphQL API Integration', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // All tests require authentication
  })

  test.describe('API Authentication', () => {
    test('should include Bearer token in GraphQL requests', async ({
      page,
      appPage,
    }) => {
      let authHeaderReceived = false

      await persistIssueTimeline(page)

      // Intercept the timeline query and check the auth header.
      await page.route('**/graphql', (route) => {
        const headers = route.request().headers()
        if (headers['authorization'] === `Bearer ${MOCK_ACCESS_TOKEN}`) {
          authHeaderReceived = true
        }

        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: issueCommentsResponse('Bearer header issue'),
          }),
        })
      })

      await appPage.goto()
      await expect(
        page.getByRole('link', { name: 'Bearer header issue' }),
      ).toBeVisible()

      expect(authHeaderReceived).toBe(true)
    })

    test('should handle unauthorized API responses', async ({
      page,
      appPage,
    }) => {
      await persistIssueTimeline(page)

      await page.route('**/graphql', (route) => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: 'Unauthorized' }],
          }),
        })
      })

      await appPage.goto()

      await expect(
        page.getByText('Error in fetch from Github API.'),
      ).toBeVisible()
      await expect(appPage.appContainer).toBeVisible()
    })
  })

  test.describe('Query Operations', () => {
    test('should fetch following suggestions for the subscribe autocomplete', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      let getViewerFollowingWasRequested = false

      await graphqlMocker.mockOperation('getViewerFollowing', () => {
        getViewerFollowingWasRequested = true
        return viewerFollowingResponse()
      })

      await appPage.goto()
      await page.getByRole('button', { name: 'Add subscription' }).click()

      const dialog = page.getByRole('dialog', {
        name: 'Enter GitHub Username',
      })
      await dialog.getByRole('combobox', { name: 'GitHub username' }).click()

      await expect(page.getByRole('listbox').getByRole('option')).toHaveCount(2)
      expect(getViewerFollowingWasRequested).toBe(true)
    })

    test('should fetch issue comments', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      await persistIssueTimeline(page)
      await graphqlMocker.mockOperation('getIssueComments', () =>
        issueCommentsResponse('Fetched issue comment'),
      )

      await appPage.goto()

      await expect(
        page.getByRole('link', { name: 'Fetched issue comment' }),
      ).toBeVisible()
    })

    test('should fetch discussion comments', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      await persistDiscussionTimeline(page)
      await graphqlMocker.mockOperation('getDiscussionComments', () =>
        discussionCommentsResponse('Fetched discussion comment'),
      )

      await appPage.goto()

      await expect(
        page.getByRole('link', { name: 'Fetched discussion comment' }),
      ).toBeVisible()
    })
  })

  test.describe('Subscription State Operations', () => {
    test('should add a PR/Issue subscription locally and fetch its timeline', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      const operationNames: string[] = []

      await graphqlMocker.mockOperation('getViewerFollowing', (operation) => {
        operationNames.push(operation.operationName ?? 'unknown')
        return viewerFollowingResponse()
      })
      await graphqlMocker.mockOperation('getIssueComments', (operation) => {
        operationNames.push(operation.operationName ?? 'unknown')
        expect(operation.variables).toMatchObject({ query: 'octocat' })
        return issueCommentsResponse('Local subscription issue')
      })

      await appPage.goto()
      await page.getByRole('button', { name: 'Add subscription' }).click()

      const dialog = page.getByRole('dialog', {
        name: 'Enter GitHub Username',
      })
      await dialog
        .getByRole('combobox', { name: 'GitHub username' })
        .fill('octocat')
      await page.getByRole('button', { name: 'Add' }).click()

      await expect(
        page.getByRole('link', { name: 'Local subscription issue' }),
      ).toBeVisible()
      expect(operationNames).toEqual(['getViewerFollowing', 'getIssueComments'])
    })

    test('should show a timeline error when a locally added subscription fetch fails', async ({
      page,
      appPage,
    }) => {
      await page.route('**/graphql', (route) => {
        const operation = JSON.parse(route.request().postData() ?? '{}') as {
          operationName?: string
        }

        if (operation.operationName === 'getViewerFollowing') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: viewerFollowingResponse() }),
          })
          return
        }

        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(
            mockGraphQLError('Subscription timeline failed'),
          ),
        })
      })

      await appPage.goto()
      await page.getByRole('button', { name: 'Add subscription' }).click()

      const dialog = page.getByRole('dialog', {
        name: 'Enter GitHub Username',
      })
      await dialog
        .getByRole('combobox', { name: 'GitHub username' })
        .fill('octocat')
      await page.getByRole('button', { name: 'Add' }).click()

      await expect(
        page.getByText('Error in fetch from Github API.'),
      ).toBeVisible()
    })
  })

  test.describe('Error Handling', () => {
    test('should handle network errors', async ({ page, appPage }) => {
      await persistIssueTimeline(page)

      // Simulate a network failure from the timeline query.
      await page.route('**/graphql', (route) => route.abort('failed'))

      await appPage.goto()

      await expect(
        page.getByText('Error in fetch from Github API.'),
      ).toBeVisible()
      await expect(appPage.appContainer).toBeVisible()
    })

    test('should handle GraphQL errors', async ({ page, appPage }) => {
      await persistIssueTimeline(page)

      await page.route('**/graphql', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(
            mockGraphQLError('Query failed', {
              code: 'INTERNAL_ERROR',
            }),
          ),
        })
      })

      await appPage.goto()

      await expect(
        page.getByText('Error in fetch from Github API.'),
      ).toBeVisible()
      await expect(appPage.appContainer).toBeVisible()
    })

    test('should handle rate limiting', async ({ page, appPage }) => {
      await persistIssueTimeline(page)

      await page.route('**/graphql', (route) => {
        route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [
              {
                message: 'Rate limit exceeded',
                extensions: {
                  code: 'RATE_LIMITED',
                },
              },
            ],
          }),
        })
      })

      await appPage.goto()

      await expect(
        page.getByText('Error in fetch from Github API.'),
      ).toBeVisible()
      await expect(appPage.appContainer).toBeVisible()
    })

    test('should handle timeout', async ({ page, appPage }) => {
      await persistIssueTimeline(page)

      await page.route('**/graphql', async (route) => {
        // Keep the app in the loading state briefly, then complete the slow query.
        await new Promise((resolve) => setTimeout(resolve, 1000))
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: issueCommentsResponse('Slow issue comment'),
          }),
        })
      })

      await appPage.goto()

      await expect(page.getByRole('progressbar')).toBeVisible()
      await expect(
        page.getByRole('link', { name: 'Slow issue comment' }),
      ).toBeVisible()
    })
  })

  test.describe('Caching Behavior', () => {
    test('should not refetch the same timeline during ordinary UI interactions', async ({
      page,
      appPage,
    }) => {
      let requestCount = 0

      await persistIssueTimeline(page)
      await page.route('**/graphql', (route) => {
        requestCount++
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: issueCommentsResponse('Cached issue comment'),
          }),
        })
      })

      await appPage.goto()
      await expect(
        page.getByRole('link', { name: 'Cached issue comment' }),
      ).toBeVisible()

      await page.getByRole('button', { name: 'Open account menu' }).click()
      await page.keyboard.press('Escape')

      expect(requestCount).toBe(1)
    })

    test('should refetch the persisted timeline after page reload', async ({
      page,
      appPage,
    }) => {
      let requestCount = 0

      await persistIssueTimeline(page)
      await page.route('**/graphql', (route) => {
        requestCount++
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: issueCommentsResponse(`Reloaded issue ${requestCount}`),
          }),
        })
      })

      await appPage.goto()
      await expect(
        page.getByRole('link', { name: 'Reloaded issue 1' }),
      ).toBeVisible()

      await page.reload({ waitUntil: 'domcontentloaded' })
      await appPage.waitForVisible()

      await expect(
        page.getByRole('link', { name: 'Reloaded issue 2' }),
      ).toBeVisible()
      expect(requestCount).toBe(2)
    })
  })

  test.describe('Pagination', () => {
    test('should render every comment in the current issue batch', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      await persistIssueTimeline(page)
      await graphqlMocker.mockOperation('getIssueComments', () =>
        issueCommentsResponseWithTitles([
          'First batch issue',
          'Second batch issue',
        ]),
      )

      await appPage.goto()

      await expect(
        page.getByRole('link', { name: 'First batch issue' }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: 'Second batch issue' }),
      ).toBeVisible()
    })

    test('should not fetch another page when scrolling a current comment timeline', async ({
      page,
      appPage,
    }) => {
      let requestCount = 0

      await persistIssueTimeline(page)
      await page.route('**/graphql', (route) => {
        requestCount++
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: issueCommentsResponse('Single batch issue'),
          }),
        })
      })

      await appPage.goto()
      await expect(
        page.getByRole('link', { name: 'Single batch issue' }),
      ).toBeVisible()

      // Current implementation loads the latest comment batch, not cursor pagination.
      await appPage.scrollTimelineToBottom()
      await page.waitForTimeout(500)

      expect(requestCount).toBe(1)
    })
  })

  test.describe('Reload Updates', () => {
    test('should show updated timeline data after reload', async ({
      page,
      appPage,
    }) => {
      let requestCount = 0

      await persistIssueTimeline(page)
      await page.route('**/graphql', (route) => {
        requestCount++
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: issueCommentsResponse(`Updated issue ${requestCount}`),
          }),
        })
      })

      await appPage.goto()
      await expect(
        page.getByRole('link', { name: 'Updated issue 1' }),
      ).toBeVisible()

      await page.reload({ waitUntil: 'domcontentloaded' })
      await appPage.waitForVisible()

      await expect(
        page.getByRole('link', { name: 'Updated issue 2' }),
      ).toBeVisible()
    })
  })

  test.describe('Performance', () => {
    test('should make no GraphQL requests when no subscriptions are present', async ({
      page,
      appPage,
    }) => {
      let requestCount = 0

      await page.route('**/graphql', (route) => {
        requestCount++
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: issueCommentsResponse('Unexpected issue'),
          }),
        })
      })

      await appPage.goto()
      await expect(appPage.timelineContainer).toBeAttached()
      await page.waitForTimeout(500)

      expect(requestCount).toBe(0)
    })

    test('should make one request for each persisted timeline on initial load', async ({
      page,
      appPage,
    }) => {
      let requestCount = 0

      await persistSubscriptions(page, [
        { information: 'PR_Issues', user: 'octocat' },
        { information: 'PR_Issues', user: 'gaearon' },
      ])
      await page.route('**/graphql', (route) => {
        const operation = JSON.parse(route.request().postData() ?? '{}') as {
          variables?: { query?: string }
        }
        const user = operation.variables?.query ?? 'unknown'

        requestCount++
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: issueCommentsResponse(`${user} request issue`),
          }),
        })
      })

      await appPage.goto()

      await expect(
        page.getByRole('link', { name: 'octocat request issue' }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: 'gaearon request issue' }),
      ).toBeVisible()
      expect(requestCount).toBe(2)
    })
  })
})
