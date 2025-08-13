import { AuthEntity } from './auth.entity'
import { AuthToken } from '@/shared/types'

export interface AuthRepository {
  auth(code: string): Promise<AuthEntity>
  verify(idToken: string): Promise<boolean>
  getToken(): Promise<AuthToken>
  deleteToken(): Promise<void>
  refreshToken(): Promise<AuthToken>
}
