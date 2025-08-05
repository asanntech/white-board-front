import { ApiClient } from './api-client'

export const apiClient = new ApiClient({
  BASE: 'http://localhost:4000',
  TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
  HEADERS: {
    'Content-Type': 'application/json',
  },
})
