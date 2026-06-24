import type { Page } from '@playwright/test'

import { test, expect } from '../fixtures/auth'

/**
 * Locates the active username combobox inside the subscription dialog to avoid MUI dialog-name label collisions.
 * @param page - Playwright page with the subscription dialog open.
 * @returns The visible GitHub username combobox.
 * @example
 * const input = getUsernameCombobox(page)
 */
function getUsernameCombobox(page: Page) {
  return page
    .getByRole('dialog', { name: 'Enter GitHub Username' })
    .getByRole('combobox', { name: 'GitHub username' })
}

test.describe('Subscription Flow with Following Suggestions', () => {
  test.beforeEach(async ({ authenticatedPage, graphqlMocker }) => {
    // Mock the Viewer query for authenticated state
    graphqlMocker.mockOperation('Viewer', () => ({
      viewer: {
        login: 'e2e-test-user',
        avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
        name: 'E2E Test User',
      },
    }))

    // Mock the GetViewerFollowing query to provide suggestions
    graphqlMocker.mockOperation('getViewerFollowing', () => ({
      viewer: {
        following: {
          totalCount: 3,
          nodes: [
            {
              login: 'octocat',
              name: 'The Octocat',
              avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
            },
            {
              login: 'torvalds',
              name: 'Linus Torvalds',
              avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4',
            },
            {
              login: 'gaearon',
              name: null,
              avatarUrl: 'https://avatars.githubusercontent.com/u/810438?v=4',
            },
          ],
        },
      },
    }))

    // Mock the PR/Issue timeline that is loaded after adding a PR_Issues subscription.
    graphqlMocker.mockOperation('getIssueComments', () => ({
      search: {
        edges: [
          {
            node: {
              issueComments: {
                edges: [
                  {
                    node: {
                      author: {
                        login: 'octocat',
                        avatarUrl:
                          'https://avatars.githubusercontent.com/u/583231?v=4',
                        url: 'https://github.com/octocat',
                        resourcePath: '/octocat',
                      },
                      repository: {
                        nameWithOwner: 'octocat/hello-world',
                      },
                      url: 'https://github.com/octocat/hello-world/issues/1#issuecomment-1',
                      issue: {
                        title: 'Observable issue comment from E2E mock',
                        author: {
                          login: 'octocat',
                        },
                        url: 'https://github.com/octocat/hello-world/issues/1',
                      },
                      body: 'Mock issue comment body',
                      bodyHTML: '<p>Mock issue comment body</p>',
                      bodyText: 'Mock issue comment body',
                      publishedAt: '2026-06-24T00:00:00Z',
                      createdAt: '2026-06-24T00:00:00Z',
                      reactions: {
                        totalCount: 0,
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }))

    // Mock the Discussion timeline that is loaded after adding a Discussion subscription.
    graphqlMocker.mockOperation('getDiscussionComments', () => ({
      search: {
        edges: [
          {
            node: {
              repositoryDiscussionComments: {
                edges: [
                  {
                    node: {
                      author: {
                        login: 'customuser123',
                        avatarUrl:
                          'https://avatars.githubusercontent.com/u/2?v=4',
                        url: 'https://github.com/customuser123',
                        resourcePath: '/customuser123',
                      },
                      url: 'https://github.com/custom/repo/discussions/1#discussioncomment-1',
                      body: 'Mock discussion comment body',
                      bodyHTML: '<p>Mock discussion comment body</p>',
                      bodyText: 'Mock discussion comment body',
                      publishedAt: '2026-06-24T00:00:00Z',
                      createdAt: '2026-06-24T00:00:00Z',
                      reactions: {
                        totalCount: 0,
                      },
                      discussion: {
                        title: 'Observable discussion comment from E2E mock',
                        url: 'https://github.com/custom/repo/discussions/1',
                        author: {
                          login: 'customuser123',
                          avatarUrl:
                            'https://avatars.githubusercontent.com/u/2?v=4',
                          url: 'https://github.com/customuser123',
                        },
                        repository: {
                          nameWithOwner: 'custom/repo',
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }))
  })

  test.describe('Modal Opening', () => {
    test('should open subscribe modal when clicking + button', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Click the "+" button to open subscribe modal
      const addButton = page.getByRole('button', { name: 'Add subscription' })
      await addButton.click()

      // Modal should be visible with title
      await expect(page.getByText('Enter GitHub Username')).toBeVisible()
    })
  })

  test.describe('Following Suggestions', () => {
    test('should display following suggestions in autocomplete', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Open modal
      await page.getByRole('button', { name: 'Add subscription' }).click()
      await expect(page.getByText('Enter GitHub Username')).toBeVisible()

      // Click the autocomplete input
      const input = getUsernameCombobox(page)
      await input.click()

      // Suggestions should appear
      const listbox = page.getByRole('listbox')
      await expect(listbox).toBeVisible()

      // Should show all 3 following users
      const options = listbox.getByRole('option')
      await expect(options).toHaveCount(3)
    })

    test('should filter suggestions as user types', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Open modal
      await page.getByRole('button', { name: 'Add subscription' }).click()

      const input = getUsernameCombobox(page)
      await input.fill('octo')

      // Should filter to only octocat
      const listbox = page.getByRole('listbox')
      await expect(listbox).toBeVisible()
      await expect(listbox.getByRole('option')).toHaveCount(1)
      await expect(page.getByText('@octocat')).toBeVisible()
    })
  })

  test.describe('Selecting a Suggestion', () => {
    test('should populate input when selecting a suggestion', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Open modal
      await page.getByRole('button', { name: 'Add subscription' }).click()

      // Click autocomplete and select a suggestion
      const input = getUsernameCombobox(page)
      await input.click()

      // Click on "The Octocat" option
      await page.getByText('The Octocat').click()

      // Input should now contain the login
      await expect(input).toHaveValue('octocat')
    })

    test('should submit form with selected suggestion', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Open modal
      await page.getByRole('button', { name: 'Add subscription' }).click()

      // Select a user from suggestions
      const input = getUsernameCombobox(page)
      await input.click()
      await page.getByText('The Octocat').click()

      // Select information type (PR_Issues is default, but click to confirm)
      await page.getByLabel('PullRequest & Issue Comments').check()

      // Submit the form
      await page.getByRole('button', { name: 'Add' }).click()

      // Modal should close after successful submission
      await expect(page.getByText('Enter GitHub Username')).not.toBeVisible()

      // Added subscription should render a PR/Issue timeline with mocked comments.
      await expect(page.getByRole('heading', { name: 'octocat' })).toBeVisible()
      await expect(
        page.getByRole('heading', { name: 'PR_Issues' }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', {
          name: 'Observable issue comment from E2E mock',
        }),
      ).toBeVisible()
    })
  })

  test.describe('Custom Username Entry', () => {
    test('should accept custom username in freeSolo mode', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Open modal
      await page.getByRole('button', { name: 'Add subscription' }).click()

      // Type a custom username not in the following list
      const input = getUsernameCombobox(page)
      await input.fill('customuser123')

      // Select Discussion to cover the non-default timeline branch.
      await page.getByLabel('Discussion Comments').check()

      // Submit form with custom username
      await page.getByRole('button', { name: 'Add' }).click()

      // Modal should close
      await expect(page.getByText('Enter GitHub Username')).not.toBeVisible()

      // Added subscription should render a Discussion timeline with mocked comments.
      await expect(
        page.getByRole('heading', { name: 'customuser123' }),
      ).toBeVisible()
      await expect(
        page.getByRole('heading', { name: 'Discussion' }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', {
          name: 'Observable discussion comment from E2E mock',
        }),
      ).toBeVisible()
    })
  })
})
