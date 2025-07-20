'use server'

import { cookies } from 'next/headers'

export async function setCookieAction({ key, value, maxAge }: { key: string; value: string; maxAge?: number }) {
  const cookieStore = await cookies()
  cookieStore.set(key, value, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: maxAge ?? 60 * 60 * 24,
  })
}
