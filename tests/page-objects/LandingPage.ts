import { Page, Locator } from '@playwright/test'

/**
 * Page Object for Landing Page
 * Represents the unauthenticated state of the application
 */
export class LandingPagePO {
  readonly page: Page

  // Main sections
  readonly mainHeader: Locator
  readonly mainFooter: Locator
  readonly homeSection: Locator

  // Authentication
  readonly githubLoginButton: Locator

  // Navigation links (if present in header/footer)
  readonly navLinks: Locator

  constructor(page: Page) {
    this.page = page

    // Main sections
    this.mainHeader = page.locator('header, [role="banner"], .MuiAppBar-root')
    this.mainFooter = page.getByText(/Laststance\.io/)
    this.homeSection = page.locator('main, [role="main"], body')

    // GitHub OAuth button - actual implementation uses "Login with GitHub" text
    this.githubLoginButton = page.locator(
      'button:has-text("Login with GitHub"), ' +
        '[href*="github.com/login/oauth/authorize"]',
    )

    // Navigation links
    this.navLinks = page.locator('nav a, header a')
  }

  /**
   * Navigate to landing page
   */
  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' })
  }

  /**
   * Click GitHub OAuth login button
   */
  async clickGitHubLogin() {
    await this.githubLoginButton.click()
  }

  /**
   * Wait for landing page to be visible
   */
  async waitForVisible() {
    await this.githubLoginButton.waitFor({ state: 'visible' })
    await this.homeSection.waitFor({ state: 'visible' })
  }

  /**
   * Check if landing page is displayed
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
   * Check if GitHub login button is visible
   */
  async isGitHubLoginButtonVisible(): Promise<boolean> {
    return this.githubLoginButton.isVisible()
  }

  /**
   * Get all navigation links
   */
  async getNavigationLinks(): Promise<string[]> {
    const links = await this.navLinks.all()
    return Promise.all(
      links.map((link) => link.textContent().then((t) => t || '')),
    )
  }

  /**
   * Take screenshot of landing page
   */
  async screenshot(path?: string) {
    await this.page.screenshot({
      path: path || 'screenshots/landing-page.png',
      fullPage: true,
    })
  }
}
