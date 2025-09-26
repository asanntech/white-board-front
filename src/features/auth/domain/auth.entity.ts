import { AuthToken } from './auth-token'
import { AuthExpiration } from './auth-expiration'

interface AuthParams {
  accessToken: string
  idToken: string
  refreshToken: string
  expiresIn: number
}

export class AuthEntity {
  public readonly accessToken: AuthToken
  public readonly idToken: AuthToken
  public readonly refreshToken: AuthToken
  public readonly expiresIn: AuthExpiration

  constructor(params: AuthParams) {
    this.accessToken = new AuthToken(params.accessToken)
    this.idToken = new AuthToken(params.idToken)
    this.refreshToken = new AuthToken(params.refreshToken)
    this.expiresIn = new AuthExpiration(params.expiresIn)
  }
}
