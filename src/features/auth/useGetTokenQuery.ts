import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AuthApi } from './api'
import { AuthToken } from '@/shared/types'

type UseGetTokenQueryOptions = UseQueryOptions<AuthToken, Error>

export const useGetTokenQuery = (options?: UseGetTokenQueryOptions) => {
  const authApi = new AuthApi()

  return useQuery<AuthToken, Error>({
    queryKey: ['auth', 'token'],
    queryFn: authApi.getToken,
    ...options,
  })
}
