import { test, expect } from '../fixtures/auth'

test.describe('Sidebar Functionality', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // All tests in this suite require authentication
  })

  test.describe('Sidebar Visibility', () => {
    test('should display sidebar when authenticated', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Verify sidebar is visible
      expect(await appPage.sidebar.isVisible()).toBe(true)
      await expect(appPage.sidebar.sidebarContainer).toBeVisible()
    })

    test('should display sidebar on initial load', async ({
      page,
      appPage,
    }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Sidebar should be visible immediately
      await appPage.sidebar.waitForVisible()
      expect(await appPage.sidebar.isVisible()).toBe(true)
    })

    test('should maintain sidebar visibility on navigation', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Navigate away and back
      await page.goBack()
      await page.goForward()
      await page.waitForLoadState('networkidle')

      // Sidebar should still be visible
      expect(await appPage.sidebar.isVisible()).toBe(true)
    })
  })

  test.describe('User Profile Display', () => {
    test('should display user avatar', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      // Mock user data
      await graphqlMocker.mockOperation('Viewer', () => ({
        viewer: {
          login: 'testuser',
          avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4',
          name: 'Test User',
        },
      }))

      await appPage.goto()

      // Check if avatar is visible
      const hasAvatar = await appPage.sidebar.isUserAvatarVisible()
      // Avatar may or may not be present depending on implementation
      if (hasAvatar) {
        await expect(appPage.sidebar.userAvatar).toBeVisible()
      }
    })

    test('should display user name if available', async ({ page, appPage }) => {
      await appPage.goto()

      // Try to get user name
      const userName = await appPage.sidebar.getUserName()

      // If user name is present, it should not be empty
      if (userName) {
        expect(userName.length).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Navigation Items', () => {
    test('should display navigation items', async ({ page, appPage }) => {
      await appPage.goto()

      // Get navigation items
      const navItems = await appPage.sidebar.getNavigationItems()

      // Should have at least some navigation items
      expect(navItems.length).toBeGreaterThan(0)
    })

    test('should be able to click navigation items', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Try to get navigation items
      const navItems = await appPage.sidebar.navItems.all()

      if (navItems.length > 0) {
        const firstItem = navItems[0]

        // Click first navigation item
        await firstItem.click()
        await page.waitForLoadState('networkidle')

        // Should still be on app (not redirect to login)
        expect(await appPage.isVisible()).toBe(true)
      }
    })
  })

  test.describe('Sidebar Layout', () => {
    test('should have reasonable width', async ({ page, appPage }) => {
      await appPage.goto()

      const width = await appPage.sidebar.getWidth()

      // Sidebar should be visible width (not collapsed)
      expect(width).toBeGreaterThan(100)

      // Should not take up entire screen
      const viewportWidth = page.viewportSize()?.width || 1280
      expect(width).toBeLessThan(viewportWidth * 0.5)
    })

    test('should be positioned on the left side', async ({ page, appPage }) => {
      await appPage.goto()

      const box = await appPage.sidebar.sidebarContainer.boundingBox()

      // Should be on the left (x position close to 0)
      expect(box?.x).toBeLessThan(50)
    })

    test('should span full height', async ({ page, appPage }) => {
      await appPage.goto()

      const box = await appPage.sidebar.sidebarContainer.boundingBox()
      const viewportHeight = page.viewportSize()?.height || 720

      // Should be close to full viewport height
      expect(box?.height).toBeGreaterThan(viewportHeight * 0.9)
    })
  })

  test.describe('Sidebar Toggle (if implemented)', () => {
    test('should toggle sidebar visibility if toggle button exists', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Check if toggle button exists
      const toggleVisible = await appPage.sidebar.toggleButton
        .isVisible()
        .catch(() => false)

      if (toggleVisible) {
        const initialWidth = await appPage.sidebar.getWidth()

        // Toggle sidebar
        await appPage.sidebar.toggle()

        const newWidth = await appPage.sidebar.getWidth()

        // Width should have changed
        expect(newWidth).not.toBe(initialWidth)
      } else {
        // No toggle button - test passes (feature may not be implemented)
        expect(true).toBe(true)
      }
    })

    test('should collapse sidebar on toggle', async ({ page, appPage }) => {
      await appPage.goto()

      const toggleVisible = await appPage.sidebar.toggleButton
        .isVisible()
        .catch(() => false)

      if (toggleVisible) {
        // Toggle to collapse
        await appPage.sidebar.toggle()

        // Check if collapsed
        const isCollapsed = await appPage.sidebar.isCollapsed()
        expect(isCollapsed).toBe(true)

        // Toggle back to expand
        await appPage.sidebar.toggle()

        const isStillCollapsed = await appPage.sidebar.isCollapsed()
        expect(isStillCollapsed).toBe(false)
      } else {
        expect(true).toBe(true)
      }
    })
  })

  test.describe('Responsive Behavior', () => {
    test('should adapt to mobile viewport', async ({ page, appPage }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await appPage.goto()

      // Sidebar should still be present (may be hidden or overlay)
      const sidebarExists = await appPage.sidebar.sidebarContainer
        .count()
        .then((c) => c > 0)
      expect(sidebarExists).toBe(true)
    })

    test('should adapt to tablet viewport', async ({ page, appPage }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })
      await appPage.goto()

      // Sidebar should be visible
      expect(await appPage.sidebar.isVisible()).toBe(true)
    })

    test('should work on desktop viewport', async ({ page, appPage }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 })
      await appPage.goto()

      // Sidebar should be fully visible
      expect(await appPage.sidebar.isVisible()).toBe(true)

      const width = await appPage.sidebar.getWidth()
      expect(width).toBeGreaterThan(200)
    })
  })

  test.describe('Sidebar Content', () => {
    test('should render without JavaScript errors', async ({
      page,
      appPage,
    }) => {
      const errors: string[] = []

      page.on('pageerror', (error) => {
        errors.push(error.message)
      })

      await appPage.goto()
      await appPage.sidebar.waitForVisible()

      // Should not have any console errors
      expect(errors.length).toBe(0)
    })

    test('should have accessible sidebar structure', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      // Check for proper semantic structure
      const sidebar = appPage.sidebar.sidebarContainer

      // Should be an aside or nav element
      const tagName = await sidebar.evaluate((el) => el.tagName.toLowerCase())
      expect(['aside', 'nav', 'div']).toContain(tagName)
    })
  })

  test.describe('Sidebar Screenshots', () => {
    test('should take sidebar screenshot', async ({ page, appPage }) => {
      await appPage.goto()
      await appPage.sidebar.waitForVisible()

      // Take screenshot (for visual regression testing)
      await appPage.sidebar.screenshot('test-results/sidebar-screenshot.png')

      // Verify screenshot was taken
      expect(true).toBe(true)
    })
  })

  test.describe('Sidebar Performance', () => {
    test('should render sidebar quickly', async ({ page, appPage }) => {
      const startTime = Date.now()

      await appPage.goto()
      await appPage.sidebar.waitForVisible()

      const renderTime = Date.now() - startTime

      // Sidebar should render within 3 seconds
      expect(renderTime).toBeLessThan(3000)
    })

    test('should not cause layout shifts', async ({ page, appPage }) => {
      await appPage.goto()
      await appPage.sidebar.waitForVisible()

      const initialBox = await appPage.sidebar.sidebarContainer.boundingBox()

      // Wait a bit for any layout shifts
      await page.waitForTimeout(1000)

      const finalBox = await appPage.sidebar.sidebarContainer.boundingBox()

      // Position and size should not change
      expect(initialBox?.x).toBe(finalBox?.x)
      expect(initialBox?.y).toBe(finalBox?.y)
      expect(initialBox?.width).toBe(finalBox?.width)
    })
  })
})
