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
    this.accessToken = params.accessToken
    this.idToken = params.idToken
    this.refreshToken = params.refreshToken
    this.expiresIn = params.expiresIn
  }
}
