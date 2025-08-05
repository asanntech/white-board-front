'use client'

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useAuthToken } from '@/hooks'

/**
 * Cognitoの認証コールバックページ
 * アクセストークンとIDトークンを取得し、localStorageに保存する
 * 認証後、ルームページにリダイレクトする
 */
export default function AuthCallbackPage() {
  const router = useRouter()

  const params = useSearchParams()
  const code = params.get('code') || undefined

  const { isLoading } = useAuthToken(
    { code },
    {
      onSuccess: () => {
        router.push('/room/1')
      },
    }
  )

  return isLoading ? <div>認証中...</div> : null
}
