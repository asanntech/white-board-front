import { cookies } from 'next/headers'
import { addSeconds } from 'date-fns'
import { AuthApi } from '@/features/auth/infra'
import { cookieOptions, TOKEN_COOKIE_KEYS } from '@/shared/utils'

/**
 * Cognitoのコールバックエンドポイント
 * 認証コードを受け取り、トークンを取得してCookieに保存する
 */
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams
    const code = searchParams.get('code')

    if (!code) {
      return Response.json({ error: 'Authorization code is required' }, { status: 400 })
    }

    const authApi = new AuthApi()
    const res = await authApi.auth(code)

    const cookieStore = await cookies()

    cookieStore.set(TOKEN_COOKIE_KEYS.ACCESS_TOKEN, res.accessToken, cookieOptions)
    cookieStore.set(TOKEN_COOKIE_KEYS.ID_TOKEN, res.idToken, cookieOptions)
    cookieStore.set(TOKEN_COOKIE_KEYS.REFRESH_TOKEN, res.refreshToken, cookieOptions)

    const expired = addSeconds(new Date(), res.expiresIn).getTime().toString()
    cookieStore.set(TOKEN_COOKIE_KEYS.EXPIRED, expired, cookieOptions)

    // リダイレクト先が指定されていればそのページにリダイレクト
    // オープンリダイレクト防止のため相対パスのみ許可
    const next = searchParams.get('state')
    if (next?.startsWith('/') && !next?.startsWith('//')) {
      return Response.redirect(`${process.env.NEXT_PUBLIC_WHITE_BOARD_URI}${next}`, 302)
    }

    return Response.redirect(`${process.env.NEXT_PUBLIC_WHITE_BOARD_URI}/room`, 302)
  } catch (error) {
    console.error('Authentication callback error:', error)
    return Response.redirect(`${process.env.NEXT_PUBLIC_WHITE_BOARD_URI}?error=auth_failed`, 302)
  }
}
