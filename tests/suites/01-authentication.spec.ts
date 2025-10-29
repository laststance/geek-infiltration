import { test, expect } from '../fixtures/auth'
import {
  setupAuthMocks,
  clearAuthState,
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
      expect(await landingPage.isGitHubLoginButtonVisible()).toBe(true)
      await expect(landingPage.githubLoginButton).toBeVisible()
      await expect(landingPage.githubLoginButton).toHaveText(
        /Login with GitHub/i,
      )
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
      // Setup OAuth mocks
      await setupAuthMocks(page)

      // Navigate to landing page
      await landingPage.goto()

      // Verify we're on Landing Page
      expect(await landingPage.isVisible()).toBe(true)

      // Click GitHub login button
      await landingPage.clickGitHubLogin()

      // Wait for OAuth redirect and app to load
      await page.waitForLoadState('networkidle')

      // Verify we're now authenticated and App is visible
      const authenticated = await isAuthenticated(page)
      expect(authenticated).toBe(true)

      // Verify App container is visible (not Landing Page)
      await expect(page.locator('main[role="main"]')).toBeVisible()

      // Verify Landing Page is no longer visible
      expect(await landingPage.isVisible()).toBe(false)
    })

    test('should store access token in Redux persist', async ({
      page,
      landingPage,
    }) => {
      await setupAuthMocks(page)
      await landingPage.goto()
      await landingPage.clickGitHubLogin()
      await page.waitForLoadState('networkidle')

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

      await landingPage.goto()

      // Attempt OAuth (this will fail)
      await landingPage.githubLoginButton.click()
      await page.waitForLoadState('networkidle')

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
      await page.reload()
      await page.waitForLoadState('networkidle')

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

      // Navigate away and back
      await page.goto('/')
      await page.goBack()
      await page.waitForLoadState('networkidle')

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

      // Clear auth state (simulating logout)
      await clearAuthState(page)

      // Navigate to root
      await page.goto('/')
      await page.waitForLoadState('networkidle')

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
      await clearAuthState(page)

      // Verify all auth data is cleared
      const token = await getAuthToken(page)
      expect(token).toBeNull()

      const reduxState = await getReduxPersistedState(page)
      expect(reduxState).toBeNull()
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
      await page.waitForLoadState('networkidle')

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
      await page.waitForLoadState('networkidle')

      // Should remain unauthenticated
      expect(await isAuthenticated(page)).toBe(false)
    })

    test('should handle concurrent auth attempts', async ({
      page,
      landingPage,
    }) => {
      await setupAuthMocks(page)
      await landingPage.goto()

      // Click login button multiple times rapidly
      await Promise.all([
        landingPage.githubLoginButton.click(),
        landingPage.githubLoginButton.click().catch(() => {}), // May fail, that's ok
      ])

      await page.waitForLoadState('networkidle')

      // Should be authenticated once
      expect(await isAuthenticated(page)).toBe(true)

      const token = await getAuthToken(page)
      expect(token).toBe(MOCK_ACCESS_TOKEN)
    })
  })
})
