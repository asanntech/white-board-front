import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AuthApi } from './api'

type UseAuthSessionResult =
  | {
      userId: string
      roomId: string
      idToken: string
      hasToken: true
    }
  | {
      hasToken: false
    }

type UseAuthSessionOptions = UseQueryOptions<UseAuthSessionResult, Error>

export const useAuthSession = (options?: UseAuthSessionOptions) => {
  const authApi = new AuthApi()

  return useQuery<UseAuthSessionResult, Error>({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      // Next.js API Routeで cookie からトークンを取得する
      const token = await authApi.getToken()
      if (!token.hasToken) return { hasToken: false }

      // トークンを検証して、ユーザー情報を取得する
      const { userId, roomId } = await authApi.verify(token.idToken)
      return { userId, roomId, idToken: token.idToken, hasToken: true }
    },
    ...options,
  })
}
