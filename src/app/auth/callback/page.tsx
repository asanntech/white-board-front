'use client'

import { useRouter, notFound } from 'next/navigation'
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

  const { isLoading, isError } = useAuthToken(
    { code },
    {
      onSuccess: () => {
        router.replace('/room/1')
      },
    }
  )

  if (isLoading) return <div>認証中...</div>

  if (isError) return <div>認証に失敗しました</div>

  if (!code) notFound()

  return null
}
