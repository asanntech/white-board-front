import { cookies } from 'next/headers'
import { addSeconds } from 'date-fns'
import { AuthApiResult, AuthToken } from '@/shared/types'
import { cookieOptions, TOKEN_COOKIE_KEYS } from '@/shared/utils'

// トークンをCookieから取得する
export async function GET() {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get(TOKEN_COOKIE_KEYS.ACCESS_TOKEN)?.value
  const idToken = cookieStore.get(TOKEN_COOKIE_KEYS.ID_TOKEN)?.value
  const refreshToken = cookieStore.get(TOKEN_COOKIE_KEYS.REFRESH_TOKEN)?.value
  const expired = cookieStore.get(TOKEN_COOKIE_KEYS.EXPIRED)?.value

  const token: AuthToken = accessToken
    ? {
        hasToken: true,
        accessToken,
        idToken: idToken as string,
        refreshToken: refreshToken as string,
        expired: Number(expired as string),
      }
    : {
        hasToken: false,
      }

  return Response.json(token, { status: 200 })
}

// リフレッシュトークンを使用してトークンを更新する
export async function POST() {
  const cookieStore = await cookies()

  const refreshToken = cookieStore.get(TOKEN_COOKIE_KEYS.REFRESH_TOKEN)?.value

  if (!refreshToken) throw new Error('No refresh token found')

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
    refresh_token: refreshToken,
  })

  const res = await fetch(`${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`, {
    method: 'POST',
    body,
  })

  if (!res.ok) throw new Error('Failed to refresh token')

  const data: AuthApiResult = await res.json()

  cookieStore.set(TOKEN_COOKIE_KEYS.ACCESS_TOKEN, data.access_token, cookieOptions)
  cookieStore.set(TOKEN_COOKIE_KEYS.ID_TOKEN, data.id_token, cookieOptions)

  const expired = addSeconds(new Date(), data.expires_in).getTime()
  cookieStore.set(TOKEN_COOKIE_KEYS.EXPIRED, expired.toString(), cookieOptions)

  const token: AuthToken = {
    hasToken: true,
    accessToken: data.access_token,
    idToken: data.id_token,
    refreshToken,
    expired,
  }

  return Response.json(token, { status: 200 })
}

// トークンをCookieから削除する
export async function DELETE() {
  const cookieStore = await cookies()

  cookieStore.delete(TOKEN_COOKIE_KEYS.ACCESS_TOKEN)
  cookieStore.delete(TOKEN_COOKIE_KEYS.ID_TOKEN)
  cookieStore.delete(TOKEN_COOKIE_KEYS.REFRESH_TOKEN)
  cookieStore.delete(TOKEN_COOKIE_KEYS.EXPIRED)

  return Response.json({ message: 'Deleted token' }, { status: 200 })
}
