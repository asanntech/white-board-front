import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AuthApi } from './api/auth'

interface UseAuthQueryParams {
  idToken: string
}

type VerifyOptions = UseMutationOptions<boolean, Error, UseAuthQueryParams>

export const useVerifyMutation = (options?: VerifyOptions) => {
  const authApi = new AuthApi()

  return useMutation<boolean, Error, UseAuthQueryParams>({
    mutationFn: ({ idToken }) => authApi.verify(idToken),
    ...options,
  })
}
