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

  cookieStore.set(TOKEN_COOKIE_KEYS.ACCESS_TOKEN, res.accessToken, cookieOptions)
  cookieStore.set(TOKEN_COOKIE_KEYS.ID_TOKEN, res.idToken, cookieOptions)
  cookieStore.set(TOKEN_COOKIE_KEYS.REFRESH_TOKEN, res.refreshToken, cookieOptions)

  const expired = addSeconds(new Date(), res.expiresIn).getTime().toString()
  cookieStore.set(TOKEN_COOKIE_KEYS.EXPIRED, expired, cookieOptions)

  return Response.redirect('http://localhost:3000/room/1', 301)
}
