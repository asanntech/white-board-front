import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AuthApi } from '../api'
import { AuthRepository } from '../domain'

type VerifyOptions = UseMutationOptions<void, Error>

export const useDeleteTokenMutation = (options?: VerifyOptions) => {
  const authApi: AuthRepository = new AuthApi()

  return useMutation<void, Error>({
    mutationFn: authApi.deleteToken,
    ...options,
  })
}
