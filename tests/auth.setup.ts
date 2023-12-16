import { test as setup, expect, chromium } from '@playwright/test'

setup('authenticate', async ({ page }) => {
  const browser = await chromium.launch()
  const context = await browser.newContext()

  await context.route('**/*', (route, request) => {
    if (request.url().includes('github.com/login/oauth/authorize')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mockingtoken',
          token_type: 'bearer',
          scope: 'repo,gist',
        }),
      })
    } else {
      route.continue()
    }
  })
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('https://github.com/login')
  await page.getByLabel('Username or email address').fill('username')
  await page.getByLabel('Password').fill('password')
  await page.getByRole('button', { name: 'Sign in' }).click()
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('https://github.com/')
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(
    page.getByRole('button', { name: 'View profile and more' }),
  ).toBeVisible()

  // End of authentication steps.

  await page.context().storageState()
})
