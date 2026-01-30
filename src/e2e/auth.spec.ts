import { test, expect } from '@playwright/test'
import {
  setupAuthenticatedRoutes,
  setupUnauthenticatedRoutes,
  setupSocketMock,
  blockCognitoNavigation,
} from './helpers/auth-mock'

test.describe('未認証ユーザー - ホームページ', () => {
  test.beforeEach(async ({ page }) => {
    await setupUnauthenticatedRoutes(page)
  })

  test('メインメニューが表示される', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'White Board' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Free Trial' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible()
  })

  test('Sign InリンクにCognito OAuth URLが設定されている', async ({ page }) => {
    await page.goto('/')

    const signInLink = page.getByRole('link', { name: 'Sign In' })
    await expect(signInLink).toBeVisible()

    const href = await signInLink.getAttribute('href')
    expect(href).toContain('oauth2/authorize')
    expect(href).toContain('client_id=')
  })
})

test.describe('フリートライアル', () => {
  test.beforeEach(async ({ page }) => {
    await setupUnauthenticatedRoutes(page)
  })

  test('Free Trialクリックでメインメニューが非表示になる', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'Free Trial' }).click()

    await expect(page.getByRole('heading', { name: 'White Board' })).not.toBeVisible()
    await expect(page).toHaveURL('/')
  })
})

test.describe('認証ガード - リダイレクト', () => {
  test.beforeEach(async ({ page }) => {
    await setupUnauthenticatedRoutes(page)
  })

  test('未認証で /room/xxx にアクセスすると /?next=/room/xxx にリダイレクトされる', async ({ page }) => {
    await page.goto('/room/test-room-id')

    await expect(page).toHaveURL('/?next=/room/test-room-id')
  })

  test('未認証で /room にアクセスすると / にリダイレクトされる', async ({ page }) => {
    await page.goto('/room')

    await expect(page).toHaveURL('/')
  })
})

test.describe('ディープリンク - トースト通知', () => {
  test.beforeEach(async ({ page }) => {
    await setupUnauthenticatedRoutes(page)
  })

  test('?next= パラメータでトーストが表示される', async ({ page }) => {
    await page.goto('/?next=/room/xxx')

    await expect(page.getByText('SignInが必要です')).toBeVisible()
  })

  test('Sign Inリンクにstateパラメータが含まれる', async ({ page }) => {
    await page.goto('/?next=/room/xxx')

    const signInLink = page.getByRole('link', { name: 'Sign In' })
    const href = await signInLink.getAttribute('href')
    expect(href).toContain('&state=/room/xxx')
  })
})

test.describe('認証済みユーザー - リダイレクト', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedRoutes(page)
  })

  test('ホームページからルームに自動リダイレクトされる', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL('/room/mock-room-id')
  })
})

test.describe('認証済みユーザー - ルームページ', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedRoutes(page)
    await setupSocketMock(page)
  })

  test('サインアウトボタンが表示される', async ({ page }) => {
    await page.goto('/room/mock-room-id')

    // サインアウトボタン（右上のIconButton）が表示されるまで待機
    const signOutArea = page.locator('.fixed.right-5.top-5')
    await expect(signOutArea).toBeVisible({ timeout: 10000 })
  })
})

test.describe('ログアウトフロー', () => {
  test('サインアウトでDELETEリクエストが送信され、Cognitoログアウトに遷移する', async ({ page }) => {
    await setupAuthenticatedRoutes(page)
    await setupSocketMock(page)
    await blockCognitoNavigation(page)

    await page.goto('/room/mock-room-id')

    // サインアウトボタンエリアが表示されるまで待機
    const signOutArea = page.locator('.fixed.right-5.top-5')
    await expect(signOutArea).toBeVisible({ timeout: 10000 })

    // DELETE /api/token のリクエストと Cognito遷移リクエストを監視
    const deletePromise = page.waitForRequest(
      (req) => req.url().includes('/api/token') && req.method() === 'DELETE'
    )
    const cognitoPromise = page.waitForRequest((req) => /amazoncognito\.com.*logout/.test(req.url()))

    // サインアウトボタンをクリック
    await signOutArea.getByRole('button').click()

    // DELETE リクエストが送信されたことを確認
    const deleteReq = await deletePromise
    expect(deleteReq.method()).toBe('DELETE')

    // Cognitoログアウトへの遷移リクエストが発生したことを確認
    const cognitoReq = await cognitoPromise
    expect(cognitoReq.url()).toContain('logout')
  })
})
