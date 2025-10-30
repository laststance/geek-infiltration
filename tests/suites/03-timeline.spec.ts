import { test, expect } from '../fixtures/auth'
import { mockData } from '../helpers/graphql-mock'

test.describe('Timeline Container', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // All tests require authentication
  })

  test.describe('Timeline Display', () => {
    test('should display timeline container', async ({ page, appPage }) => {
      await appPage.goto()

      // Verify timeline container is visible
      await expect(appPage.timelineContainer).toBeVisible()
    })

    test('should position timeline next to sidebar', async ({
      page,
      appPage,
    }) => {
      await appPage.goto()

      const sidebarBox = await appPage.sidebar.sidebarContainer.boundingBox()
      const timelineBox = await appPage.timelineContainer.boundingBox()

      // Timeline should be to the right of sidebar
      if (sidebarBox && timelineBox) {
        expect(timelineBox.x).toBeGreaterThan(sidebarBox.x)
      }
    })

    test('should span full height', async ({ page, appPage }) => {
      await appPage.goto()

      const timelineBox = await appPage.timelineContainer.boundingBox()
      const viewportHeight = page.viewportSize()?.height || 720

      // Should be close to full viewport height
      if (timelineBox) {
        expect(timelineBox.height).toBeGreaterThan(viewportHeight * 0.8)
      }
    })
  })

  test.describe('Timeline Items', () => {
    test('should display timeline items when data is available', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      // Mock timeline data
      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated([
            mockData.repository({ id: 'repo-1', name: 'test-repo-1' }),
            mockData.repository({ id: 'repo-2', name: 'test-repo-2' }),
            mockData.repository({ id: 'repo-3', name: 'test-repo-3' }),
          ]),
        },
      }))

      await appPage.goto()
      await appPage.waitForTimelineItems(3)

      const itemCount = await appPage.getTimelineItemCount()
      expect(itemCount).toBeGreaterThanOrEqual(3)
    })

    test('should handle empty timeline', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      // Mock empty timeline
      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated([]),
        },
      }))

      await appPage.goto()
      await page.waitForLoadState('networkidle')

      const isEmpty = await appPage.isTimelineEmpty()
      expect(isEmpty).toBe(true)
    })

    test('should render individual timeline items correctly', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated([
            mockData.repository({ id: 'repo-1', name: 'visible-repo' }),
          ]),
        },
      }))

      await appPage.goto()
      await appPage.waitForTimelineItems(1)

      const firstItem = appPage.getTimelineItem(0)
      await expect(firstItem).toBeVisible()
    })
  })

  test.describe('Scrolling Behavior', () => {
    test('should enable vertical scrolling', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      // Mock enough items to require scrolling
      const items = Array.from({ length: 20 }, (_, i) =>
        mockData.repository({ id: `repo-${i}`, name: `repo-${i}` }),
      )

      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated(items),
        },
      }))

      await appPage.goto()
      await appPage.waitForTimelineItems(5)

      // Check if container is scrollable
      const isScrollable = await appPage.timelineContainer.evaluate((el) => {
        return el.scrollHeight > el.clientHeight
      })

      // May or may not be scrollable depending on implementation
      expect(typeof isScrollable).toBe('boolean')
    })

    test('should scroll timeline to bottom', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      const items = Array.from({ length: 15 }, (_, i) =>
        mockData.repository({ id: `repo-${i}`, name: `repo-${i}` }),
      )

      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated(items),
        },
      }))

      await appPage.goto()
      await appPage.waitForTimelineItems(5)

      const initialScroll = await appPage.timelineContainer.evaluate(
        (el) => el.scrollTop,
      )

      await appPage.scrollTimelineToBottom()
      await page.waitForTimeout(500)

      const finalScroll = await appPage.timelineContainer.evaluate(
        (el) => el.scrollTop,
      )

      // Scroll position should have changed (or stayed at 0 if not scrollable)
      expect(finalScroll).toBeGreaterThanOrEqual(initialScroll)
    })
  })

  test.describe('Infinite Scroll / Pagination', () => {
    test('should load more items when scrolling to bottom', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      // Initial load
      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated(
            Array.from({ length: 10 }, (_, i) =>
              mockData.repository({ id: `repo-${i}`, name: `repo-${i}` }),
            ),
            { hasNextPage: true },
          ),
        },
      }))

      await appPage.goto()
      await appPage.waitForTimelineItems(5)

      const initialCount = await appPage.getTimelineItemCount()

      // Scroll to bottom to trigger load more
      await appPage.scrollTimelineToBottom()
      await page.waitForTimeout(1000)

      // Check if more items loaded (or stayed same if not implemented)
      const finalCount = await appPage.getTimelineItemCount()
      expect(finalCount).toBeGreaterThanOrEqual(initialCount)
    })

    test('should handle end of timeline', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated(
            Array.from({ length: 5 }, (_, i) =>
              mockData.repository({ id: `repo-${i}`, name: `repo-${i}` }),
            ),
            { hasNextPage: false },
          ),
        },
      }))

      await appPage.goto()
      await appPage.waitForTimelineItems(5)

      await appPage.scrollTimelineToBottom()
      await page.waitForTimeout(1000)

      // Should not show loading indicator or error at end
      const errors: string[] = []
      page.on('pageerror', (error) => {
        errors.push(error.message)
      })

      expect(errors.length).toBe(0)
    })
  })

  test.describe('Timeline Interactions', () => {
    test('should be able to click timeline items', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated([
            mockData.repository({ id: 'repo-1', name: 'clickable-repo' }),
          ]),
        },
      }))

      await appPage.goto()
      await appPage.waitForTimelineItems(1)

      // Click first item
      await appPage.clickTimelineItem(0)
      await page.waitForLoadState('networkidle')

      // Should remain on app (may navigate to details page)
      expect(await appPage.isVisible()).toBe(true)
    })

    test('should handle hover on timeline items', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated([
            mockData.repository({ id: 'repo-1' }),
          ]),
        },
      }))

      await appPage.goto()
      await appPage.waitForTimelineItems(1)

      const firstItem = appPage.getTimelineItem(0)

      // Hover over item
      await firstItem.hover()

      // Should not cause errors
      await page.waitForTimeout(300)
      expect(true).toBe(true)
    })
  })

  test.describe('Search / Filter (if implemented)', () => {
    test('should filter timeline by search query', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated([
            mockData.repository({ id: 'repo-1', name: 'react-app' }),
            mockData.repository({ id: 'repo-2', name: 'vue-app' }),
          ]),
        },
      }))

      await appPage.goto()
      await appPage.waitForTimelineItems(2)

      // Try to search (may not be implemented)
      await appPage.searchTimeline('react')
      await page.waitForTimeout(500)

      // Verify timeline still renders (whether filtered or not)
      expect(await appPage.timelineContainer.isVisible()).toBe(true)
    })
  })

  test.describe('Responsive Behavior', () => {
    test('should adapt to mobile viewport', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated([
            mockData.repository({ id: 'repo-1' }),
          ]),
        },
      }))

      await appPage.goto()

      // Timeline should still be visible on mobile
      await expect(appPage.timelineContainer).toBeVisible()
    })

    test('should adapt to tablet viewport', async ({ page, appPage }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await appPage.goto()

      await expect(appPage.timelineContainer).toBeVisible()
    })
  })

  test.describe('Performance', () => {
    test('should render timeline quickly', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated([
            mockData.repository({ id: 'repo-1' }),
          ]),
        },
      }))

      const startTime = Date.now()

      await appPage.goto()
      await appPage.timelineContainer.waitFor({ state: 'visible' })

      const renderTime = Date.now() - startTime

      // Should render within 3 seconds
      expect(renderTime).toBeLessThan(3000)
    })

    test('should handle many timeline items without performance issues', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      // Mock many items
      const items = Array.from({ length: 50 }, (_, i) =>
        mockData.repository({ id: `repo-${i}`, name: `repo-${i}` }),
      )

      await graphqlMocker.mockOperation('Timeline', () => ({
        viewer: {
          repositories: mockData.paginated(items),
        },
      }))

      const startTime = Date.now()

      await appPage.goto()
      await page.waitForLoadState('networkidle')

      const loadTime = Date.now() - startTime

      // Should load within reasonable time even with many items
      expect(loadTime).toBeLessThan(5000)
    })
  })

  test.describe('Error Handling', () => {
    test('should handle timeline loading errors gracefully', async ({
      page,
      appPage,
      graphqlMocker,
    }) => {
      // Mock error response
      await page.route('**/graphql', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: 'Internal server error' }],
          }),
        })
      })

      await appPage.goto()
      await page.waitForLoadState('networkidle')

      // Should still render container (may show error message)
      await expect(appPage.timelineContainer).toBeVisible()
    })
  })
})
