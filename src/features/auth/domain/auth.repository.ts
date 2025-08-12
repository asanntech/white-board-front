import { AuthEntity } from './auth.entity'

export interface AuthRepository {
  auth(code: string): Promise<AuthEntity>
  verify(idToken: string): Promise<boolean>
}
