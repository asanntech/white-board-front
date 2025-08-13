export interface AuthApiResult {
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
}

export type AuthToken =
  | {
      hasToken: true
      accessToken: string
      idToken: string
      refreshToken: string
      expired: number
    }
  | {
      hasToken: false
    }
