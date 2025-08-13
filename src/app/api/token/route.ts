import { cookies } from 'next/headers'
import { AuthToken } from '@/shared/types'

export async function GET() {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get('access_token')?.value
  const idToken = cookieStore.get('id_token')?.value
  const refreshToken = cookieStore.get('refresh_token')?.value
  const expiresIn = cookieStore.get('expires_in')?.value

  const token: AuthToken = accessToken
    ? {
        hasToken: true,
        accessToken,
        idToken: idToken as string,
        refreshToken: refreshToken as string,
        expiresIn: Number(expiresIn as string),
      }
    : {
        hasToken: false,
      }

  return new Response(JSON.stringify(token), { status: 200 })
}

export async function DELETE() {
  const cookieStore = await cookies()

  cookieStore.delete('access_token')
  cookieStore.delete('id_token')
  cookieStore.delete('refresh_token')
  cookieStore.delete('expires_in')

  return Response.json({ message: 'deleted token' }, { status: 200 })
}
