import useLocalStorageState from 'use-local-storage-state'
import { useAuthQuery, UseAuthQueryOptions } from '@/features/auth'
import { STORAGE_KEYS } from '@/shared/utils'

interface UseAuthTokenParams {
  code?: string
}

export const useAuthToken = ({ code }: UseAuthTokenParams, options: UseAuthQueryOptions) => {
  const [, setAccessToken] = useLocalStorageState(STORAGE_KEYS.ACCESS_TOKEN, {})

  const { data, isLoading } = useAuthQuery(
    { code },
    {
      ...options,
      onSuccess: (data) => {
        setAccessToken(data.accessToken)
        options?.onSuccess?.(data)
      },
    }
  )

  return { data, isLoading }
}
