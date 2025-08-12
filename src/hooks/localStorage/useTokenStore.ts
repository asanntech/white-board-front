import { useCallback } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { useIsServerRender } from '@/hooks'
import { STORAGE_KEYS } from '@/shared/utils'

interface TokenStore {
  idToken: string
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface SetTokenParams {
  key: keyof TokenStore
  value: string
}

export const useTokenStore = () => {
  const isServerRender = useIsServerRender()

  const [tokenStore, setTokenStore, { removeItem: removeTokenStore }] = useLocalStorageState<TokenStore>(
    STORAGE_KEYS.TOKEN_STORE
  )

  const setToken = useCallback(
    (params: SetTokenParams) => {
      setTokenStore((prev) => {
        return prev ? { ...prev, [params.key]: params.value } : undefined
      })
    },
    [setTokenStore]
  )

  return { tokenStore, setTokenStore, setToken, removeTokenStore, isLoading: isServerRender }
}
