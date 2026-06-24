import { test, expect } from '../fixtures/auth'
import type { GraphQLMocker } from '../helpers/graphql-mock'
import { setReduxSlice } from '../helpers/storage'

/**
 * Persists subscribed timelines before the app boots so Redux Persist hydrates the desired test state.
 * @param page - Playwright page whose localStorage should receive the subscribed slice.
 * @param subscribed - Timeline subscriptions to render.
 * @returns Resolves after the subscribed slice is persisted.
 * @example
 * await persistSubscribedTimelines(page, [{ id: 'pr', aim: { user: 'octocat' }, information: 'PR_Issues' }])
 */
async function persistSubscribedTimelines(
  page: Parameters<typeof setReduxSlice>[0],
  subscribed: Array<{
    aim: { user: string }
    id: string
    information: 'PR_Issues' | 'Discussion'
  }>,
) {
  await setReduxSlice(page, 'subscribed', { subscribed })
}

/**
 * Mocks the PR/Issue comments query used by PR_Issues timelines.
 * @param graphqlMocker - Test GraphQL mocker fixture.
 * @param title - Issue title that should become visible in the timeline.
 * @returns The configured mocker for fluent test setup.
 * @example
 * mockIssueComments(graphqlMocker, 'Visible issue')
 */
function mockIssueComments(graphqlMocker: GraphQLMocker, title: string) {
  return graphqlMocker.mockOperation('getIssueComments', () => ({
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
                    body: 'Issue comment body',
                    bodyHTML: '<p>Issue comment body</p>',
                    bodyText: 'Issue comment body',
                    createdAt: '2026-06-24T00:00:00Z',
                    issue: {
                      author: {
                        login: 'octocat',
                      },
                      title,
                      url: 'https://github.com/octocat/hello-world/issues/1',
                    },
                    publishedAt: '2026-06-24T00:00:00Z',
                    reactions: {
                      totalCount: 0,
                    },
                    repository: {
                      nameWithOwner: 'octocat/hello-world',
                    },
                    url: 'https://github.com/octocat/hello-world/issues/1#issuecomment-1',
                  },
                },
              ],
            },
          },
        },
      ],
    },
  }))
}

/**
 * Mocks the Discussion comments query used by Discussion timelines.
 * @param graphqlMocker - Test GraphQL mocker fixture.
 * @param title - Discussion title that should become visible in the timeline.
 * @returns The configured mocker for fluent test setup.
 * @example
 * mockDiscussionComments(graphqlMocker, 'Visible discussion')
 */
function mockDiscussionComments(graphqlMocker: GraphQLMocker, title: string) {
  return graphqlMocker.mockOperation('getDiscussionComments', () => ({
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
                        'https://avatars.githubusercontent.com/u/2?v=4',
                      login: 'gaearon',
                      resourcePath: '/gaearon',
                      url: 'https://github.com/gaearon',
                    },
                    body: 'Discussion comment body',
                    bodyHTML: '<p>Discussion comment body</p>',
                    bodyText: 'Discussion comment body',
                    createdAt: '2026-06-24T00:00:00Z',
                    discussion: {
                      author: {
                        avatarUrl:
                          'https://avatars.githubusercontent.com/u/2?v=4',
                        login: 'gaearon',
                        url: 'https://github.com/gaearon',
                      },
                      repository: {
                        nameWithOwner: 'reactjs/rfcs',
                      },
                      title,
                      url: 'https://github.com/reactjs/rfcs/discussions/1',
                    },
                    publishedAt: '2026-06-24T00:00:00Z',
                    reactions: {
                      totalCount: 0,
                    },
                    url: 'https://github.com/reactjs/rfcs/discussions/1#discussioncomment-1',
                  },
                },
              ],
            },
          },
        },
      ],
    },
  }))
}

