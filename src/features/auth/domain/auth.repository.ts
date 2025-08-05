import { AuthEntity } from './auth.entity'

export interface AuthRepository {
  fetch(code: string): Promise<AuthEntity>
  // getAccessToken(): string | undefined
  // setAccessToken(accessToken: string): void
}
