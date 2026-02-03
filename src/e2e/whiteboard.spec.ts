import { test, expect } from '@playwright/test'
import { setupAuthenticatedRoutes, setupSocketMock } from './helpers/auth-mock'
import { waitForCanvasReady, getCanvasCenter, drawLine } from './helpers/whiteboard-helper'

const ROOM_URL = '/room/mock-room-id'

const SCREENSHOT_OPTIONS = { maxDiffPixelRatio: 0.01 }

test.describe('ホワイトボード - 初期表示', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedRoutes(page)
    await setupSocketMock(page)
    await page.goto(ROOM_URL)
    await waitForCanvasReady(page)
  })

  test('ツールバーが表示される', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Select', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Pen', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Red pen', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Marker', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Eraser', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Redo', exact: true })).toBeVisible()
  })

  test('初期ツールがSelectでアクティブである', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Select', exact: true })).toHaveClass(/(?<!\S)bg-neutral-100(?!\S)/)
  })

  test('Undo/Redoボタンが初期状態で無効である', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Redo', exact: true })).toBeDisabled()
  })

  test('キャンバスが表示される', async ({ page }) => {
    const canvas = page.locator('canvas').first()
    await expect(canvas).toBeVisible()
    await expect(page).toHaveScreenshot('initial-display.png', SCREENSHOT_OPTIONS)
  })
})

test.describe('ホワイトボード - ツール切り替え', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedRoutes(page)
    await setupSocketMock(page)
    await page.goto(ROOM_URL)
    await waitForCanvasReady(page)
  })

  test('ペンツールに切り替えられる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    await expect(page.getByRole('button', { name: 'Pen', exact: true })).toHaveClass(/(?<!\S)bg-neutral-100(?!\S)/)
    await expect(page.getByRole('button', { name: 'Select', exact: true })).not.toHaveClass(/(?<!\S)bg-neutral-100(?!\S)/)
  })

  test('赤ペンツールに切り替えられる', async ({ page }) => {
    await page.getByRole('button', { name: 'Red pen', exact: true }).click()

    await expect(page.getByRole('button', { name: 'Red pen', exact: true })).toHaveClass(/(?<!\S)bg-neutral-100(?!\S)/)
  })

  test('マーカーツールに切り替えられる', async ({ page }) => {
    await page.getByRole('button', { name: 'Marker', exact: true }).click()

    await expect(page.getByRole('button', { name: 'Marker', exact: true })).toHaveClass(/(?<!\S)bg-neutral-100(?!\S)/)
  })

  test('消しゴムツールに切り替えられる', async ({ page }) => {
    await page.getByRole('button', { name: 'Eraser', exact: true }).click()

    await expect(page.getByRole('button', { name: 'Eraser', exact: true })).toHaveClass(/(?<!\S)bg-neutral-100(?!\S)/)
  })

  test('選択ツールに戻せる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()
    await page.getByRole('button', { name: 'Select', exact: true }).click()

    await expect(page.getByRole('button', { name: 'Select', exact: true })).toHaveClass(/(?<!\S)bg-neutral-100(?!\S)/)
    await expect(page.getByRole('button', { name: 'Pen', exact: true })).not.toHaveClass(/(?<!\S)bg-neutral-100(?!\S)/)
  })
})

test.describe('ホワイトボード - ペン描画', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedRoutes(page)
    await setupSocketMock(page)
    await page.goto(ROOM_URL)
    await waitForCanvasReady(page)
  })

  test('ペンで線を描画できる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 100, y: center.y },
      { x: center.x + 100, y: center.y },
    ])

    await expect(page).toHaveScreenshot('pen-single-line.png', SCREENSHOT_OPTIONS)
  })

  test('複数の線を描画できる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)

    // 横線
    await drawLine(page, [
      { x: center.x - 100, y: center.y },
      { x: center.x + 100, y: center.y },
    ])

    // 縦線
    await drawLine(page, [
      { x: center.x, y: center.y - 100 },
      { x: center.x, y: center.y + 100 },
    ])

    await expect(page).toHaveScreenshot('pen-multiple-lines.png', SCREENSHOT_OPTIONS)
  })

  test('描画後にUndoボタンが有効になる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 50, y: center.y },
      { x: center.x + 50, y: center.y },
    ])

    await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeEnabled()
  })
})

test.describe('ホワイトボード - 赤ペン・マーカー描画', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedRoutes(page)
    await setupSocketMock(page)
    await page.goto(ROOM_URL)
    await waitForCanvasReady(page)
  })

  test('赤ペンで描画すると赤色の線になる', async ({ page }) => {
    await page.getByRole('button', { name: 'Red pen', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 100, y: center.y },
      { x: center.x + 100, y: center.y },
    ])

    await expect(page).toHaveScreenshot('red-pen-line.png', SCREENSHOT_OPTIONS)
  })

  test('マーカーで描画すると半透明の緑色になる', async ({ page }) => {
    await page.getByRole('button', { name: 'Marker', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 100, y: center.y },
      { x: center.x + 100, y: center.y },
    ])

    await expect(page).toHaveScreenshot('marker-line.png', SCREENSHOT_OPTIONS)
  })
})

test.describe('ホワイトボード - 消しゴム', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedRoutes(page)
    await setupSocketMock(page)
    await page.goto(ROOM_URL)
    await waitForCanvasReady(page)
  })

  test('消しゴムで線を消去できる', async ({ page }) => {
    // ペンで横線を描画
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 100, y: center.y },
      { x: center.x + 100, y: center.y },
    ])

    // 消しゴムに切り替えて、描画した線の上を縦にスワイプ
    await page.getByRole('button', { name: 'Eraser', exact: true }).click()
    await drawLine(page, [
      { x: center.x, y: center.y - 50 },
      { x: center.x, y: center.y + 50 },
    ])

    await expect(page).toHaveScreenshot('eraser-after-delete.png', SCREENSHOT_OPTIONS)
  })
})

