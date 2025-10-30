import { Page } from '@playwright/test'

/**
 * Mock GitHub OAuth access token
 */
export const MOCK_ACCESS_TOKEN = 'mock_github_token_for_e2e_tests'

/**
 * Mock GitHub OAuth authorization code
 */
export const MOCK_AUTH_CODE = 'mock_auth_code_12345'

/**
 * Setup authentication mocks for GitHub OAuth flow
 * This intercepts the OAuth callback and token exchange
 */
export async function setupAuthMocks(page: Page) {
  // Mock the GitHub OAuth callback redirect
  await page.route('**/github.com/login/oauth/authorize**', (route) => {
    // Simulate GitHub redirecting back with auth code
    const url = new URL(route.request().url())
    const redirectUri = url.searchParams.get('redirect_uri')
    if (redirectUri) {
      route.fulfill({
        status: 302,
        headers: {
          Location: `${redirectUri}?code=${MOCK_AUTH_CODE}`,
        },
      })
    } else {
      route.abort()
    }
  })

  // Mock the token exchange endpoint (proxied through Vite)
  await page.route('**/login/oauth/access_token', (route) => {
    const request = route.request()
    const postData = request.postData()

    // Verify the auth code is present
    if (postData?.includes(MOCK_AUTH_CODE)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: MOCK_ACCESS_TOKEN,
          token_type: 'bearer',
          scope: 'repo,user',
        }),
      })
    } else {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'bad_verification_code',
          error_description: 'The code passed is incorrect or expired.',
        }),
      })
    }
  })
}

/**
 * Login with mocked OAuth flow
 * This navigates to the app, triggers OAuth, and completes authentication
 */
export async function loginWithMockOAuth(page: Page) {
  await setupAuthMocks(page)

  // Navigate to app
  await page.goto('/')

  // Click the GitHub OAuth button (assuming it exists on LandingPage)
  // Note: Adjust selector based on actual implementation
  await page.click('[data-testid="github-login-button"]')

  // Wait for redirect and token storage
  await page.waitForLoadState('networkidle')

  // Verify we're authenticated (App should be visible, not LandingPage)
  await page.waitForSelector('[data-testid="app-container"]', {
    timeout: 5000,
  })
}

/**
 * Set authentication state directly in localStorage
 * This bypasses the OAuth flow for tests that don't need to verify it
 */
export async function setAuthState(
  page: Page,
  accessToken = MOCK_ACCESS_TOKEN,
) {
  await page.goto('/')

  // Set Redux persist state with auth token
  await page.evaluate((token) => {
    const reduxState = {
      authenticator: {
        accessToken: token,
      },
      subscribed: {},
      _persist: {
        version: -1,
        rehydrated: true,
      },
    }
    localStorage.setItem(
      'persist:Geek-Infiltration',
      JSON.stringify(reduxState),
    )
  }, accessToken)

  // Reload to apply state
  await page.reload()
  await page.waitForLoadState('networkidle')
}

/**
 * Clear authentication state
 */
export async function clearAuthState(page: Page) {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.removeItem('persist:Geek-Infiltration')
    sessionStorage.clear()
  })
  await page.reload()
  await page.waitForLoadState('networkidle')
}

/**
 * Get current auth token from Redux state
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const persistedState = localStorage.getItem('persist:Geek-Infiltration')
    if (!persistedState) return null

    try {
      const state = JSON.parse(persistedState)
      const authenticator = JSON.parse(state.authenticator || '{}')
      return authenticator.accessToken || null
    } catch {
      return null
    }
  })
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const token = await getAuthToken(page)
  return !!token
}
