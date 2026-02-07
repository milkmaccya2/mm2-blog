import { test, expect } from '@playwright/test'

test('homepage has correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/milkmaccya/)
  await expect(page.getByRole('heading', { name: "Milkmaccya's Log" })).toBeVisible()
})

test('blog index page shows list of posts', async ({ page }) => {
  await page.goto('/blog')
  const listItems = page.getByRole('listitem')
  await expect(listItems).not.toHaveCount(0)
})

test('can navigate to about page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'About' }).first().click()
  await expect(page).toHaveURL(/.*about/)
  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible()
})
