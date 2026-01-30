import { apiClient } from '@/lib/open-api'
import { AuthEntity, AuthRepository } from '@/features/auth/domain'
import { AuthApiResult, AuthToken } from '@/shared/types'
import { AuthVerifyResponseDto } from '@/lib/open-api/api-client'

export class AuthApi implements AuthRepository {
  private static token: AuthToken

  public static resetCache() {
    AuthApi.token = { hasToken: false }
  }

  // トークンを取得する
  public async getToken() {
    // 既にトークンが存在する場合 かつ 有効期限が切れていない場合
    if (AuthApi.token?.hasToken && AuthApi.token.expired > Date.now()) {
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
  public async verify(idToken: string): Promise<AuthVerifyResponseDto> {
    const res = await apiClient.auth.verify({ requestBody: { idToken } })
    return res
  }
}
