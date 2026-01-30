import { http, HttpResponse } from 'msw'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'

export const authHandlers = [
  // Next.js API Route: GET /api/token
  http.get('/api/token', () => {
    return HttpResponse.json({
      hasToken: true,
      accessToken: 'mock-access-token',
      idToken: 'mock-id-token',
      refreshToken: 'mock-refresh-token',
      expired: Date.now() + 3600 * 1000,
    })
  }),

  // Next.js API Route: DELETE /api/token
  http.delete('/api/token', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Backend API: POST /verify (via OpenAPI client)
  http.post(`${API_BASE_URL}/verify`, () => {
    return HttpResponse.json({
      userId: 'mock-user-id',
      roomId: 'mock-room-id',
      lastName: 'Test',
      firstName: 'User',
      email: 'test@example.com',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    })
  }),
]
