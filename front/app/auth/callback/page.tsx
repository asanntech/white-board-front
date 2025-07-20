'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setCookieAction } from '@/actions'

type Oauth2Token = {
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
}

type Props = {
  searchParams: Promise<{ code?: string }>
}

/**
 * Cognitoの認証コールバックページ
 * アクセストークンとIDトークンを取得し、クッキーに保存する
 * 認証後、ルームページにリダイレクトする
 */
export default function AuthCallbackPage(props: Props) {
  const [isError, setError] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const authenticate = async () => {
      try {
        const searchParams = await props.searchParams
        const code = searchParams?.code

        if (!code) {
          throw new Error('Authorization code not found')
        }

        const params = new URLSearchParams()
        params.append('grant_type', 'authorization_code')
        params.append('client_id', process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string)
        params.append('redirect_uri', process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI as string)
        params.append('code', code)

        const res = await fetch(`${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        })

        if (!res.ok) throw new Error('Token exchange failed')

        const tokens: Oauth2Token = await res.json()

        await Promise.all([
          setCookieAction({ key: 'access-token', value: tokens.access_token, maxAge: tokens.expires_in }),
          setCookieAction({ key: 'id-token', value: tokens.id_token, maxAge: tokens.expires_in }),
        ])

        router.push('/room/1')
      } catch (e) {
        if (e instanceof Error) {
          console.error('Authentication error:', e)
        }
        setError(true)
      }
    }

    authenticate()
  }, [])

  return isError ? <p>認証に失敗しました。</p> : <p>認証中...</p>
}
