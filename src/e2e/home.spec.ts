import { test, expect } from '@playwright/test'

test.describe('ホームページ', () => {
  test('ページが正常に読み込まれる', async ({ page }) => {
    await page.goto('/')

    // ページが表示されることを確認
    await expect(page).toHaveURL('/')
  })
})
