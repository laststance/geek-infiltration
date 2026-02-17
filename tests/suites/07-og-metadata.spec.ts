import { test, expect } from '@playwright/test'

test.describe('Open Graph & Twitter Card Metadata', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  test.describe('Open Graph Tags', () => {
    test('should have og:title meta tag', async ({ page }) => {
      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute('content')
      expect(ogTitle).toBe('Geek Infiltration | GitHub Activity Visualization')
    })

    test('should have og:description meta tag under 160 characters', async ({
      page,
    }) => {
      const ogDescription = await page
        .locator('meta[property="og:description"]')
        .getAttribute('content')
      expect(ogDescription).toBeTruthy()
      expect(ogDescription!.length).toBeLessThanOrEqual(160)
      expect(ogDescription).toContain('GitHub')
    })

    test('should have og:image pointing to OG image asset', async ({
      page,
    }) => {
      const ogImage = await page
        .locator('meta[property="og:image"]')
        .getAttribute('content')
      expect(ogImage).toContain('og-image.png')
    })

    test('should have og:url set to production URL', async ({ page }) => {
      const ogUrl = await page
        .locator('meta[property="og:url"]')
        .getAttribute('content')
      expect(ogUrl).toBe('https://geek-infiltration.vercel.app')
    })

    test('should have og:type set to website', async ({ page }) => {
      const ogType = await page
        .locator('meta[property="og:type"]')
        .getAttribute('content')
      expect(ogType).toBe('website')
    })
  })

  test.describe('Twitter Card Tags', () => {
    test('should have twitter:card set to summary_large_image', async ({
      page,
    }) => {
      const twitterCard = await page
        .locator('meta[name="twitter:card"]')
        .getAttribute('content')
      expect(twitterCard).toBe('summary_large_image')
    })

    test('should have twitter:title meta tag', async ({ page }) => {
      const twitterTitle = await page
        .locator('meta[name="twitter:title"]')
        .getAttribute('content')
      expect(twitterTitle).toBe(
        'Geek Infiltration | GitHub Activity Visualization',
      )
    })

    test('should have twitter:description meta tag', async ({ page }) => {
      const twitterDescription = await page
        .locator('meta[name="twitter:description"]')
        .getAttribute('content')
      expect(twitterDescription).toBeTruthy()
    })

    test('should have twitter:image meta tag', async ({ page }) => {
      const twitterImage = await page
        .locator('meta[name="twitter:image"]')
        .getAttribute('content')
      expect(twitterImage).toContain('og-image.png')
    })
  })

  test.describe('Page Title', () => {
    test('should have correct page title', async ({ page }) => {
      const title = await page.title()
      expect(title).toContain('Geek Infiltration')
    })
  })

  test.describe('OG Image Asset', () => {
    test('should serve og-image.png at correct URL', async ({ page }) => {
      const response = await page.request.get('/og-image.png')
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('image/')
    })
  })
})