test.describe('Timeline Container', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // All tests require authentication.
  })

  test('shows an empty timeline container when no subscriptions exist', async ({
    appPage,
  }) => {
    await appPage.goto()

    await expect(appPage.timelineContainer).toBeAttached()
    await expect(appPage.timelineItems).toHaveCount(0)
  })

  test('renders PR/Issue comments for a persisted user subscription', async ({
    page,
    appPage,
    graphqlMocker,
  }) => {
    await persistSubscribedTimelines(page, [
      {
        aim: { user: 'octocat' },
        id: 'timeline-pr',
        information: 'PR_Issues',
      },
    ])
    mockIssueComments(graphqlMocker, 'PR timeline issue from E2E mock')

    await appPage.goto()

    await expect(page.getByRole('heading', { name: 'octocat' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'PR_Issues' })).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'PR timeline issue from E2E mock' }),
    ).toBeVisible()
  })

  test('renders Discussion comments for a persisted user subscription', async ({
    page,
    appPage,
    graphqlMocker,
  }) => {
    await persistSubscribedTimelines(page, [
      {
        aim: { user: 'gaearon' },
        id: 'timeline-discussion',
        information: 'Discussion',
      },
    ])
    mockDiscussionComments(graphqlMocker, 'Discussion timeline from E2E mock')

    await appPage.goto()

    await expect(page.getByRole('heading', { name: 'gaearon' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Discussion' }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Discussion timeline from E2E mock' }),
    ).toBeVisible()
  })

  test('lays out timelines to the right of the compact sidebar', async ({
    page,
    appPage,
  }) => {
    await persistSubscribedTimelines(page, [
      {
        aim: { user: 'octocat' },
        id: 'timeline-layout',
        information: 'PR_Issues',
      },
    ])

    await appPage.goto()

    const sidebarBox = await appPage.sidebar.sidebarContainer.boundingBox()
    const timelineBox = await appPage.timelineContainer.boundingBox()

    expect(sidebarBox).toBeTruthy()
    expect(timelineBox).toBeTruthy()
    expect(timelineBox!.x).toBeGreaterThanOrEqual(
      sidebarBox!.x + sidebarBox!.width,
    )
    expect(timelineBox!.height).toBeGreaterThan(
      (page.viewportSize()?.height || 720) * 0.8,
    )
  })

  test('renders multiple persisted timelines side by side', async ({
    page,
    appPage,
    graphqlMocker,
  }) => {
    await persistSubscribedTimelines(page, [
      {
        aim: { user: 'octocat' },
        id: 'timeline-pr',
        information: 'PR_Issues',
      },
      {
        aim: { user: 'gaearon' },
        id: 'timeline-discussion',
        information: 'Discussion',
      },
    ])
    mockIssueComments(graphqlMocker, 'Multi-column PR issue')
    mockDiscussionComments(graphqlMocker, 'Multi-column discussion')

    await appPage.goto()

    await expect(page.getByRole('heading', { name: 'octocat' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'gaearon' })).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Multi-column PR issue' }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Multi-column discussion' }),
    ).toBeVisible()
  })

  test('removes a timeline from the settings menu', async ({
    page,
    appPage,
    graphqlMocker,
  }) => {
    await persistSubscribedTimelines(page, [
      {
        aim: { user: 'octocat' },
        id: 'timeline-removable',
        information: 'PR_Issues',
      },
    ])
    mockIssueComments(graphqlMocker, 'Removable PR issue')

    await appPage.goto()
    await expect(page.getByRole('heading', { name: 'octocat' })).toBeVisible()

    await page
      .getByRole('button', { name: 'Open octocat timeline settings' })
      .click()
    await page.getByRole('menuitem', { name: 'delete' }).click()

    await expect(
      page.getByRole('heading', { name: 'octocat' }),
    ).not.toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Removable PR issue' }),
    ).not.toBeVisible()
  })

  test('keeps the timeline container visible when GitHub returns an error', async ({
    page,
    appPage,
  }) => {
    await persistSubscribedTimelines(page, [
      {
        aim: { user: 'octocat' },
        id: 'timeline-error',
        information: 'PR_Issues',
      },
    ])
    await page.route('https://api.github.com/graphql', (route) => {
      route.fulfill({
        contentType: 'application/json',
        status: 500,
        body: JSON.stringify({
          errors: [{ message: 'Internal server error' }],
        }),
      })
    })

    await appPage.goto()

    await expect(appPage.timelineContainer).toBeVisible()
    await expect(
      page.getByText('Error in fetch from Github API.'),
    ).toBeVisible()
  })

  test('keeps the timeline container usable on mobile viewport', async ({
    page,
    appPage,
    graphqlMocker,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await persistSubscribedTimelines(page, [
      {
        aim: { user: 'octocat' },
        id: 'timeline-mobile',
        information: 'PR_Issues',
      },
    ])
    mockIssueComments(graphqlMocker, 'Mobile PR issue')

    await appPage.goto()

    await expect(appPage.timelineContainer).toBeVisible()
    await expect(appPage.sidebar.sidebarContainer).toBeVisible()
  })
})
