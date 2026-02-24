import { Page } from '@playwright/test'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'

/** 認証済みユーザーのAPIルートをモック */
export async function setupAuthenticatedRoutes(page: Page) {
  await page.route('**/api/token', (route) => {
    if (route.request().method() === 'DELETE') {
      return route.fulfill({ status: 204 })
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        hasToken: true,
        accessToken: 'mock-access-token',
        idToken: 'mock-id-token',
        refreshToken: 'mock-refresh-token',
        expired: Date.now() + 3600 * 1000,
      }),
    })
  })

  await page.route(`${API_BASE_URL}/verify`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        userId: 'mock-user-id',
        roomId: 'mock-room-id',
        lastName: 'Test',
        firstName: 'User',
        email: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      }),
    })
  })

  await page.route(`${API_BASE_URL}/rooms/*/creator`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ createdBy: 'mock-user-id' }),
    })
  })
}

/** 未認証ユーザーのAPIルートをモック */
export async function setupUnauthenticatedRoutes(page: Page) {
  await page.route('**/api/token', (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ hasToken: false }),
    })
  })
}

/**
 * Socket.IO WebSocket接続をモック
 * Engine.IO v4 プロトコルに準拠したハンドシェイクを返す
 */
export async function setupSocketMock(page: Page) {
  await page.routeWebSocket(/socket\.io/, (ws) => {
    // Engine.IO Open packet
    ws.send(
      '0' +
        JSON.stringify({
          sid: 'mock-sid',
          upgrades: [],
          pingInterval: 25000,
          pingTimeout: 20000,
          maxPayload: 1000000,
        })
    )

    // Socket.IO CONNECT ACK (namespace "/")
    ws.send('40' + JSON.stringify({ sid: 'mock-namespace-sid' }))

    ws.onMessage((message) => {
      if (typeof message !== 'string') return

      // Engine.IO Ping → Pong
      if (message === '2') {
        ws.send('3')
        return
      }

      // Socket.IO EVENT: join → yjs-sync-init応答
      if (message.startsWith('42')) {
        const payload = JSON.parse(message.slice(2))
        if (Array.isArray(payload) && payload[0] === 'join') {
          // 空のY.Doc状態をBase64エンコード（Uint8Array [0, 0] = "AAA="）
          ws.send(
            '42' +
              JSON.stringify([
                'yjs-sync-init',
                {
                  roomId: 'mock-room-id',
                  state: 'AAA=',
                },
              ])
          )
        }
      }
    })
  })
}
