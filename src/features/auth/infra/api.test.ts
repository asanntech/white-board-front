import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { AuthApi } from './index'

describe('AuthApi', () => {
  beforeEach(() => {
    AuthApi.resetCache()
  })

  describe('getToken', () => {
    it('トークンを取得できる', async () => {
      const authApi = new AuthApi()
      const token = await authApi.getToken()

      expect(token.hasToken).toBe(true)
      if (token.hasToken) {
        expect(token.accessToken).toBe('mock-access-token')
        expect(token.idToken).toBe('mock-id-token')
      }
    })

    it('取得に失敗した場合エラーを投げる', async () => {
      server.use(
        http.get('/api/token', () => {
          return new HttpResponse(null, { status: 500 })
        }),
      )

      const authApi = new AuthApi()
      await expect(authApi.getToken()).rejects.toThrow('Failed to fetch token')
    })
  })

  describe('deleteToken', () => {
    it('トークンを削除できる', async () => {
      const authApi = new AuthApi()
      await expect(authApi.deleteToken()).resolves.not.toThrow()
    })
  })

  describe('verify', () => {
    it('IDトークンを検証してユーザー情報を返す', async () => {
      const authApi = new AuthApi()
      const result = await authApi.verify('mock-id-token')

      expect(result.userId).toBe('mock-user-id')
      expect(result.roomId).toBe('mock-room-id')
      expect(result.email).toBe('test@example.com')
    })
  })
})
