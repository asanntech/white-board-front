import { cookies } from 'next/headers'
import { addSeconds } from 'date-fns'
import { AuthApi } from '@/features/auth/api'
import { cookieOptions, TOKEN_COOKIE_KEYS } from '@/shared/utils'

/**
 * Cognitoのコールバックエンドポイント
 * 認証コードを受け取り、トークンを取得してCookieに保存する
 */
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const code = searchParams.get('code')

  if (!code) return

  const authApi = new AuthApi()
  const res = await authApi.auth(code)

  const cookieStore = await cookies()

  cookieStore.set(TOKEN_COOKIE_KEYS.ACCESS_TOKEN, res.accessToken.getValue(), cookieOptions)
  cookieStore.set(TOKEN_COOKIE_KEYS.ID_TOKEN, res.idToken.getValue(), cookieOptions)
  cookieStore.set(TOKEN_COOKIE_KEYS.REFRESH_TOKEN, res.refreshToken.getValue(), cookieOptions)

  const expired = addSeconds(new Date(), res.expiresIn.getValue()).getTime().toString()
  cookieStore.set(TOKEN_COOKIE_KEYS.EXPIRED, expired, cookieOptions)

  // リダイレクト先が指定されていればそのページにリダイレクト
  // オープンリダイレクト防止のため相対パスのみ許可
  const next = searchParams.get('state')
  if (next?.startsWith('/') && !next?.startsWith('//')) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_WHITE_BOARD_URI}${next}`, 302)
  }

  return Response.redirect(`${process.env.NEXT_PUBLIC_WHITE_BOARD_URI}/room`, 302)
}
