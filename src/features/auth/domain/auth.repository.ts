import { AuthEntity } from './auth.entity'
import { AuthToken } from '@/shared/types'
import { AuthVerifyResponseDto } from '@/lib/open-api/api-client'

export interface AuthRepository {
  auth(code: string): Promise<AuthEntity>
  verify(idToken: string): Promise<AuthVerifyResponseDto>
  getToken(): Promise<AuthToken>
  deleteToken(): Promise<void>
}
