import { test, expect } from '../fixtures/auth'

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
    graphqlMocker.mockOperation('GetViewerFollowing', () => ({
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
  })

  test.describe('Modal Opening', () => {
    test('should open subscribe modal when clicking + button', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Click the "+" button to open subscribe modal
      const addButton = page.locator('button:has-text("+")')
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
      await page.locator('button:has-text("+")').click()
      await expect(page.getByText('Enter GitHub Username')).toBeVisible()

      // Click the autocomplete input
      const input = page.getByLabel('GitHub username')
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
      await page.locator('button:has-text("+")').click()

      const input = page.getByLabel('GitHub username')
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
      await page.locator('button:has-text("+")').click()

      // Click autocomplete and select a suggestion
      const input = page.getByLabel('GitHub username')
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
      await page.locator('button:has-text("+")').click()

      // Select a user from suggestions
      const input = page.getByLabel('GitHub username')
      await input.click()
      await page.getByText('The Octocat').click()

      // Select information type (PR_Issues is default, but click to confirm)
      await page.getByLabel('PullRequest & Issue Comments').check()

      // Submit the form
      await page.getByRole('button', { name: 'Add' }).click()

      // Modal should close after successful submission
      await expect(page.getByText('Enter GitHub Username')).not.toBeVisible()
    })
  })

  test.describe('Custom Username Entry', () => {
    test('should accept custom username in freeSolo mode', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Open modal
      await page.locator('button:has-text("+")').click()

      // Type a custom username not in the following list
      const input = page.getByLabel('GitHub username')
      await input.fill('customuser123')

      // Submit form with custom username
      await page.getByRole('button', { name: 'Add' }).click()

      // Modal should close
      await expect(page.getByText('Enter GitHub Username')).not.toBeVisible()
    })
  })
})
