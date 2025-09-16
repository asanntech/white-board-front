import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AuthApi } from './api'
import { AuthVerifyResponseDto } from '@/lib/open-api/api-client'

interface UseAuthQueryParams {
  idToken: string
}

type VerifyOptions = UseMutationOptions<AuthVerifyResponseDto, Error, UseAuthQueryParams>

export const useVerifyMutation = (options?: VerifyOptions) => {
  const authApi = new AuthApi()

  return useMutation<AuthVerifyResponseDto, Error, UseAuthQueryParams>({
    mutationFn: ({ idToken }) => authApi.verify(idToken),
    ...options,
  })
}
