import { Page } from '@playwright/test'

/**
 * ツールバーが表示されるまで待機（= キャンバス初期化完了）
 * isReadyCanvas && !isLoadingRoomCreator が true になるとツールバーが描画される
 */
export async function waitForCanvasReady(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Select', exact: true }).waitFor({ state: 'visible', timeout: 15000 })
  // Next.js開発ツールアイコンをスナップショットから除外
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' })
}

/**
 * Canvas 要素の中心座標（ビューポート座標）を取得
 */
export async function getCanvasCenter(page: Page): Promise<{ x: number; y: number }> {
  const bounds = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) throw new Error('Canvas not found')
    const rect = canvas.getBoundingClientRect()
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  })
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  }
}

/**
 * Canvas 上で線を描画する（pointerdown → pointermove → pointerup）
 * @param page Playwright Page
 * @param points ビューポート座標の配列（2点以上）
 */
export async function drawLine(page: Page, points: { x: number; y: number }[]): Promise<void> {
  if (points.length < 2) throw new Error('Need at least 2 points to draw a line')

  const start = points[0]
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()

  for (let i = 1; i < points.length; i++) {
    await page.mouse.move(points[i].x, points[i].y, { steps: 5 })
  }

  await page.mouse.up()
}
