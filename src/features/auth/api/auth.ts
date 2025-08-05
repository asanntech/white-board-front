import { AuthEntity, AuthRepository } from '@/features/auth/domain'
// import { STORAGE_KEYS } from '@/shared/utils'

export interface AuthApiResult {
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
}

export class AuthApi implements AuthRepository {
  public async fetch(code: string) {
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

  // public getAccessToken() {
  //   return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ?? undefined
  // }

  // public setAccessToken(accessToken: string) {
  //   localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  // }
}
