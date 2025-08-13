export type AuthToken =
  | {
      hasToken: true
      accessToken: string
      idToken: string
      refreshToken: string
      expiresIn: number
    }
  | {
      hasToken: false
    }
