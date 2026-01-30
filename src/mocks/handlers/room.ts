import { http, HttpResponse } from 'msw'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'

export const roomHandlers = [
  // Backend API: GET /rooms/:id/creator
  http.get(`${API_BASE_URL}/rooms/:id/creator`, () => {
    return HttpResponse.json({
      createdBy: 'mock-creator-user-id',
    })
  }),
]
