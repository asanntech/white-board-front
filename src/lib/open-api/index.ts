import { ApiClient } from './api-client'
import { AuthApi } from '@/features/auth/api'

export const apiClient = new ApiClient({
  BASE: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000',
  TOKEN: async () => {
    const authApi = new AuthApi()
    const token = await authApi.getToken()

    if (!token.hasToken) throw new Error('No token found')

    return Promise.resolve(token.accessToken)
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
})
