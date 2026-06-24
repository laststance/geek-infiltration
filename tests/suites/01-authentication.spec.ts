import { test, expect } from '../fixtures/auth'
import {
  completeMockOAuthCallback,
  getAuthToken,
  isAuthenticated,
  MOCK_ACCESS_TOKEN,
} from '../helpers/auth'
import { getReduxPersistedState } from '../helpers/storage'

test.describe('Authentication Flow', () => {
  test.describe('Unauthenticated State', () => {
    test('should display Landing Page when not authenticated', async ({
      page,
      unauthenticatedPage,
      landingPage,
    }) => {
      await landingPage.goto()

      // Verify Landing Page is visible
      expect(await landingPage.isVisible()).toBe(true)

      // Verify key elements are present
      await expect(landingPage.mainHeader).toBeVisible()
      await expect(landingPage.homeSection).toBeVisible()
      await expect(landingPage.mainFooter).toBeVisible()
    })

    test('should display GitHub login button', async ({
      page,
      unauthenticatedPage,
      landingPage,
    }) => {
      await landingPage.goto()

      // Verify GitHub login button is visible
      await expect(landingPage.githubLoginButton).toBeVisible()
      await expect(landingPage.githubLoginButton).toHaveText(
        /Login with GitHub/i,
      )
    })

    test('should explain GitHub activity visualization before login', async ({
      page,
      unauthenticatedPage,
      landingPage,
    }) => {
      // Arrange
      await landingPage.goto()

      // Act
      const main = landingPage.homeSection

      // Assert
      await expect(
        main.getByRole('heading', {
          name: /GitHub Activity Visualization/i,
        }),
      ).toBeVisible()
      await expect(
        main.getByText(/Track pull requests, issues, and discussions/i),
      ).toBeVisible()
      await expect(
        main.getByRole('heading', {
          exact: true,
          name: 'Timeline aggregation',
        }),
      ).toBeVisible()
      await expect(
        main.getByRole('heading', { exact: true, name: 'GitHub login' }),
      ).toBeVisible()
      await expect(
        main.getByRole('heading', { exact: true, name: 'Subscriptions' }),
      ).toBeVisible()
    })

    test('should not show generic landing template marketing copy', async ({
      page,
      unauthenticatedPage,
      landingPage,
    }) => {
      // Arrange
      await landingPage.goto()

      // Act
      const main = landingPage.homeSection

      // Assert
      await expect(main.getByText(/Huge pack\s+of elements/i)).toHaveCount(0)
      await expect(main.getByText(/Landing Page Template\?/i)).toHaveCount(0)
      await expect(main.getByText(/Purchase Now/i)).toHaveCount(0)
      await expect(main.getByText(/Choose Plan/i)).toHaveCount(0)
    })

    test('should keep landing product message visible on responsive viewports', async ({
      page,
      unauthenticatedPage,
      landingPage,
    }) => {
      // Arrange
      const viewports = [
        { height: 667, name: 'mobile', width: 375 },
        { height: 900, name: 'tablet', width: 768 },
        { height: 900, name: 'desktop', width: 1280 },
      ]

      for (const viewport of viewports) {
        await page.setViewportSize({
          height: viewport.height,
          width: viewport.width,
        })

        // Act
        await landingPage.goto()

        // Assert
        await expect(
          page.getByRole('heading', {
            name: /GitHub Activity Visualization/i,
          }),
          `${viewport.name} should show the product hero`,
        ).toBeVisible()
        await expect(
          landingPage.githubLoginButton,
          `${viewport.name} should keep the GitHub login CTA reachable`,
        ).toBeVisible()
      }
    })

    test('should have correct GitHub OAuth URL', async ({
      page,
      unauthenticatedPage,
      landingPage,
    }) => {
      await landingPage.goto()

      // Check that the button has the correct href
      const href = await landingPage.githubLoginButton.getAttribute('href')
      expect(href).toContain('github.com/login/oauth/authorize')
      expect(href).toContain('client_id')
      expect(href).toContain('redirect_uri')
    })

    test('should not have auth token in localStorage', async ({
      page,
      unauthenticatedPage,
    }) => {
      await page.goto('/')

      const token = await getAuthToken(page)
      expect(token).toBeNull()

      const authenticated = await isAuthenticated(page)
      expect(authenticated).toBe(false)
    })
  })

  test.describe('GitHub OAuth Flow', () => {
    test('should complete OAuth flow and redirect to App', async ({
      page,
      landingPage,
    }) => {
      await completeMockOAuthCallback(page)

      // Verify we're now authenticated and App is visible
      const authenticated = await isAuthenticated(page)
      expect(authenticated).toBe(true)

      // Verify App container is visible (not Landing Page)
      await expect(page.getByTestId('app-container')).toBeVisible()

      // Verify Landing Page is no longer visible
      await expect(landingPage.githubLoginButton).not.toBeVisible()
    })

    test('should store access token in Redux persist', async ({ page }) => {
      await completeMockOAuthCallback(page)

      // Verify token is stored
      const token = await getAuthToken(page)
      expect(token).toBe(MOCK_ACCESS_TOKEN)

      // Verify Redux state structure
      const reduxState = await getReduxPersistedState(page)
      expect(reduxState).toBeTruthy()
      expect(reduxState).toHaveProperty('authenticator')
      expect(reduxState).toHaveProperty('_persist')
    })

    test('should handle OAuth errors gracefully', async ({
      page,
      landingPage,
    }) => {
      // Setup mock for failed OAuth
      await page.route('**/login/oauth/access_token', (route) => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'bad_verification_code',
            error_description: 'The code passed is incorrect or expired.',
          }),
        })
      })

      await page.goto('/?code=expired_code', { waitUntil: 'domcontentloaded' })

      // Should still be on Landing Page (not authenticated)
      expect(await landingPage.isVisible()).toBe(true)
      expect(await isAuthenticated(page)).toBe(false)
    })
  })

  test.describe('Authenticated State', () => {
    test('should display App when authenticated', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      await appPage.goto()

      // Verify App is visible
      expect(await appPage.isVisible()).toBe(true)

      // Verify authenticated
      expect(await isAuthenticated(page)).toBe(true)

      // Verify key app components
      await expect(appPage.appContainer).toBeVisible()
      await expect(appPage.sidebar.sidebarContainer).toBeVisible()
    })

    test('should preserve authentication after page reload', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      await appPage.goto()

      // Verify authenticated
      expect(await isAuthenticated(page)).toBe(true)

      // Reload page
      await page.reload({ waitUntil: 'domcontentloaded' })

      // Should still be authenticated
      expect(await isAuthenticated(page)).toBe(true)
      expect(await appPage.isVisible()).toBe(true)
    })

    test('should maintain auth state across navigation', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      await appPage.goto()

      // Navigate within the same origin and reload to verify persisted auth state survives navigation.
      await page.goto('/#timeline', { waitUntil: 'domcontentloaded' })
      await page.goto('/', { waitUntil: 'domcontentloaded' })

      // Should still be authenticated
      expect(await isAuthenticated(page)).toBe(true)
      expect(await appPage.isVisible()).toBe(true)
    })
  })

  test.describe('Logout', () => {
    test('should logout and return to Landing Page', async ({
      page,
      authenticatedPage,
      appPage,
      landingPage,
    }) => {
      await appPage.goto()
      expect(await isAuthenticated(page)).toBe(true)

      // Logout through the visible account menu.
      await appPage.sidebar.clickLogout()

      // Should be back on Landing Page
      expect(await landingPage.isVisible()).toBe(true)
      expect(await isAuthenticated(page)).toBe(false)
    })

    test('should clear all auth data on logout', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      await appPage.goto()

      // Verify authenticated
      expect(await isAuthenticated(page)).toBe(true)

      // Logout
      await appPage.sidebar.clickLogout()
      await page.waitForFunction(() => {
        const persistedState = localStorage.getItem('persist:Geek-Infiltration')
        if (!persistedState) return true

        const state = JSON.parse(persistedState)
        const authenticator = JSON.parse(state.authenticator || '{}')
        return authenticator.accessToken === null
      })

      // Verify all auth data is cleared
      const token = await getAuthToken(page)
      expect(token).toBeNull()

      const reduxState = await getReduxPersistedState(page)
      if (reduxState === null) {
        expect(reduxState).toBeNull()
      } else {
        expect(reduxState).toHaveProperty('authenticator')
        const authenticator = JSON.parse(
          (reduxState as Record<string, string>).authenticator || '{}',
        )
        expect(authenticator.accessToken ?? null).toBeNull()
      }
    })
  })

  test.describe('Security', () => {
    test('should not expose sensitive data in URL', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      await appPage.goto()

      // Check URL doesn't contain access token
      const url = page.url()
      expect(url).not.toContain('access_token')
      expect(url).not.toContain(MOCK_ACCESS_TOKEN)
    })

    test('should not expose auth token in session storage', async ({
      page,
      authenticatedPage,
    }) => {
      await page.goto('/')

      // Verify token is not in session storage
      const sessionToken = await page.evaluate(() => {
        return window.sessionStorage.getItem('access_token')
      })
      expect(sessionToken).toBeNull()
    })

    test('should use localStorage with Redux persist only', async ({
      page,
      authenticatedPage,
    }) => {
      await page.goto('/')

      // Check localStorage keys
      const keys = await page.evaluate(() => {
        return Object.keys(localStorage)
      })

      // Should only have Redux persist key
      expect(keys).toContain('persist:Geek-Infiltration')
      expect(keys.length).toBeLessThanOrEqual(2) // persist key + potentially one other
    })
  })

  test.describe('Edge Cases', () => {
    test('should handle corrupted localStorage gracefully', async ({
      page,
    }) => {
      await page.goto('/')

      // Set corrupted data
      await page.evaluate(() => {
        localStorage.setItem(
          'persist:Geek-Infiltration',
          'corrupted-data-{invalid-json',
        )
      })

      await page.reload()
      await page.waitForLoadState('domcontentloaded')

      // Should fallback to unauthenticated state
      expect(await isAuthenticated(page)).toBe(false)
    })

    test('should handle missing OAuth parameters', async ({
      page,
      landingPage,
    }) => {
      await landingPage.goto()

      // Navigate with missing code parameter
      await page.goto('/?error=access_denied')
      await page.waitForLoadState('domcontentloaded')

      // Should remain unauthenticated
      expect(await isAuthenticated(page)).toBe(false)
    })

    test('should handle concurrent auth attempts', async ({ page }) => {
      const secondPage = await page.context().newPage()
      try {
        await Promise.all([
          completeMockOAuthCallback(page),
          completeMockOAuthCallback(secondPage),
        ])
      } finally {
        await secondPage.close()
      }

      // Should be authenticated once
      expect(await isAuthenticated(page)).toBe(true)

      const token = await getAuthToken(page)
      expect(token).toBe(MOCK_ACCESS_TOKEN)
    })
  })
})
