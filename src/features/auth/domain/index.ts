interface AuthParams {
  accessToken: string
  idToken: string
  refreshToken: string
  expiresIn: number
}

export class AuthEntity {
  public readonly accessToken: string
  public readonly idToken: string
  public readonly refreshToken: string
  public readonly expiresIn: number

  constructor(params: AuthParams) {
    if (!params.accessToken) throw new Error('Access token is required')
    if (!params.idToken) throw new Error('ID token is required')
    if (!params.refreshToken) throw new Error('Refresh token is required')
    if (params.expiresIn > Date.now()) throw new Error('Expiration is required')

    this.accessToken = params.accessToken
    this.idToken = params.idToken
    this.refreshToken = params.refreshToken
    this.expiresIn = params.expiresIn
  }
}

export * from './auth.repository'
