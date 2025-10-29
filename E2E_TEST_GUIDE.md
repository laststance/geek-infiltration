# E2E Test Guide - Geek Infiltration

Complete guide for End-to-End testing with Playwright.

## Overview

This project uses **Playwright** for comprehensive E2E testing to ensure application quality before and during the React 18→19 upgrade process.

### Test Coverage

- ✅ **Authentication Flow**: GitHub OAuth, token management, session persistence
- ✅ **Sidebar Functionality**: Navigation, user profile, responsive behavior
- ✅ **Timeline Container**: Content display, scrolling, infinite scroll/pagination
- ✅ **GraphQL API Integration**: Query/mutation operations, error handling, caching
- ✅ **Error Handling**: Network failures, authentication errors, data validation
- ✅ **Integration Tests**: Redux persistence, UI/UX quality, responsive design, performance, security

## Project Structure

```
tests/
├── fixtures/
│   └── auth.ts                 # Test fixtures with auth helpers
├── helpers/
│   ├── auth.ts                 # Authentication utilities
│   ├── graphql-mock.ts         # GraphQL mocking utilities
│   └── storage.ts              # localStorage/Redux helpers
├── page-objects/
│   ├── index.ts                # Page Object exports
│   ├── LandingPage.ts          # Landing Page PO
│   ├── AppPage.ts              # Authenticated App PO
│   └── Sidebar.ts              # Sidebar Component PO
└── suites/
    ├── 01-authentication.spec.ts    # Auth flow tests
    ├── 02-sidebar.spec.ts           # Sidebar tests
    ├── 03-timeline.spec.ts          # Timeline tests
    ├── 04-graphql-api.spec.ts       # API integration tests
    ├── 05-error-handling.spec.ts    # Error scenarios
    └── 06-integration.spec.ts       # Full integration tests
```

## Running Tests

### All Tests

```bash
# Run all E2E tests
pnpm playwright

# Run with UI mode (recommended for development)
pnpm playwright:ui

# Run in debug mode
pnpm playwright:debug

# Generate test code interactively
pnpm playwright:codegen
```

### Specific Test Suites

```bash
# Run authentication tests only
pnpm playwright tests/suites/01-authentication.spec.ts

# Run sidebar tests only
pnpm playwright tests/suites/02-sidebar.spec.ts

# Run specific test by name
pnpm playwright -g "should display Landing Page"
```

### Browser-Specific Tests

```bash
# Run on Chromium only
pnpm playwright --project=chromium

# Run on Firefox only
pnpm playwright --project=firefox

# Run on WebKit only
pnpm playwright --project=webkit
```

### CI/CD Mode

```bash
# Run with retries (CI environment detected automatically)
CI=true pnpm playwright
```

## Test Architecture

### 1. Fixtures (`tests/fixtures/auth.ts`)

Fixtures provide reusable test contexts:

```typescript
import { test, expect } from '../fixtures/auth'

test('my test', async ({ authenticatedPage, appPage }) => {
  // Test with authenticated state automatically set
  await appPage.goto()
  // ...
})
```

**Available Fixtures**:

- `authenticatedPage`: Auto-sets mock auth token
- `unauthenticatedPage`: Auto-clears auth state
- `graphqlMocker`: GraphQL operation mocking
- `appPage`: App Page Object instance
- `landingPage`: Landing Page Object instance

### 2. Page Objects (`tests/page-objects/`)

Page Objects encapsulate page interactions:

```typescript
import { LandingPagePO } from '../page-objects/LandingPage'

const landingPage = new LandingPagePO(page)
await landingPage.goto()
await landingPage.clickGitHubLogin()
expect(await landingPage.isVisible()).toBe(true)
```

**Available Page Objects**:

- `LandingPagePO`: Unauthenticated landing page
- `AppPagePO`: Authenticated app with sidebar and timeline
- `SidebarPO`: Sidebar navigation component

### 3. Helper Functions (`tests/helpers/`)

#### Authentication Helpers

```typescript
import {
  setupAuthMocks,
  setAuthState,
  clearAuthState,
  getAuthToken,
  isAuthenticated,
} from '../helpers/auth'

// Setup OAuth mocks
await setupAuthMocks(page)

// Set auth state directly (faster than OAuth flow)
await setAuthState(page, 'mock_token')

// Check if authenticated
const isAuth = await isAuthenticated(page)
```

#### GraphQL Mocking

```typescript
import { GraphQLMocker, mockData, commonMocks } from '../helpers/graphql-mock'

const mocker = new GraphQLMocker()
await mocker.setup(page)

// Mock specific operation
mocker.mockOperation('Viewer', () => ({
  viewer: mockData.user({ login: 'testuser' }),
}))

// Use common mocks
mocker.mockOperation('Timeline', () => commonMocks.timelineWithRepos(5))
```

#### Storage Helpers

```typescript
import {
  getReduxSlice,
  setReduxSlice,
  waitForReduxRehydration,
  getLocalStorageItem,
} from '../helpers/storage'

// Get Redux slice
const authenticator = await getReduxSlice(page, 'authenticator')

// Set Redux slice
await setReduxSlice(page, 'subscribed', { plan: 'premium' })

// Wait for rehydration
await waitForReduxRehydration(page)
```

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '../fixtures/auth'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Setup runs before each test
  })

  test('should do something', async ({ page, appPage }) => {
    // Arrange
    await appPage.goto()

    // Act
    await appPage.sidebar.clickHome()

    // Assert
    expect(await appPage.isVisible()).toBe(true)
  })
})
```

### Test with GraphQL Mocking

```typescript
test('should display user repositories', async ({
  page,
  appPage,
  graphqlMocker,
}) => {
  // Mock GraphQL response
  await graphqlMocker.mockOperation('Repositories', () => ({
    viewer: {
      repositories: mockData.paginated([
        mockData.repository({ name: 'repo-1' }),
        mockData.repository({ name: 'repo-2' }),
      ]),
    },
  }))

  await appPage.goto()
  await appPage.waitForTimelineItems(2)

  const count = await appPage.getTimelineItemCount()
  expect(count).toBe(2)
})
```

### Test with Authentication

```typescript
// Test unauthenticated state
test('should show landing page', async ({
  unauthenticatedPage,
  landingPage,
}) => {
  await landingPage.goto()
  expect(await landingPage.isVisible()).toBe(true)
})

