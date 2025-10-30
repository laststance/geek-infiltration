import { Page, Locator } from '@playwright/test'
import { SidebarPO } from './Sidebar'

/**
 * Page Object for main App (authenticated state)
 * Represents the authenticated application with Sidebar and Timeline
 */
export class AppPagePO {
  readonly page: Page

  // Main container
  readonly appContainer: Locator

  // Sub-components
  readonly sidebar: SidebarPO
  readonly timelineContainer: Locator

  // Timeline elements
  readonly timelineItems: Locator
  readonly loadMoreButton: Locator

  constructor(page: Page) {
    this.page = page

    // Main app container
    this.appContainer = page.locator('main[role="main"], main')

    // Sub-components
    this.sidebar = new SidebarPO(page)
    this.timelineContainer = page.locator(
      '[data-testid="timeline-container"], ' +
        'main > div:nth-child(2), ' + // Second child of main (after sidebar)
        'div:has(> article)', // Container with articles
    )

    // Timeline items (repositories, issues, etc.)
    this.timelineItems = this.timelineContainer.locator(
      'article, [data-testid="timeline-item"], [role="article"]',
    )

    // Load more button (infinite scroll or pagination)
    this.loadMoreButton = page.locator(
      'button:has-text("Load more"), button:has-text("Show more")',
    )
  }

  /**
   * Navigate to app (assumes authentication is already set)
   */
  async goto() {
    await this.page.goto('/')
    await this.waitForVisible()
  }

  /**
   * Wait for app to be visible
   */
  async waitForVisible() {
    await this.appContainer.waitFor({ state: 'visible', timeout: 10000 })
    await this.sidebar.waitForVisible()
  }

  /**
   * Check if app is displayed (authenticated state)
   */
  async isVisible(): Promise<boolean> {
    try {
      await this.waitForVisible()
      return true
    } catch {
      return false
    }
  }

  /**
   * Get count of timeline items
   */
  async getTimelineItemCount(): Promise<number> {
    return this.timelineItems.count()
  }

  /**
   * Wait for timeline items to load
   */
  async waitForTimelineItems(minCount = 1) {
    await this.page.waitForFunction(
      (min) => {
        const items = document.querySelectorAll(
          'article, [data-testid="timeline-item"], [role="article"]',
        )
        return items.length >= min
      },
      minCount,
      { timeout: 10000 },
    )
  }

  /**
   * Scroll timeline to bottom
   */
  async scrollTimelineToBottom() {
    await this.timelineContainer.evaluate((el) => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    })
  }

  /**
   * Click load more button if present
   */
  async clickLoadMore() {
    if (await this.loadMoreButton.isVisible()) {
      await this.loadMoreButton.click()
      await this.page.waitForLoadState('networkidle')
    }
  }

  /**
   * Get timeline item by index
   */
  getTimelineItem(index: number): Locator {
    return this.timelineItems.nth(index)
  }

  /**
   * Click timeline item by index
   */
  async clickTimelineItem(index: number) {
    await this.getTimelineItem(index).click()
  }

  /**
   * Search timeline (if search functionality exists)
   */
  async searchTimeline(query: string) {
    const searchInput = this.page.locator(
      'input[type="search"], input[placeholder*="Search"]',
    )
    if (await searchInput.isVisible()) {
      await searchInput.fill(query)
      await searchInput.press('Enter')
      await this.page.waitForLoadState('networkidle')
    }
  }

  /**
   * Take screenshot of app
   */
  async screenshot(path?: string) {
    await this.page.screenshot({
      path: path || 'screenshots/app.png',
      fullPage: false,
    })
  }

  /**
   * Check if timeline is empty
   */
  async isTimelineEmpty(): Promise<boolean> {
    const count = await this.getTimelineItemCount()
    return count === 0
  }
}
