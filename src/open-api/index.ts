import { ApiClient } from './api-client'
import { STORAGE_KEYS } from '@/shared/utils'

export const apiClient = new ApiClient({
  BASE: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000',
  TOKEN: () => {
    const tokenStr = localStorage.getItem(STORAGE_KEYS.TOKEN_STORE)
    const tokenStore = tokenStr ? JSON.parse(tokenStr) : undefined
    if (!tokenStore) throw new Error('No token found')

    return Promise.resolve(tokenStore.accessToken)
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
})
