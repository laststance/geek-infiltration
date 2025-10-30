import { Page, Locator } from '@playwright/test'

/**
 * Page Object for Sidebar component
 * Handles sidebar navigation and user profile
 */
export class SidebarPO {
  readonly page: Page

  // Sidebar container
  readonly sidebarContainer: Locator

  // User profile
  readonly userAvatar: Locator
  readonly userName: Locator
  readonly userBio: Locator

  // Navigation items
  readonly navItems: Locator
  readonly navHome: Locator
  readonly navRepositories: Locator
  readonly navIssues: Locator
  readonly navPullRequests: Locator

  // Actions
  readonly settingsButton: Locator
  readonly logoutButton: Locator
  readonly toggleButton: Locator

  constructor(page: Page) {
    this.page = page

    // Sidebar container (adjust based on actual implementation)
    this.sidebarContainer = page.locator(
      '[data-testid="sidebar"], ' +
        'aside, ' +
        'nav[aria-label="Main navigation"], ' +
        'main > div:first-child', // First child of main
    )

    // User profile elements
    this.userAvatar = this.sidebarContainer.locator(
      'img[alt*="avatar"], ' +
        'img[alt*="profile"], ' +
        '[data-testid="user-avatar"]',
    )
    this.userName = this.sidebarContainer
      .locator('[data-testid="user-name"], ' + 'h1, h2, h3, h4, h5, h6')
      .first()
    this.userBio = this.sidebarContainer
      .locator('[data-testid="user-bio"], p')
      .first()

    // Navigation items
    this.navItems = this.sidebarContainer.locator('a, button[role="link"]')
    this.navHome = this.sidebarContainer.locator(
      'a:has-text("Home"), button:has-text("Home")',
    )
    this.navRepositories = this.sidebarContainer.locator(
      'a:has-text("Repositories"), button:has-text("Repositories")',
    )
    this.navIssues = this.sidebarContainer.locator(
      'a:has-text("Issues"), button:has-text("Issues")',
    )
    this.navPullRequests = this.sidebarContainer.locator(
      'a:has-text("Pull"), button:has-text("Pull")',
    )

    // Actions
    this.settingsButton = this.sidebarContainer.locator(
      '[data-testid="settings-button"], button[aria-label*="Settings"]',
    )
    this.logoutButton = this.sidebarContainer.locator(
      '[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Sign out")',
    )
    this.toggleButton = this.sidebarContainer.locator(
      '[data-testid="sidebar-toggle"], button[aria-label*="toggle"]',
    )
  }

  /**
   * Wait for sidebar to be visible
   */
  async waitForVisible() {
    await this.sidebarContainer.waitFor({ state: 'visible', timeout: 5000 })
  }

  /**
   * Check if sidebar is visible
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
   * Get user name from sidebar
   */
  async getUserName(): Promise<string> {
    return (await this.userName.textContent()) || ''
  }

  /**
   * Check if user avatar is visible
   */
  async isUserAvatarVisible(): Promise<boolean> {
    return this.userAvatar.isVisible()
  }

  /**
   * Get all navigation items text
   */
  async getNavigationItems(): Promise<string[]> {
    const items = await this.navItems.all()
    return Promise.all(
      items.map((item) => item.textContent().then((t) => t || '')),
    )
  }

  /**
   * Click navigation item by text
   */
  async clickNavItem(text: string) {
    await this.sidebarContainer
      .locator(`a:has-text("${text}"), button:has-text("${text}")`)
      .click()
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Click home navigation
   */
  async clickHome() {
    await this.navHome.click()
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Click repositories navigation
   */
  async clickRepositories() {
    await this.navRepositories.click()
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Click issues navigation
   */
  async clickIssues() {
    await this.navIssues.click()
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Click pull requests navigation
   */
  async clickPullRequests() {
    await this.navPullRequests.click()
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Click settings button
   */
  async clickSettings() {
    await this.settingsButton.click()
  }

  /**
   * Click logout button
   */
  async clickLogout() {
    await this.logoutButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Toggle sidebar (collapse/expand)
   */
  async toggle() {
    if (await this.toggleButton.isVisible()) {
      await this.toggleButton.click()
      await this.page.waitForTimeout(300) // Wait for animation
    }
  }

  /**
   * Check if sidebar is collapsed
   */
  async isCollapsed(): Promise<boolean> {
    const width = await this.sidebarContainer.evaluate((el) => {
      return el.getBoundingClientRect().width
    })
    return width < 100 // Arbitrary threshold for collapsed state
  }

  /**
   * Get sidebar width
   */
  async getWidth(): Promise<number> {
    return this.sidebarContainer.evaluate((el) => {
      return el.getBoundingClientRect().width
    })
  }

  /**
   * Take screenshot of sidebar
   */
  async screenshot(path?: string) {
    await this.sidebarContainer.screenshot({
      path: path || 'screenshots/sidebar.png',
    })
  }
}
