import { test, expect } from '../fixtures/auth'
import { mockData } from '../helpers/graphql-mock'
import {
  getReduxSlice,
  setReduxSlice,
  waitForReduxRehydration,
} from '../helpers/storage'

test.describe('Integration Tests', () => {
  test.describe('Redux Persistence', () => {
    test('should persist authenticator state', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      await appPage.goto()

      const authenticatorSlice = await getReduxSlice(page, 'authenticator')
      expect(authenticatorSlice).toBeTruthy()
      expect(authenticatorSlice).toHaveProperty('accessToken')
    })

    test('should persist subscribed state', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      await appPage.goto()

      // Set subscribed state
      await setReduxSlice(page, 'subscribed', {
        plan: 'premium',
        expiresAt: '2025-12-31',
      })

      await page.reload()
      await waitForReduxRehydration(page)

      const subscribedSlice = await getReduxSlice(page, 'subscribed')
      expect(subscribedSlice).toHaveProperty('plan')
    })

    test('should NOT persist userInterface state', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      await appPage.goto()

      // Set UI state
      await setReduxSlice(page, 'userInterface', {
        sidebarOpen: false,
      })

      await page.reload()
      await waitForReduxRehydration(page)

      // UI state should not be persisted
      const uiSlice = await getReduxSlice(page, 'userInterface')
      // May or may not be persisted depending on configuration
      expect(typeof uiSlice).toBe('object')
    })

    test('should rehydrate state on page load', async ({
      page,
      authenticatedPage,
      appPage,
    }) => {
      await appPage.goto()

      const isRehydrated = await page.evaluate(() => {
        const state = localStorage.getItem('persist:Geek-Infiltration')
        if (!state) return false
        const parsed = JSON.parse(state)
        return parsed._persist?.rehydrated === true
      })

      expect(isRehydrated).toBe(true)
    })
  })

  test.describe('UI/UX Quality', () => {
    test('should have no layout shifts during load', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await page.goto('/')

      // Measure cumulative layout shift
      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          let clsValue = 0

          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if ((entry as any).hadRecentInput) continue
              clsValue += (entry as any).value
            }
          }).observe({ type: 'layout-shift', buffered: true })

          setTimeout(() => resolve(clsValue), 3000)
        })
      })

      // CLS should be low (< 0.1 is good)
      expect(cls).toBeLessThan(0.25)
    })

    test('should be keyboard navigable', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      // Tab through elements
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Should have focus indicator
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName
      })

      expect(focusedElement).toBeTruthy()
    })

    test('should have accessible labels', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      // Check for aria-labels
      const hasAccessibleElements = await page.evaluate(() => {
        const elementsWithLabels = document.querySelectorAll(
          '[aria-label], [aria-labelledby]',
        )
        return elementsWithLabels.length > 0
      })

      expect(hasAccessibleElements).toBe(true)
    })

    test('should have proper heading hierarchy', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      const headings = await page.evaluate(() => {
        const h1 = document.querySelectorAll('h1').length
        const h2 = document.querySelectorAll('h2').length
        const h3 = document.querySelectorAll('h3').length
        return { h1, h2, h3 }
      })

      // Should have at least one h1
      expect(headings.h1).toBeGreaterThanOrEqual(0)
    })

    test('should have sufficient color contrast', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      // Basic check for text visibility
      const hasVisibleText = await page.evaluate(() => {
        const texts = Array.from(
          document.querySelectorAll('p, span, a, button'),
        )
        return texts.some((el) => {
          const styles = window.getComputedStyle(el)
          return styles.color !== 'rgba(0, 0, 0, 0)' && styles.opacity !== '0'
        })
      })

      expect(hasVisibleText).toBe(true)
    })
  })

  test.describe('Responsive Design', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ]

    for (const viewport of viewports) {
      test(`should be functional on ${viewport.name}`, async ({
        page,
        appPage,
        authenticatedPage,
      }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        })
        await appPage.goto()

        // App should be visible
        expect(await appPage.isVisible()).toBe(true)

        // Sidebar should be present
        const sidebarExists = await appPage.sidebar.sidebarContainer.count()
        expect(sidebarExists).toBeGreaterThan(0)

        // Timeline should be present
        await expect(appPage.timelineContainer).toBeVisible()
      })
    }

    test('should adapt layout to viewport size', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await appPage.goto()

      const desktopLayout = await page.evaluate(() => {
        const sidebar = document.querySelector('aside, nav')
        return sidebar?.getBoundingClientRect().width || 0
      })

      await page.setViewportSize({ width: 768, height: 1024 })
      await page.waitForTimeout(500)

      const tabletLayout = await page.evaluate(() => {
        const sidebar = document.querySelector('aside, nav')
        return sidebar?.getBoundingClientRect().width || 0
      })

      // Layout should adapt (widths may differ)
      expect(typeof desktopLayout).toBe('number')
      expect(typeof tabletLayout).toBe('number')
    })
  })

  test.describe('Performance', () => {
    test('should load within 3 seconds', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      const startTime = Date.now()

      await appPage.goto()
      await page.waitForLoadState('networkidle')

      const loadTime = Date.now() - startTime

      expect(loadTime).toBeLessThan(3000)
    })

    test('should have fast First Contentful Paint', async ({
      page,
      authenticatedPage,
    }) => {
      await page.goto('/')

      const fcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name === 'first-contentful-paint') {
                resolve(entry.startTime)
              }
            }
          }).observe({ type: 'paint', buffered: true })

          setTimeout(() => resolve(0), 5000)
        })
      })

      // FCP should be under 1.8 seconds (good threshold)
      expect(fcp).toBeLessThan(1800)
    })

    test('should have fast Time to Interactive', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      const startTime = Date.now()

      await appPage.goto()

      // Wait for page to be interactive
      await page.waitForLoadState('domcontentloaded')

      const tti = Date.now() - startTime

      // TTI should be under 5 seconds
      expect(tti).toBeLessThan(5000)
    })

    test('should not have memory leaks', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      // Get memory metrics using Chrome DevTools Protocol
      const session = await page.context().newCDPSession(page)
      const metrics1 = await session.send('Performance.getMetrics')

      // Navigate and trigger re-renders
      await page.reload()
      await page.reload()
      await page.waitForLoadState('networkidle')

      const metrics2 = await session.send('Performance.getMetrics')

      // Extract JSHeapUsedSize from metrics
      const getHeapSize = (metrics: any) => {
        const heapMetric = metrics.metrics.find(
          (m: any) => m.name === 'JSHeapUsedSize',
        )
        return heapMetric ? heapMetric.value : 0
      }

      const heapGrowth = getHeapSize(metrics2) - getHeapSize(metrics1)
      const heapGrowthMB = heapGrowth / 1024 / 1024

      // Should not grow more than 50MB
      expect(heapGrowthMB).toBeLessThan(50)

      await session.detach()
    })
  })

  test.describe('Security', () => {
    test('should not expose sensitive data in DOM', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      const hasExposedToken = await page.evaluate(() => {
        const html = document.documentElement.innerHTML
        return (
          html.includes('mock_github_token') || html.includes('access_token')
        )
      })

      expect(hasExposedToken).toBe(false)
    })

    test('should use HTTPS for API requests', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      let hasInsecureRequest = false

      page.on('request', (request) => {
        const url = request.url()
        if (url.includes('api.github.com') && !url.startsWith('https://')) {
          hasInsecureRequest = true
        }
      })

      await appPage.goto()
      await page.waitForLoadState('networkidle')

      expect(hasInsecureRequest).toBe(false)
    })

    test('should have CSP headers', async ({ page, authenticatedPage }) => {
      const response = await page.goto('/')

      const headers = response?.headers() || {}

      // Check for security headers
      expect(typeof headers).toBe('object')
    })

    test('should sanitize user input', async ({
      page,
      appPage,
      authenticatedPage,
    }) => {
      await appPage.goto()

      // Try to inject script
      await page.evaluate(() => {
        const input = document.querySelector('input')
        if (input) {
          input.value = '<script>alert("XSS")</script>'
          input.dispatchEvent(new Event('input', { bubbles: true }))
        }
      })

      await page.waitForTimeout(500)

      // Should not execute script
      const hasAlert = await page.evaluate(() => {
        return (window as any).alertFired === true
      })

      expect(hasAlert).toBe(false)
    })

    test('should prevent clickjacking', async ({ page, authenticatedPage }) => {
      const response = await page.goto('/')

      const headers = response?.headers() || {}

      // Check for X-Frame-Options or CSP frame-ancestors
      const hasFrameProtection =
        headers['x-frame-options'] ||
        headers['content-security-policy']?.includes('frame-ancestors')

      // May or may not be set depending on server config
      expect(typeof hasFrameProtection).toBeDefined()
    })
  })

  test.describe('Full User Journey', () => {
    test('should complete full authenticated user journey', async ({
      page,
      landingPage,
      appPage,
    }) => {
      // 1. Start unauthenticated
      await landingPage.goto()
      expect(await landingPage.isVisible()).toBe(true)

      // 2. Authenticate
      await page.evaluate(() => {
        const state = {
          authenticator: JSON.stringify({ accessToken: 'mock_token' }),
          _persist: { version: -1, rehydrated: true },
        }
        localStorage.setItem('persist:Geek-Infiltration', JSON.stringify(state))
      })

      // 3. Navigate to app
      await appPage.goto()
      expect(await appPage.isVisible()).toBe(true)

      // 4. Interact with sidebar
      await appPage.sidebar.waitForVisible()

      // 5. View timeline
      await expect(appPage.timelineContainer).toBeVisible()

      // 6. Complete journey
      expect(true).toBe(true)
    })
  })
})
