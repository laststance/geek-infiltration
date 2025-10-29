import { test as base } from '@playwright/test'
import {
  setAuthState,
  clearAuthState,
  MOCK_ACCESS_TOKEN,
} from '../helpers/auth'
import { GraphQLMocker } from '../helpers/graphql-mock'
import { AppPagePO } from '../page-objects/AppPage'
import { LandingPagePO } from '../page-objects/LandingPage'

/**
 * Extended test fixtures with authentication helpers
 */
type AuthFixtures = {
  authenticatedPage: void
  unauthenticatedPage: void
  graphqlMocker: GraphQLMocker
  appPage: AppPagePO
  landingPage: LandingPagePO
}

/**
 * Extend Playwright test with custom fixtures
 */
export const test = base.extend<AuthFixtures>({
  /**
   * Authenticated page fixture
   * Automatically sets auth state before each test
   */
  authenticatedPage: async ({ page }, use) => {
    await setAuthState(page, MOCK_ACCESS_TOKEN)
    await use()
  },

  /**
   * Unauthenticated page fixture
   * Automatically clears auth state before each test
   */
  unauthenticatedPage: async ({ page }, use) => {
    await clearAuthState(page)
    await use()
  },

  /**
   * GraphQL mocker fixture
   * Provides instance for mocking GraphQL operations
   */
  graphqlMocker: async ({ page }, use) => {
    const mocker = new GraphQLMocker()
    await mocker.setup(page)
    await use(mocker)
    mocker.clear()
  },

  /**
   * App page object fixture
   */
  appPage: async ({ page }, use) => {
    const appPage = new AppPagePO(page)
    await use(appPage)
  },

  /**
   * Landing page object fixture
   */
  landingPage: async ({ page }, use) => {
    const landingPage = new LandingPagePO(page)
    await use(landingPage)
  },
})

/**
 * Export expect for convenience
 */
export { expect } from '@playwright/test'
