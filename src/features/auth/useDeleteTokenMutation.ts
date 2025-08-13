import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AuthApi } from './api'

type VerifyOptions = UseMutationOptions<void, Error>

export const useDeleteTokenMutation = (options?: VerifyOptions) => {
  const authApi = new AuthApi()

  return useMutation<void, Error>({
    mutationFn: authApi.deleteToken,
    ...options,
  })
}
