import { cookies } from 'next/headers'
import { AuthApi } from '@/features/auth/api'

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
}

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
  cookieStore.set('expires_in', res.expiresIn.toString(), cookieOptions)

  return Response.redirect('http://localhost:3000/room/1', 301)
}
