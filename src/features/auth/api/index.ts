import { apiClient } from '@/open-api'
import { AuthEntity, AuthRepository } from '@/features/auth/domain'
import { AuthToken } from '@/shared/types'

export interface AuthApiResult {
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
}

export class AuthApi implements AuthRepository {
  private static token: AuthToken

  public async getToken() {
    if (AuthApi.token?.hasToken) return AuthApi.token

    const res = await fetch('/api/token')
    if (!res.ok) throw new Error('Failed to fetch token')

    const data: AuthToken = await res.json()

    AuthApi.token = data
    return AuthApi.token
  }

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

  public async verify(idToken: string) {
    const res = await apiClient.auth.verify({ requestBody: { idToken } })
    return !!res
  }
}
