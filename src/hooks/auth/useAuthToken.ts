import { useEffect } from 'react'
import { useAuthQuery } from '@/features/auth'
import { AuthEntity } from '@/features/auth/domain'
import { useTokenStore } from '@/hooks'

interface UseAuthTokenParams {
  code?: string
}

interface UseAuthTokenOptions {
  onSuccess?: (data: AuthEntity) => void
}

export const useAuthToken = ({ code }: UseAuthTokenParams, options?: UseAuthTokenOptions) => {
  const { setTokenStore } = useTokenStore()

  const { data, isLoading, isSuccess, isError } = useAuthQuery({ code })

  useEffect(() => {
    if (isSuccess) {
      setTokenStore(data)
      options?.onSuccess?.(data)
    }
  }, [isSuccess, data, options, setTokenStore])

  return { data, isLoading, isError }
}
