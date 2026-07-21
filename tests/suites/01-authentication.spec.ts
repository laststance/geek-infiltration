import { test, expect } from '../fixtures/auth'
import { E2E_LAZY_ROUTE_DELAY_MS } from '../constants'
import { completeMockOAuthCallback, isAuthenticated } from '../helpers/auth'
import { getReduxPersistedState } from '../helpers/storage'

const LEGACY_GITHUB_TOKEN = 'legacy-browser-readable-github-token'

test.describe('Authentication Flow', () => {
  test.describe('Unauthenticated State', () => {
    test('shows the product landing page before a server session exists', async ({
      unauthenticatedPage,
      landingPage,
    }) => {
      // Arrange
      await landingPage.goto()

      // Act
      const main = landingPage.homeSection

      // Assert
      await expect(landingPage.githubLoginButton).toBeVisible()
      await expect(landingPage.mainHeader).toBeVisible()
      await expect(landingPage.mainFooter).toBeVisible()
      await expect(
        main.getByRole('heading', {
          name: /Follow the work, not the feed/i,
        }),
      ).toBeVisible()
      await expect(
        main.getByText(/Track the issues and pull requests that matter/i),
      ).toBeVisible()
      await expect(
        main.getByRole('heading', {
          exact: true,
          name: 'Timeline aggregation',
        }),
      ).toBeVisible()
      await expect(
        main.getByRole('heading', { exact: true, name: 'GitHub OAuth login' }),
      ).toBeVisible()
      await expect(
        main.getByRole('heading', { exact: true, name: 'Subscriptions' }),
      ).toBeVisible()
      await expect(main.getByText(/Huge pack\s+of elements/i)).toHaveCount(0)
      await expect(main.getByText(/Landing Page Template\?/i)).toHaveCount(0)
      await expect(main.getByText(/Purchase Now/i)).toHaveCount(0)
      await expect(main.getByText(/Choose Plan/i)).toHaveCount(0)
    })

    test('keeps the GitHub login entry point reachable on responsive viewports', async ({
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

      // Every supported layout must retain a visible login entry point.
      for (const viewport of viewports) {
        await page.setViewportSize({
          height: viewport.height,
          width: viewport.width,
        })

        // Act
        await landingPage.goto()

        // Assert
        await expect(
          landingPage.githubLoginButton,
          `${viewport.name} should keep the GitHub login CTA reachable`,
        ).toBeVisible()
      }
    })

    test('starts GitHub login through the same-origin BFF', async ({
      page,
      unauthenticatedPage,
      landingPage,
    }) => {
      // Arrange
      await landingPage.goto()

      // Act
      const href = await landingPage.githubLoginButton.getAttribute('href')

      // Assert
      expect(href).toBe('/api/auth/github/start')
      const browserAuthArtifacts = await page.evaluate(() => ({
        localStorage: JSON.stringify(localStorage),
        oauthState: sessionStorage.getItem(
          'geek-infiltration:github-oauth-state',
        ),
      }))
      expect(browserAuthArtifacts.oauthState).toBeNull()
      expect(browserAuthArtifacts.localStorage).not.toContain('accessToken')
    })
  })

  test.describe('GitHub OAuth Flow', () => {
    test('enters the app after the BFF establishes a session', async ({
      page,
      landingPage,
    }) => {
      // Arrange and Act
      await completeMockOAuthCallback(page)

      // Assert
      expect(await isAuthenticated(page)).toBe(true)
      await expect(page).toHaveURL(/\/app$/)
      await expect(page.getByTestId('app-container')).toBeVisible()
      await expect(landingPage.githubLoginButton).not.toBeVisible()
    })

    test('never persists an authenticator slice or GitHub token in browser storage', async ({
      page,
    }) => {
      // Arrange
      await completeMockOAuthCallback(page)

      // Act
      const browserStorage = await page.evaluate(() => ({
        local: Object.values(localStorage).join('\n'),
        session: Object.values(sessionStorage).join('\n'),
      }))
      const reduxState = await getReduxPersistedState(page)

      // Assert
      expect(browserStorage.local).not.toContain('accessToken')
      expect(browserStorage.session).not.toContain('accessToken')
      expect(reduxState).not.toHaveProperty('authenticator')
    })
  })

  test.describe('Authenticated State', () => {
    test('preserves the server session after reload and route navigation', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      // Arrange
      await appPage.goto()

      // Act
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.goto('/releases', { waitUntil: 'domcontentloaded' })
      await page.goto('/app', { waitUntil: 'domcontentloaded' })

      // Assert
      expect(await isAuthenticated(page)).toBe(true)
      await expect(appPage.appContainer).toBeVisible()
      await expect(appPage.sidebar.sidebarContainer).toBeVisible()
    })
  })

  test.describe('URL Routing', () => {
    test('redirects signed-out users away from every protected route', async ({
      page,
      unauthenticatedPage,
      landingPage,
    }) => {
      // Arrange and Act
      await page.goto('/app', { waitUntil: 'domcontentloaded' })

      // Assert
      await expect(page).toHaveURL(/\/$/)
      await expect(landingPage.githubLoginButton).toBeVisible()

      // Act
      await page.goto('/releases', { waitUntil: 'domcontentloaded' })

      // Assert
      await expect(page).toHaveURL(/\/$/)
      await expect(landingPage.githubLoginButton).toBeVisible()
    })

    test('renders timeline and releases URLs for a valid server session', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      // Arrange
      await appPage.goto()

      // Act and Assert
      await expect(appPage.timelineContainer).toBeVisible()
      await appPage.gotoReleases()
      await expect(page).toHaveURL(/\/releases$/)
      await expect(appPage.releaseFeedRoute).toBeVisible()
    })

    test('keeps browser back and forward navigation synchronized with routed views', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      // Arrange
      await appPage.goto()
      await appPage.gotoReleases()

      // Act
      await page.goBack({ waitUntil: 'domcontentloaded' })

      // Assert
      await expect(page).toHaveURL(/\/app$/)
      await expect(appPage.timelineContainer).toBeVisible()

      // Act
      await page.goForward({ waitUntil: 'domcontentloaded' })

      // Assert
      await expect(page).toHaveURL(/\/releases$/)
      await expect(appPage.releaseFeedRoute).toBeVisible()
    })

    test('shows a loading state while the code-split release route loads', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      // Arrange
      let releaseRouteWasRequested = false
      await page.route('**/src/routes/ReleasesRoute.tsx*', async (route) => {
        releaseRouteWasRequested = true
        await new Promise((resolve) =>
          setTimeout(resolve, E2E_LAZY_ROUTE_DELAY_MS),
        )
        await route.continue()
      })
      await appPage.goto()

      // Act
      await page.goto('/releases', { waitUntil: 'domcontentloaded' })

      // Assert
      await expect(page.getByTestId('full-screen-spinner')).toBeVisible()
      await expect(appPage.releaseFeedRoute).toBeVisible()
      expect(releaseRouteWasRequested).toBe(true)
    })
  })

  test.describe('Logout', () => {
    test('expires the server session and returns to the landing page', async ({
      page,
      authenticatedPage,
      appPage,
      landingPage,
    }) => {
      // Arrange
      await appPage.goto()
      expect(await isAuthenticated(page)).toBe(true)

      // Act
      await appPage.sidebar.clickLogout()

      // Assert
      await expect(landingPage.githubLoginButton).toBeVisible()
      expect(await isAuthenticated(page)).toBe(false)
      const reduxState = await getReduxPersistedState(page)
      expect(reduxState).not.toHaveProperty('authenticator')
    })
  })

  test.describe('Security Regression', () => {
    test('removes a legacy persisted GitHub token and refuses it as authentication', async ({
      page,
      unauthenticatedPage,
      landingPage,
    }) => {
      // Arrange
      await page.evaluate((legacyToken) => {
        localStorage.setItem(
          'persist:Geek-Infiltration',
          JSON.stringify({
            _persist: JSON.stringify({ rehydrated: true, version: -1 }),
            authenticator: JSON.stringify({ accessToken: legacyToken }),
            subscribed: JSON.stringify({ subscribed: [] }),
          }),
        )
      }, LEGACY_GITHUB_TOKEN)

      // Act
      await page.reload({ waitUntil: 'domcontentloaded' })
      await expect(landingPage.githubLoginButton).toBeVisible()

      // Assert
      expect(await isAuthenticated(page)).toBe(false)
      await expect
        .poll(async () => JSON.stringify(await getReduxPersistedState(page)))
        .not.toContain(LEGACY_GITHUB_TOKEN)
    })

    test('treats an old client callback URL as a signed-out unknown route', async ({
      page,
      unauthenticatedPage,
      landingPage,
    }) => {
      // Arrange and Act
      await page.goto('/callback?error=access_denied', {
        waitUntil: 'domcontentloaded',
      })

      // Assert
      await expect(page).toHaveURL(/\/$/)
      expect(await isAuthenticated(page)).toBe(false)
      await expect(landingPage.githubLoginButton).toBeVisible()
    })
  })
})
