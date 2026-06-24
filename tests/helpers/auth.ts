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
 * Opens the app OAuth callback URL so Authenticator exchanges the mocked code for a token.
 * @param page - Playwright page that should receive the authenticated app state.
 * @returns Resolves after the app renders with the mocked access token persisted.
 * @example
 * await completeMockOAuthCallback(page)
 */
export async function completeMockOAuthCallback(page: Page) {
  await setupAuthMocks(page)
  await page.goto(`/callback?code=${MOCK_AUTH_CODE}`, {
    waitUntil: 'domcontentloaded',
  })
  await page.getByTestId('app-container').waitFor({ state: 'visible' })
}

/**
 * Writes the Redux Persist auth shape directly so tests can start from an authenticated shell.
 * @param page - Playwright page on the app origin.
 * @param accessToken - Mock GitHub token to persist.
 * @returns Resolves after localStorage and sessionStorage are updated.
 * @example
 * await writePersistedAuthState(page, 'mock-token')
 */
async function writePersistedAuthState(page: Page, accessToken: string) {
  await page.evaluate((token) => {
    const reduxState = {
      authenticator: JSON.stringify({
        accessToken: token,
      }),
      subscribed: JSON.stringify({ subscribed: [] }),
      _persist: JSON.stringify({
        version: -1,
        rehydrated: true,
      }),
    }
    localStorage.setItem(
      'persist:Geek-Infiltration',
      JSON.stringify(reduxState),
    )
    sessionStorage.clear()
  }, accessToken)
}

/**
 * Sets persisted authentication before tests that need app access without exercising OAuth.
 * @param page - Playwright page whose localStorage should receive Redux Persist state.
 * @param accessToken - Mock GitHub token to persist.
 * @returns Resolves after the page reloads with persisted auth applied.
 * @example
 * await setAuthState(page, 'mock-token')
 */
export async function setAuthState(
  page: Page,
  accessToken = MOCK_ACCESS_TOKEN,
) {
  await page.goto('/og-image.png', { timeout: 10000, waitUntil: 'load' })
  await writePersistedAuthState(page, accessToken)

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // Load the app after storage is ready, then wait for the authenticated tree to hydrate.
      await page.goto('/', {
        timeout: 10000,
        waitUntil: 'domcontentloaded',
      })
      await page
        .getByTestId('app-container')
        .waitFor({ state: 'visible', timeout: 7000 })
      return
    } catch (error) {
      if (attempt === 2) throw error

      // Retry from a static page to avoid staying stuck in a lazy-loading fallback.
      await page.goto('/og-image.png', { timeout: 10000, waitUntil: 'load' })
      await writePersistedAuthState(page, accessToken)
    }
  }
}

/**
 * Clears persisted auth data before checking the unauthenticated landing state.
 * @param page - Playwright page whose browser storage should be cleared.
 * @returns Resolves after the landing page login button is visible.
 * @example
 * await clearAuthState(page)
 */
export async function clearAuthState(page: Page) {
  await page.goto('/og-image.png', { waitUntil: 'load' })
  await page.evaluate(() => {
    localStorage.removeItem('persist:Geek-Infiltration')
    sessionStorage.clear()
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page
    .getByRole('link', { name: /login with github/i })
    .first()
    .waitFor({ state: 'visible' })
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
  return Boolean(token)
}
