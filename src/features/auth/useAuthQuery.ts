import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AuthApi } from './api/auth'
import { AuthEntity } from './domain'

interface UseAuthQueryParams {
  code?: string
}

export type UseAuthQueryOptions = UseQueryOptions<AuthEntity, Error>

export const useAuthQuery = (params: UseAuthQueryParams, options?: UseAuthQueryOptions) => {
  const authApi = new AuthApi()

  return useQuery<AuthEntity, Error>({
    queryKey: ['auth', params.code],
    enabled: !!params.code,
    queryFn: () => authApi.auth(params.code as string),
    ...options,
  })
}
