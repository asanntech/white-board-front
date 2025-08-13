import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AuthApi } from './api'
import { AuthToken } from '@/shared/types'

type VerifyOptions = UseMutationOptions<AuthToken, Error>

export const useRefreshTokenMutation = (options?: VerifyOptions) => {
  const authApi = new AuthApi()

  return useMutation<AuthToken, Error>({
    mutationFn: authApi.refreshToken,
    ...options,
  })
}