test.describe('ホワイトボード - Undo/Redo', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedRoutes(page)
    await setupSocketMock(page)
    await page.goto(ROOM_URL)
    await waitForCanvasReady(page)
  })

  test('Undoで直前の描画を取り消せる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 100, y: center.y },
      { x: center.x + 100, y: center.y },
    ])

    await page.getByRole('button', { name: 'Undo', exact: true }).click()

    await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeDisabled()
    await expect(page).toHaveScreenshot('undo-single.png', SCREENSHOT_OPTIONS)
  })

  test('Redoで取り消した描画を復元できる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 100, y: center.y },
      { x: center.x + 100, y: center.y },
    ])

    await page.getByRole('button', { name: 'Undo', exact: true }).click()
    await page.getByRole('button', { name: 'Redo', exact: true }).click()

    await expect(page.getByRole('button', { name: 'Redo', exact: true })).toBeDisabled()
    await expect(page).toHaveScreenshot('redo-restore.png', SCREENSHOT_OPTIONS)
  })

  test('複数回のUndo/Redoが正しく動作する', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)

    // 線A
    await drawLine(page, [
      { x: center.x - 100, y: center.y - 30 },
      { x: center.x + 100, y: center.y - 30 },
    ])
    // 線B
    await drawLine(page, [
      { x: center.x - 100, y: center.y + 30 },
      { x: center.x + 100, y: center.y + 30 },
    ])

    // Undo × 2 → 全消去
    await page.getByRole('button', { name: 'Undo', exact: true }).click()
    await page.getByRole('button', { name: 'Undo', exact: true }).click()
    await expect(page).toHaveScreenshot('undo-multiple-all-cleared.png', SCREENSHOT_OPTIONS)

    // Redo × 1 → 線Aのみ復元
    await page.getByRole('button', { name: 'Redo', exact: true }).click()
    await expect(page).toHaveScreenshot('redo-partial-one-line.png', SCREENSHOT_OPTIONS)
  })

  test('新しい描画後にRedoが無効になる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)

    await drawLine(page, [
      { x: center.x - 100, y: center.y },
      { x: center.x + 100, y: center.y },
    ])

    await page.getByRole('button', { name: 'Undo', exact: true }).click()

    // 新しい線を描画
    await drawLine(page, [
      { x: center.x, y: center.y - 50 },
      { x: center.x, y: center.y + 50 },
    ])

    await expect(page.getByRole('button', { name: 'Redo', exact: true })).toBeDisabled()
  })
})

test.describe('ホワイトボード - キーボードショートカット', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedRoutes(page)
    await setupSocketMock(page)
    await page.goto(ROOM_URL)
    await waitForCanvasReady(page)
  })

  test('Ctrl+Zでundoできる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 100, y: center.y },
      { x: center.x + 100, y: center.y },
    ])

    await page.keyboard.press('Control+z')

    await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeDisabled()
    await expect(page).toHaveScreenshot('keyboard-undo.png', SCREENSHOT_OPTIONS)
  })

  test('Ctrl+Yでredoできる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 100, y: center.y },
      { x: center.x + 100, y: center.y },
    ])

    await page.keyboard.press('Control+z')
    await page.keyboard.press('Control+y')

    await expect(page.getByRole('button', { name: 'Redo', exact: true })).toBeDisabled()
    await expect(page).toHaveScreenshot('keyboard-redo.png', SCREENSHOT_OPTIONS)
  })

  test('Ctrl+Shift+Zでredoできる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 100, y: center.y },
      { x: center.x + 100, y: center.y },
    ])

    await page.keyboard.press('Control+z')
    await page.keyboard.press('Control+Shift+z')

    await expect(page.getByRole('button', { name: 'Redo', exact: true })).toBeDisabled()
    await expect(page).toHaveScreenshot('keyboard-redo-shift.png', SCREENSHOT_OPTIONS)
  })
})

test.describe('ホワイトボード - 選択と削除', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedRoutes(page)
    await setupSocketMock(page)
    await page.goto(ROOM_URL)
    await waitForCanvasReady(page)
  })

  test('選択ツールでドラッグして線を選択しDeleteで削除できる', async ({ page }) => {
    // ペンで描画
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 80, y: center.y },
      { x: center.x + 80, y: center.y },
    ])

    // 選択ツールに切り替え
    await page.getByRole('button', { name: 'Select', exact: true }).click()

    // 描画した線を囲むようにドラッグ選択
    await drawLine(page, [
      { x: center.x - 120, y: center.y - 40 },
      { x: center.x + 120, y: center.y + 40 },
    ])

    // Deleteキーで削除
    await page.keyboard.press('Delete')

    await expect(page).toHaveScreenshot('select-delete.png', SCREENSHOT_OPTIONS)
  })

  test('Backspaceキーでも選択した線を削除できる', async ({ page }) => {
    await page.getByRole('button', { name: 'Pen', exact: true }).click()

    const center = await getCanvasCenter(page)
    await drawLine(page, [
      { x: center.x - 80, y: center.y },
      { x: center.x + 80, y: center.y },
    ])

    await page.getByRole('button', { name: 'Select', exact: true }).click()

    await drawLine(page, [
      { x: center.x - 120, y: center.y - 40 },
      { x: center.x + 120, y: center.y + 40 },
    ])

    await page.keyboard.press('Backspace')

    await expect(page).toHaveScreenshot('select-backspace-delete.png', SCREENSHOT_OPTIONS)
  })
})
