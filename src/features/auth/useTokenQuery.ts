import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AuthApi } from './api'
import { AuthToken } from '@/shared/types'

export type UseTokenQueryOptions = UseQueryOptions<AuthToken, Error>

export const useTokenQuery = (options?: UseTokenQueryOptions) => {
  const authApi = new AuthApi()

  return useQuery<AuthToken, Error>({
    queryKey: ['auth', 'token'],
    queryFn: authApi.getToken,
    ...options,
  })
}
