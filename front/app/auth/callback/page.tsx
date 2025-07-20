'use client'

import { useQuery } from 'react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { STORAGE_KEYS } from '@/constants/storageKeys'

type Oauth2Token = {
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
}

/**
 * Cognitoの認証コールバックページ
 * アクセストークンとIDトークンを取得し、localStorageに保存する
 * 認証後、ルームページにリダイレクトする
 */
export default function AuthCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()

  const code = params.get('code') || ''

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
    redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI as string,
  })

  useQuery<Oauth2Token, Error>({
    queryKey: ['oauth2Token', code],
    enabled: !!code,
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`, {
        method: 'POST',
        body,
      })
      return await res.json()
    },
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token)
      router.replace('/room/1')
    },
    onError: (error) => {
      console.error('認証エラー:', error)
      router.replace('/login')
    },
  })

  return <div>認証中...</div>
}
