import { apiClient } from '@/lib/open-api'
import { AuthEntity, AuthRepository } from '@/features/auth/domain'
import { AuthApiResult, AuthToken } from '@/shared/types'

export class AuthApi implements AuthRepository {
  private static token: AuthToken

  // トークンを取得する
  public async getToken() {
    // 既にトークンが存在する場合
    if (AuthApi.token?.hasToken) {
      // トークンの有効期限が切れていたら更新する
      const timestamp = Date.now()
      if (AuthApi.token.expired < timestamp) {
        AuthApi.token = await this.refreshToken()
      }

      return AuthApi.token
    }

    const res = await fetch('/api/token')
    if (!res.ok) throw new Error('Failed to fetch token')

    const data: AuthToken = await res.json()

    AuthApi.token = data
    return AuthApi.token
  }

  // トークンを削除する
  public async deleteToken() {
    AuthApi.token = { hasToken: false }
    await fetch('/api/token', { method: 'DELETE' })
  }

  // トークンを更新する
  public async refreshToken() {
    if (!AuthApi.token.hasToken) throw new Error('No token found')

    const res = await fetch('/api/token', { method: 'POST' })
    if (!res.ok) throw new Error('Failed to Refresh Token')

    const data: AuthToken = await res.json()

    AuthApi.token = data
    return AuthApi.token
  }

  // 認証コードを受け取ってトークンを取得する
  public async auth(code: string) {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
      redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI as string,
    })

    const res = await fetch(`${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`, {
      method: 'POST',
      body,
    })

    if (!res.ok) throw new Error('Failed to fetch auth token')

    const data: AuthApiResult = await res.json()

    return new AuthEntity({
      accessToken: data.access_token,
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    })
  }

  // トークンを検証する
  public async verify(idToken: string) {
    const res = await apiClient.auth.verify({ requestBody: { idToken } })
    return !!res
  }
}