// Test authenticated state
test('should show app', async ({ authenticatedPage, appPage }) => {
  await appPage.goto()
  expect(await appPage.isVisible()).toBe(true)
})
```

## Best Practices

### 1. Use Page Objects

❌ **Don't**:

```typescript
await page.click('button:has-text("Login")')
await page.waitForSelector('main')
```

✅ **Do**:

```typescript
await landingPage.clickGitHubLogin()
await appPage.waitForVisible()
```

### 2. Use Fixtures

❌ **Don't**:

```typescript
test('my test', async ({ page }) => {
  await setAuthState(page, 'token')
  await page.goto('/')
})
```

✅ **Do**:

```typescript
test('my test', async ({ authenticatedPage, appPage }) => {
  await appPage.goto()
})
```

### 3. Mock External Dependencies

❌ **Don't**:

```typescript
// Make real API calls
await page.goto('/')
await page.waitForResponse('**/graphql')
```

✅ **Do**:

```typescript
await graphqlMocker.mockOperation('Viewer', () => commonMocks.viewer())
await appPage.goto()
```

### 4. Wait for Stability

❌ **Don't**:

```typescript
await page.goto('/')
await page.click('button') // May fail if not loaded
```

✅ **Do**:

```typescript
await appPage.goto()
await appPage.waitForVisible()
await appPage.sidebar.waitForVisible()
await page.click('button')
```

### 5. Use Descriptive Test Names

❌ **Don't**:

```typescript
test('test 1', async () => {})
test('auth', async () => {})
```

✅ **Do**:

```typescript
test('should display Landing Page when not authenticated', async () => {})
test('should complete OAuth flow and redirect to App', async () => {})
```

## Debugging Tests

### Visual Debugging

```bash
# Open Playwright UI
pnpm playwright:ui

# Run in headed mode
pnpm playwright --headed

# Run with slow motion
pnpm playwright --headed --slow-mo=1000
```

### Screenshots and Videos

```bash
# Screenshots saved on failure (automatic)
# Location: test-results/

# Videos saved on failure (automatic)
# Location: test-results/
```

### Debug Mode

```bash
# Step through tests
pnpm playwright:debug

# Or use debugger in code
await page.pause()
```

### Console Logs

```typescript
test('debug test', async ({ page }) => {
  page.on('console', (msg) => console.log('BROWSER:', msg.text()))
  page.on('pageerror', (error) => console.log('ERROR:', error.message))

  await page.goto('/')
})
```

## Common Issues

### Issue: "Timeout waiting for element"

**Solution**: Increase timeout or wait for load state

```typescript
await page.waitForLoadState('networkidle')
await element.waitFor({ timeout: 10000 })
```

### Issue: "Element is not visible"

**Solution**: Check if element is rendered and wait for visibility

```typescript
await expect(element).toBeVisible({ timeout: 5000 })
```

### Issue: "Authentication not working"

**Solution**: Ensure auth mocks are setup before navigation

```typescript
await setupAuthMocks(page)
await page.goto('/') // Now with mocks
```

### Issue: "GraphQL requests failing"

**Solution**: Mock GraphQL operations before test

```typescript
await graphqlMocker.mockOperation('OperationName', () => ({
  data: { ... }
}))
```

## Performance Considerations

### Fast Tests

```typescript
// Use direct auth state (fast)
await setAuthState(page)

// Instead of full OAuth flow (slow)
await landingPage.clickGitHubLogin()
```

### Parallel Execution

```bash
# Run tests in parallel (default)
pnpm playwright

# Disable parallel for debugging
pnpm playwright --workers=1
```

### Selective Running

```bash
# Run only fast smoke tests
pnpm playwright -g "should display"

# Skip slow integration tests
pnpm playwright --grep-invert "Integration Tests"
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E Tests
  run: pnpm playwright

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

### Environment Variables

```bash
# CI mode (automatic retries, no parallelization)
CI=true pnpm playwright

# Disable video recording
PWVIDEO=off pnpm playwright

# Custom base URL
BASE_URL=http://staging.example.com pnpm playwright
```

## Test Maintenance

### Updating Tests After Code Changes

1. **Page structure changes**: Update Page Objects
2. **API changes**: Update GraphQL mocks
3. **Auth flow changes**: Update auth helpers
4. **New features**: Add new test suites

### Regenerating Tests

```bash
# Generate new tests interactively
pnpm playwright:codegen
```

### Visual Regression Testing

```typescript
// Take screenshots for comparison
await page.screenshot({ path: 'baseline.png' })

// Compare with baseline
await expect(page).toHaveScreenshot('baseline.png')
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Generator](https://playwright.dev/docs/codegen)
- [Page Object Model](https://playwright.dev/docs/pom)

## Support

For issues or questions:

1. Check existing test examples
2. Review helper function documentation
3. Use Playwright UI for visual debugging
4. Refer to Playwright official docs

---

**Created**: 2025-10-29
**Phase**: 2 (E2E Test Implementation)
**Status**: ✅ Complete
