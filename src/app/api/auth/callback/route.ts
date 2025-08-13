import { cookies } from 'next/headers'
import { addSeconds } from 'date-fns'
import { AuthApi } from '@/features/auth/api'
import { cookieOptions } from '@/shared/utils'

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

  cookieStore.set('access_token', res.accessToken, cookieOptions)
  cookieStore.set('id_token', res.idToken, cookieOptions)
  cookieStore.set('refresh_token', res.refreshToken, cookieOptions)

  const expired = addSeconds(new Date(), res.expiresIn).getTime().toString()
  cookieStore.set('expired', expired, cookieOptions)

  return Response.redirect('http://localhost:3000/room/1', 301)
}
