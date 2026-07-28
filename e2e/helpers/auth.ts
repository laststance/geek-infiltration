import { Page } from '@playwright/test'

import {
  E2E_APP_VISIBLE_TIMEOUT_MS,
  E2E_AUTH_SETUP_ATTEMPTS,
  E2E_NAVIGATION_TIMEOUT_MS,
} from '../constants'

const AUTH_SESSION_API_URL = '**/api/auth/session'
const AUTH_LOGOUT_API_URL = '**/api/auth/logout'
const GITHUB_GRAPHQL_API_URL = '**/api/github/graphql'
type AuthenticationMockState = {
  authenticated: boolean
}

/**
 * Detects the Release Feed operation even when the GraphQL client omits `operationName`.
 * @param operation - Parsed GraphQL POST body from Playwright routing.
 * @returns True when the request is the initial starred repository release query.
 * @example
 * isReleaseFeedQuery({ query: 'query getViewerStarredRepositoryReleases { viewer { login } }' })
 */
function isReleaseFeedQuery(operation: {
  operationName?: string
  query?: string
}) {
  return (
    operation.operationName === 'getViewerStarredRepositoryReleases' ||
    operation.query?.includes('query getViewerStarredRepositoryReleases') ===
      true
  )
}

/**
 * Prevents authenticated E2E routing tests from reaching the real BFF or GitHub API when `/releases` mounts.
 * @param page - Playwright page whose GraphQL requests should receive a safe empty Release Feed.
 * @returns Resolves after the default Release Feed route mock is registered.
 * @example
 * await setupDefaultReleaseFeedMock(page)
 */
export async function setupDefaultReleaseFeedMock(page: Page) {
  await page.route(GITHUB_GRAPHQL_API_URL, async (route) => {
    const postData = route.request().postData()

    if (!postData) {
      await route.fallback()
      return
    }

    let operation: { operationName?: string; query?: string }

    try {
      operation = JSON.parse(postData) as {
        operationName?: string
        query?: string
      }
    } catch {
      await route.fallback()
      return
    }

    if (!isReleaseFeedQuery(operation)) {
      await route.fallback()
      return
    }

    await route.fulfill({
      body: JSON.stringify({
        data: {
          viewer: {
            starredRepositories: {
              nodes: [],
              pageInfo: {
                endCursor: null,
                hasNextPage: false,
              },
              totalCount: 0,
            },
          },
        },
      }),
      contentType: 'application/json',
      status: 200,
    })
  })
}

/**
 * Mocks the browser-visible session contract while keeping GitHub credentials absent from E2E state.
 * @param page - Playwright page whose same-origin auth APIs should be intercepted.
 * @param initiallyAuthenticated - Initial BFF session status exposed to route loaders.
 * @returns Mutable server-session stand-in shared by login, status, and logout handlers.
 * @example
 * await setupAuthenticationApiMock(page, true)
 */
export async function setupAuthenticationApiMock(
  page: Page,
  initiallyAuthenticated: boolean,
) {
  const authenticationState: AuthenticationMockState = {
    authenticated: initiallyAuthenticated,
  }

  await page.route(AUTH_SESSION_API_URL, async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        authenticated: authenticationState.authenticated,
      }),
      contentType: 'application/json',
      headers: { 'Cache-Control': 'no-store' },
      status: 200,
    })
  })

  await page.route(AUTH_LOGOUT_API_URL, async (route) => {
    authenticationState.authenticated = false
    await route.fulfill({ status: 204 })
  })

  return authenticationState
}

/**
 * Exercises the browser login navigation against mocked BFF boundaries without creating a client token.
 * @param page - Playwright page that should enter the authenticated app.
 * @returns Resolves after the account shell becomes visible.
 * @example
 * await completeMockOAuthCallback(page)
 */
export async function completeMockOAuthCallback(page: Page) {
  const authenticationState = await setupAuthenticationApiMock(page, false)
  await setupDefaultReleaseFeedMock(page)
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  authenticationState.authenticated = true
  await page.goto('/app', { waitUntil: 'domcontentloaded' })
  await page.getByTestId('app-container').waitFor({ state: 'visible' })
}

/**
 * Starts a test from an authenticated BFF session without writing credentials into browser storage.
 * @param page - Playwright page whose auth APIs should report a valid session.
 * @returns Resolves after the app shell renders.
 * @example
 * await setAuthState(page)
 */
export async function setAuthState(page: Page) {
  await setupAuthenticationApiMock(page, true)
  await setupDefaultReleaseFeedMock(page)

  // Retrying isolates transient parallel-browser navigation delays from authentication behavior.
  for (let attempt = 0; attempt < E2E_AUTH_SETUP_ATTEMPTS; attempt++) {
    try {
      await page.goto('/', {
        timeout: E2E_NAVIGATION_TIMEOUT_MS,
        waitUntil: 'domcontentloaded',
      })
      await page.getByTestId('app-container').waitFor({
        state: 'visible',
        timeout: E2E_APP_VISIBLE_TIMEOUT_MS,
      })
      return
    } catch (error) {
      // The final attempt surfaces a real fixture failure to Playwright.
      if (attempt === E2E_AUTH_SETUP_ATTEMPTS - 1) throw error

      // Restart from a static resource when parallel browser work delays route hydration.
      await page.goto('/og-image.png', {
        timeout: E2E_NAVIGATION_TIMEOUT_MS,
        waitUntil: 'load',
      })
    }
  }
}

/**
 * Starts a test from a signed-out BFF session and removes any legacy browser-persisted auth artifacts.
 * @param page - Playwright page whose auth APIs should report no session.
 * @returns Resolves after the landing login entry point becomes visible.
 * @example
 * await clearAuthState(page)
 */
export async function clearAuthState(page: Page) {
  await setupAuthenticationApiMock(page, false)
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
 * Checks the same session endpoint used by React Router instead of inspecting browser-readable tokens.
 * @param page - Playwright page on the application origin.
 * @returns True only when the mocked BFF reports a valid session.
 * @example
 * await isAuthenticated(page) // => true
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  return page.evaluate(async () => {
    const response = await fetch('/api/auth/session', { cache: 'no-store' })
    // Mocked server errors must not count as a valid session.
    if (!response.ok) return false

    const payload: unknown = await response.json()
    return (
      payload !== null &&
      typeof payload === 'object' &&
      'authenticated' in payload &&
      payload.authenticated === true
    )
  })
}
