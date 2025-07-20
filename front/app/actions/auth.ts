'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const logoutUrl =
  `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout` +
  `?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}` +
  `&logout_uri=${process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URI}`

export async function signOutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('access-token')
  cookieStore.delete('id-token')
  redirect(logoutUrl)
}
