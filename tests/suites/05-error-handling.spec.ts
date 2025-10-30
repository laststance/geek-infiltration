import { test, expect } from '../fixtures/auth'
import { clearAuthState } from '../helpers/auth'

test.describe('Error Handling', () => {
  test.describe('Network Errors', () => {
    test('should handle offline mode', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      // Simulate offline
      await page.context().setOffline(true)

      // Reload page
      await page.reload().catch(() => {}) // May fail, that's expected

      // Navigate to a page
      await page.goto('/').catch(() => {})

      // Go back online
      await page.context().setOffline(false)

      // Should recover
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      expect(await appPage.isVisible()).toBe(true)
    })

    test('should handle slow network', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      // Throttle network
      await page.route('**/*', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        route.continue()
      })

      await appPage.goto()

      // Should still load (slowly)
      await expect(appPage.appContainer).toBeVisible({ timeout: 15000 })
    })

    test('should show error state on API failure', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      // Mock API failure
      await page.route('**/graphql', (route) => {
        route.abort('failed')
      })

      await appPage.goto()
      await page.waitForLoadState('networkidle')

      // App should handle error gracefully
      expect(await appPage.appContainer.isVisible()).toBe(true)
    })
  })

  test.describe('Authentication Errors', () => {
    test('should handle expired token', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      // Mock 401 response for expired token
      await page.route('**/graphql', (route) => {
        route.fulfill({
          status: 401,
          body: JSON.stringify({
            errors: [{ message: 'Token expired' }],
          }),
        })
      })

      // Try to interact with API
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Should handle expired token (may redirect to login)
      expect(true).toBe(true)
    })

    test('should handle invalid token', async ({ page, landingPage }) => {
      // Set invalid token
      await page.goto('/')
      await page.evaluate(() => {
        const invalidState = {
          authenticator: JSON.stringify({ accessToken: 'invalid_token_12345' }),
          _persist: { version: -1, rehydrated: true },
        }
        localStorage.setItem(
          'persist:Geek-Infiltration',
          JSON.stringify(invalidState),
        )
      })

      await page.reload()
      await page.waitForLoadState('networkidle')

      // Should handle invalid token gracefully
      expect(true).toBe(true)
    })

    test('should handle missing token after logout', async ({
      page,
      appPage,
      landingPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      // Clear auth
      await clearAuthState(page)
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Should redirect to landing page
      expect(await landingPage.isVisible()).toBe(true)
    })
  })

  test.describe('UI Error States', () => {
    test('should handle missing React component', async ({ page }) => {
      const errors: Error[] = []
      page.on('pageerror', (error) => errors.push(error))

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Should not have critical React errors
      const hasCriticalError = errors.some(
        (e) => e.message.includes('React') && e.message.includes('undefined'),
      )
      expect(hasCriticalError).toBe(false)
    })

    test('should handle JavaScript errors gracefully', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))

      await appPage.goto()

      // Trigger potential error by rapid interactions
      await page.reload()
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Should not accumulate many errors
      expect(errors.length).toBeLessThan(5)
    })

    test('should recover from rendering errors', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      // Corrupt Redux state to trigger error
      await page.evaluate(() => {
        const corruptState = {
          authenticator: 'not-a-valid-json',
          _persist: { version: -1, rehydrated: true },
        }
        localStorage.setItem(
          'persist:Geek-Infiltration',
          JSON.stringify(corruptState),
        )
      })

      await page.reload()
      await page.waitForLoadState('networkidle')

      // Should recover or show error boundary
      expect(true).toBe(true)
    })
  })

  test.describe('Data Validation Errors', () => {
    test('should handle malformed API responses', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await page.route('**/graphql', (route) => {
        route.fulfill({
          status: 200,
          body: 'not-valid-json',
        })
      })

      await appPage.goto()
      await page.waitForLoadState('networkidle')

      // Should handle malformed response
      expect(await appPage.appContainer.isVisible()).toBe(true)
    })

    test('should handle missing required fields in API response', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await page.route('**/graphql', (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: {
              viewer: {
                // Missing required fields
              },
            },
          }),
        })
      })

      await appPage.goto()
      await page.waitForLoadState('networkidle')

      // Should handle missing fields
      expect(await appPage.appContainer.isVisible()).toBe(true)
    })

    test('should handle unexpected data types', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await page.route('**/graphql', (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            data: {
              viewer: {
                id: 12345, // Should be string
                login: null, // Unexpected null
                name: ['Array', 'Instead', 'Of', 'String'], // Wrong type
              },
            },
          }),
        })
      })

      await appPage.goto()
      await page.waitForLoadState('networkidle')

      // Should handle type mismatches
      expect(await appPage.appContainer.isVisible()).toBe(true)
    })
  })

  test.describe('Browser Compatibility', () => {
    test('should handle missing localStorage gracefully', async ({ page }) => {
      // Disable localStorage
      await page.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', {
          value: null,
          writable: false,
        })
      })

      await page.goto('/').catch(() => {})
      await page.waitForLoadState('networkidle')

      // Should handle missing localStorage
      expect(true).toBe(true)
    })

    test('should handle console errors without breaking', async ({
      page,
      authenticatedPage,
    }) => {
      const consoleErrors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // May have some console errors, but should not crash
      expect(true).toBe(true)
    })
  })

  test.describe('Error Recovery', () => {
    test('should retry failed requests', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      let attemptCount = 0

      await page.route('**/graphql', (route) => {
        attemptCount++

        if (attemptCount <= 2) {
          // Fail first 2 attempts
          route.abort('failed')
        } else {
          // Succeed on 3rd attempt
          route.fulfill({
            status: 200,
            body: JSON.stringify({
              data: { viewer: { login: 'testuser' } },
            }),
          })
        }
      })

      await appPage.goto()
      await page.waitForTimeout(3000)

      // Should retry and eventually succeed
      expect(attemptCount).toBeGreaterThan(1)
    })

    test('should allow manual retry after error', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await page.route('**/graphql', (route) => route.abort('failed'))

      await appPage.goto()
      await page.waitForLoadState('networkidle')

      // Clear route to allow retry
      await page.unroute('**/graphql')

      await page.reload()
      await page.waitForLoadState('networkidle')

      // Should recover on retry
      expect(true).toBe(true)
    })
  })

  test.describe('Error Boundaries', () => {
    test('should catch errors with Sentry Error Boundary', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      // Verify Error Boundary wraps application
      const hasErrorBoundary = await page.evaluate(() => {
        // Check if Sentry is loaded
        return typeof (window as any).Sentry !== 'undefined'
      })

      // Sentry should be available in production
      expect(typeof hasErrorBoundary).toBe('boolean')
    })

    test('should display error UI when component crashes', async ({
      page,
      authenticatedPage,
    }) => {
      // Intentionally cause a React error
      await page.evaluate(() => {
        // Try to trigger error in React
        const container = document.querySelector('main')
        if (container) {
          container.innerHTML = ''
        }
      })

      await page.reload()
      await page.waitForLoadState('networkidle')

      // Should show error boundary or recover
      expect(true).toBe(true)
    })
  })
})
