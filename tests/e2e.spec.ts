import { type Page, expect, test } from '@playwright/test'

async function verifyLayout(page: Page) {
  await expect(page).not.toHaveTitle('')
  await expect(page.getByRole('navigation').first()).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
}

test.describe('Smoke Tests', () => {
  test('homepage', async ({ page }) => {
    await page.goto('/')
    await verifyLayout(page)
    await expect(
      page.getByRole('heading', { level: 1, name: "Milkmaccya's Log" }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { level: 2, name: 'Projects' }),
    ).toBeVisible()
    await expect(page.locator('.note-section')).toBeVisible()
    await expect(
      page.getByRole('heading', { level: 2, name: 'Recent Posts' }),
    ).toBeVisible()
  })

  test('blog index', async ({ page }) => {
    await page.goto('/blog')
    await verifyLayout(page)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Blog' }),
    ).toBeVisible()
    await expect(page.getByRole('listitem').first()).toBeVisible()
  })

  test('latest blog post', async ({ page }) => {
    await page.goto('/blog')
    await page.getByRole('listitem').first().getByRole('link').click();
    await verifyLayout(page)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('article').first()).toBeVisible()
  })

  test('about page', async ({ page }) => {
    await page.goto('/about')
    await verifyLayout(page)
    await expect(
      page.getByRole('heading', { level: 1, name: 'About Me' }),
    ).toBeVisible()
  })

  test('projects page', async ({ page }) => {
    await page.goto('/projects')
    await verifyLayout(page)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Personal Projects' }),
    ).toBeVisible()
  })

  test('privacy page', async ({ page }) => {
    await page.goto('/privacy')
    await verifyLayout(page)
    await expect(
      page.getByRole('heading', { level: 1, name: 'プライバシーポリシー' }),
    ).toBeVisible()
  })

  test('terms page', async ({ page }) => {
    await page.goto('/terms')
    await verifyLayout(page)
    await expect(
      page.getByRole('heading', { level: 1, name: '利用規約' }),
    ).toBeVisible()
  })

  test('チャットウィジェットが表示される', async ({ page }) => {
    await page.goto('/')
    const chatButton = page.locator('button[aria-label="チャットを開く"]')
    await expect(chatButton).toBeVisible({ timeout: 10000 })
  })

  test('チャットウィンドウの開閉', async ({ page }) => {
    await page.goto('/')
    const chatButton = page.locator('button[aria-label="チャットを開く"]')
    await expect(chatButton).toBeVisible({ timeout: 10000 })
    await chatButton.click()

    const closeButton = page.locator('button[aria-label="チャットを閉じる"]')
    await expect(closeButton).toBeVisible({ timeout: 10000 })
    await closeButton.click()

    await expect(chatButton).toBeVisible()
  })
})
